"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetTracks = void 0;
const vehicle_model_1 = require("../models/vehicle.model");
const GetTracks = async (req, res) => {
    try {
        const tracks = await vehicle_model_1.VehicleLocation.find().sort({ reg: 1, created_at: 1 });
        const groupedTracks = {};
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
    }
    catch (error) {
        console.error('Error fetching tracks:', error);
        res.status(500).json({ error: 'Failed to fetch tracking data' });
    }
};
exports.GetTracks = GetTracks;
//# sourceMappingURL=vehicle.controller.js.map