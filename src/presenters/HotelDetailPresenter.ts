/**
 * src/presenters/HotelDetailPresenter.ts
 * Presenter pour la page de détail d'un hôtel.
 *
 * Optimisation : charge l'hôtel ET ses chambres en parallèle avec Promise.all.
 * Sans Promise.all : 300ms + 300ms = 600ms d'attente
 * Avec Promise.all : max(300ms, 300ms) = 300ms d'attente
 */
import { IHotelDetailPresenter } from "@/interfaces/presenters/IHotelDetailPresenter";
import { IHotelService } from "@/interfaces/services/IHotelService";
import { IRoomRepository } from "@/interfaces/repositories/IRoomRepository";
import { HotelDetailViewModel } from "@/viewmodels/HotelDetailViewModel";
import { RoomViewModel } from "@/viewmodels/RoomViewModel";
import { Room } from "@/core/entities/Room";
import { formatGuests, formatPrice, formatReviewCount } from "@/lib/formatters";

export class HotelDetailPresenter implements IHotelDetailPresenter {
    private vm: HotelDetailViewModel = {
        id: "", name: "", description: "", address: "", city: "", country: "",
        stars: 0, rating: 0, reviewCount: "", images: [], amenities: [],
        rooms: [], isLoading: true, hasError: false,
    };

    constructor(
        private hotelService: IHotelService,
        private roomRepo: IRoomRepository,        // Accès direct au repo pour les chambres
        private onChange: (vm: HotelDetailViewModel) => void
    ) { }

    async loadHotel(id: string): Promise<void> {
        this.update({ isLoading: true, hasError: false });

        try {
            // Chargement parallèle : hôtel + chambres en même temps
            const [hotel, rooms] = await Promise.all([
                this.hotelService.getById(id),
                this.roomRepo.findByHotelId(id),
            ]);

            if (!hotel) {
                throw new Error("Hôtel introuvable. Il a peut-être été supprimé.");
            }

            this.update({
                isLoading: false,
                id: hotel.id,
                name: hotel.name,
                description: hotel.description,
                address: hotel.address,
                city: hotel.city,
                country: hotel.country,
                latitude: hotel.latitude,
                longitude: hotel.longitude,
                stars: hotel.stars,
                rating: hotel.rating,
                reviewCount: formatReviewCount(hotel.reviewCount),
                images: hotel.images,
                amenities: hotel.amenities,
                rooms: rooms.map(this.mapRoom),
            });
        } catch (error: any) {
            this.update({
                isLoading: false,
                hasError: true,
                errorMessage: error.message ?? "Une erreur est survenue.",
            });
        }
    }

    onRoomSelect(roomId: string): void {
        // Met à jour la chambre sélectionnée → le composant RoomCard l'affichera comme active
        this.update({ selectedRoomId: roomId });
    }

    /**
     * Transforme une entité Room en RoomViewModel.
     * Note : priceRaw est conservé pour que BookingPresenter puisse calculer le prix.
     */
    private mapRoom = (room: Room): RoomViewModel => ({
        id: room.id,
        name: room.name,
        type: room.type,
        description: room.description,
        // Affiché : "350 €/nuit"
        pricePerNight: `${formatPrice(room.pricePerNight, room.currency)}/nuit`,
        // Pour calcul : 350
        priceRaw: room.pricePerNight,
        capacity: formatGuests(room.capacity),        // "2 voyageurs"
        size: `${room.size} m²`,                      // "32 m²"
        bedInfo: `${room.bedCount} ${room.bedType}`,  // "1 Grand lit double"
        amenities: room.amenities,
        images: room.images,
        isAvailable: room.isAvailable,
    });

    private update(partial: Partial<HotelDetailViewModel>): void {
        this.vm = { ...this.vm, ...partial };
        this.onChange(this.vm);
    }

    getViewModel(): HotelDetailViewModel {
        return this.vm;
    }
}