import { Request, Response } from 'express';
import { VehicleLocation } from '../models/vehicle.model';

export const GetTracks = async (req: Request, res: Response) => {
    try {
        const tracks = await VehicleLocation.find().sort({ reg: 1, created_at: 1 });

        const groupedTracks: Record<string, any[]> = {};

        for (const track of tracks) {
            if (!groupedTracks[track.reg])
                groupedTracks[track.reg] = [];

            groupedTracks[track.reg].push({
                lat: track.lat,
                lon: track.lon,
                created_at: track.created_at,
                is_start: track.is_start,
                is_end: track.is_end,
                reference: track.reference
            });
        }

        res.json(groupedTracks);
    } catch (error) {
        console.error('Error fetching tracks:', error);
        res.status(500).json({ error: 'Failed to fetch tracking data' });
    }
};
