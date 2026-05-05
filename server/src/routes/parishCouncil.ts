import { Router, Request, Response } from 'express';
import ParishCouncil from '../models/ParishCouncil';
import { authMiddleware } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();

// GET /api/parish-council
router.get('/', async (_req: Request, res: Response): Promise<void> => {
  try {
    const members = await ParishCouncil.find();
    res.json(members);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});

// POST /api/parish-council (admin)
router.post('/', authMiddleware, upload.single('image_file'), async (req: Request, res: Response): Promise<void> => {
  try {
    const image_url = req.file ? `/uploads/${req.file.filename}` : req.body.image_url || '';
    const member = new ParishCouncil({ ...req.body, image_url });
    await member.save();
    res.status(201).json(member);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});

// PUT /api/parish-council/:id (admin)
router.put('/:id', authMiddleware, upload.single('image_file'), async (req: Request, res: Response): Promise<void> => {
  try {
    const existing = await ParishCouncil.findById(req.params.id);
    if (!existing) { res.status(404).json({ message: 'Not found' }); return; }
    const image_url = req.file ? `/uploads/${req.file.filename}` : req.body.image_url || existing.image_url;
    const updated = await ParishCouncil.findByIdAndUpdate(
      req.params.id,
      { ...req.body, image_url },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});

// DELETE /api/parish-council/:id (admin)
router.delete('/:id', authMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    await ParishCouncil.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});

export default router;
