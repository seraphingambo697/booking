/**
 * src/components/hotel/HotelRating.tsx
 * Bloc note + étoiles officielles + nombre d'avis.
 *
 * Réutilisé dans HotelCard (miniature) et HotelInfo (détail).
 * Paramètre "size" pour adapter la taille selon le contexte.
 */
import { Star } from "lucide-react";

interface HotelRatingProps {
    /** Note voyageurs (ex: 4.8) */
    rating: number;
    /** Étoiles officielles classement (1-5) */
    stars: number;
    /** Nombre d'avis déjà formaté : "1,3k avis" */
    reviewCount: string;
    /** Taille d'affichage */
    size?: "sm" | "md";
}

export function HotelRating({ rating, stars, reviewCount, size = "md" }: HotelRatingProps) {
    const isSmall = size === "sm";

    return (
        <div className="flex flex-col items-end gap-1 shrink-0">
            {/* Étoiles officielles */}
            <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                        key={i}
                        className={`${isSmall ? "h-3 w-3" : "h-4 w-4"} ${i < stars ? "fill-amber-400 text-amber-400" : "fill-muted text-muted"
                            }`}
                    />
                ))}
            </div>

            {/* Note + avis */}
            <div className="flex items-center gap-1.5">
                <span
                    className={`bg-primary text-primary-foreground font-bold rounded-md px-2 py-0.5 ${isSmall ? "text-xs" : "text-sm"
                        }`}
                >
                    {rating.toFixed(1)}
                </span>
                <span className={`text-muted-foreground ${isSmall ? "text-xs" : "text-sm"}`}>
                    {reviewCount}
                </span>
            </div>
        </div>
    );
}