/**
 * src/components/search/SearchFilters.tsx
 * Filtres dans sidebar pleine hauteur — sans card, fond blanc de la sidebar.
 */
import { useState } from "react";
import { Star, SlidersHorizontal, RotateCcw } from "lucide-react";
import { SortOption, HotelFilters } from "@/interfaces/services/IHotelService";

interface SearchFiltersProps {
    onSort: (sort: SortOption) => void;
    onFilter: (filters: HotelFilters) => void;
}

const SORT_OPTIONS = [
    { value: "rating-desc", label: "Mieux notés" },
    { value: "price-asc", label: "Prix croissant" },
    { value: "price-desc", label: "Prix décroissant" },
    { value: "reviewCount-desc", label: "Plus d'avis" },
];

export function SearchFilters({ onSort, onFilter }: SearchFiltersProps) {
    const [selectedSort, setSelectedSort] = useState("rating-desc");
    const [selectedStars, setSelectedStars] = useState<number[]>([]);
    const [maxPrice, setMaxPrice] = useState(2000);

    const handleSort = (value: string) => {
        setSelectedSort(value);
        const [field, direction] = value.split("-") as [SortOption["field"], SortOption["direction"]];
        onSort({ field, direction });
    };

    const handleStarToggle = (star: number) => {
        const next = selectedStars.includes(star)
            ? selectedStars.filter((s) => s !== star)
            : [...selectedStars, star];
        setSelectedStars(next);
        onFilter({ stars: next.length > 0 ? next : undefined, maxPrice: maxPrice < 2000 ? maxPrice : undefined });
    };

    const handlePrice = (price: number) => {
        setMaxPrice(price);
        onFilter({ stars: selectedStars.length > 0 ? selectedStars : undefined, maxPrice: price < 2000 ? price : undefined });
    };

    const handleReset = () => {
        setSelectedSort("rating-desc");
        setSelectedStars([]);
        setMaxPrice(2000);
        onSort({ field: "rating", direction: "desc" });
        onFilter({});
    };

    const hasFilters = selectedStars.length > 0 || maxPrice < 2000 || selectedSort !== "rating-desc";

    return (
        <div className="w-full">

            {/* Header */}
            <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2 font-bold text-slate-800">
                    <SlidersHorizontal className="h-4 w-4 text-blue-600" />
                    Filtres
                </div>
                {hasFilters && (
                    <button
                        onClick={handleReset}
                        className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-semibold"
                    >
                        <RotateCcw className="h-3 w-3" />
                        Réinitialiser
                    </button>
                )}
            </div>

            {/* ── Tri ── */}
            <div className="mb-6">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Trier par</p>
                <div className="space-y-0.5">
                    {SORT_OPTIONS.map((opt) => (
                        <label
                            key={opt.value}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-colors ${selectedSort === opt.value
                                ? "bg-blue-50 text-blue-700"
                                : "hover:bg-slate-50 text-slate-600"
                                }`}
                        >
                            {/* Radio visuel custom */}
                            <div className={`h-4 w-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${selectedSort === opt.value ? "border-blue-600" : "border-slate-300"
                                }`}>
                                {selectedSort === opt.value && (
                                    <div className="h-2 w-2 rounded-full bg-blue-600" />
                                )}
                            </div>
                            <input type="radio" name="sort" value={opt.value}
                                checked={selectedSort === opt.value}
                                onChange={() => handleSort(opt.value)}
                                className="sr-only"
                            />
                            <span className="text-sm font-medium">{opt.label}</span>
                        </label>
                    ))}
                </div>
            </div>

            <div className="h-px bg-slate-100 mb-6" />

            {/* ── Classement étoiles ── */}
            <div className="mb-6">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Classement</p>
                <div className="space-y-0.5">
                    {[5, 4, 3, 2].map((star) => {
                        const active = selectedStars.includes(star);
                        return (
                            <label
                                key={star}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-colors ${active ? "bg-amber-50" : "hover:bg-slate-50"
                                    }`}
                            >
                                {/* Checkbox visuelle custom */}
                                <div className={`h-4 w-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${active ? "bg-amber-400 border-amber-400" : "border-slate-300"
                                    }`}>
                                    {active && <span className="text-white text-xs font-bold leading-none">✓</span>}
                                </div>
                                <input type="checkbox" checked={active}
                                    onChange={() => handleStarToggle(star)}
                                    className="sr-only"
                                />
                                <div className="flex gap-0.5">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <Star key={i} className={`h-3.5 w-3.5 ${i < star ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200"
                                            }`} />
                                    ))}
                                </div>
                            </label>
                        );
                    })}
                </div>
            </div>

            <div className="h-px bg-slate-100 mb-6" />

            {/* ── Prix max ── */}
            <div>
                <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Prix max / nuit</p>
                    <span className="text-sm font-bold text-blue-600">
                        {maxPrice === 2000 ? "Tous" : `${maxPrice} €`}
                    </span>
                </div>
                <input
                    type="range" min={50} max={2000} step={50} value={maxPrice}
                    onChange={(e) => handlePrice(Number(e.target.value))}
                    className="w-full h-1.5 rounded-full appearance-none bg-slate-200 accent-blue-600 cursor-pointer"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-2">
                    <span>50 €</span>
                    <span>2 000 €</span>
                </div>
            </div>
        </div>
    );
}