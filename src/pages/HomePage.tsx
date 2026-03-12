/**
 * src/pages/HomePage.tsx
 * Page d'accueil — première page vue par l'utilisateur.
 *
 * Responsabilités (composant "vue stupide") :
 * - Affiche le hero avec la SearchBar
 * - Affiche les destinations populaires
 * - Affiche les features (pas de logique)
 * Toute la logique est dans useSearch et SearchPresenter.
 */
import { useNavigate } from "react-router-dom";
import { Building2, Shield, HeadphonesIcon } from "lucide-react";
import { SearchBar } from "@/components/search/SearchBar";
import { useSearch } from "@/hooks/useSearch";
import { useSearchStore } from "@/store/searchStore";
import { ROUTES } from "@/router/routes";

export function HomePage() {
    const navigate = useNavigate();
    const { vm, presenter } = useSearch();
    const { setParams } = useSearchStore();

    /** Stocke les params dans le store et navigue vers les résultats */
    const handleSearch = () => {
        if (!vm.isValid) return;
        setParams({
            city: vm.city,
            checkIn: vm.checkIn!,
            checkOut: vm.checkOut!,
            guestCount: vm.guestCount,
        });
        navigate(ROUTES.SEARCH);
    };

    /** Recherche rapide via une destination populaire */
    const handleQuickSearch = (city: string) => {
        const checkIn = new Date();
        const checkOut = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000); // +3 jours
        setParams({ city, checkIn, checkOut, guestCount: 2 });
        navigate(ROUTES.SEARCH);
    };

    const DESTINATIONS = [
        { city: "Paris", emoji: "🗼" },
        { city: "Nice", emoji: "🏖️" },
        { city: "Bordeaux", emoji: "🍷" },
        { city: "Chamonix", emoji: "⛷️" },
        { city: "Lyon", emoji: "🦁" },
        { city: "Marseille", emoji: "⛵" },
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
            desc: "Vos données sont protégées par chiffrement SSL 256 bits.",
        },
        {
            icon: <HeadphonesIcon className="h-8 w-8 text-primary" />,
            title: "Support 24/7",
            desc: "Notre équipe est disponible à toute heure pour vous aider.",
        },
    ];

    return (
        <div>
            {/* ── Hero Section ── */}
            <section
                className="relative text-white py-24 px-4"
                style={{
                    backgroundImage: "url(https://cdn.pixabay.com/photo/2022/04/26/13/14/background-7158357_960_720.jpg)",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >
                {/* Texte centré */}
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
                        Votre prochaine aventure<br />vous attend
                    </h1>
                    <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                        Découvrez des milliers d'hôtels d'exception. Réservez en quelques clics.
                    </p>
                </div>

                {/* SearchBar centrée et large */}
                <div className="max-w-5xl mx-auto px-4">
                    <SearchBar
                        vm={vm}
                        presenter={presenter}
                        onSubmit={handleSearch}
                        variant="hero"
                    />
                </div>
            </section>

            {/* ── Destinations populaires ── */}
            <section className="py-16 px-4">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-2xl font-bold mb-8 text-center">Destinations populaires</h2>
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                        {DESTINATIONS.map(({ city, emoji }) => (
                            <button
                                key={city}
                                onClick={() => handleQuickSearch(city)}
                                className="bg-white border rounded-xl p-4 text-center hover:shadow-md hover:border-primary transition-all group"
                            >
                                <div className="text-3xl mb-2">{emoji}</div>
                                <p className="font-medium text-sm group-hover:text-primary transition-colors">{city}</p>
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Features ── */}
            <section className="bg-muted/40 py-16 px-4">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-2xl font-bold text-center mb-12">Pourquoi choisir LuxStay ?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {FEATURES.map((f) => (
                            <div key={f.title} className="bg-white rounded-xl p-6 text-center shadow-sm">
                                <div className="flex justify-center mb-4">{f.icon}</div>
                                <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                                <p className="text-muted-foreground text-sm">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}