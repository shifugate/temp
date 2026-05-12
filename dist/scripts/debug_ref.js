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
        const docs = await vehicle_model_1.VehicleLocation.find({ reference: 'VH-OFB-1778483398000' }).sort({ created_at: 1 });
        console.log(JSON.stringify(docs, null, 2));
        process.exit(0);
    }
    catch (e) {
        console.error(e);
        process.exit(1);
    }
};
run();
//# sourceMappingURL=debug_ref.js.map