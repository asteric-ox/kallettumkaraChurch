import mongoose, { Schema, Document } from 'mongoose';

export interface IHallBooking extends Document {
  name: string;
  phone: string;
  email: string;
  event_type: string;
  booking_date: Date;
  start_time: string; // e.g., "10:00 AM"
  end_time: string;   // e.g., "04:00 PM"
  time_slot: 'Morning' | 'Afternoon' | 'Full Day' | 'Custom';
  status: 'Pending' | 'Approved' | 'Declined';
  additional_info?: string;
  created_at: Date;
}

const HallBookingSchema: Schema = new Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String },
  event_type: { type: String, required: true },
  booking_date: { type: Date, required: true },
  start_time: { type: String, required: true },
  end_time: { type: String, required: true },
  time_slot: { 
    type: String, 
    enum: ['Morning', 'Afternoon', 'Full Day', 'Custom'], 
    default: 'Full Day' 
  },
  status: { 
    type: String, 
    enum: ['Pending', 'Approved', 'Declined'], 
    default: 'Pending' 
  },
  additional_info: { type: String },
  created_at: { type: Date, default: Date.now },
});

export default mongoose.model<IHallBooking>('HallBooking', HallBookingSchema);
