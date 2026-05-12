import cron from 'node-cron';
import { FetchLiveData } from '../services/flight.service';

export const StartSchedules = () => {
    FetchLiveData();

    cron.schedule('*/2 * * * *', () => FetchLiveData());

    console.log('[Schedules] Flight data tracking started (Every 2 minutes)');
};
