/**
 * src/components/hotel/HotelAmenities.tsx
 * Grille d'équipements avec icônes associées.
 *
 * AMENITY_ICONS : mapping string → icône Lucide.
 * Si l'équipement n'a pas d'icône dédiée, on affiche un "✓" générique.
 */
import { Wifi, Waves, UtensilsCrossed, Dumbbell, Car, Wind, Coffee, Sparkles, Mountain, Flame } from "lucide-react";

/** Mapping équipement → icône Lucide */
const AMENITY_ICONS: Record<string, React.ReactNode> = {
    "WiFi": <Wifi className="h-5 w-5" />,
    "Piscine": <Waves className="h-5 w-5" />,
    "Restaurant": <UtensilsCrossed className="h-5 w-5" />,
    "Salle de sport": <Dumbbell className="h-5 w-5" />,
    "Parking": <Car className="h-5 w-5" />,
    "Climatisation": <Wind className="h-5 w-5" />,
    "Bar": <Coffee className="h-5 w-5" />,
    "Spa": <Sparkles className="h-5 w-5" />,
    "Vue mer": <Mountain className="h-5 w-5" />,
    "Sauna": <Flame className="h-5 w-5" />,
};

interface HotelAmenitiesProps {
    amenities: string[];
}

export function HotelAmenities({ amenities }: HotelAmenitiesProps) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {amenities.map((amenity) => (
                <div
                    key={amenity}
                    className="flex items-center gap-2.5 p-3 border rounded-lg bg-muted/30 text-sm"
                >
                    <span className="text-primary shrink-0">
                        {/* Icône dédiée ou fallback "✓" */}
                        {AMENITY_ICONS[amenity] ?? <span className="text-base">✓</span>}
                    </span>
                    <span className="font-medium">{amenity}</span>
                </div>
            ))}
        </div>
    );
}