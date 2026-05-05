import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Public Layout
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import HistoryPage from './pages/HistoryPage';
import SpiritualLifePage from './pages/SpiritualLifePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import ParishPage from './pages/ParishPage';
import CatechismPage from './pages/CatechismPage';
import FamilyUnitsPage from './pages/FamilyUnitsPage';
import FamilyUnitDetailPage from './pages/FamilyUnitDetailPage';
import InstitutionsPage from './pages/InstitutionsPage';
import AssociationsPage from './pages/AssociationsPage';
import BulletinPage from './pages/BulletinPage';
import GalleryPage from './pages/GalleryPage';
import MaintenancePage from './pages/MaintenancePage';
import HallBookingPage from './pages/HallBookingPage';

// Admin Layout
import AdminLayout from './components/admin/AdminLayout';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminMassTimings from './pages/admin/AdminMassTimings';
import AdminAnnouncements from './pages/admin/AdminAnnouncements';
import AdminParishCouncil from './pages/admin/AdminParishCouncil';
import AdminTrustees from './pages/admin/AdminTrustees';
import AdminFamilyUnits from './pages/admin/AdminFamilyUnits';
import AdminFamilyUnitEdit from './pages/admin/AdminFamilyUnitEdit';
import AdminSettings from './pages/admin/AdminSettings';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAdmin } = useAuth();
  return isAdmin ? <>{children}</> : <Navigate to="/admin/login" replace />;
}

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/spiritual-life" element={<SpiritualLifePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/parish" element={<ParishPage />} />
          <Route path="/catechism" element={<CatechismPage />} />
          <Route path="/family-units" element={<FamilyUnitsPage />} />
          <Route path="/family-units/:id" element={<FamilyUnitDetailPage />} />
          <Route path="/institutions" element={<InstitutionsPage />} />
          <Route path="/associations" element={<AssociationsPage />} />
          <Route path="/bulletin" element={<BulletinPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/maintenance" element={<MaintenancePage />} />
          <Route path="/hall-booking" element={<HallBookingPage />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
          <Route index element={<AdminDashboard />} />
          <Route path="mass-timings" element={<AdminMassTimings />} />
          <Route path="announcements" element={<AdminAnnouncements />} />
          <Route path="parish-council" element={<AdminParishCouncil />} />
          <Route path="trustees" element={<AdminTrustees />} />
          <Route path="family-units" element={<AdminFamilyUnits />} />
          <Route path="family-units/:id" element={<AdminFamilyUnitEdit />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
