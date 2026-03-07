/**
 * src/pages/SearchResultsPage.tsx
 * Layout full-width : sidebar collée à gauche + grille 3 colonnes.
 */
import { useNavigate } from "react-router-dom";
import { Building2, MapPin, Calendar, Users } from "lucide-react";
import { HotelCard, HotelCardSkeleton } from "@/components/hotel/HotelCard";
import { SearchFilters } from "@/components/search/SearchFilters";
import { useHotelList } from "@/hooks/useHotelList";
import { useSearchStore } from "@/store/searchStore";
import { ROUTES } from "@/router/routes";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export function SearchResultsPage() {
    const navigate = useNavigate();
    const { params } = useSearchStore();
    const { vm, onSort, onFilter } = useHotelList(params);

    const fmtDate = (d: Date | null) =>
        d ? format(d, "d MMM", { locale: fr }) : "—";

    return (
        <div className="min-h-screen bg-slate-50">

            {/* ── Bandeau contexte — pleine largeur ── */}
            <div className="bg-white border-b border-slate-100 shadow-sm px-6 py-3">
                <div className="flex flex-wrap items-center gap-2">
                    {params.city && (
                        <span className="flex items-center gap-1.5 bg-blue-50 text-blue-700 rounded-lg px-3 py-1 text-sm font-semibold">
                            <MapPin className="h-3.5 w-3.5" />
                            {params.city}
                        </span>
                    )}
                    {params.checkIn && (
                        <span className="flex items-center gap-1.5 bg-slate-100 text-slate-600 rounded-lg px-3 py-1 text-sm font-medium">
                            <Calendar className="h-3.5 w-3.5" />
                            {fmtDate(params.checkIn)} → {fmtDate(params.checkOut)}
                        </span>
                    )}
                    {params.guestCount && (
                        <span className="flex items-center gap-1.5 bg-slate-100 text-slate-600 rounded-lg px-3 py-1 text-sm font-medium">
                            <Users className="h-3.5 w-3.5" />
                            {params.guestCount} voyageur{params.guestCount > 1 ? "s" : ""}
                        </span>
                    )}
                    {!vm.isLoading && !vm.isEmpty && (
                        <span className="ml-auto text-sm text-slate-400">
                            <span className="font-semibold text-slate-700">{vm.hotels.length}</span>{" "}
                            résultat{vm.hotels.length > 1 ? "s" : ""}
                        </span>
                    )}
                </div>
            </div>

            {/* ── Layout principal : sidebar gauche + contenu droite ── */}
            <div className="flex min-h-screen">

                {/* ── Sidebar filtre — collée au bord gauche, largeur fixe ── */}
                <aside
                    className="hidden lg:flex flex-col bg-white border-r border-slate-100 shrink-0"
                    style={{ width: "260px" }}
                >
                    {/* Sticky à l'intérieur de la sidebar */}
                    <div className="sticky top-0 p-4 overflow-y-auto" style={{ maxHeight: "100vh" }}>
                        <SearchFilters onFilter={onFilter} onSort={onSort} />
                    </div>
                </aside>

                {/* ── Zone résultats — remplit tout l'espace restant ── */}
                <div className="flex-1 min-w-0 p-6">

                    {/* Skeletons */}
                    {vm.isLoading && (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <HotelCardSkeleton key={i} />
                            ))}
                        </div>
                    )}

                    {/* État vide */}
                    {vm.isEmpty && !vm.isLoading && (
                        <div className="flex flex-col items-center justify-center h-96 text-center">
                            <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                                <Building2 className="h-7 w-7 text-slate-300" />
                            </div>
                            <h2 className="text-lg font-bold text-slate-800 mb-1">Aucun hôtel trouvé</h2>
                            <p className="text-slate-500 text-sm mb-5 max-w-xs">
                                Essayez une autre destination ou modifiez vos critères.
                            </p>
                            <button
                                onClick={() => navigate(ROUTES.HOME)}
                                className="bg-blue-600 text-white px-5 py-2 rounded-xl font-semibold hover:bg-blue-700 transition-colors text-sm"
                            >
                                ← Nouvelle recherche
                            </button>
                        </div>
                    )}

                    {/* Grille 3 colonnes */}
                    {!vm.isLoading && !vm.isEmpty && (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                            {vm.hotels.map((hotel) => (
                                <HotelCard
                                    key={hotel.id}
                                    hotel={hotel}
                                    onClick={() => navigate(ROUTES.HOTEL_DETAIL(hotel.id))}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}