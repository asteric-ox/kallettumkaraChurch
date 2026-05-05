import mongoose, { Schema, Document } from 'mongoose';

export interface ITrustee extends Document {
  name: string;
  role: string;
  image_url: string;
  phone: string;
  dob: string;
  feast_day: string;
  installation_date: string;
}

const TrusteeSchema = new Schema<ITrustee>({
  name: { type: String, required: true },
  role: { type: String, default: 'Trustee' },
  image_url: { type: String, default: '' },
  phone: { type: String, default: '' },
  dob: { type: String, default: '' },
  feast_day: { type: String, default: '' },
  installation_date: { type: String, default: '' },
});

export default mongoose.model<ITrustee>('Trustee', TrusteeSchema);
