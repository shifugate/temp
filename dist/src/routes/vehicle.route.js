"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const token_auth_1 = require("../auth/token.auth");
const vehicle_controller_1 = require("../controller/vehicle.controller");
const router = express_1.default.Router();
router.get('/tracks', token_auth_1.AuthenticateToken, vehicle_controller_1.GetTracks);
exports.default = router;
//# sourceMappingURL=vehicle.route.js.map