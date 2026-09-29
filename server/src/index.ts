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
app.set('trust proxy', process.env.TRUSTED_PROXY_CONFIGURATION || true);

const PORT = process.env.PORT || 5000;

// ── Middleware ─────────────────────────────────────────────────────
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173',
  'http://localhost:5173',
];
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. mobile apps, curl)
    if (!origin || allowedOrigins.includes(origin)) {
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
    // Only seed if needed or via environment variable
    if (process.env.SEED_DATA === 'true') {
      await seedDatabase();
    }
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
  }
};

startServer();

