import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

// Public pages
import Home from './pages/Home';
import Trips from './pages/Trips';
import TripDetail from './pages/TripDetail';
import Login from './pages/Login';

// Admin pages
import Dashboard from './pages/admin/Dashboard';
import ManageTrips from './pages/admin/ManageTrips';
import Students from './pages/admin/Students';
import Registrations from './pages/admin/Registrations';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 font-body text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Home />} />
      <Route path="/trips" element={<Trips />} />
      <Route path="/trips/:id" element={<TripDetail />} />
      <Route path="/login" element={<Login />} />

      {/* Protected Admin Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/admin/trips" element={<ManageTrips />} />
        <Route path="/admin/students" element={<Students />} />
        <Route path="/admin/registrations" element={<Registrations />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
