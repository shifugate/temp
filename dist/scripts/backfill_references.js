"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const vehicle_model_1 = require("../src/models/vehicle.model");
dotenv_1.default.config();
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/lfac_api';
const backfill = async () => {
    try {
        console.log(`Connecting to MongoDB...`);
        await mongoose_1.default.connect(MONGO_URI);
        console.log('Connected to MongoDB successfully');
        const regs = await vehicle_model_1.VehicleLocation.distinct('reg');
        console.log(`Found ${regs.length} unique registrations to process.`);
        for (const reg of regs) {
            console.log(`Processing registration: ${reg}...`);
            const tracks = await vehicle_model_1.VehicleLocation.find({ reg }).sort({ created_at: 1 });
            let currentReference = undefined;
            for (let i = 0; i < tracks.length; i++) {
                const currentTrack = tracks[i];
                const previousTrack = i > 0 ? tracks[i - 1] : null;
                let isStart = false;
                let isEnd = false;
                // 1. Check heuristics for gap > 5 mins
                if (!previousTrack) {
                    isStart = true;
                }
                else {
                    const timeDiffMinutes = (currentTrack.created_at.getTime() - previousTrack.created_at.getTime()) / (1000 * 60);
                    if (timeDiffMinutes > 5) {
                        isStart = true;
                        if (previousTrack && !previousTrack.is_end) {
                            previousTrack.is_end = true;
                            await previousTrack.save();
                        }
                    }
                }
                // 2. Respect existing 'is_start' if it was captured accurately by the flight service
                if (currentTrack.is_start === true) {
                    isStart = true;
                    if (previousTrack && !previousTrack.is_end) {
                        previousTrack.is_end = true;
                        await previousTrack.save();
                    }
                }
                // 3. Heuristic for the very last track of the vehicle
                if (i === tracks.length - 1) {
                    const ageMinutes = (new Date().getTime() - currentTrack.created_at.getTime()) / (1000 * 60);
                    if (ageMinutes > 5) {
                        isEnd = true;
                    }
                }
                // 4. Respect existing 'is_end'
                if (currentTrack.is_end === true) {
                    isEnd = true;
                }
                // CLEANUP: Hard reset the flags so there are no dirty states
                currentTrack.is_start = isStart;
                currentTrack.is_end = isEnd;
                // If this is a start point, generate a NEW reference for the session
                if (isStart) {
                    currentReference = `${reg}-${currentTrack.created_at.getTime()}`;
                }
                // Assign the reference
                currentTrack.reference = currentReference;
                await currentTrack.save();
            }
            console.log(`Finished ${reg}. Processed ${tracks.length} records.`);
        }
        console.log('Database backfill complete.');
        process.exit(0);
    }
    catch (err) {
        console.error('Error during backfill:', err);
        process.exit(1);
    }
};
backfill();
//# sourceMappingURL=backfill_references.js.map