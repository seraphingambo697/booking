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
        <div className={`w-full ${isHero
            ? "bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.2)] p-4 border border-gray-100"
            : "bg-white rounded-xl border border-gray-200 p-2"
            }`}>
            {/* Conteneur Flex - On s'assure que les items sont bien alignés */}
            <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">

                {/* ── Champ Destination ── */}
                <div className="relative flex-[1.5]">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
                    <input
                        type="text"
                        placeholder="Destination"
                        value={vm.city}
                        onChange={(e) => presenter.onCityChange(e.target.value)}
                        className={`w-full pl-12 pr-4 rounded-2xl bg-gray-50 border-2 transition-all text-sm font-bold text-black placeholder:text-gray-400 ${isHero ? "h-14" : "h-11"
                            } ${vm.cityError ? "border-red-500" : "border-transparent focus:border-black"}`}
                    />
                </div>

                {/* ── Sélecteur de dates ── */}
                <div className="flex-[2] bg-gray-50 rounded-2xl">
                    <DateRangePicker
                        checkIn={vm.checkIn}
                        checkOut={vm.checkOut}
                        onChange={(checkIn, checkOut) => presenter.onDateChange(checkIn, checkOut)}
                        error={vm.dateError}
                        height={isHero ? "h-14" : "h-11"}
                    />
                </div>

                {/* ── Sélecteur de voyageurs ── */}
                <div className="flex-1 bg-gray-50 rounded-2xl">
                    <GuestSelector
                        count={vm.guestCount}
                        onChange={(count) => presenter.onGuestCountChange(count)}
                        height={isHero ? "h-14" : "h-11"}
                    />
                </div>

                {/* ── Bouton Rechercher (FORCE NOIR) ── */}
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        onSubmit();
                    }}
                    disabled={!vm.isValid}
                    className={`flex items-center justify-center gap-3 bg-[#111111] text-white font-black rounded-2xl hover:bg-black transition-all px-8 shrink-0 shadow-lg ${isHero ? "h-14 text-base" : "h-11 text-sm"
                        } disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed`}
                >
                    <Search className="h-5 w-5 stroke-[3px]" />
                    <span className="uppercase tracking-widest">Rechercher</span>
                </button>
            </div>

            {(vm.cityError || vm.dateError) && (
                <div className="mt-3 px-4 flex gap-6">
                    {vm.cityError && <span className="text-red-600 text-[10px] font-black uppercase tracking-tighter">{vm.cityError}</span>}
                    {vm.dateError && <span className="text-red-600 text-[10px] font-black uppercase tracking-tighter">{vm.dateError}</span>}
                </div>
            )}
        </div>
    );
}