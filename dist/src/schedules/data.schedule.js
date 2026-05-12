"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StartSchedules = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const flight_service_1 = require("../services/flight.service");
const StartSchedules = () => {
    (0, flight_service_1.FetchLiveData)();
    node_cron_1.default.schedule('*/2 * * * *', () => (0, flight_service_1.FetchLiveData)());
    console.log('[Schedules] Flight data tracking started (Every 2 minutes)');
};
exports.StartSchedules = StartSchedules;
//# sourceMappingURL=data.schedule.js.map