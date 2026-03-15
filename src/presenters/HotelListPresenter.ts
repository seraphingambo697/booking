/**
 * src/presenters/HotelListPresenter.ts
 * Presenter pour la liste des hôtels (page SearchResultsPage).
 *
 * Responsabilités :
 * 1. Charger les hôtels via IHotelService
 * 2. Mapper Hotel[] → HotelCardViewModel[] (formatage)
 * 3. Gérer les états de chargement et d'erreur
 * 4. Appliquer tri et filtres côté client
 */
import { IHotelListPresenter } from "@/interfaces/presenters/IHotelListPresenter";
import { IHotelService, SortOption, HotelFilters } from "@/interfaces/services/IHotelService";
import { SearchParams } from "@/interfaces/repositories/IHotelRepository";
import { HotelListViewModel, HotelCardViewModel } from "@/viewmodels/HotelListViewModel";
import { Hotel } from "@/core/entities/Hotel";
import { formatPrice, formatReviewCount } from "@/lib/utils";

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
  ) {}

  async loadHotels(params: SearchParams): Promise<void> {
    // 1. Passe en état de chargement → les Skeletons s'affichent
    this.update({ isLoading: true, hasError: false });

    try {
      // 2. Appelle le service (qui appelle le repository)
      const hotels = await this.hotelService.search(params);

      // 3. Applique le tri par défaut
      const sorted = this.hotelService.sortHotels(hotels, this.vm.currentSort as SortOption);

      // 4. Transforme les entités en ViewModels (formatage)
      this.update({
        isLoading: false,
        hotels: sorted.map(this.mapToCard),
        totalResults: this.formatTotal(sorted.length),
        isEmpty: sorted.length === 0,
      });
    } catch (error) {
      // 5. Gère l'erreur de façon lisible pour l'utilisateur
      this.update({
        isLoading: false,
        hasError: true,
        errorMessage: "Impossible de charger les hôtels. Veuillez réessayer.",
      });
    }
  }

  onSortChange(sort: SortOption): void {
    // Tri synchrone sur les données déjà chargées (pas d'appel API)
    this.update({ currentSort: sort });
  }

  onFilterChange(filters: HotelFilters): void {
    // Filtrage synchrone — retour instantané dans l'UI
    this.update({ activeFilters: filters });
  }

  /**
   * Transforme une entité Hotel en HotelCardViewModel.
   * C'est ici que tout le formatage se fait (jamais dans le composant).
   */
  private mapToCard = (hotel: Hotel): HotelCardViewModel => ({
    id: hotel.id,
    name: hotel.name,
    city: hotel.city,
    country: hotel.country,
    // Formatage du prix : 350 → "350 €/nuit"
    pricePerNight: `${formatPrice(hotel.priceFrom, hotel.currency)}/nuit`,
    rating: hotel.rating,
    // Formatage des avis : 1284 → "1,3k avis"
    reviewCount: formatReviewCount(hotel.reviewCount),
    stars: hotel.stars,
    thumbnailUrl: hotel.images[0] ?? "",
    // Limite à 4 équipements pour ne pas surcharger la carte
    amenities: hotel.amenities.slice(0, 4),
    isAvailable: true,
    // Logique de badge : règle métier dans le Presenter, pas dans le composant
    badge: this.computeBadge(hotel),
  });

  /** Détermine si un badge promotionnel doit être affiché */
  private computeBadge(hotel: Hotel): string | undefined {
    if (hotel.rating >= 4.8) return "Coup de cœur";
    if (hotel.priceFrom < 200) return "Bon plan";
    return undefined;
  }

  /** Formate le compteur de résultats */
  private formatTotal(count: number): string {
    if (count === 0) return "Aucun hôtel trouvé";
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
