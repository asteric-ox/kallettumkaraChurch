import { Request, Response, NextFunction } from 'express';

export const ipRestrictionMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  if (process.env.NODE_ENV === 'development' || process.env.DISABLE_IP_RESTRICTION === 'true') {
    return next();
  }

  const allowedIpsStr = process.env.ADMIN_ALLOWED_IPS;
  
  if (!allowedIpsStr) {
    // Fail securely if no IP is provided in production and no explicit disable flag
    res.status(403).json({ message: 'IP restriction is enabled but no IPs are configured in ADMIN_ALLOWED_IPS.' });
    return;
  }

  const allowedIps = allowedIpsStr.split(',').map(ip => ip.trim());
  
  // Use req.ip which respects 'trust proxy' if set in Express
  // Fallback to socket remote address just in case
  const clientIp = req.ip || req.socket.remoteAddress;

  if (!clientIp) {
    res.status(403).json({ message: 'Could not determine client IP address.' });
    return;
  }

  if (allowedIps.includes(clientIp)) {
    return next();
  }

  res.status(403).json({ message: 'Forbidden: Your IP address is not authorized to access the admin panel.' });
};
