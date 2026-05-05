import { Router, Request, Response } from 'express';
import MassTiming from '../models/MassTiming';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// GET /api/mass-timings
router.get('/', async (_req: Request, res: Response): Promise<void> => {
  try {
    const timings = await MassTiming.find().sort({ day: 1, time: 1 });
    res.json(timings);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});

// GET /api/mass-timings/today
router.get('/today/:day', async (req: Request, res: Response): Promise<void> => {
  try {
    const timings = await MassTiming.find({ day: req.params.day });
    res.json(timings);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});

// GET /api/mass-timings/sunday
router.get('/category/sunday', async (_req: Request, res: Response): Promise<void> => {
  try {
    const timings = await MassTiming.find({ category: 'Sunday' });
    res.json(timings);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});

// POST /api/mass-timings (admin)
router.post('/', authMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    const timing = new MassTiming(req.body);
    await timing.save();
    res.status(201).json(timing);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});

// PUT /api/mass-timings/:id (admin)
router.put('/:id', authMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    const timing = await MassTiming.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!timing) { res.status(404).json({ message: 'Not found' }); return; }
    res.json(timing);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});

// DELETE /api/mass-timings/:id (admin)
router.delete('/:id', authMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    await MassTiming.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});

export default router;
