/**
 * src/pages/HotelDetailPage.tsx
 * Page de détail — layout 2 colonnes avec map intégrée.
 */
import { useParams, useNavigate } from "react-router-dom";
import {
    Star, MapPin, ArrowLeft, Wifi, Waves, UtensilsCrossed,
    Dumbbell, Car, Wind, Coffee, Sparkles, Mountain, Flame,
    BedDouble, Users, Maximize2, Check, ChevronRight
} from "lucide-react";
import { useHotelDetail } from "@/hooks/useHotelDetail";
import { useBookingStore } from "@/store/bookingStore";
import { useSearchStore } from "@/store/searchStore";
import { RoomViewModel } from "@/viewmodels/RoomViewModel";
import { HotelDetailViewModel } from "@/viewmodels/HotelDetailViewModel";
import { ROUTES } from "@/router/routes";

/* ── Icônes équipements ── */
const AMENITY_ICONS: Record<string, React.ReactNode> = {
    "WiFi": <Wifi className="h-4 w-4" />,
    "Piscine": <Waves className="h-4 w-4" />,
    "Restaurant": <UtensilsCrossed className="h-4 w-4" />,
    "Salle de sport": <Dumbbell className="h-4 w-4" />,
    "Parking": <Car className="h-4 w-4" />,
    "Climatisation": <Wind className="h-4 w-4" />,
    "Bar": <Coffee className="h-4 w-4" />,
    "Spa": <Sparkles className="h-4 w-4" />,
    "Vue mer": <Mountain className="h-4 w-4" />,
    "Sauna": <Flame className="h-4 w-4" />,
};

/* ── Map OpenStreetMap (iframe, pas d'API key) ── */
function HotelMap({ lat, lng, name }: { lat: number; lng: number; name: string }) {
    const zoom = 15;
    const src = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.01},${lat - 0.007},${lng + 0.01},${lat + 0.007}&layer=mapnik&marker=${lat},${lng}`;
    return (
        <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
            <iframe
                src={src}
                width="100%"
                height="260"
                style={{ border: 0 }}
                title={`Carte - ${name}`}
                loading="lazy"
            />
            <a
                href={`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=${zoom}/${lat}/${lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 py-2.5 text-xs text-slate-500 hover:text-blue-600 bg-white transition-colors border-t border-slate-100"
            >
                <MapPin className="h-3.5 w-3.5" />
                Voir sur OpenStreetMap
                <ChevronRight className="h-3 w-3" />
            </a>
        </div>
    );
}

