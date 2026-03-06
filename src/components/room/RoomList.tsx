/**
 * src/components/room/RoomList.tsx
 * Liste de toutes les chambres d'un hôtel.
 *
 * Affiche un message vide si aucune chambre disponible.
 * Délègue le rendu de chaque chambre à RoomCard.
 */
import { BedDouble } from "lucide-react";
import { RoomCard } from "./RoomCard";
import { RoomViewModel } from "@/viewmodels/RoomViewModel";

interface RoomListProps {
    rooms: RoomViewModel[];
    selectedRoomId?: string;
    onRoomSelect: (roomId: string) => void;
    onBook: (room: RoomViewModel) => void;
}

export function RoomList({ rooms, selectedRoomId, onRoomSelect, onBook }: RoomListProps) {
    /* Aucune chambre dans cet hôtel */
    if (rooms.length === 0) {
        return (
            <div className="text-center py-12">
                <BedDouble className="h-14 w-14 mx-auto mb-3 text-muted-foreground/30" />
                <p className="text-muted-foreground">Aucune chambre disponible pour ces dates.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {rooms.map((room) => (
                <RoomCard
                    key={room.id}
                    room={room}
                    isSelected={selectedRoomId === room.id}
                    onRoomSelect={onRoomSelect}
                    onBook={onBook}
                />
            ))}
        </div>
    );
}