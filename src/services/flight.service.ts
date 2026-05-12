import axios from 'axios';
import { VehicleLocation } from '../models/vehicle.model';

export const FetchLiveData = async () => {
    try {
        const apiUrl = [
            "https://fr24api.flightradar24.com/api/live/flight-positions/full?registrations=VH-LF2,VH-LF3,VH-LF4,VH-LF5,VH-LF6,VH-XCE,VH-XCI,VH-XCK,VH-XCY,VH-XGB,VH-XIA,VH-XIH,VH-XIJ,VH-XIL,VH-XIR",
            "https://fr24api.flightradar24.com/api/live/flight-positions/full?registrations=VH-XIU,VH-XIW,VH-XNR,VH-URR,VH-OFA,VH-OFB,VH-OFC,VH-VSZ"
        ];

        const activeRegsThisTick = new Set<string>();

        for (const api of apiUrl) {
            const response = await axios.get(api, { headers: { 'Authorization': `Bearer ${process.env.FLIGHT_RADAR_API_KEY}`, 'Accept-Version': 'v1' } });
            const flights = response.data.data;

            for (const flight of flights) {
                activeRegsThisTick.add(flight.reg);

                const flightDate = flight.timestamp ? new Date(flight.timestamp) : new Date();
                const lastRecord = await VehicleLocation.findOne({ reg: flight.reg }).sort({ created_at: -1 });

                let isStart = !lastRecord || lastRecord.is_end;
                let reference = isStart ? `${flight.reg}-${flightDate.getTime()}` : lastRecord?.reference;

                if (lastRecord && !isStart && lastRecord.lat === flight.lat && lastRecord.lon === flight.lon) {
                    continue;
                }

                if (isStart) {
                    await VehicleLocation.create({ reg: flight.reg, lat: flight.lat, lon: flight.lon, created_at: flightDate, is_start: true, reference: reference });
                } else {
                    const followingRecord = await VehicleLocation.findOne({ reference, is_start: false });
                    if (followingRecord) {
                        followingRecord.lat = flight.lat;
                        followingRecord.lon = flight.lon;
                        followingRecord.created_at = flightDate;
                        await followingRecord.save();
                    } else {
                        await VehicleLocation.create({ reg: flight.reg, lat: flight.lat, lon: flight.lon, created_at: flightDate, is_start: false, reference: reference });
                    }
                }
            }
        }

        const allTargetRegs: string[] = [];
        for (const api of apiUrl) {
            const match = api.match(/registrations=([^&]+)/);

            if (match)
                allTargetRegs.push(...match[1].split(','));
        }

        for (const reg of allTargetRegs) {
            if (!activeRegsThisTick.has(reg)) {
                const openRefs = await VehicleLocation.distinct('reference', { reg, is_end: false });

                for (const ref of openRefs) {
                    const latestInSession = await VehicleLocation.findOne({ reference: ref }).sort({ created_at: -1 });

                    if (latestInSession) {
                        const minutesSinceUpdate = (Date.now() - latestInSession.created_at.getTime()) / (1000 * 60);

                        if (minutesSinceUpdate < 10)
                            continue;
                    }

                    const hasFollowing = await VehicleLocation.exists({ reference: ref, is_start: false });

                    if (hasFollowing) {
                        const result = await VehicleLocation.updateMany({ reference: ref, is_start: false }, { $set: { is_end: true } });
                        if (result.modifiedCount > 0) {
                            console.log(`[Flight Radar Service] Registration ${reg} lost for > 10 minutes. Session ${ref} ended.`);
                        }
                    } else {
                        const result = await VehicleLocation.deleteMany({ reference: ref });
                        if (result.deletedCount > 0) {
                            console.log(`[Flight Radar Service] Registration ${reg} lost for > 10 minutes with only start point. Removed session ${ref}.`);
                        }
                    }
                }
            }
        }

        console.log(`[Flight Radar Service] Cron job ran at ${new Date().toISOString()}`);

    } catch (error) {
        console.error('[Flight Radar Service] Error fetching data:', error);
    }
};
