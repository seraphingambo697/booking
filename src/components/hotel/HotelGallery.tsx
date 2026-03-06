/**
 * src/components/hotel/HotelGallery.tsx
 * Galerie de photos en disposition mosaïque.
 *
 * Layout :
 * - 1ère photo : grande (occupe 2 colonnes × 2 lignes)
 * - 4 autres photos : petites (1 colonne × 1 ligne chacune)
 *
 * Toujours affiche exactement 5 cases — rempli avec le fallback si besoin.
 */

const FALLBACK = "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800";

interface HotelGalleryProps {
    images: string[];
    name: string;
}

export function HotelGallery({ images, name }: HotelGalleryProps) {
    /* Garantit exactement 5 images (rempli avec fallback si besoin) */
    const display = [
        ...images,
        ...Array(Math.max(0, 5 - images.length)).fill(FALLBACK),
    ].slice(0, 5);

    return (
        <div className="grid grid-cols-4 grid-rows-2 gap-2 h-72 md:h-96 rounded-xl overflow-hidden">
            {/* Image principale — grande */}
            <div className="col-span-2 row-span-2 overflow-hidden">
                <img
                    src={display[0]}
                    alt={`${name} - photo principale`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK; }}
                />
            </div>

            {/* 4 petites photos */}
            {display.slice(1).map((src, i) => (
                <div key={i} className="overflow-hidden">
                    <img
                        src={src}
                        alt={`${name} - photo ${i + 2}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK; }}
                    />
                </div>
            ))}
        </div>
    );
}