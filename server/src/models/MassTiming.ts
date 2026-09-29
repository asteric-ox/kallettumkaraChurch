import mongoose, { Schema, Document } from 'mongoose';

export interface IMassTiming extends Document {
  day: string;
  time: string;
  description: string;
  category: 'Weekday' | 'Sunday' | 'Special';
  is_special: boolean;
  special_date?: Date;
  special_occasion?: string;
  special_expiry?: Date;
}

const MassTimingSchema = new Schema<IMassTiming>({
  day: { type: String, required: true },
  time: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, enum: ['Weekday', 'Sunday', 'Special'], required: true },
  is_special: { type: Boolean, default: false },
  special_date: { type: Date },
  special_occasion: { type: String },
  special_expiry: { type: Date },
});

export default mongoose.model<IMassTiming>('MassTiming', MassTimingSchema);
