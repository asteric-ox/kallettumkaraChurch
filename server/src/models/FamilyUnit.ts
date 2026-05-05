import mongoose, { Schema, Document } from 'mongoose';

interface ILeadershipMember {
  name: string;
  phone: string;
  address: string;
  image_url: string;
}

interface IFamily {
  name: string;
  phone: string;
  address: string;
  email: string;
  image_url: string;
  visible: boolean;
}

export interface IFamilyUnit extends Document {
  unit_number: number;
  name: string;
  show_photo: boolean;
  president: ILeadershipMember;
  secretary: ILeadershipMember;
  treasurer: ILeadershipMember;
  families: IFamily[];
}

const LeadershipSchema = new Schema<ILeadershipMember>({
  name: { type: String, default: '—' },
  phone: { type: String, default: '—' },
  address: { type: String, default: '—' },
  image_url: { type: String, default: '' },
}, { _id: false });

const FamilySchema = new Schema<IFamily>({
  name: { type: String, required: true },
  phone: { type: String, default: '' },
  address: { type: String, default: '' },
  email: { type: String, default: '' },
  image_url: { type: String, default: '' },
  visible: { type: Boolean, default: true },
}, { _id: false });

const FamilyUnitSchema = new Schema<IFamilyUnit>({
  unit_number: { type: Number, required: true },
  name: { type: String, required: true },
  show_photo: { type: Boolean, default: true },
  president: { type: LeadershipSchema, default: () => ({}) },
  secretary: { type: LeadershipSchema, default: () => ({}) },
  treasurer: { type: LeadershipSchema, default: () => ({}) },
  families: { type: [FamilySchema], default: [] },
});

export default mongoose.model<IFamilyUnit>('FamilyUnit', FamilyUnitSchema);
