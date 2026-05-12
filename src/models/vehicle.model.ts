import mongoose, { Schema, Document } from 'mongoose';

export interface IVehicleLocation extends Document {
  reg: string;
  lat: number;
  lon: number;
  created_at: Date;
  is_start?: boolean;
  is_end?: boolean;
  reference?: string;
}

const VehicleLocationSchema: Schema = new Schema({
  reg: { type: String, required: true },
  lat: { type: Number, required: true },
  lon: { type: Number, required: true },
  created_at: { type: Date, default: Date.now },
  is_start: { type: Boolean, default: false },
  is_end: { type: Boolean, default: false },
  reference: { type: String, required: false },
});

VehicleLocationSchema.index({ created_at: 1 }, { expireAfterSeconds: 31 * 24 * 60 * 60 });

export const VehicleLocation = mongoose.model<IVehicleLocation>('VehicleLocation', VehicleLocationSchema);
