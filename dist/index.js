"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const vehicle_route_1 = __importDefault(require("./src/routes/vehicle.route"));
const data_schedule_1 = require("./src/schedules/data.schedule");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/lfac_api';
app.use(express_1.default.json());
mongoose_1.default.connect(MONGO_URI)
    .then(() => {
    console.log('Connected to MongoDB successfully');
    (0, data_schedule_1.StartSchedules)();
    app.get('/', (req, res) => res.send('LFAC API is running'));
    app.use('/api/vehicles', vehicle_route_1.default);
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
})
    .catch((err) => console.error('MongoDB connection error:', err));
//# sourceMappingURL=index.js.map