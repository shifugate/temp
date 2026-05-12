const crypto = require('crypto');

if (!global.crypto) {
    global.crypto = crypto;
}

import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import VehicleRoutes from './src/routes/vehicle.route';
import { StartSchedules } from './src/schedules/data.schedule';

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/lfac_api';

app.use(express.json());

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB successfully');

        StartSchedules();

        app.get('/', (req: Request, res: Response) => res.send('LFAC API is running'));
        app.use('/api/vehicles', VehicleRoutes);
        app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
    })
    .catch((err) => console.error('MongoDB connection error:', err));