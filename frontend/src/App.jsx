import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
// Officer pages
import OfficerDashboard from './pages/OfficerDashboard';
import OfficerForestMap from './pages/OfficerForestMap';
import OfficerAlerts from './pages/OfficerAlerts';
import OfficerReports from './pages/OfficerReports';
import OfficerRangers from './pages/OfficerRangers';
import OfficerManageZones from './pages/OfficerManageZones';
import OfficerManageSensors from './pages/OfficerManageSensors';
// Admin pages
import AdminDashboard from './pages/AdminDashboard';
import ManageForests from './pages/ManageForests';
import ManageOfficers from './pages/ManageOfficers';
import AdminForestMap from './pages/AdminForestMap';
import AdminAlerts from './pages/AdminAlerts';
import AdminReports from './pages/AdminReports';
import AdminRangers from './pages/AdminRangers';
// Ranger pages
import RangerOverview from './pages/RangerOverview';
import MyArea from './pages/MyArea';
// Others (fallback)
import Overview from './pages/Overview';
import ForestMap from './pages/ForestMap';
import Alerts from './pages/Alerts';
import ActiveCases from './pages/ActiveCases';
import Reports from './pages/Reports';
import Rangers from './pages/Rangers';
import Sensors from './pages/Sensors';
import Settings from './pages/Settings';

function AppLayout({ children }) {
  return (
    <div className="flex h-screen bg-gray-950 overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}

function DashboardRouter() {
  const { isAdmin, isOfficer, isRanger } = useAuth();
  if (isAdmin) return <AdminDashboard />;
  if (isOfficer) return <OfficerDashboard />;
  if (isRanger) return <RangerOverview />;
  return <Overview />;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />

          {/* Admin routes */}
          <Route path="/" element={<ProtectedRoute><AppLayout><DashboardRouter /></AppLayout></ProtectedRoute>} />
          <Route path="/admin/forest-map" element={<ProtectedRoute allowedRoles={['admin']}><AppLayout><AdminForestMap /></AppLayout></ProtectedRoute>} />
          <Route path="/admin/alerts" element={<ProtectedRoute allowedRoles={['admin']}><AppLayout><AdminAlerts /></AppLayout></ProtectedRoute>} />
          <Route path="/admin/reports" element={<ProtectedRoute allowedRoles={['admin']}><AppLayout><AdminReports /></AppLayout></ProtectedRoute>} />
          <Route path="/admin/rangers" element={<ProtectedRoute allowedRoles={['admin']}><AppLayout><AdminRangers /></AppLayout></ProtectedRoute>} />
          <Route path="/manage-forests" element={<ProtectedRoute allowedRoles={['admin']}><AppLayout><ManageForests /></AppLayout></ProtectedRoute>} />
          <Route path="/manage-officers" element={<ProtectedRoute allowedRoles={['admin']}><AppLayout><ManageOfficers /></AppLayout></ProtectedRoute>} />

          {/* Officer routes */}
          <Route path="/officer/dashboard" element={<ProtectedRoute allowedRoles={['officer']}><AppLayout><OfficerDashboard /></AppLayout></ProtectedRoute>} />
          <Route path="/officer/forest-map" element={<ProtectedRoute allowedRoles={['officer']}><AppLayout><OfficerForestMap /></AppLayout></ProtectedRoute>} />
          <Route path="/officer/alerts" element={<ProtectedRoute allowedRoles={['officer']}><AppLayout><OfficerAlerts /></AppLayout></ProtectedRoute>} />
          <Route path="/officer/reports" element={<ProtectedRoute allowedRoles={['officer']}><AppLayout><OfficerReports /></AppLayout></ProtectedRoute>} />
          <Route path="/officer/rangers" element={<ProtectedRoute allowedRoles={['officer']}><AppLayout><OfficerRangers /></AppLayout></ProtectedRoute>} />
          <Route path="/officer/manage-zones" element={<ProtectedRoute allowedRoles={['officer']}><AppLayout><OfficerManageZones /></AppLayout></ProtectedRoute>} />
          <Route path="/officer/manage-sensors" element={<ProtectedRoute allowedRoles={['officer']}><AppLayout><OfficerManageSensors /></AppLayout></ProtectedRoute>} />

          {/* Ranger routes */}
          <Route path="/my-area" element={<ProtectedRoute allowedRoles={['ranger']}><AppLayout><MyArea /></AppLayout></ProtectedRoute>} />

          {/* Fallback routes (non-admin/officer) */}
          <Route path="/forest-map" element={<ProtectedRoute><AppLayout><ForestMap /></AppLayout></ProtectedRoute>} />
          <Route path="/alerts" element={<ProtectedRoute><AppLayout><Alerts /></AppLayout></ProtectedRoute>} />
          <Route path="/active-cases" element={<ProtectedRoute><AppLayout><ActiveCases /></AppLayout></ProtectedRoute>} />
          <Route path="/reports" element={<ProtectedRoute><AppLayout><Reports /></AppLayout></ProtectedRoute>} />
          <Route path="/rangers" element={<ProtectedRoute><AppLayout><Rangers /></AppLayout></ProtectedRoute>} />
          <Route path="/sensors" element={<ProtectedRoute><AppLayout><Sensors /></AppLayout></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><AppLayout><Settings /></AppLayout></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
