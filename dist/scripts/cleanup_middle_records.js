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
const cleanup = async () => {
    try {
        console.log(`Connecting to MongoDB...`);
        await mongoose_1.default.connect(MONGO_URI);
        console.log('Connected to MongoDB successfully');
        const references = await vehicle_model_1.VehicleLocation.distinct('reference');
        console.log(`Found ${references.length} unique sessions to process.`);
        let totalDeleted = 0;
        for (const ref of references) {
            if (!ref)
                continue;
            // Get all records for this session, sorted by time
            const allInSession = await vehicle_model_1.VehicleLocation.find({ reference: ref }).sort({ created_at: 1 });
            if (allInSession.length <= 2) {
                continue;
            }
            const startRecordId = allInSession[0]._id;
            const endRecordId = allInSession[allInSession.length - 1]._id;
            // Delete all records except the first (start) and last (latest/end)
            const result = await vehicle_model_1.VehicleLocation.deleteMany({
                reference: ref,
                _id: { $nin: [startRecordId, endRecordId] }
            });
            totalDeleted += result.deletedCount;
            console.log(`Session ${ref}: Deleted ${result.deletedCount} intermediate records.`);
        }
        console.log(`Cleanup complete. Total records deleted: ${totalDeleted}`);
        process.exit(0);
    }
    catch (err) {
        console.error('Error during cleanup:', err);
        process.exit(1);
    }
};
cleanup();
//# sourceMappingURL=cleanup_middle_records.js.map