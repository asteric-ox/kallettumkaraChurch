import { Router, Request, Response } from 'express';
import Announcement from '../models/Announcement';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// GET /api/announcements (active ones)
router.get('/', async (_req: Request, res: Response): Promise<void> => {
  try {
    const announcements = await Announcement.find({
      expiry: { $gte: new Date() }
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
    await Announcement.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});

export default router;
