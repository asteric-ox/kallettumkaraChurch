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

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ─────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Static Files ───────────────────────────────────────────────────
const clientBuildPath = path.join(__dirname, '../../client/dist');
app.use(express.static(clientBuildPath));

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

// Serve uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ── Health Check ───────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', message: 'Infant Jesus Church API running' });
});

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) return;
  res.sendFile(path.join(clientBuildPath, 'index.html'));
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

