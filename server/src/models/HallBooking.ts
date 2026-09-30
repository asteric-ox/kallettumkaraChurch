import mongoose, { Schema, Document } from 'mongoose';

export type HallType = 'Main Parish Hall' | 'Mini Parish Hall' | 'Both (Main & Mini Hall)';

export const HALL_PRICING: Record<HallType, number> = {
  'Main Parish Hall': 10000,
  'Mini Parish Hall': 5000,
  'Both (Main & Mini Hall)': 15000,
};

export interface IHallBooking extends Document {
  name: string;
  phone: string;
  email: string;
  event_type: string;
  booking_date: Date;
  start_time: string; // e.g., "10:00 AM"
  end_time: string;   // e.g., "04:00 PM"
  time_slot: 'Morning' | 'Afternoon' | 'Full Day' | 'Custom';
  hall_type: HallType;
  amount: number;
  status: 'Pending' | 'Approved' | 'Declined';
  additional_info?: string;
  admin_remarks?: string;
  email_sent?: boolean;
  created_at: Date;
}

const HallBookingSchema: Schema = new Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  event_type: { type: String, required: true },
  booking_date: { type: Date, required: true },
  start_time: { type: String, required: true },
  end_time: { type: String, required: true },
  time_slot: { 
    type: String, 
    enum: ['Morning', 'Afternoon', 'Full Day', 'Custom'], 
    default: 'Full Day' 
  },
  hall_type: {
    type: String,
    enum: ['Main Parish Hall', 'Mini Parish Hall', 'Both (Main & Mini Hall)'],
    default: 'Main Parish Hall',
  },
  amount: {
    type: Number,
    default: 10000,
  },
  status: { 
    type: String, 
    enum: ['Pending', 'Approved', 'Declined'], 
    default: 'Pending' 
  },
  additional_info: { type: String },
  admin_remarks: { type: String },
  email_sent: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now },
});

export default mongoose.model<IHallBooking>('HallBooking', HallBookingSchema);
