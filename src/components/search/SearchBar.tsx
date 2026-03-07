/**
 * src/components/search/SearchBar.tsx
 * Barre de recherche principale — 4 champs : destination, dates, voyageurs, bouton.
 *
 * variant="hero"    : fond blanc avec ombre, texte normal
 * variant="compact" : version condensée pour la barre de navigation
 *
 * Composant "vue stupide" : délègue toutes les actions au Presenter via les props.
 */
import { MapPin, Search } from "lucide-react";
import { SearchViewModel } from "@/viewmodels/SearchViewModel";
import { SearchPresenter } from "@/presenters/SearchPresenter";
import { DateRangePicker } from "./DateRangePicker";
import { GuestSelector } from "./GuestSelector";

interface SearchBarProps {
    vm: SearchViewModel;
    presenter: SearchPresenter;
    onSubmit: () => void;
    variant?: "hero" | "compact";
}

export function SearchBar({ vm, presenter, onSubmit, variant = "hero" }: SearchBarProps) {
    const isHero = variant === "hero";

    return (
        <div className={`${isHero ? "bg-white rounded-2xl shadow-2xl p-5 md:p-6" : "bg-white rounded-xl border p-3"}`}>
            {/* Ligne unique sur desktop : Destination | Arrivée | Départ | Voyageurs | Bouton */}
            <div className="flex flex-col md:flex-row gap-3 items-stretch">

                {/* ── Champ Destination ── flex-[1.5] pour qu'il soit un peu plus large */}
                <div className="relative flex-[1.5]">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none z-10" />
                    <input
                        type="text"
                        placeholder="Destination"
                        value={vm.city}
                        onChange={(e) => presenter.onCityChange(e.target.value)}
                        data-cy="search-city"
                        className={`w-full pl-9 pr-3 border rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm text-gray-800 placeholder:text-gray-400 ${isHero ? "h-12" : "h-10"
                            } ${vm.cityError ? "border-destructive" : "border-gray-200"}`}
                    />
                    {vm.cityError && (
                        <p className="text-destructive text-xs mt-1">{vm.cityError}</p>
                    )}
                </div>

                {/* ── Sélecteur de dates ── flex-[2] pour les deux champs côte à côte */}
                <div className="flex-[2]">
                    <DateRangePicker
                        checkIn={vm.checkIn}
                        checkOut={vm.checkOut}
                        onChange={(checkIn, checkOut) => presenter.onDateChange(checkIn, checkOut)}
                        error={vm.dateError}
                        height={isHero ? "h-12" : "h-10"}
                    />
                </div>

                {/* ── Sélecteur de voyageurs ── */}
                <div className="flex-1">
                    <GuestSelector
                        count={vm.guestCount}
                        onChange={(count) => presenter.onGuestCountChange(count)}
                        height={isHero ? "h-12" : "h-10"}
                    />
                </div>

                {/* ── Bouton Rechercher ── */}
                <button
                    onClick={onSubmit}
                    disabled={!vm.isValid}
                    data-cy="search-submit"
                    className={`flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors px-6 shrink-0 ${isHero ? "h-12" : "h-10"
                        }`}
                >
                    <Search className="h-4 w-4" />
                    <span>Rechercher</span>
                </button>
            </div>
        </div>
    );
}