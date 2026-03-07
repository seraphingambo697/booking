/**
 * src/components/hotel/HotelCard.tsx
 * Layout vertical (image haut / contenu bas) — optimisé grille 2 colonnes.
 * Compact, dense, sans espace mort.
 */
import { Star, MapPin, ArrowRight } from "lucide-react";
import { HotelCardViewModel } from "@/viewmodels/HotelListViewModel";

interface HotelCardProps {
    hotel: HotelCardViewModel;
    onClick: () => void;
}

export function HotelCard({ hotel, onClick }: HotelCardProps) {
    return (
        <article
            onClick={onClick}
            className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group flex flex-col h-full"
        >
            {/* ── Image ── hauteur fixe, toujours remplie */}
            <div className="relative h-44 overflow-hidden shrink-0">
                <img
                    src={hotel.thumbnailUrl}
                    alt={hotel.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src =
                            "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800";
                    }}
                />
                {/* Gradient bas */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                {/* Badge */}
                {hotel.badge && (
                    <span className={`absolute top-2.5 left-2.5 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow ${hotel.badge === "Coup de cœur" ? "bg-rose-500" : "bg-emerald-500"
                        }`}>
                        {hotel.badge === "Coup de cœur" ? "❤️ " : "🏷️ "}{hotel.badge}
                    </span>
                )}

                {/* Note + étoiles officielles — en bas de l'image */}
                <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between">
                    <div className="flex">
                        {Array.from({ length: hotel.stars }).map((_, i) => (
                            <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400 drop-shadow" />
                        ))}
                    </div>
                    <div className="flex items-center gap-1 bg-white/95 backdrop-blur-sm rounded-lg px-2 py-0.5">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        <span className="text-xs font-bold text-slate-800">{hotel.rating}</span>
                    </div>
                </div>
            </div>

            {/* ── Contenu ── compact, pas de padding excessif */}
            <div className="flex flex-col flex-1 p-4 gap-3">
                {/* Nom + ville */}
                <div>
                    <h3 className="font-bold text-base text-slate-800 leading-tight line-clamp-1 mb-1">
                        {hotel.name}
                    </h3>
                    <div className="flex items-center gap-1 text-slate-400 text-xs">
                        <MapPin className="h-3 w-3 shrink-0" />
                        <span>{hotel.city}, {hotel.country}</span>
                    </div>
                </div>

                {/* Chips équipements — 3 max pour rester compact */}
                <div className="flex flex-wrap gap-1">
                    {hotel.amenities.slice(0, 3).map((a) => (
                        <span key={a} className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md font-medium">
                            {a}
                        </span>
                    ))}
                    {hotel.amenities.length > 3 && (
                        <span className="text-xs text-slate-400 px-1 py-0.5">
                            +{hotel.amenities.length - 3}
                        </span>
                    )}
                </div>

                {/* Spacer pour pousser le footer vers le bas */}
                <div className="flex-1" />

                {/* ── Footer : prix + bouton — toujours en bas de card ── */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <div className="leading-none">
                        <div className="flex items-baseline gap-0.5">
                            <span className="text-xl font-bold text-blue-600">
                                {hotel.pricePerNight.replace(" €/nuit", "")}
                            </span>
                            <span className="text-xs text-slate-400">€/nuit</span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">{hotel.reviewCount}</p>
                    </div>

                    <div className="flex items-center gap-1 bg-blue-600 text-white text-xs font-bold px-3 py-2 rounded-xl group-hover:bg-blue-700 transition-colors">
                        Voir
                        <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                </div>
            </div>
        </article>
    );
}

/** Skeleton */
export function HotelCardSkeleton() {
    return (
        <div className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm flex flex-col animate-pulse">
            <div className="h-44 bg-slate-200" />
            <div className="p-4 space-y-3">
                <div className="h-4 bg-slate-200 rounded w-3/4" />
                <div className="h-3 bg-slate-200 rounded w-1/3" />
                <div className="flex gap-1.5">
                    <div className="h-5 bg-slate-200 rounded-md w-14" />
                    <div className="h-5 bg-slate-200 rounded-md w-14" />
                    <div className="h-5 bg-slate-200 rounded-md w-14" />
                </div>
                <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
                    <div className="h-6 bg-slate-200 rounded w-20" />
                    <div className="h-7 bg-slate-200 rounded-xl w-16" />
                </div>
            </div>
        </div>
    );
}