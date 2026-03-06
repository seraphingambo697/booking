/**
 * src/components/search/SearchFilters.tsx
 * Panneau de filtres latéral : tri + étoiles + prix max.
 *
 * Appelle onFilter/onSort à chaque changement → le HotelListPresenter
 * applique immédiatement les filtres sur les données déjà chargées
 * (pas de nouvel appel API).
 */
import { useState } from "react";
import { Star, ArrowUpDown } from "lucide-react";
import { SortOption, HotelFilters } from "@/interfaces/services/IHotelService";

interface SearchFiltersProps {
    onSort: (sort: SortOption) => void;
    onFilter: (filters: HotelFilters) => void;
}

export function SearchFilters({ onSort, onFilter }: SearchFiltersProps) {
    const [selectedSort, setSelectedSort] = useState<string>("rating-desc");
    const [selectedStars, setSelectedStars] = useState<number[]>([]);
    const [maxPrice, setMaxPrice] = useState<number>(2000);

    /** Quand l'utilisateur change le tri */
    const handleSortChange = (value: string) => {
        setSelectedSort(value);
        const [field, direction] = value.split("-") as [SortOption["field"], SortOption["direction"]];
        onSort({ field, direction });
    };

    /** Quand l'utilisateur coche/décoche des étoiles */
    const handleStarToggle = (star: number) => {
        const next = selectedStars.includes(star)
            ? selectedStars.filter((s) => s !== star)
            : [...selectedStars, star];
        setSelectedStars(next);
        applyFilters(next, maxPrice);
    };

    /** Quand l'utilisateur déplace le slider de prix */
    const handlePriceChange = (price: number) => {
        setMaxPrice(price);
        applyFilters(selectedStars, price);
    };

    const applyFilters = (stars: number[], price: number) => {
        onFilter({
            stars: stars.length > 0 ? stars : undefined,
            maxPrice: price < 2000 ? price : undefined,
        });
    };

    const SORT_OPTIONS = [
        { value: "rating-desc", label: "Mieux notés" },
        { value: "price-asc", label: "Prix croissant" },
        { value: "price-desc", label: "Prix décroissant" },
        { value: "reviewCount-desc", label: "Plus d'avis" },
    ];

    return (
        <div className="bg-white border rounded-xl p-4 space-y-6 sticky top-24">

            {/* ── Tri ── */}
            <div>
                <div className="flex items-center gap-2 font-semibold mb-3">
                    <ArrowUpDown className="h-4 w-4 text-primary" />
                    Trier par
                </div>
                <div className="space-y-1.5">
                    {SORT_OPTIONS.map((opt) => (
                        <label key={opt.value} className="flex items-center gap-2 cursor-pointer group">
                            <input
                                type="radio"
                                name="sort"
                                value={opt.value}
                                checked={selectedSort === opt.value}
                                onChange={() => handleSortChange(opt.value)}
                                className="accent-primary"
                            />
                            <span className="text-sm group-hover:text-primary transition-colors">
                                {opt.label}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            <div className="border-t" />

            {/* ── Filtre par étoiles ── */}
            <div>
                <div className="flex items-center gap-2 font-semibold mb-3">
                    <Star className="h-4 w-4 text-primary" />
                    Étoiles
                </div>
                <div className="space-y-1.5">
                    {[5, 4, 3, 2].map((star) => (
                        <label key={star} className="flex items-center gap-2 cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={selectedStars.includes(star)}
                                onChange={() => handleStarToggle(star)}
                                className="accent-primary"
                            />
                            <div className="flex items-center gap-1">
                                {Array.from({ length: star }).map((_, i) => (
                                    <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                                ))}
                                {Array.from({ length: 5 - star }).map((_, i) => (
                                    <Star key={i} className="h-3.5 w-3.5 fill-muted text-muted" />
                                ))}
                            </div>
                        </label>
                    ))}
                </div>
            </div>

            <div className="border-t" />

            {/* ── Filtre par prix maximum ── */}
            <div>
                <div className="flex items-center justify-between font-semibold mb-3">
                    <span>Prix max / nuit</span>
                    <span className="text-primary font-bold">{maxPrice} €</span>
                </div>
                <input
                    type="range"
                    min={50}
                    max={2000}
                    step={50}
                    value={maxPrice}
                    onChange={(e) => handlePriceChange(Number(e.target.value))}
                    className="w-full accent-primary"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>50 €</span>
                    <span>2 000 €</span>
                </div>
            </div>

            {/* ── Bouton reset ── */}
            <button
                onClick={() => {
                    setSelectedSort("rating-desc");
                    setSelectedStars([]);
                    setMaxPrice(2000);
                    onSort({ field: "rating", direction: "desc" });
                    onFilter({});
                }}
                className="w-full text-sm text-muted-foreground hover:text-foreground border rounded-md py-2 hover:bg-muted transition-colors"
            >
                Réinitialiser les filtres
            </button>
        </div>
    );
}