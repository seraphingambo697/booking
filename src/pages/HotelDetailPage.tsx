/**
 * src/pages/HotelDetailPage.tsx
 *
 * Page de détail d'un hôtel avec ses chambres.
 * Récupère l'id depuis les params d'URL via useParams().
 * Quand l'utilisateur clique "Réserver" sur une chambre :
 * 1. Stocke le contexte dans bookingStore
 * 2. Navigue vers /booking
 */

import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { HotelGallery } from "@/components/hotel/HotelGallery";
import { HotelInfo } from "@/components/hotel/HotelInfo";
import { RoomList } from "@/components/room/RoomList";
import { useHotelDetail } from "@/hooks/useHotelDetail";
import { useBookingStore } from "@/store/bookingStore";
import { useSearchStore } from "@/store/searchStore";
import { RoomViewModel } from "@/viewmodels/RoomViewModel";
import { ROUTES } from "@/router/routes";

export function HotelDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { vm, onRoomSelect } = useHotelDetail(id!);
    const { setBookingContext } = useBookingStore();
    const { params } = useSearchStore();

    /** L'utilisateur clique "Réserver" sur une chambre */
    const handleBook = (room: RoomViewModel) => {
        setBookingContext({
            hotelId: vm.id,
            roomId: room.id,
            hotelName: vm.name,
            room,
            checkIn: params.checkIn ?? new Date(),
            checkOut: params.checkOut ?? new Date(Date.now() + 86400000 * 2),
            guestCount: params.guestCount ?? 2,
        });
        navigate(ROUTES.BOOKING);
    };

    // État chargement
    if (vm.isLoading) {
        return (
            <div className="container py-8 space-y-6">
                <Skeleton className="h-96 w-full rounded-xl" />
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-48 w-full rounded-xl" />
            </div>
        );
    }

    // État erreur
    if (vm.hasError) {
        return (
            <div className="container py-8">
                <Alert variant="destructive">
                    <AlertDescription>{vm.errorMessage}</AlertDescription>
                </Alert>
                <Button variant="outline" className="mt-4" onClick={() => navigate(-1)}>
                    Retour
                </Button>
            </div>
        );
    }

    return (
        <div className="container py-8 space-y-8">
            {/* Retour aux résultats */}
            <button
                onClick={() => navigate(-1)}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
                ← Retour aux résultats
            </button>

            {/* Galerie photos */}
            <HotelGallery images={vm.images} name={vm.name} />

            {/* Infos hôtel (nom, adresse, note, équipements) */}
            <HotelInfo vm={vm} />

            {/* Liste des chambres */}
            <div>
                <h2 className="text-xl font-bold mb-4">Chambres disponibles</h2>
                <RoomList
                    rooms={vm.rooms}
                    selectedRoomId={vm.selectedRoomId}
                    onRoomSelect={onRoomSelect}
                    onBook={handleBook}
                />
            </div>
        </div>
    );
}