import mongoose, { Schema, Document } from 'mongoose';

export interface IAnnouncement extends Document {
  title: string;
  content: string;
  date: Date;
  expiry: Date;
  pdf_url: string;
  mass_timing_id?: mongoose.Types.ObjectId;
  is_special_mass?: boolean;
}

const AnnouncementSchema = new Schema<IAnnouncement>({
  title: { type: String, required: true },
  content: { type: String, required: true },
  date: { type: Date, default: Date.now },
  expiry: { type: Date, required: true },
  pdf_url: { type: String, default: '' },
  mass_timing_id: { type: Schema.Types.ObjectId, ref: 'MassTiming' },
  is_special_mass: { type: Boolean, default: false },
});

export default mongoose.model<IAnnouncement>('Announcement', AnnouncementSchema);
