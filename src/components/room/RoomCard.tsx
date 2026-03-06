/**
 * src/components/room/RoomCard.tsx
 * Carte d'une chambre individuelle.
 *
 * Deux modes :
 * - Sélection (onRoomSelect) : met en surbrillance la chambre choisie
 * - Réservation directe (onBook) : navigue vers le tunnel de réservation
 *
 * Affiche un badge "Complet" si isAvailable = false.
 */
import { Users, Maximize2, BedDouble, Check } from "lucide-react";
import { RoomViewModel } from "@/viewmodels/RoomViewModel";

interface RoomCardProps {
    room: RoomViewModel;
    isSelected?: boolean;
    onRoomSelect: (roomId: string) => void;
    onBook: (room: RoomViewModel) => void;
}

/** Mapping type chambre → label lisible */
const ROOM_TYPE_LABELS: Record<string, string> = {
    SINGLE: "Simple",
    DOUBLE: "Double",
    TWIN: "Twin",
    SUITE: "Suite",
    DELUXE: "Deluxe",
    FAMILY: "Familiale",
};

export function RoomCard({ room, isSelected, onRoomSelect, onBook }: RoomCardProps) {
    return (
        <article
            className={`bg-white border rounded-xl overflow-hidden transition-all ${isSelected ? "ring-2 ring-primary shadow-md" : "hover:shadow-md"
                } ${!room.isAvailable ? "opacity-70" : ""}`}
        >
            <div className="flex flex-col md:flex-row">
                {/* ── Photo de la chambre ── */}
                <div className="relative md:w-56 h-44 md:h-auto shrink-0 overflow-hidden">
                    <img
                        src={room.images[0] ?? "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800"}
                        alt={room.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800";
                        }}
                    />

                    {/* Badge type */}
                    <span className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                        {ROOM_TYPE_LABELS[room.type] ?? room.type}
                    </span>

                    {/* Badge disponibilité */}
                    {!room.isAvailable && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <span className="bg-white text-foreground text-sm font-bold px-3 py-1 rounded-full">
                                Complet
                            </span>
                        </div>
                    )}
                </div>

                {/* ── Contenu texte ── */}
                <div className="flex-1 p-4 flex flex-col justify-between">
                    <div>
                        {/* Nom */}
                        <h3 className="font-semibold text-lg mb-1">{room.name}</h3>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{room.description}</p>

                        {/* Caractéristiques : capacity, size, bed */}
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-3">
                            <span className="flex items-center gap-1.5">
                                <Users className="h-4 w-4 text-primary shrink-0" />
                                {room.capacity}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Maximize2 className="h-4 w-4 text-primary shrink-0" />
                                {room.size}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <BedDouble className="h-4 w-4 text-primary shrink-0" />
                                {room.bedInfo}
                            </span>
                        </div>

                        {/* Amenities (5 max) */}
                        <div className="flex flex-wrap gap-1.5">
                            {room.amenities.slice(0, 5).map((a) => (
                                <span key={a} className="flex items-center gap-1 text-xs bg-muted px-2 py-0.5 rounded-full">
                                    <Check className="h-3 w-3 text-primary" />
                                    {a}
                                </span>
                            ))}
                            {room.amenities.length > 5 && (
                                <span className="text-xs text-muted-foreground px-2 py-0.5">
                                    +{room.amenities.length - 5} autres
                                </span>
                            )}
                        </div>
                    </div>

                    {/* ── Prix + boutons ── */}
                    <div className="flex items-center justify-between mt-4 pt-4 border-t">
                        <div>
                            {/* pricePerNight est déjà formaté par le Presenter : "350 €/nuit" */}
                            <span className="text-xl font-bold text-primary">{room.pricePerNight}</span>
                        </div>

                        <div className="flex gap-2">
                            {/* Bouton Sélectionner (highlight sans naviguer) */}
                            <button
                                disabled={!room.isAvailable}
                                onClick={() => onRoomSelect(room.id)}
                                className={`text-sm border px-3 py-1.5 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${isSelected
                                    ? "bg-primary/10 border-primary text-primary"
                                    : "border-input hover:bg-muted"
                                    }`}
                            >
                                {isSelected ? "✓ Sélectionnée" : "Sélectionner"}
                            </button>

                            {/* Bouton Réserver (navigue vers BookingPage) */}
                            <button
                                disabled={!room.isAvailable}
                                onClick={() => onBook(room)}
                                data-cy="book-room"
                                className="text-sm bg-primary text-primary-foreground px-3 py-1.5 rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Réserver
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </article>
    );
}