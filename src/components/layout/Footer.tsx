/**
 * src/components/layout/Footer.tsx
 * Pied de page avec liens de navigation.
 */

import { Link } from "react-router-dom";
import { Hotel } from "lucide-react";
import { ROUTES } from "@/router/routes";

export function Footer() {
    return (
        <footer className="border-t bg-muted/40 mt-16">
            <div className="container py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                    <div className="flex items-center gap-2 font-bold text-lg text-primary mb-3">
                        <Hotel className="h-5 w-5" /> LuxStay
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Réservez les meilleurs hôtels en France et dans le monde entier.
                    </p>
                </div>
                <div>
                    <h3 className="font-semibold mb-3">Navigation</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                        <li><Link to={ROUTES.HOME} className="hover:text-foreground transition-colors">Accueil</Link></li>
                        <li><Link to={ROUTES.SEARCH} className="hover:text-foreground transition-colors">Rechercher</Link></li>
                        <li><Link to={ROUTES.MY_BOOKINGS} className="hover:text-foreground transition-colors">Mes réservations</Link></li>
                    </ul>
                </div>
                <div>
                    <h3 className="font-semibold mb-3">Compte</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                        <li><Link to={ROUTES.LOGIN} className="hover:text-foreground transition-colors">Connexion</Link></li>
                        <li><Link to={ROUTES.REGISTER} className="hover:text-foreground transition-colors">Inscription</Link></li>
                    </ul>
                </div>
            </div>
            <div className="border-t py-4 text-center text-sm text-muted-foreground">
                © {new Date().getFullYear()} LuxStay. Tous droits réservés.
            </div>
        </footer>
    );
}