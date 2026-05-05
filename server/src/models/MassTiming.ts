import mongoose, { Schema, Document } from 'mongoose';

export interface IMassTiming extends Document {
  day: string;
  time: string;
  description: string;
  category: 'Weekday' | 'Sunday';
}

const MassTimingSchema = new Schema<IMassTiming>({
  day: { type: String, required: true },
  time: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, enum: ['Weekday', 'Sunday'], required: true },
});

export default mongoose.model<IMassTiming>('MassTiming', MassTimingSchema);
