import mongoose, { Schema, Document } from 'mongoose';

export interface IAnnouncement extends Document {
  title: string;
  content: string;
  date: Date;
  expiry: Date;
  pdf_url: string;
}

const AnnouncementSchema = new Schema<IAnnouncement>({
  title: { type: String, required: true },
  content: { type: String, required: true },
  date: { type: Date, default: Date.now },
  expiry: { type: Date, required: true },
  pdf_url: { type: String, default: '' },
});

export default mongoose.model<IAnnouncement>('Announcement', AnnouncementSchema);
