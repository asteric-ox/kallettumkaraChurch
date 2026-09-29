import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { connectDB } from './config/db';
import { seedDatabase } from './seed';

// Routes
import authRoutes from './routes/auth';
import massTimingsRoutes from './routes/massTimings';
import announcementsRoutes from './routes/announcements';
import parishCouncilRoutes from './routes/parishCouncil';
import trusteesRoutes from './routes/trustees';
import familyUnitsRoutes from './routes/familyUnits';
import settingsRoutes from './routes/settings';
import prayerRequestsRoutes from './routes/prayerRequests';
import translationsRoutes from './routes/translations';
import hallBookingsRoutes from './routes/hallBookings';

dotenv.config();

const app = express();
// Trust proxy is required for Render and Cloudflare to get the actual client IP
app.set('trust proxy', 1);

const PORT = process.env.PORT || 5000;

// ── Middleware ─────────────────────────────────────────────────────
const clientUrls = (process.env.CLIENT_URL || '')
  .split(',')
  .map(u => u.trim().replace(/\/$/, ''))
  .filter(Boolean);

const allowedOrigins = [
  ...clientUrls,
  'https://kallettumkarachurch.site',
  'https://www.kallettumkarachurch.site',
  'http://localhost:5173',
  'http://localhost:3000',
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. mobile apps, curl)
    if (!origin) return callback(null, true);
    
    const cleanOrigin = origin.replace(/\/$/, '');
    const isAllowed = allowedOrigins.includes(cleanOrigin) || 
      cleanOrigin.endsWith('.pages.dev') || 
      cleanOrigin.endsWith('.kallettumkarachurch.site');

    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error(`CORS policy: origin '${origin}' not allowed`));
    }
  },
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// ── API Routes ─────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/mass-timings', massTimingsRoutes);
app.use('/api/announcements', announcementsRoutes);
app.use('/api/parish-council', parishCouncilRoutes);
app.use('/api/trustees', trusteesRoutes);
app.use('/api/family-units', familyUnitsRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/prayer-requests', prayerRequestsRoutes);
app.use('/api/translations', translationsRoutes);
app.use('/api/hall-bookings', hallBookingsRoutes);

// Serve uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ── Health Check ───────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', message: 'Infant Jesus Church API running' });
});



// ── Start Server ───────────────────────────────────────────────────
const startServer = async () => {
  try {
    await connectDB();
    // Run seed Database unconditionally to ensure admin credentials are set
    await seedDatabase();
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
  }
};

startServer();

