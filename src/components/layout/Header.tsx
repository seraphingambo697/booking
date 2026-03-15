/**
 * src/components/layout/Header.tsx
 *
 * Header sticky de l'application.
 * Affiche le logo, la navigation et le menu utilisateur.
 * Lit AuthViewModel depuis useAuth() pour l'état de connexion.
 */

import { Link, useNavigate } from "react-router-dom";
import { Hotel, LogIn, LogOut, BookOpen, Menu, X, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
//import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { ROUTES } from "@/router/routes";
import { useAuthStore } from "@/store/authStore";

export function Header() {
    const { vm, onLogout } = useAuth();
    const navigate = useNavigate();
    const [mobileOpen, setMobileOpen] = useState(false);
    const { user } = useAuthStore();


    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
            <div className="container flex h-16 items-center justify-between">
                {/* Logo */}
                <Link to={ROUTES.HOME} className="flex items-center gap-2 font-bold text-xl text-primary">
                    <Hotel className="h-6 w-6" />
                    LuxStay
                </Link>

                <nav className="hidden md:flex items-center gap-4">
                    {vm.isAuthenticated ? (
                        <>
                            <button onClick={() => navigate(ROUTES.MY_BOOKINGS)}
                                className="flex items-center gap-1.5 text-sm text-slate-600 hover:text-slate-900 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors">
                                <BookOpen className="h-4 w-4" /> Mes réservations
                            </button>

                            {user?.isAdmin && (
                                <button onClick={() => navigate(ROUTES.ADMIN)}
                                    className="flex items-center gap-1.5 text-sm text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-50 font-medium">
                                    <ShieldCheck className="h-4 w-4" /> Admin
                                </button>
                            )}

                            <button onClick={() => navigate(ROUTES.PROFILE)}
                                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-slate-100 transition-colors">
                                <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                                    {vm.userInitials}
                                </div>
                                <span className="text-sm font-medium">{vm.userName}</span>
                            </button>

                            <button onClick={onLogout}
                                className="flex items-center gap-1.5 text-sm text-red-500 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50">
                                <LogOut className="h-4 w-4" /> Déconnexion
                            </button>
                        </>
                    ) : (
                        <>
                            <Button variant="ghost" size="sm" onClick={() => navigate(ROUTES.LOGIN)}>
                                <LogIn className="h-4 w-4 mr-2" />
                                Connexion
                            </Button>
                            <Button size="sm" onClick={() => navigate(ROUTES.REGISTER)}>
                                S'inscrire
                            </Button>
                        </>
                    )}
                </nav>

                {/* Bouton menu mobile */}
                <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
                    {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
            </div>

            {/* Menu mobile déroulant */}
            {mobileOpen && (
                <div className="md:hidden border-t px-4 py-4 flex flex-col gap-3 bg-background">
                    {vm.isAuthenticated ? (
                        <>
                            <Button variant="ghost" onClick={() => { navigate(ROUTES.MY_BOOKINGS); setMobileOpen(false); }}>
                                Mes réservations
                            </Button>
                            <Button variant="outline" onClick={() => { onLogout(); setMobileOpen(false); }}>
                                Déconnexion
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button variant="ghost" onClick={() => { navigate(ROUTES.LOGIN); setMobileOpen(false); }}>
                                Connexion
                            </Button>
                            <Button onClick={() => { navigate(ROUTES.REGISTER); setMobileOpen(false); }}>
                                S'inscrire
                            </Button>
                        </>
                    )}
                </div>
            )}
        </header>
    );
}