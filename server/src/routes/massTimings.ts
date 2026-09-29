import { Router, Request, Response } from 'express';
import MassTiming from '../models/MassTiming';
import Announcement from '../models/Announcement';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Helper to keep Special Masses synced as Announcements
export const syncSpecialMassAnnouncement = async (timing: any) => {
  if (!timing || !timing.is_special) return;

  const rawExpiry = timing.special_expiry || timing.special_date || new Date();
  const expiryDate = new Date(rawExpiry);
  expiryDate.setHours(23, 59, 59, 999);

  const dateStr = timing.special_date
    ? new Date(timing.special_date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
    : timing.day;

  const occasion = timing.special_occasion || timing.description || 'Special Mass';
  const desc = timing.description && timing.description !== timing.special_occasion ? ` Note: ${timing.description}` : '';
  const content = `Special Holy Mass on ${dateStr} at ${timing.time}.${desc}`;

  await Announcement.findOneAndUpdate(
    { mass_timing_id: timing._id },
    {
      title: `✨ Special Mass: ${occasion}`,
      content: content,
      date: timing.special_date ? new Date(timing.special_date) : new Date(),
      expiry: expiryDate,
      mass_timing_id: timing._id,
      is_special_mass: true,
    },
    { upsert: true, new: true }
  );
};

// Sync existing special masses to announcements on startup
const ensureAllSpecialMassesSynced = async () => {
  try {
    const specials = await MassTiming.find({ is_special: true });
    for (const s of specials) {
      await syncSpecialMassAnnouncement(s);
    }
  } catch (e) {
    console.error('Error syncing special masses to announcements:', e);
  }
};
ensureAllSpecialMassesSynced();

// GET /api/mass-timings — all regular timings
router.get('/', async (_req: Request, res: Response): Promise<void> => {
  try {
    const timings = await MassTiming.find({ is_special: { $ne: true } }).sort({ day: 1, time: 1 });
    res.json(timings);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});

// GET /api/mass-timings/special — active special masses (public)
router.get('/special', async (_req: Request, res: Response): Promise<void> => {
  try {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const specials = await MassTiming.find({
      is_special: true,
      $or: [
        { special_expiry: { $gte: startOfToday } },
        { special_date: { $gte: startOfToday } },
        { special_expiry: { $exists: false } },
      ],
    }).sort({ special_date: 1 });
    res.json(specials);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});

// GET /api/mass-timings/special/all — all special masses (admin)
router.get('/special/all', authMiddleware, async (_req: Request, res: Response): Promise<void> => {
  try {
    const specials = await MassTiming.find({ is_special: true }).sort({ special_date: -1 });
    res.json(specials);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});

// GET /api/mass-timings/today/:day
router.get('/today/:day', async (req: Request, res: Response): Promise<void> => {
  try {
    const timings = await MassTiming.find({ day: req.params.day, is_special: { $ne: true } });
    res.json(timings);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});

// GET /api/mass-timings/category/sunday
router.get('/category/sunday', async (_req: Request, res: Response): Promise<void> => {
  try {
    const timings = await MassTiming.find({ category: 'Sunday', is_special: { $ne: true } });
    res.json(timings);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});

// POST /api/mass-timings (admin) — regular or special
router.post('/', authMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    if (req.body.is_special) {
      if (req.body.special_expiry) {
        const exp = new Date(req.body.special_expiry);
        exp.setHours(23, 59, 59, 999);
        req.body.special_expiry = exp;
      } else if (req.body.special_date) {
        const exp = new Date(req.body.special_date);
        exp.setHours(23, 59, 59, 999);
        req.body.special_expiry = exp;
      }
    }
    const timing = new MassTiming(req.body);
    await timing.save();

    if (timing.is_special) {
      await syncSpecialMassAnnouncement(timing);
    }

    res.status(201).json(timing);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});

// PUT /api/mass-timings/:id (admin)
router.put('/:id', authMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    if (req.body.is_special) {
      if (req.body.special_expiry) {
        const exp = new Date(req.body.special_expiry);
        exp.setHours(23, 59, 59, 999);
        req.body.special_expiry = exp;
      } else if (req.body.special_date) {
        const exp = new Date(req.body.special_date);
        exp.setHours(23, 59, 59, 999);
        req.body.special_expiry = exp;
      }
    }

    const timing = await MassTiming.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!timing) { res.status(404).json({ message: 'Not found' }); return; }

    if (timing.is_special) {
      await syncSpecialMassAnnouncement(timing);
    } else {
      await Announcement.deleteMany({ mass_timing_id: timing._id });
    }

    res.json(timing);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});

// DELETE /api/mass-timings/:id (admin)
router.delete('/:id', authMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    await MassTiming.findByIdAndDelete(req.params.id);
    await Announcement.deleteMany({ mass_timing_id: req.params.id });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});

export default router;
