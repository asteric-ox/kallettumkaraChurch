import mongoose, { Schema, Document } from 'mongoose';

export interface IParishCouncil extends Document {
  name: string;
  role: string;
  image_url: string;
  phone: string;
  dob: string;
  feast_day: string;
  normal_mass_time: string;
  special_mass_time: string;
}

const ParishCouncilSchema = new Schema<IParishCouncil>({
  name: { type: String, required: true },
  role: { type: String, required: true },
  image_url: { type: String, default: '' },
  phone: { type: String, default: '' },
  dob: { type: String, default: '' },
  feast_day: { type: String, default: '' },
  normal_mass_time: { type: String, default: '' },
  special_mass_time: { type: String, default: '' },
});

export default mongoose.model<IParishCouncil>('ParishCouncil', ParishCouncilSchema);
