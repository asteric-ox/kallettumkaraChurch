import mongoose, { Schema, Document } from 'mongoose';

export interface IPrayerRequest extends Document {
  name: string;
  email: string;
  intention: string;
  createdAt: Date;
}

const PrayerRequestSchema = new Schema<IPrayerRequest>({
  name: { type: String, default: 'Anonymous' },
  email: { type: String, default: '' },
  intention: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, index: true },
});

export default mongoose.model<IPrayerRequest>('PrayerRequest', PrayerRequestSchema);
