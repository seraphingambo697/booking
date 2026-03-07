/**
 * src/pages/MyBookingsPage.tsx
 * Page "Mes réservations" — redesignée, pleine largeur, moderne.
 */
import { useNavigate } from "react-router-dom";
import { BookOpen, Calendar, Moon, Hotel, ArrowRight, Tag } from "lucide-react";
import { useState, useEffect } from "react";
import { MyBookingsViewModel, BookingSummaryViewModel } from "@/viewmodels/BookingSummaryViewModel";
import { BookingRepository } from "@/repositories/BookingRepository";
import { BookingService } from "@/services/BookingService";
import { BookingStatus } from "@/core/enums/BookingStatus";
import { useAuthStore } from "@/store/authStore";
import { ROUTES } from "@/router/routes";
import { countNights } from "@/lib/dateUtils";
import { formatDate, formatNights, formatPrice } from "@/lib/formatters";

const bookingRepo = new BookingRepository();
const bookingService = new BookingService(bookingRepo);

/* Couleurs de statut */
const STATUS_STYLES: Record<string, { label: string; bg: string; text: string; dot: string }> = {
    [BookingStatus.CONFIRMED]: { label: "Confirmée", bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
    [BookingStatus.PENDING]: { label: "En attente", bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-400" },
    [BookingStatus.CANCELLED]: { label: "Annulée", bg: "bg-red-50", text: "text-red-600", dot: "bg-red-500" },
    [BookingStatus.COMPLETED]: { label: "Terminée", bg: "bg-slate-100", text: "text-slate-500", dot: "bg-slate-400" },
};

export function MyBookingsPage() {
    const navigate = useNavigate();
    const { userId } = useAuthStore();
    const [vm, setVm] = useState<MyBookingsViewModel>({
        bookings: [], isLoading: true, hasError: false, isEmpty: false,
    });

    useEffect(() => {
        bookingService.getByUserId(userId ?? "u1").then((bookings) => {
            setVm({
                isLoading: false, hasError: false,
                isEmpty: bookings.length === 0,
                bookings: bookings.map((b) => {
                    const nights = countNights(b.checkIn, b.checkOut);
                    const s = STATUS_STYLES[b.status] ?? STATUS_STYLES[BookingStatus.COMPLETED];
                    return {
                        id: b.id,
                        bookingRef: `LX-${b.id.toUpperCase()}`,
                        hotelName: b.hotelName,
                        roomName: b.roomName,
                        checkIn: formatDate(b.checkIn),
                        checkOut: formatDate(b.checkOut),
                        nights: formatNights(nights),
                        totalPrice: formatPrice(b.totalPrice, b.currency),
                        status: s.label,
                        statusColor: "default" as BookingSummaryViewModel["statusColor"],
                        canCancel: b.status === BookingStatus.CONFIRMED || b.status === BookingStatus.PENDING,
                        _statusStyle: s,
                    } as BookingSummaryViewModel & { _statusStyle: typeof s };
                }),
            });
        }).catch(() => {
            setVm((v) => ({ ...v, isLoading: false, hasError: true, errorMessage: "Erreur de chargement." }));
        });
    }, [userId]);

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="mx-auto px-6 py-8" style={{ maxWidth: "900px" }}>

                {/* ── Header ── */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Mes réservations</h1>
                        {!vm.isLoading && !vm.isEmpty && (
                            <p className="text-slate-500 text-sm mt-0.5">
                                {vm.bookings.length} réservation{vm.bookings.length > 1 ? "s" : ""} au total
                            </p>
                        )}
                    </div>
                    <button
                        onClick={() => navigate(ROUTES.HOME)}
                        className="flex items-center gap-2 bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors"
                    >
                        <Hotel className="h-4 w-4" />
                        Réserver un hôtel
                    </button>
                </div>

                {/* ── Skeletons ── */}
                {vm.isLoading && (
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white rounded-2xl p-5 border border-slate-100 animate-pulse">
                                <div className="flex justify-between mb-3">
                                    <div className="space-y-2">
                                        <div className="h-4 bg-slate-200 rounded w-40" />
                                        <div className="h-3 bg-slate-200 rounded w-28" />
                                    </div>
                                    <div className="h-6 bg-slate-200 rounded-lg w-24" />
                                </div>
                                <div className="flex gap-4 mt-4">
                                    <div className="h-3 bg-slate-200 rounded w-36" />
                                    <div className="h-3 bg-slate-200 rounded w-16" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* ── État vide ── */}
                {vm.isEmpty && !vm.isLoading && (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                            <BookOpen className="h-7 w-7 text-slate-300" />
                        </div>
                        <h2 className="text-lg font-bold text-slate-800 mb-1">Aucune réservation</h2>
                        <p className="text-slate-500 text-sm mb-5">Commencez à explorer nos hôtels !</p>
                        <button
                            onClick={() => navigate(ROUTES.HOME)}
                            className="bg-blue-600 text-white px-5 py-2 rounded-xl font-semibold hover:bg-blue-700 transition-colors text-sm"
                        >
                            Trouver un hôtel
                        </button>
                    </div>
                )}

                {/* ── Liste des réservations ── */}
                {!vm.isLoading && !vm.isEmpty && (
                    <div className="space-y-3">
                        {(vm.bookings as Array<BookingSummaryViewModel & { _statusStyle?: typeof STATUS_STYLES[string] }>).map((booking) => {
                            const style = booking._statusStyle ?? STATUS_STYLES[BookingStatus.COMPLETED];
                            return (
                                <div
                                    key={booking.id}
                                    className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
                                >
                                    {/* Barre colorée en haut selon statut */}
                                    <div className={`h-1 w-full ${style.dot}`} />

                                    <div className="p-5">
                                        {/* ── Ligne 1 : hôtel + statut + prix ── */}
                                        <div className="flex items-start justify-between gap-4 mb-3">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <h3 className="font-bold text-slate-800 text-base leading-tight">
                                                        {booking.hotelName}
                                                    </h3>
                                                    {/* Badge statut */}
                                                    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${style.bg} ${style.text}`}>
                                                        <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
                                                        {booking.status}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-slate-500 mt-0.5">{booking.roomName}</p>
                                            </div>

                                            {/* Prix + ref */}
                                            <div className="text-right shrink-0">
                                                <p className="text-xl font-bold text-blue-600">{booking.totalPrice}</p>
                                                <p className="text-xs text-slate-400 font-mono mt-0.5">{booking.bookingRef}</p>
                                            </div>
                                        </div>

                                        {/* ── Ligne 2 : dates + nuits + bouton ── */}
                                        <div className="flex items-center justify-between flex-wrap gap-3 pt-3 border-t border-slate-100">
                                            <div className="flex items-center gap-4 text-sm text-slate-500">
                                                <span className="flex items-center gap-1.5">
                                                    <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                                                    {booking.checkIn} → {booking.checkOut}
                                                </span>
                                                <span className="flex items-center gap-1.5">
                                                    <Moon className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                                                    {booking.nights}
                                                </span>
                                            </div>

                                            <button
                                                onClick={() => navigate(ROUTES.BOOKING_CONFIRMATION(booking.id))}
                                                className="flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                                            >
                                                Voir les détails
                                                <ArrowRight className="h-3.5 w-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}