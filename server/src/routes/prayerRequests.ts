import { Router, Request, Response } from 'express';
import PrayerRequest from '../models/PrayerRequest';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// POST /api/prayer-requests (public)
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const pr = new PrayerRequest(req.body);
    await pr.save();
    res.status(201).json({ message: 'Prayer intention received. God bless you!' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});

// GET /api/prayer-requests (admin)
router.get('/', authMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    const limit = parseInt(req.query.limit as string) || 100;
    const prayers = await PrayerRequest.find().sort({ createdAt: -1 }).limit(limit);
    res.json(prayers);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});

// DELETE /api/prayer-requests/:id (admin)
router.delete('/:id', authMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    await PrayerRequest.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});

// DELETE /api/prayer-requests (admin) — clear all
router.delete('/', authMiddleware, async (_req: Request, res: Response): Promise<void> => {
  try {
    await PrayerRequest.deleteMany({});
    res.json({ message: 'All prayer requests cleared' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});

export default router;
