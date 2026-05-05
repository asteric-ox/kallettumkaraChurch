import { Router, Request, Response } from 'express';
import SiteSettings from '../models/SiteSettings';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// GET /api/settings
router.get('/', async (_req: Request, res: Response): Promise<void> => {
  try {
    const settings = await SiteSettings.findOne({ key: 'general' });
    res.json(settings || { maintenance_mode: false, maintenance_message: '', hall_booking_enabled: true });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});

// PUT /api/settings/maintenance (admin)
router.put('/maintenance', authMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    const { maintenance_mode, maintenance_message, hall_booking_enabled } = req.body;
    const settings = await SiteSettings.findOneAndUpdate(
      { key: 'general' },
      { maintenance_mode, maintenance_message, hall_booking_enabled, updated_at: new Date() },
      { new: true, upsert: true }
    );
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});

export default router;
