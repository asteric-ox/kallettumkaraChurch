import { Router, Request, Response } from 'express';
import path from 'path';
import fs from 'fs';

const router = Router();

// GET /api/translations/:lang
router.get('/:lang', (req: Request, res: Response): void => {
  const { lang } = req.params;
  const filePath = path.join(__dirname, '../../data', `${lang}.json`);
  if (!fs.existsSync(filePath)) {
    res.status(404).json({ message: 'Translation not found' });
    return;
  }
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  res.json(data);
});

export default router;
