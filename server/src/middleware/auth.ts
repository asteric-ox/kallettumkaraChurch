import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  admin?: { username: string };
}

import { ipRestrictionMiddleware } from './ipRestriction';

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
  // 1. Enforce IP Restriction for all authenticated routes
  ipRestrictionMiddleware(req, res, () => {
    // 2. Enforce JWT Auth
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      res.status(401).json({ message: 'No token provided' });
      return;
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as { username: string };
      req.admin = decoded;
      next();
    } catch {
      res.status(401).json({ message: 'Invalid token' });
    }
  });
};
