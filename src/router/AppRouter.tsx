/**
 * src/router/AppRouter.tsx
 *
 * Configuration du routeur React Router v6.
 *
 * Structure :
 * - BrowserRouter : utilise l'API History du navigateur (URLs propres)
 * - Layout : wrapper commun (Header + Footer) autour de toutes les pages
 * - Routes : définition de toutes les routes de l'application
 *
 * Les routes paramètrées utilisent ROUTES.xxx() sans argument
 * pour générer le pattern avec ":id" (ex: "/hotel/:id").
 *
 * Note : pas de ProtectedRoute pour l'instant (MVP).
 * En production, ajouter un wrapper ProtectedRoute qui redirige
 * vers /login si l'utilisateur n'est pas authentifié.
 */

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { HomePage } from "@/pages/HomePage";
import { SearchResultsPage } from "@/pages/SearchResultsPage";
import { HotelDetailPage } from "@/pages/HotelDetailPage";
import { BookingPage } from "@/pages/BookingPage";
import { BookingConfirmationPage } from "@/pages/BookingConfirmationPage";
import { MyBookingsPage } from "@/pages/MyBookingsPage";
import { LoginPage } from "@/pages/LoginPage";
import { RegisterPage } from "@/pages/RegisterPage";
import { ROUTES } from "./routes";

export function AppRouter() {
    return (
        <BrowserRouter>
            {/* Layout englobe toutes les pages → Header et Footer partagés */}
            <Layout>
                <Routes>
                    <Route path={ROUTES.HOME} element={<HomePage />} />
                    <Route path={ROUTES.SEARCH} element={<SearchResultsPage />} />
                    <Route path={ROUTES.HOTEL_DETAIL()} element={<HotelDetailPage />} />
                    <Route path={ROUTES.BOOKING} element={<BookingPage />} />
                    <Route path={ROUTES.BOOKING_CONFIRMATION()} element={<BookingConfirmationPage />} />
                    <Route path={ROUTES.MY_BOOKINGS} element={<MyBookingsPage />} />
                    <Route path={ROUTES.LOGIN} element={<LoginPage />} />
                    <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
                </Routes>
            </Layout>
        </BrowserRouter>
    );
}