import { Router, Request, Response } from 'express';
import PrayerRequest from '../models/PrayerRequest';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// POST /api/prayer-requests
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
router.get('/', authMiddleware, async (_req: Request, res: Response): Promise<void> => {
  try {
    const prayers = await PrayerRequest.find().sort({ createdAt: -1 }).limit(50);
    res.json(prayers);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});

export default router;
