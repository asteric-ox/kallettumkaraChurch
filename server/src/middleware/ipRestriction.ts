import { Request, Response, NextFunction } from 'express';

const normalizeIp = (ip?: string): string => {
  if (!ip) return '';
  let clean = ip.trim();
  if (clean.startsWith('::ffff:')) {
    clean = clean.replace('::ffff:', '');
  }
  return clean;
};

export const ipRestrictionMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const disableIp = process.env.DISABLE_IP_RESTRICTION?.toString().trim().toLowerCase();
  if (process.env.NODE_ENV === 'development' || disableIp === 'true') {
    return next();
  }

  const allowedIpsStr = process.env.ADMIN_ALLOWED_IPS;
  
  if (!allowedIpsStr || !allowedIpsStr.trim()) {
    // Fail securely if no IP is provided in production and no explicit disable flag
    res.status(403).json({ message: 'IP restriction is enabled but no IPs are configured in ADMIN_ALLOWED_IPS.' });
    return;
  }

  // Extract all possible client IP candidates
  const cfIp = req.headers['cf-connecting-ip'] as string | undefined;
  const xForwarded = req.headers['x-forwarded-for'] as string | undefined;
  const xForwardedFirst = xForwarded ? xForwarded.split(',')[0].trim() : undefined;
  const reqIp = req.ip;
  const remoteAddress = req.socket.remoteAddress;

  const candidateIps = [
    normalizeIp(cfIp),
    normalizeIp(xForwardedFirst),
    normalizeIp(reqIp),
    normalizeIp(remoteAddress),
  ].filter(Boolean);

  console.log("Admin IP diagnostic:", {
    detectedIP: req.ip,
    normalizedReqIP: normalizeIp(req.ip),
    remoteIP: req.socket.remoteAddress,
    cfConnectingIP: cfIp,
    xForwardedFor: xForwarded,
    candidateIPs: candidateIps,
    allowedIPs: allowedIpsStr
  });

  const allowedIps = allowedIpsStr
    .split(',')
    .map(ip => normalizeIp(ip))
    .filter(Boolean);

  const isAllowed = candidateIps.some(candidate => allowedIps.includes(candidate));

  if (isAllowed) {
    return next();
  }

  res.status(403).json({ message: 'Forbidden: Your IP address is not authorized to access the admin panel.' });
};

