/**
 * src/components/room/RoomDetails.tsx
 * Panneau de détail complet d'une chambre (carousel photos + toutes les infos).
 *
 * Peut être utilisé dans un drawer/modal pour afficher tous les détails
 * sans naviguer vers une autre page.
 */
import { useState } from "react";
import { ChevronLeft, ChevronRight, Users, Maximize2, BedDouble, Check } from "lucide-react";
import { RoomViewModel } from "@/viewmodels/RoomViewModel";

interface RoomDetailsProps {
    room: RoomViewModel;
}

export function RoomDetails({ room }: RoomDetailsProps) {
    const [currentImg, setCurrentImg] = useState(0);

    const prevImg = () => setCurrentImg((i) => (i - 1 + room.images.length) % room.images.length);
    const nextImg = () => setCurrentImg((i) => (i + 1) % room.images.length);

    return (
        <div className="space-y-5">
            {/* ── Carousel de photos ── */}
            {room.images.length > 0 && (
                <div className="relative h-56 rounded-xl overflow-hidden group">
                    <img
                        src={room.images[currentImg]}
                        alt={`${room.name} photo ${currentImg + 1}`}
                        className="w-full h-full object-cover"
                    />

                    {room.images.length > 1 && (
                        <>
                            <button
                                onClick={prevImg}
                                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </button>
                            <button
                                onClick={nextImg}
                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </button>

                            {/* Indicateurs */}
                            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                                {room.images.map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setCurrentImg(i)}
                                        className={`h-1.5 rounded-full transition-all ${i === currentImg ? "w-4 bg-white" : "w-1.5 bg-white/60"
                                            }`}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </div>
            )}

            {/* ── Informations ── */}
            <div>
                <h3 className="font-bold text-xl mb-2">{room.name}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{room.description}</p>
            </div>

            {/* ── Caractéristiques ── */}
            <div className="grid grid-cols-3 gap-3">
                {[
                    { icon: <Users className="h-5 w-5" />, label: room.capacity },
                    { icon: <Maximize2 className="h-5 w-5" />, label: room.size },
                    { icon: <BedDouble className="h-5 w-5" />, label: room.bedInfo },
                ].map(({ icon, label }) => (
                    <div key={label} className="bg-muted/30 rounded-lg p-3 text-center">
                        <div className="flex justify-center text-primary mb-1">{icon}</div>
                        <p className="text-xs font-medium">{label}</p>
                    </div>
                ))}
            </div>

            {/* ── Équipements complets ── */}
            <div>
                <h4 className="font-semibold mb-2">Équipements inclus</h4>
                <div className="grid grid-cols-2 gap-1.5">
                    {room.amenities.map((a) => (
                        <div key={a} className="flex items-center gap-2 text-sm">
                            <Check className="h-4 w-4 text-primary shrink-0" />
                            <span>{a}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Prix ── */}
            <div className="flex justify-between items-center pt-3 border-t">
                <span className="text-muted-foreground text-sm">Prix par nuit</span>
                <span className="text-2xl font-bold text-primary">{room.pricePerNight}</span>
            </div>
        </div>
    );
}