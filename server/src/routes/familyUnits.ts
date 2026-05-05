import { Router, Request, Response } from 'express';
import FamilyUnit from '../models/FamilyUnit';
import { authMiddleware } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();

// GET /api/family-units
router.get('/', async (_req: Request, res: Response): Promise<void> => {
  try {
    const units = await FamilyUnit.find().sort({ unit_number: 1 });
    res.json(units);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});

// GET /api/family-units/:id
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const unit = await FamilyUnit.findById(req.params.id);
    if (!unit) { res.status(404).json({ message: 'Not found' }); return; }
    res.json(unit);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});

// PUT /api/family-units/:id/leadership (admin)
router.put('/:id/leadership', authMiddleware, upload.fields([
  { name: 'president_image', maxCount: 1 },
  { name: 'secretary_image', maxCount: 1 },
  { name: 'treasurer_image', maxCount: 1 },
]), async (req: Request, res: Response): Promise<void> => {
  try {
    const unit = await FamilyUnit.findById(req.params.id);
    if (!unit) { res.status(404).json({ message: 'Not found' }); return; }

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const presImg = files?.president_image?.[0] ? `/uploads/${files.president_image[0].filename}` : unit.president?.image_url || '';
    const secImg = files?.secretary_image?.[0] ? `/uploads/${files.secretary_image[0].filename}` : unit.secretary?.image_url || '';
    const treImg = files?.treasurer_image?.[0] ? `/uploads/${files.treasurer_image[0].filename}` : unit.treasurer?.image_url || '';

    const updated = await FamilyUnit.findByIdAndUpdate(req.params.id, {
      president: { name: req.body.president_name || '—', phone: req.body.president_phone || '—', address: req.body.president_address || '—', image_url: presImg },
      secretary: { name: req.body.secretary_name || '—', phone: req.body.secretary_phone || '—', address: req.body.secretary_address || '—', image_url: secImg },
      treasurer: { name: req.body.treasurer_name || '—', phone: req.body.treasurer_phone || '—', address: req.body.treasurer_address || '—', image_url: treImg },
    }, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});

// PATCH /api/family-units/:id/toggle-photo (admin)
router.patch('/:id/toggle-photo', authMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    const unit = await FamilyUnit.findById(req.params.id);
    if (!unit) { res.status(404).json({ message: 'Not found' }); return; }
    const updated = await FamilyUnit.findByIdAndUpdate(req.params.id, { show_photo: !unit.show_photo }, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});

// POST /api/family-units/:id/families (admin)
router.post('/:id/families', authMiddleware, upload.single('image_file'), async (req: Request, res: Response): Promise<void> => {
  try {
    const image_url = req.file ? `/uploads/${req.file.filename}` : '';
    const family = { name: req.body.name, phone: req.body.phone || '', address: req.body.address || '', email: req.body.email || '', image_url, visible: true };
    const updated = await FamilyUnit.findByIdAndUpdate(req.params.id, { $push: { families: family } }, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});

// PATCH /api/family-units/:id/families/:index/toggle (admin)
router.patch('/:id/families/:index/toggle', authMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    const unit = await FamilyUnit.findById(req.params.id);
    if (!unit) { res.status(404).json({ message: 'Not found' }); return; }
    const idx = parseInt(req.params.index);
    if (idx < 0 || idx >= unit.families.length) { res.status(400).json({ message: 'Invalid index' }); return; }
    unit.families[idx].visible = !unit.families[idx].visible;
    await unit.save();
    res.json(unit);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});

// DELETE /api/family-units/:id/families/:index (admin)
router.delete('/:id/families/:index', authMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    const unit = await FamilyUnit.findById(req.params.id);
    if (!unit) { res.status(404).json({ message: 'Not found' }); return; }
    const idx = parseInt(req.params.index);
    if (idx < 0 || idx >= unit.families.length) { res.status(400).json({ message: 'Invalid index' }); return; }
    unit.families.splice(idx, 1);
    await unit.save();
    res.json(unit);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});

export default router;
