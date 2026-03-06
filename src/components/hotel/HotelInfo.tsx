/**
 * src/components/hotel/HotelInfo.tsx
 * Bloc d'informations principal d'un hôtel :
 * nom, localisation, étoiles, note, description + équipements.
 *
 * Composant "vue stupide" : reçoit HotelDetailViewModel, n'a aucune logique.
 */
import { MapPin } from "lucide-react";
import { HotelDetailViewModel } from "@/viewmodels/HotelDetailViewModel";
import { HotelRating } from "./HotelRating";
import { HotelAmenities } from "./HotelAmenities";

interface HotelInfoProps {
    vm: HotelDetailViewModel;
}

export function HotelInfo({ vm }: HotelInfoProps) {
    return (
        <div className="space-y-4">
            {/* Nom + étoiles */}
            <div className="flex items-start justify-between gap-4">
                <h1 className="text-2xl md:text-3xl font-bold leading-tight">{vm.name}</h1>
                <HotelRating stars={vm.stars} rating={vm.rating} reviewCount={vm.reviewCount} />
            </div>

            {/* Adresse */}
            <div className="flex items-center gap-1.5 text-muted-foreground">
                <MapPin className="h-4 w-4 shrink-0" />
                <span className="text-sm">{vm.address}, {vm.city}, {vm.country}</span>
            </div>

            {/* Séparateur */}
            <div className="border-t" />

            {/* Description */}
            <p className="text-muted-foreground leading-relaxed">{vm.description}</p>

            {/* Équipements */}
            <div>
                <h2 className="font-semibold text-lg mb-3">Équipements</h2>
                <HotelAmenities amenities={vm.amenities} />
            </div>
        </div>
    );
}