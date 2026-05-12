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
const run = async () => {
    try {
        await mongoose_1.default.connect(MONGO_URI);
        const twentyMinutesAgo = new Date(Date.now() - 20 * 60 * 1000);
        const result = await vehicle_model_1.VehicleLocation.updateMany({ is_end: false, created_at: { $lt: twentyMinutesAgo } }, { $set: { is_end: true } });
        console.log('Cleanup manually executed. Marked ' + result.modifiedCount + ' stale sessions as ended.');
        process.exit(0);
    }
    catch (e) {
        console.error(e);
        process.exit(1);
    }
};
run();
//# sourceMappingURL=manual_cleanup.js.map