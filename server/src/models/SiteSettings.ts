import mongoose, { Schema, Document } from 'mongoose';

export interface ISiteSettings extends Document {
  key: string;
  maintenance_mode: boolean;
  maintenance_message: string;
  hall_booking_enabled: boolean;
  updated_at: Date;
}

const SiteSettingsSchema = new Schema<ISiteSettings>({
  key: { type: String, required: true, unique: true },
  maintenance_mode: { type: Boolean, default: false },
  maintenance_message: { type: String, default: '' },
  hall_booking_enabled: { type: Boolean, default: true },
  updated_at: { type: Date, default: Date.now },
});

export default mongoose.model<ISiteSettings>('SiteSettings', SiteSettingsSchema);
