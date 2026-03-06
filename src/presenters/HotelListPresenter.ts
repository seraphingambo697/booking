/**
 * src/presenters/HotelListPresenter.ts
 *
 * Presenter de la liste des hôtels (page SearchResultsPage).
 *
 * Responsabilités :
 * 1. Charger les hôtels via IHotelService
 * 2. Transformer Hotel[] en HotelCardViewModel[]
 *    (formatage des prix, notes, badges...)
 * 3. Gérer les états isLoading / hasError / isEmpty
 * 4. Répondre aux changements de tri et filtres
 *
 * Le composant HotelCard est STUPIDE : il affiche vm.pricePerNight
 * sans savoir que c'était 350 à l'origine.
 */

import { IHotelListPresenter } from "@/interfaces/presenters/IHotelListPresenter";
import { IHotelService, SortOption, HotelFilters } from "@/interfaces/services/IHotelService";
import { SearchParams } from "@/interfaces/repositories/IHotelRepository";
import { HotelListViewModel, HotelCardViewModel } from "@/viewmodels/HotelListViewModel";
import { Hotel } from "@/core/entities/Hotel";
import { formatPrice, formatReviewCount } from "@/lib/formatters";

export class HotelListPresenter implements IHotelListPresenter {
    private vm: HotelListViewModel = {
        hotels: [],
        isLoading: false,
        hasError: false,
        totalResults: "",
        isEmpty: false,
        currentSort: { field: "rating", direction: "desc" },
        activeFilters: {},
    };

    constructor(
        private hotelService: IHotelService,
        private onChange: (vm: HotelListViewModel) => void
    ) { }

    async loadHotels(params: SearchParams): Promise<void> {
        // État de chargement → les skeletons s'affichent dans la vue
        this.update({ isLoading: true, hasError: false });

        try {
            const hotels = await this.hotelService.search(params);

            this.update({
                isLoading: false,
                // Transformation Hotel[] → HotelCardViewModel[]
                hotels: hotels.map((h) => this.mapToCardViewModel(h)),
                totalResults: this.formatTotalResults(hotels.length),
                isEmpty: hotels.length === 0,
            });
        } catch (error) {
            this.update({
                isLoading: false,
                hasError: true,
                errorMessage: "Impossible de charger les hôtels. Veuillez réessayer.",
            });
        }
    }

    onSortChange(sort: SortOption): void {
        this.update({ currentSort: sort });
        // Note : pour retrier les résultats existants sans refaire un appel API,
        // on pourrait appeler hotelService.sortHotels() ici
    }

    onFilterChange(filters: HotelFilters): void {
        this.update({ activeFilters: filters });
    }

    /**
     * Transforme une entité Hotel brute en HotelCardViewModel affichable.
     * C'est ici que se fait TOUT le formatage.
     */
    private mapToCardViewModel(hotel: Hotel): HotelCardViewModel {
        return {
            id: hotel.id,
            name: hotel.name,
            city: hotel.city,
            country: hotel.country,

            // ── Formatage ──────────────────────────────────────────────────────────
            pricePerNight: `${formatPrice(hotel.priceFrom, hotel.currency)}/nuit`,
            reviewCount: formatReviewCount(hotel.reviewCount),

            // ── Données brutes (pour les étoiles SVG) ─────────────────────────────
            rating: hotel.rating,
            stars: hotel.stars,

            thumbnailUrl: hotel.images[0] ?? "",
            amenities: hotel.amenities.slice(0, 4), // Max 4 sur la carte

            isAvailable: true,

            // ── Règle métier : calcul du badge ────────────────────────────────────
            badge: this.calculateBadge(hotel),
        };
    }

    /**
     * Règle métier pour attribuer un badge promotionnel.
     * Centralisée ici pour être facilement modifiable.
     */
    private calculateBadge(hotel: Hotel): string | undefined {
        if (hotel.rating >= 4.8) return "Coup de cœur";
        if (hotel.priceFrom < 200) return "Bon plan";
        return undefined;
    }

    private formatTotalResults(count: number): string {
        return `${count} hôtel${count > 1 ? "s" : ""} trouvé${count > 1 ? "s" : ""}`;
    }

    private update(partial: Partial<HotelListViewModel>): void {
        this.vm = { ...this.vm, ...partial };
        this.onChange(this.vm);
    }

    getViewModel(): HotelListViewModel {
        return this.vm;
    }
}