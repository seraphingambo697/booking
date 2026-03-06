/**
 * src/presenters/HotelDetailPresenter.ts
 *
 * Presenter de la page de détail d'un hôtel.
 *
 * Charge en parallèle l'hôtel ET ses chambres (Promise.all)
 * pour optimiser le temps de chargement.
 *
 * Transforme :
 * - Hotel → champs plats du HotelDetailViewModel
 * - Room[] → RoomViewModel[] (via mapRoomToViewModel)
 */

import { IHotelDetailPresenter } from "@/interfaces/presenters/IHotelDetailPresenter";
import { IHotelService } from "@/interfaces/services/IHotelService";
import { IRoomRepository } from "@/interfaces/repositories/IRoomRepository";
import { HotelDetailViewModel } from "@/viewmodels/HotelDetailViewModel";
import { RoomViewModel } from "@/viewmodels/RoomViewModel";
import { Room } from "@/core/entities/Room";
import { formatPrice, formatReviewCount, formatGuests } from "@/lib/formatters";

export class HotelDetailPresenter implements IHotelDetailPresenter {
    private vm: HotelDetailViewModel = {
        id: "", name: "", description: "", address: "", city: "", country: "",
        stars: 0, rating: 0, reviewCount: "", images: [], amenities: [],
        rooms: [], isLoading: false, hasError: false,
    };

    constructor(
        private hotelService: IHotelService,
        /** Repository des chambres — injecté séparément du service hôtel */
        private roomRepo: IRoomRepository,
        private onChange: (vm: HotelDetailViewModel) => void
    ) { }

    async loadHotel(id: string): Promise<void> {
        this.update({ isLoading: true, hasError: false });

        try {
            // ── Chargement en parallèle pour optimiser les performances ────────────
            const [hotel, rooms] = await Promise.all([
                this.hotelService.getById(id),
                this.roomRepo.findByHotelId(id),
            ]);

            if (!hotel) {
                throw new Error("Hôtel introuvable");
            }

            this.update({
                isLoading: false,
                // Données de l'hôtel
                id: hotel.id,
                name: hotel.name,
                description: hotel.description,
                address: hotel.address,
                city: hotel.city,
                country: hotel.country,
                stars: hotel.stars,
                rating: hotel.rating,
                reviewCount: formatReviewCount(hotel.reviewCount),
                images: hotel.images,
                amenities: hotel.amenities,
                // Chambres transformées en ViewModels
                rooms: rooms.map((r) => this.mapRoomToViewModel(r)),
            });
        } catch (error: any) {
            this.update({
                isLoading: false,
                hasError: true,
                errorMessage: error.message ?? "Erreur lors du chargement de l'hôtel.",
            });
        }
    }

    onRoomSelect(roomId: string): void {
        // Met à jour la chambre sélectionnée dans le ViewModel
        // Le composant RoomCard utilise ce flag pour afficher "Sélectionnée ✓"
        this.update({ selectedRoomId: roomId });
    }

    /**
     * Transforme une entité Room en RoomViewModel.
     * Formate toutes les données pour l'affichage.
     */
    private mapRoomToViewModel(room: Room): RoomViewModel {
        return {
            id: room.id,
            name: room.name,
            type: room.type,
            description: room.description,

            // ── Formatage ──────────────────────────────────────────────────────────
            pricePerNight: `${formatPrice(room.pricePerNight, room.currency)}/nuit`,
            priceRaw: room.pricePerNight,          // Conservé pour les calculs du BookingPresenter
            capacity: formatGuests(room.capacity),
            size: `${room.size} m²`,
            bedInfo: `${room.bedCount} ${room.bedType}`,

            amenities: room.amenities,
            images: room.images,
            isAvailable: room.isAvailable,
        };
    }

    private update(partial: Partial<HotelDetailViewModel>): void {
        this.vm = { ...this.vm, ...partial };
        this.onChange(this.vm);
    }

    getViewModel(): HotelDetailViewModel {
        return this.vm;
    }
}