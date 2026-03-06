/**
 * src/components/hotel/HotelCard.tsx
 * Carte hôtel pour la liste de résultats.
 *
 * Composant "stupide" : reçoit un HotelCardViewModel et affiche.
 * Pas de formatage ici — tout est déjà fait dans HotelListPresenter.
 */
import { Star, MapPin } from "lucide-react";
import { HotelCardViewModel } from "@/viewmodels/HotelListViewModel";

interface HotelCardProps {
    hotel: HotelCardViewModel;
    onClick: () => void;
}

export function HotelCard({ hotel, onClick }: HotelCardProps) {
    return (
        <article
            onClick={onClick}
            className="bg-white border rounded-xl overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer"
        >
            {/* Image miniature */}
            <div className="relative h-52 overflow-hidden">
                <img
                    src={hotel.thumbnailUrl}
                    alt={hotel.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                        /* Fallback si l'image ne charge pas */
                        (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800";
                    }}
                />

                {/* Badge promotionnel */}
                {hotel.badge && (
                    <div className="absolute top-3 left-3 bg-amber-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow">
                        {hotel.badge}
                    </div>
                )}

                {/* Note */}
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    <span className="text-xs font-bold">{hotel.rating}</span>
                </div>
            </div>

            {/* Contenu de la carte */}
            <div className="p-4">
                {/* Nom + étoiles */}
                <div className="flex justify-between items-start mb-1">
                    <h3 className="font-semibold text-base leading-tight line-clamp-1">
                        {hotel.name}
                    </h3>
                    <div className="flex ml-2 shrink-0">
                        {Array.from({ length: hotel.stars }).map((_, i) => (
                            <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                        ))}
                    </div>
                </div>

                {/* Localisation */}
                <div className="flex items-center gap-1 text-muted-foreground text-sm mb-3">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{hotel.city}, {hotel.country}</span>
                </div>

                {/* Équipements (chips) */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                    {hotel.amenities.map((amenity) => (
                        <span
                            key={amenity}
                            className="text-xs bg-muted px-2 py-0.5 rounded-full"
                        >
                            {amenity}
                        </span>
                    ))}
                </div>

                {/* Prix + avis */}
                <div className="flex items-center justify-between pt-2 border-t">
                    <span className="text-lg font-bold text-primary">
                        {/* pricePerNight = "350 €/nuit" — déjà formaté par le Presenter */}
                        {hotel.pricePerNight}
                    </span>
                    <span className="text-xs text-muted-foreground">
                        {hotel.reviewCount}
                    </span>
                </div>
            </div>
        </article>
    );
}

/**
 * Skeleton de chargement pour HotelCard.
 * Affiché pendant le chargement des hôtels (isLoading = true).
 */
export function HotelCardSkeleton() {
    return (
        <div className="bg-white border rounded-xl overflow-hidden animate-pulse">
            <div className="h-52 bg-muted" />
            <div className="p-4 space-y-3">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-3 bg-muted rounded w-1/2" />
                <div className="flex gap-2">
                    <div className="h-5 bg-muted rounded-full w-16" />
                    <div className="h-5 bg-muted rounded-full w-16" />
                </div>
                <div className="h-5 bg-muted rounded w-1/3" />
            </div>
        </div>
    );
}