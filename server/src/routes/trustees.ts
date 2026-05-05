import { Router, Request, Response } from 'express';
import Trustee from '../models/Trustee';
import { authMiddleware } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();

// GET /api/trustees
router.get('/', async (_req: Request, res: Response): Promise<void> => {
  try {
    const trustees = await Trustee.find();
    res.json(trustees);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});

// POST /api/trustees (admin)
router.post('/', authMiddleware, upload.single('image_file'), async (req: Request, res: Response): Promise<void> => {
  try {
    const image_url = req.file ? `/uploads/${req.file.filename}` : req.body.image_url || '';
    const trustee = new Trustee({ ...req.body, image_url });
    await trustee.save();
    res.status(201).json(trustee);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});

// PUT /api/trustees/:id (admin)
router.put('/:id', authMiddleware, upload.single('image_file'), async (req: Request, res: Response): Promise<void> => {
  try {
    const existing = await Trustee.findById(req.params.id);
    if (!existing) { res.status(404).json({ message: 'Not found' }); return; }
    const image_url = req.file ? `/uploads/${req.file.filename}` : req.body.image_url || existing.image_url;
    const updated = await Trustee.findByIdAndUpdate(req.params.id, { ...req.body, image_url }, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});

// DELETE /api/trustees/:id (admin)
router.delete('/:id', authMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    await Trustee.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});

export default router;
