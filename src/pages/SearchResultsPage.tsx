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
    const fmt = (d: Date | null) => d ? format(d, "d MMM", { locale: fr }) : "—";

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="bg-white border-b px-6 py-3 flex flex-wrap items-center gap-2">
                {params.city && (
                    <span className="flex items-center gap-1.5 bg-blue-50 text-blue-700 rounded-lg px-3 py-1 text-sm font-semibold">
                        <MapPin className="h-3.5 w-3.5" />{params.city}
                    </span>
                )}
                {params.checkIn && (
                    <span className="flex items-center gap-1.5 bg-slate-100 text-slate-600 rounded-lg px-3 py-1 text-sm">
                        <Calendar className="h-3.5 w-3.5" />{fmt(params.checkIn)} → {fmt(params.checkOut ?? null)}
                    </span>
                )}
                {params.guestCount && (
                    <span className="flex items-center gap-1.5 bg-slate-100 text-slate-600 rounded-lg px-3 py-1 text-sm">
                        <Users className="h-3.5 w-3.5" />{params.guestCount} voyageur{params.guestCount > 1 ? "s" : ""}
                    </span>
                )}
                {!vm.isLoading && !vm.isEmpty && (
                    <span className="ml-auto text-sm text-slate-400">
                        <span className="font-semibold text-slate-700">{vm.hotels.length}</span> résultat{vm.hotels.length > 1 ? "s" : ""}
                    </span>
                )}
            </div>

            <div className="flex min-h-screen">
                <aside className="hidden lg:flex flex-col bg-white border-r shrink-0" style={{ width: "260px" }}>
                    <div className="sticky top-0 p-4 overflow-y-auto" style={{ maxHeight: "100vh" }}>
                        <SearchFilters onFilter={onFilter} onSort={onSort} />
                    </div>
                </aside>

                <div className="flex-1 min-w-0 p-6">
                    {vm.isLoading && (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                            {Array.from({ length: 6 }).map((_, i) => <HotelCardSkeleton key={i} />)}
                        </div>
                    )}
                    {vm.isEmpty && !vm.isLoading && (
                        <div className="flex flex-col items-center justify-center h-96 text-center">
                            <Building2 className="h-12 w-12 text-slate-200 mb-4" />
                            <h2 className="text-lg font-bold mb-1">Aucun hôtel trouvé</h2>
                            <p className="text-slate-500 text-sm mb-5">Essayez une autre destination.</p>
                            <button onClick={() => navigate(ROUTES.HOME)}
                                className="bg-blue-600 text-white px-5 py-2 rounded-xl font-semibold text-sm">
                                ← Nouvelle recherche
                            </button>
                        </div>
                    )}
                    {!vm.isLoading && !vm.isEmpty && (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                            {vm.hotels.map(hotel => (
                                <HotelCard key={hotel.id} hotel={hotel}
                                    onClick={() => navigate(ROUTES.HOTEL_DETAIL(hotel.id))} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}