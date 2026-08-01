import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute, RoleRoute, GuestRoute } from './components/common/RouteGuards';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import HackathonListing from './pages/HackathonListing';
import HackathonDetails from './pages/HackathonDetails';
import TeamPage from './pages/TeamPage';
import SubmissionPage from './pages/SubmissionPage';
import Leaderboard from './pages/Leaderboard';
import NotFound from './pages/NotFound';

// Dashboard
import DashboardRouter from './pages/dashboard/DashboardRouter';
import AdminDashboard from './pages/dashboard/AdminDashboard';
import OrganizerDashboard from './pages/dashboard/OrganizerDashboard';
import ParticipantDashboard from './pages/dashboard/ParticipantDashboard';
import JudgeDashboard from './pages/dashboard/JudgeDashboard';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1e1e2e',
              color: '#f1f5f9',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              borderRadius: '12px',
              fontSize: '14px',
            },
            success: {
              iconTheme: { primary: '#8b5cf6', secondary: '#fff' },
            },
            error: {
              iconTheme: { primary: '#ef4444', secondary: '#fff' },
            },
          }}
        />
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/hackathons" element={<HackathonListing />} />
          <Route path="/hackathons/:id" element={<HackathonDetails />} />
          <Route path="/leaderboard" element={<Leaderboard />} />

          {/* Guest only */}
          <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
          <Route path="/signup" element={<GuestRoute><Signup /></GuestRoute>} />

          {/* Protected */}
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/team/:hackathonId" element={<ProtectedRoute><TeamPage /></ProtectedRoute>} />
          <Route path="/submit/:hackathonId" element={<RoleRoute roles={['participant']}><SubmissionPage /></RoleRoute>} />

          {/* Dashboard Router */}
          <Route path="/dashboard" element={<ProtectedRoute><DashboardRouter /></ProtectedRoute>} />
          <Route path="/dashboard/admin" element={<RoleRoute roles={['admin']}><AdminDashboard /></RoleRoute>} />
          <Route path="/dashboard/organizer" element={<RoleRoute roles={['organizer', 'admin']}><OrganizerDashboard /></RoleRoute>} />
          <Route path="/dashboard/participant" element={<RoleRoute roles={['participant']}><ParticipantDashboard /></RoleRoute>} />
          <Route path="/dashboard/judge" element={<RoleRoute roles={['judge', 'admin']}><JudgeDashboard /></RoleRoute>} />

          {/* Error pages */}
          <Route path="/unauthorized" element={
            <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white">
              <div className="text-center">
                <h1 className="text-6xl font-bold text-red-500 mb-4">403</h1>
                <p className="text-gray-400">You are not authorized to access this page.</p>
              </div>
            </div>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
