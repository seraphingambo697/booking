/**
 * src/pages/HomePage.tsx
 *
 * Page d'accueil de l'application.
 *
 * Sections :
 * 1. Hero avec image de fond et SearchBar
 * 2. Pourquoi LuxStay (features)
 * 3. Destinations populaires (raccourcis de recherche)
 *
 * Cette page est STUPIDE : elle utilise useSearch() pour le ViewModel
 * et délègue toute la logique au SearchPresenter.
 */

import { useNavigate } from "react-router-dom";
import { Building2, Shield, HeadphonesIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useSearch } from "@/hooks/useSearch";
import { useSearchStore } from "@/store/searchStore";
import { ROUTES } from "@/router/routes";
import { SearchBar } from "@/components/search/SearchBar";

export function HomePage() {
    const navigate = useNavigate();
    const { setParams } = useSearchStore();
    const { vm, presenter, handleSubmit } = useSearch();

    /** Raccourci : clique sur une destination populaire */
    const handleDestinationClick = (city: string) => {
        setParams({
            city,
            checkIn: new Date(),
            checkOut: new Date(Date.now() + 86400000 * 3),
            guestCount: 2,
        });
        navigate(ROUTES.SEARCH);
    };

    const DESTINATIONS = [
        { city: "Paris", emoji: "🗼" },
        { city: "Nice", emoji: "🏖️" },
        { city: "Bordeaux", emoji: "🍷" },
        { city: "Chamonix", emoji: "⛷️" },
        { city: "Lyon", emoji: "🦁" },
        { city: "Aix-en-Provence", emoji: "🌿" },
    ];

    const FEATURES = [
        {
            icon: <Building2 className="h-8 w-8 text-primary" />,
            title: "10 000+ hôtels",
            desc: "Une sélection rigoureuse des meilleures adresses en France et dans le monde.",
        },
        {
            icon: <Shield className="h-8 w-8 text-primary" />,
            title: "Paiement sécurisé",
            desc: "Toutes vos transactions sont protégées par chiffrement SSL 256 bits.",
        },
        {
            icon: <HeadphonesIcon className="h-8 w-8 text-primary" />,
            title: "Support 24/7",
            desc: "Notre équipe est disponible à toute heure pour vous accompagner.",
        },
    ];

    return (
        <div>
            {/* ── Hero ──────────────────────────────────────────────────────────── */}
            <section
                className="relative py-24 px-4 text-white"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(15,23,42,0.7), rgba(15,23,42,0.7)), " +
                        "url(https://images.unsplash.com/photo-1551882547-ff40c4fe799f?w=1600)",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >
                <div className="container text-center mb-10">
                    <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
                        Votre prochaine aventure<br />vous attend
                    </h1>
                    <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                        Découvrez des milliers d'hôtels d'exception en France et dans le monde.
                    </p>
                </div>

                <div className="container max-w-5xl">
                    {/* SearchBar reçoit vm et presenter — pas de logique ici */}
                    <SearchBar vm={vm} presenter={presenter} onSubmit={handleSubmit} variant="hero" />
                </div>
            </section>

            {/* ── Features ──────────────────────────────────────────────────────── */}
            <section className="container py-20">
                <h2 className="text-2xl font-bold text-center mb-12">
                    Pourquoi choisir LuxStay ?
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {FEATURES.map((f) => (
                        <Card key={f.title} className="text-center p-6">
                            <div className="flex justify-center mb-4">{f.icon}</div>
                            <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                            <p className="text-muted-foreground text-sm">{f.desc}</p>
                        </Card>
                    ))}
                </div>
            </section>

            {/* ── Destinations populaires ────────────────────────────────────────── */}
            <section className="bg-muted/40 py-16">
                <div className="container">
                    <h2 className="text-2xl font-bold mb-8">Destinations populaires</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {DESTINATIONS.map(({ city, emoji }) => (
                            <button
                                key={city}
                                onClick={() => handleDestinationClick(city)}
                                className="bg-white rounded-xl p-4 text-center hover:shadow-md transition-shadow group"
                                data-cy={`destination-${city.toLowerCase()}`}
                            >
                                <div className="text-3xl mb-2">{emoji}</div>
                                <p className="font-medium text-sm group-hover:text-primary transition-colors">
                                    {city}
                                </p>
                            </button>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}