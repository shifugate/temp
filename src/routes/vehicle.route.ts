import express from 'express';
import { AuthenticateToken } from '../auth/token.auth';
import { GetTracks } from '../controller/vehicle.controller';

const router = express.Router();

router.get('/tracks', AuthenticateToken, GetTracks);

export default router;
