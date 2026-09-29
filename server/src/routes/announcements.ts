import { Router, Request, Response } from 'express';
import Announcement from '../models/Announcement';
import MassTiming from '../models/MassTiming';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// GET /api/announcements (active ones)
router.get('/', async (_req: Request, res: Response): Promise<void> => {
  try {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const announcements = await Announcement.find({
      expiry: { $gte: startOfToday }
    }).sort({ date: -1 }).limit(10);
    res.json(announcements);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});

// GET /api/announcements/all (admin)
router.get('/all', authMiddleware, async (_req: Request, res: Response): Promise<void> => {
  try {
    const announcements = await Announcement.find().sort({ date: -1 });
    res.json(announcements);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});

// POST /api/announcements (admin)
router.post('/', authMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    if (req.body.expiry) {
      const exp = new Date(req.body.expiry);
      exp.setHours(23, 59, 59, 999);
      req.body.expiry = exp;
    }
    const ann = new Announcement({ ...req.body, date: new Date() });
    await ann.save();
    res.status(201).json(ann);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});

// DELETE /api/announcements/:id (admin)
router.delete('/:id', authMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    const ann = await Announcement.findById(req.params.id);
    if (ann) {
      if (ann.mass_timing_id) {
        await MassTiming.findByIdAndDelete(ann.mass_timing_id).catch(() => {});
      }
      await Announcement.findByIdAndDelete(req.params.id);
    }
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});

export default router;
