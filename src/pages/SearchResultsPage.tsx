/**
 * src/pages/SearchResultsPage.tsx
 *
 * Page des résultats de recherche d'hôtels.
 * Lit les params depuis searchStore et charge les hôtels via useHotelList.
 */

import { useNavigate } from "react-router-dom";
import { Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { HotelCard, HotelCardSkeleton } from "@/components/hotel/HotelCard";
import { useHotelList } from "@/hooks/useHotelList";
import { useSearchStore } from "@/store/searchStore";
import { ROUTES } from "@/router/routes";
import { SearchFilters } from "@/components/search/SearchFilters";

export function SearchResultsPage() {
    const navigate = useNavigate();
    const { params } = useSearchStore();
    const { vm, onSort, onFilter } = useHotelList(params);

    return (
        <div className="container py-8">
            {/* En-tête des résultats */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold">
                    {vm.isLoading ? "Recherche en cours..." : vm.totalResults}
                </h1>
                {params.city && (
                    <p className="text-muted-foreground mt-1">
                        Destination : <strong>{params.city}</strong>
                    </p>
                )}
            </div>

            <div className="flex gap-6">
                {/* Sidebar filtres (desktop) */}
                <aside className="hidden lg:block w-64 shrink-0">
                    <SearchFilters onFilter={onFilter} onSort={onSort} />
                </aside>

                {/* Grille de résultats */}
                <div className="flex-1">
                    {vm.hasError && (
                        <Alert variant="destructive" className="mb-4">
                            <AlertDescription>{vm.errorMessage}</AlertDescription>
                        </Alert>
                    )}

                    {/* État chargement → skeletons */}
                    {vm.isLoading && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <HotelCardSkeleton key={i} />
                            ))}
                        </div>
                    )}

                    {/* État vide */}
                    {vm.isEmpty && !vm.isLoading && (
                        <div className="text-center py-20">
                            <Building2 className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
                            <h2 className="text-xl font-semibold mb-2">Aucun hôtel trouvé</h2>
                            <p className="text-muted-foreground mb-4">
                                Essayez une autre destination ou modifiez vos filtres.
                            </p>
                            <Button variant="outline" onClick={() => navigate(ROUTES.HOME)}>
                                Retour à l'accueil
                            </Button>
                        </div>
                    )}

                    {/* Liste des hôtels */}
                    {!vm.isLoading && !vm.isEmpty && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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