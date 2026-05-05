import { Router } from 'express';
import HallBooking from '../models/HallBooking';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Get all approved bookings (Public)
router.get('/public', async (req, res) => {
  try {
    const bookings = await HallBooking.find({ status: 'Approved' }).sort({ booking_date: 1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching availability' });
  }
});

// Get all bookings (Admin only)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const bookings = await HallBooking.find().sort({ booking_date: 1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings' });
  }
});

// Check availability for a specific date
router.get('/check-availability', async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) return res.status(400).json({ message: 'Date is required' });

    const bookings = await HallBooking.find({
      booking_date: new Date(date as string),
      status: { $ne: 'Declined' }
    });
    
    res.json({ available: bookings.length === 0, bookings });
  } catch (error) {
    res.status(500).json({ message: 'Error checking availability' });
  }
});

// Submit a new booking request (Public)
router.post('/', async (req, res) => {
  try {
    const { name, phone, email, event_type, booking_date, time_slot, additional_info } = req.body;
    
    const newBooking = new HallBooking({
      name,
      phone,
      email,
      event_type,
      booking_date,
      time_slot,
      additional_info
    });

    await newBooking.save();
    res.status(201).json({ message: 'Booking request submitted successfully', booking: newBooking });
  } catch (error) {
    res.status(400).json({ message: 'Error submitting booking request' });
  }
});

// Update booking status (Admin only)
router.patch('/:id/status', authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await HallBooking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json(booking);
  } catch (error) {
    res.status(400).json({ message: 'Error updating booking' });
  }
});

export default router;
