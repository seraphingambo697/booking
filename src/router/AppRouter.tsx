import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { HomePage } from "@/pages/HomePage";
import { SearchResultsPage } from "@/pages/SearchResultsPage";
import { HotelDetailPage } from "@/pages/HotelDetailPage";
import { BookingPage } from "@/pages/BookingPage";
import { BookingConfirmationPage } from "@/pages/BookingConfirmationPage";
import { MyBookingsPage } from "@/pages/MyBookingsPage";
import { LoginPage } from "@/pages/LoginPage";
import { RegisterPage } from "@/pages/RegisterPage";
import { ProfilePage } from "@/pages/ProfilePage";
import { AdminPage } from "@/pages/AdminPage";
import { ROUTES } from "./routes";
import { useAuthStore } from "@/store/authStore";

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <>{children}</> : <Navigate to={ROUTES.LOGIN} replace />;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated) return <Navigate to={ROUTES.LOGIN} replace />;
  if (!user?.isAdmin) return <Navigate to={ROUTES.HOME} replace />;
  return <>{children}</>;
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path={ROUTES.HOME} element={<HomePage />} />
          <Route path={ROUTES.SEARCH} element={<SearchResultsPage />} />
          <Route path={ROUTES.HOTEL_DETAIL()} element={<HotelDetailPage />} />
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          <Route path={ROUTES.REGISTER} element={<RegisterPage />} />

          <Route path={ROUTES.BOOKING} element={
            <PrivateRoute><BookingPage /></PrivateRoute>
          } />
          <Route path={ROUTES.BOOKING_CONFIRMATION()} element={
            <PrivateRoute><BookingConfirmationPage /></PrivateRoute>
          } />
          <Route path={ROUTES.MY_BOOKINGS} element={
            <PrivateRoute><MyBookingsPage /></PrivateRoute>
          } />
          <Route path={ROUTES.PROFILE} element={
            <PrivateRoute><ProfilePage /></PrivateRoute>
          } />
          <Route path={ROUTES.ADMIN} element={
            <AdminRoute><AdminPage /></AdminRoute>
          } />

          <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}