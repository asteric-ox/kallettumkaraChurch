import { Router } from 'express';
import HallBooking, { HallType, HALL_PRICING } from '../models/HallBooking';
import { authMiddleware } from '../middleware/auth';
import { sendBookingApprovalEmail, sendBookingRejectionEmail } from '../utils/emailService';

const router = Router();

// 1. Get bookings for the public calendar (PRIVACY SAFE: strictly excludes email and phone)
router.get('/public', async (_req, res) => {
  try {
    const bookings = await HallBooking.find({
      status: { $in: ['Approved', 'Pending'] }
    })
      .select('event_type booking_date start_time end_time time_slot hall_type amount status')
      .sort({ booking_date: 1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching availability' });
  }
});

// 2. Get all bookings (Admin only - includes email, phone, and remarks)
router.get('/', authMiddleware, async (_req, res) => {
  try {
    const bookings = await HallBooking.find().sort({ created_at: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings' });
  }
});

// 3. Get single booking status by ID (Public tracking - excludes email and phone)
router.get('/status/:id', async (req, res) => {
  try {
    const booking = await HallBooking.findById(req.params.id).select(
      'name event_type booking_date start_time end_time time_slot hall_type amount status admin_remarks'
    );
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json(booking);
  } catch (error) {
    res.status(400).json({ message: 'Invalid booking ID' });
  }
});

// 4. Check availability for a specific date and optional hall_type
router.get('/check-availability', async (req, res) => {
  try {
    const { date, hall_type } = req.query;
    if (!date) return res.status(400).json({ message: 'Date is required' });

    const bookings = await HallBooking.find({
      booking_date: new Date(date as string),
      status: { $ne: 'Declined' }
    }).select('event_type booking_date start_time end_time time_slot hall_type status');

    let conflict = false;
    if (hall_type) {
      if (hall_type === 'Both (Main & Mini Hall)') {
        // If requesting both halls, ANY existing booking on that date is a conflict
        conflict = bookings.length > 0;
      } else {
        // If requesting a single hall, conflict occurs if that same hall is booked OR 'Both' is booked
        conflict = bookings.some(b => b.hall_type === hall_type || b.hall_type === 'Both (Main & Mini Hall)');
      }
    } else {
      conflict = bookings.length > 0;
    }

    res.json({ available: !conflict, bookings });
  } catch (error) {
    res.status(500).json({ message: 'Error checking availability' });
  }
});

// 5. Submit a new booking request (Public)
router.post('/', async (req, res) => {
  try {
    const {
      name,
      phone,
      email,
      event_type,
      booking_date,
      time_slot,
      start_time,
      end_time,
      hall_type,
      additional_info
    } = req.body;

    if (!name || !phone || !email || !event_type || !booking_date) {
      return res.status(400).json({ message: 'Please provide all required fields (Name, Phone, Email, Event Type, and Date).' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Please enter a valid email address.' });
    }

    // Determine hall_type and calculate amount
    let selectedHall: HallType = 'Main Parish Hall';
    if (hall_type === 'Mini Parish Hall') {
      selectedHall = 'Mini Parish Hall';
    } else if (hall_type === 'Both (Main & Mini Hall)' || hall_type === 'Both') {
      selectedHall = 'Both (Main & Mini Hall)';
    }

    const calculatedAmount = HALL_PRICING[selectedHall] || 10000;

    const newBooking = new HallBooking({
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim().toLowerCase(),
      event_type,
      booking_date,
      time_slot: time_slot || 'Full Day',
      start_time: start_time || '08:00 AM',
      end_time: end_time || '10:00 PM',
      hall_type: selectedHall,
      amount: calculatedAmount,
      additional_info: additional_info?.trim(),
    });

    await newBooking.save();
    res.status(201).json({ message: 'Booking request submitted successfully', booking: newBooking });
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'Error submitting booking request' });
  }
});

// 6. Update booking status (Admin only) - Automatically triggers email notification
router.patch('/:id/status', authMiddleware, async (req, res) => {
  try {
    const { status, admin_remarks } = req.body;
    if (!['Approved', 'Declined', 'Pending'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Must be Approved, Declined, or Pending.' });
    }

    const updateFields: any = { status };
    if (admin_remarks !== undefined) {
      updateFields.admin_remarks = admin_remarks;
    }

    const booking = await HallBooking.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true }
    );

    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    // Send email notification based on status
    let emailSent = false;
    if (status === 'Approved') {
      emailSent = await sendBookingApprovalEmail(booking);
      if (emailSent) {
        booking.email_sent = true;
        await booking.save();
      }
    } else if (status === 'Declined') {
      emailSent = await sendBookingRejectionEmail(booking);
      if (emailSent) {
        booking.email_sent = true;
        await booking.save();
      }
    }

    res.json({
      message: `Booking status updated to ${status}.${emailSent ? ` Email notification sent to ${booking.email}.` : ' (Email could not be delivered: Render free tier blocks outbound SMTP ports 465/587).' }`,
      booking,
      emailSent,
    });
  } catch (error) {
    res.status(400).json({ message: 'Error updating booking' });
  }
});

// 7. Resend notification email (Admin only)
router.post('/:id/resend-email', authMiddleware, async (req, res) => {
  try {
    const booking = await HallBooking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    let sent = false;
    if (booking.status === 'Approved') {
      sent = await sendBookingApprovalEmail(booking);
    } else if (booking.status === 'Declined') {
      sent = await sendBookingRejectionEmail(booking);
    } else {
      return res.status(400).json({ message: 'Notification email can only be sent for Approved or Declined bookings.' });
    }

    if (sent) {
      booking.email_sent = true;
      await booking.save();
      return res.json({ message: `Email successfully resent to ${booking.email}` });
    } else {
      return res.status(500).json({
        message: 'Render free tier blocks SMTP ports (465/587). Configure GMAIL_WEBHOOK_URL or an HTTPS email service to send emails.',
      });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error resending email' });
  }
});


export default router;
