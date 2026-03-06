/**
 * src/components/layout/Navbar.tsx
 *
 * Barre de navigation secondaire (breadcrumb ou tabs de section).
 * Peut être utilisée dans les pages intérieures pour la navigation contextuelle.
 * Séparée du Header pour être utilisable indépendamment.
 */

import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/router/routes";

interface NavItem {
    label: string;
    href: string;
}

const NAV_ITEMS: NavItem[] = [
    { label: "Accueil", href: ROUTES.HOME },
    { label: "Mes réservations", href: ROUTES.MY_BOOKINGS },
];

export function Navbar() {
    const location = useLocation();

    return (
        <nav className="flex gap-1 p-1 bg-muted rounded-lg">
            {NAV_ITEMS.map((item) => (
                <Link
                    key={item.href}
                    to={item.href}
                    className={cn(
                        "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                        location.pathname === item.href
                            ? "bg-background text-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                    )}
                >
                    {item.label}
                </Link>
            ))}
        </nav>
    );
}