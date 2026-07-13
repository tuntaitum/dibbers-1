import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import ProtectedRoute from '@/components/ProtectedRoute';
import { ThemeProvider } from '@/lib/ThemeContext';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import LoadingPage from '@/components/LoadingPage';

// Layouts
import PlayerLayout from '@/components/PlayerLayout';
import VenueLayout from '@/components/VenueLayout';
import AdminLayout from '@/components/AdminLayout';

// Public
import Landing from '@/pages/Landing';
import HomeLaunch from '@/pages/HomeLaunch';
import Terms from '@/pages/Terms';
import Privacy from '@/pages/Privacy';

// Player
import Explore from '@/pages/player/Explore';
import MapExplorer from '@/pages/player/MapExplorer';
import VenueDetail from '@/pages/player/VenueDetail';
import BookingConfirm from '@/pages/player/BookingConfirm';
import BookingPayment from '@/pages/player/BookingPayment';
import BookingConfirmed from '@/pages/player/BookingConfirmed';
import MyBookings from '@/pages/player/MyBookings';
import Stats from '@/pages/player/Stats';
import Profile from '@/pages/player/Profile';
import Milestones from '@/pages/player/Milestones';

// Venue
import VenueDashboard from '@/pages/venue/VenueDashboard';
import VenueOnboarding from '@/pages/venue/VenueOnboarding';
import MyCourts from '@/pages/venue/MyCourts';
import VenueBookings from '@/pages/venue/VenueBookings';
import VenueSettings from '@/pages/venue/VenueSettings';

// Admin
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminVenues from '@/pages/admin/AdminVenues';
import AdminSlots from '@/pages/admin/AdminSlots';
import AdminUsers from '@/pages/admin/AdminUsers';
import AdminWaitlist from '@/pages/admin/AdminWaitlist';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return <LoadingPage />;
  }

  if (authError) {
    if (authError.type === 'user_not_registered') return <UserNotRegisteredError />;
    // auth_required is handled per-route — player pages are public, don't global-redirect
  }

  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Landing />} />
      <Route path="/homewhenlaunch" element={<HomeLaunch />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/privacy" element={<Privacy />} />

      {/* Player app — Explore is fully public; Stats/Profile/Bookings require login */}
      <Route element={<PlayerLayout />}>
        <Route path="/explore" element={<Explore />} />
        <Route element={<ProtectedRoute unauthenticatedElement={<Navigate to="/login" replace />} />}>
          <Route path="/bookings" element={<MyBookings />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/milestones" element={<Milestones />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Route>
      <Route path="/explore/map" element={<MapExplorer />} />
      <Route path="/venue/:id" element={<VenueDetail />} />
      <Route path="/book/:slotId" element={<BookingConfirm />} />
      <Route path="/pay/:slotId" element={<BookingPayment />} />
      <Route path="/booking-confirmed/:bookingId" element={<BookingConfirmed />} />

      {/* Venue portal — requires login */}
      <Route element={<ProtectedRoute unauthenticatedElement={<Navigate to="/login" replace />} />}>
        <Route element={<VenueLayout />}>
          <Route path="/venue/dashboard" element={<VenueDashboard />} />
          <Route path="/venue/courts" element={<MyCourts />} />
          <Route path="/venue/bookings" element={<VenueBookings />} />
          <Route path="/venue/settings" element={<VenueSettings />} />
        </Route>
        <Route path="/venue/new" element={<VenueOnboarding />} />
      </Route>

      {/* Admin panel — requires login */}
      <Route element={<ProtectedRoute unauthenticatedElement={<Navigate to="/login" replace />} />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/venues" element={<AdminVenues />} />
          <Route path="/admin/slots" element={<AdminSlots />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/waitlist" element={<AdminWaitlist />} />
        </Route>
      </Route>

      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <QueryClientProvider client={queryClientInstance}>
          <Router>
            <AuthenticatedApp />
          </Router>
          <Toaster />
        </QueryClientProvider>
      </ThemeProvider>
    </AuthProvider>
  )
}

export default App