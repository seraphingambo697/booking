/**
 * src/components/layout/Header.tsx
 *
 * Header sticky de l'application.
 * Affiche le logo, la navigation et le menu utilisateur.
 * Lit AuthViewModel depuis useAuth() pour l'état de connexion.
 */

import { Link, useNavigate } from "react-router-dom";
import { Hotel, LogIn, LogOut, BookOpen, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { ROUTES } from "@/router/routes";

export function Header() {
    const { vm, onLogout } = useAuth();
    const navigate = useNavigate();
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
            <div className="container flex h-16 items-center justify-between">
                {/* Logo */}
                <Link to={ROUTES.HOME} className="flex items-center gap-2 font-bold text-xl text-primary">
                    <Hotel className="h-6 w-6" />
                    LuxStay
                </Link>

                {/* Navigation desktop */}
                <nav className="hidden md:flex items-center gap-4">
                    {vm.isAuthenticated ? (
                        <>
                            <Button variant="ghost" size="sm" onClick={() => navigate(ROUTES.MY_BOOKINGS)}>
                                <BookOpen className="h-4 w-4 mr-2" />
                                Mes réservations
                            </Button>
                            {/* Avatar avec initiales */}
                            <div className="flex items-center gap-2">
                                <Avatar className="h-8 w-8">
                                    <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                                        {vm.userInitials}
                                    </AvatarFallback>
                                </Avatar>
                                <span className="text-sm font-medium">{vm.userName}</span>
                            </div>
                            <Button variant="outline" size="sm" onClick={onLogout} data-cy="logout-btn">
                                <LogOut className="h-4 w-4 mr-2" />
                                Déconnexion
                            </Button>
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