/* ── Skeleton ── */
function DetailSkeleton() {
    return (
        <div className="animate-pulse">
            <div className="h-[420px] bg-slate-200 w-full mb-6" />
            <div className="px-6 pb-8 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-4">
                        <div className="h-8 bg-slate-200 rounded-xl w-2/3" />
                        <div className="h-4 bg-slate-200 rounded w-1/3" />
                        <div className="h-20 bg-slate-200 rounded-xl" />
                    </div>
                    <div className="space-y-4">
                        <div className="h-64 bg-slate-200 rounded-2xl" />
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ── RoomCard inline ── */
function RoomCard({ room, isSelected, onRoomSelect, onBook }: {
    room: RoomViewModel;
    isSelected?: boolean;
    onRoomSelect: (id: string) => void;
    onBook: (room: RoomViewModel) => void;
}) {
    const ROOM_LABELS: Record<string, string> = {
        SINGLE: "Simple", DOUBLE: "Double", TWIN: "Twin",
        SUITE: "Suite", DELUXE: "Deluxe", FAMILY: "Familiale",
    };
    return (
        <div className={`bg-white rounded-2xl border overflow-hidden transition-all duration-200 ${isSelected ? "border-blue-400 shadow-md ring-2 ring-blue-100" : "border-slate-100 shadow-sm hover:shadow-md"
            } ${!room.isAvailable ? "opacity-60" : ""}`}>
            <div className="flex flex-col sm:flex-row">
                {/* Photo */}
                <div className="relative sm:w-52 h-40 sm:h-auto shrink-0 overflow-hidden">
                    <img
                        src={room.images[0] ?? "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800"}
                        alt={room.name}
                        className="w-full h-full object-cover"
                    />
                    <span className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full font-semibold">
                        {ROOM_LABELS[room.type] ?? room.type}
                    </span>
                    {!room.isAvailable && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <span className="bg-white text-slate-700 text-xs font-bold px-3 py-1 rounded-full">Complet</span>
                        </div>
                    )}
                </div>
                {/* Contenu */}
                <div className="flex-1 p-4 flex flex-col justify-between">
                    <div>
                        <h3 className="font-bold text-slate-800 mb-1">{room.name}</h3>
                        <p className="text-sm text-slate-500 mb-3 line-clamp-2">{room.description}</p>
                        <div className="flex flex-wrap gap-3 text-xs text-slate-500 mb-3">
                            <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5 text-blue-500" />{room.capacity}</span>
                            <span className="flex items-center gap-1"><Maximize2 className="h-3.5 w-3.5 text-blue-500" />{room.size}</span>
                            <span className="flex items-center gap-1"><BedDouble className="h-3.5 w-3.5 text-blue-500" />{room.bedInfo}</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                            {room.amenities.slice(0, 4).map((a) => (
                                <span key={a} className="flex items-center gap-1 text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md">
                                    <Check className="h-3 w-3 text-emerald-500" />{a}
                                </span>
                            ))}
                            {room.amenities.length > 4 && (
                                <span className="text-xs text-slate-400 px-1">+{room.amenities.length - 4}</span>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
                        <div>
                            <span className="text-xl font-bold text-blue-600">
                                {room.pricePerNight.replace(" €/nuit", "")}
                            </span>
                            <span className="text-xs text-slate-400"> €/nuit</span>
                        </div>
                        <div className="flex gap-2">
                            <button
                                disabled={!room.isAvailable}
                                onClick={() => onRoomSelect(room.id)}
                                className={`text-xs px-3 py-1.5 rounded-xl border font-semibold transition-colors disabled:opacity-50 ${isSelected
                                    ? "bg-blue-50 border-blue-400 text-blue-700"
                                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                                    }`}
                            >
                                {isSelected ? "✓ Sélectionnée" : "Sélectionner"}
                            </button>
                            <button
                                disabled={!room.isAvailable}
                                onClick={() => onBook(room)}
                                data-cy="book-room"
                                className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors"
                            >
                                Réserver
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ══════════════════════════════════════════════════════ */
export function HotelDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { vm, onRoomSelect } = useHotelDetail(id!);
    const { setBookingContext } = useBookingStore();
    const { params } = useSearchStore();

    const handleBook = (room: RoomViewModel) => {
        setBookingContext({
            hotelId: vm.id, roomId: room.id, hotelName: vm.name, room,
            checkIn: params.checkIn ?? new Date(),
            checkOut: params.checkOut ?? new Date(Date.now() + 2 * 86400000),
            guestCount: params.guestCount ?? 2,
        });
        navigate(ROUTES.BOOKING);
    };

    if (vm.isLoading) return <DetailSkeleton />;

    if (vm.hasError) return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
            <p className="text-red-500">{vm.errorMessage}</p>
        </div>
    );

    /* Coordonnées — fallback Paris si absentes */
    const lat = vm.latitude ?? 48.8566;
    const lng = vm.longitude ?? 2.3522;

    return (
        <div className="min-h-screen bg-slate-50">

            {/* ── Galerie pleine largeur ── */}
            <div className="relative">
                <GalleryGrid images={vm.images} name={vm.name} />
                {/* Bouton retour flottant sur la galerie */}
                <button
                    onClick={() => navigate(-1)}
                    className="absolute top-4 left-4 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm text-slate-700 text-sm font-semibold px-3 py-2 rounded-xl shadow hover:bg-white transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Retour
                </button>
            </div>

            {/* ── Layout 2 colonnes ── */}
            <div className="mx-auto px-6 py-8" style={{ maxWidth: "1200px" }}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                    {/* ── Colonne gauche (2/3) : infos + chambres ── */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Nom + étoiles + note */}
                        <div>
                            <div className="flex items-start justify-between gap-4 mb-2">
                                <h1 className="text-3xl font-bold text-slate-800 leading-tight">{vm.name}</h1>
                                <div className="shrink-0 text-right">
                                    <div className="flex justify-end mb-1">
                                        {Array.from({ length: vm.stars }).map((_, i) => (
                                            <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                                        ))}
                                    </div>
                                    <div className="flex items-center gap-2 justify-end">
                                        <span className="bg-blue-600 text-white font-bold text-sm px-2.5 py-1 rounded-lg">
                                            {vm.rating.toFixed(1)}
                                        </span>
                                        <span className="text-sm text-slate-500">{vm.reviewCount}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-1.5 text-slate-500 text-sm">
                                <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
                                {vm.address}, {vm.city}, {vm.country}
                            </div>
                        </div>

                        {/* Description */}
                        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                            <h2 className="font-bold text-slate-800 mb-2">À propos</h2>
                            <p className="text-slate-600 leading-relaxed text-sm">{vm.description}</p>
                        </div>

                        {/* Équipements */}
                        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                            <h2 className="font-bold text-slate-800 mb-4">Équipements</h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                {vm.amenities.map((a) => (
                                    <div key={a} className="flex items-center gap-2.5 p-2.5 bg-slate-50 rounded-xl text-sm text-slate-700">
                                        <span className="text-blue-500 shrink-0">
                                            {AMENITY_ICONS[a] ?? <Check className="h-4 w-4" />}
                                        </span>
                                        {a}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Chambres */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold text-slate-800">
                                    Chambres disponibles
                                    <span className="ml-2 text-sm font-normal text-slate-400">
                                        ({vm.rooms.filter(r => r.isAvailable).length} dispo)
                                    </span>
                                </h2>
                            </div>
                            <div className="space-y-4">
                                {vm.rooms.map((room) => (
                                    <RoomCard
                                        key={room.id}
                                        room={room}
                                        isSelected={vm.selectedRoomId === room.id}
                                        onRoomSelect={onRoomSelect}
                                        onBook={handleBook}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ── Colonne droite (1/3) : sticky avec map + infos rapides ── */}
                    <div className="space-y-4 lg:sticky lg:top-6">

                        {/* Card prix + CTA */}
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                            <div className="flex items-baseline gap-1 mb-1">
                                <span className="text-3xl font-bold text-blue-600">
                                    {vm.rooms[0]?.pricePerNight.replace(" €/nuit", "") ?? "—"}
                                </span>
                                <span className="text-slate-400 text-sm">€ / nuit</span>
                            </div>
                            <p className="text-xs text-slate-400 mb-4">Prix à partir de · taxes incluses</p>
                            <button
                                onClick={() => {
                                    const available = vm.rooms.find(r => r.isAvailable);
                                    if (available) handleBook(available);
                                    else document.querySelector('[data-cy="book-room"]')?.scrollIntoView({ behavior: "smooth" });
                                }}
                                className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors text-sm"
                            >
                                Réserver maintenant
                            </button>
                            <p className="text-xs text-center text-slate-400 mt-2">Annulation gratuite disponible</p>
                        </div>

                        {/* Map */}
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
                            <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2 text-sm">
                                <MapPin className="h-4 w-4 text-blue-500" />
                                Localisation
                            </h3>
                            <HotelMap lat={lat} lng={lng} name={vm.name} />
                            <p className="text-xs text-slate-500 mt-3 leading-relaxed">
                                {vm.address}, {vm.city}
                            </p>
                        </div>

                        {/* Infos rapides */}
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
                            <h3 className="font-bold text-slate-800 mb-3 text-sm">Infos pratiques</h3>
                            <div className="space-y-2 text-sm text-slate-600">
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Check-in</span>
                                    <span className="font-medium">à partir de 15h00</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Check-out</span>
                                    <span className="font-medium">avant 12h00</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Animaux</span>
                                    <span className="font-medium">Non acceptés</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Fumeurs</span>
                                    <span className="font-medium">Interdit</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ── Galerie mosaïque ── */
function GalleryGrid({ images, name }: { images: string[]; name: string }) {
    const FALLBACK = "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800";
    const display = [...images, ...Array(Math.max(0, 5 - images.length)).fill(FALLBACK)].slice(0, 5);

    return (
        <div className="grid grid-cols-4 grid-rows-2 gap-1.5 h-[420px]">
            {/* Grande image gauche */}
            <div className="col-span-2 row-span-2 overflow-hidden">
                <img src={display[0]} alt={name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK; }}
                />
            </div>
            {/* 4 petites droite */}
            {display.slice(1).map((src, i) => (
                <div key={i} className="overflow-hidden">
                    <img src={src} alt={`${name} ${i + 2}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK; }}
                    />
                </div>
            ))}
        </div>
    );
}