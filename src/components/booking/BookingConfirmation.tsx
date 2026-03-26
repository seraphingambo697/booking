/**
 * src/components/booking/BookingConfirmation.tsx
 * Carte de confirmation de réservation.
 *
 * Affichée sur BookingConfirmationPage après une réservation réussie.
 * Toutes les données viennent du BookingConfirmationViewModel (déjà formatées).
 */


import { CheckCircle2, Calendar, Users, Moon, Tag } from "lucide-react";
import { BookingConfirmationViewModel } from "@/viewmodels/BookingConfirmationViewModel";

interface BookingConfirmationCardProps {
    vm: BookingConfirmationViewModel;
    onCancel: () => void;
}

export function BookingConfirmationCard({ vm, onCancel }: BookingConfirmationCardProps) {
    return (
        <div className="max-w-2xl mx-auto bg-white border rounded-2xl overflow-hidden shadow-sm">

            {/* ── En-tête ── */}
            <div className="bg-green-50 border-b px-8 py-8 text-center">
                <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-3" />
                <h1 className="text-2xl font-bold text-green-700">
                    Réservation confirmée !
                </h1>

                <p className="text-green-600 mt-1">
                    Email envoyé à <strong>{vm.guestEmail}</strong>
                </p>

                {/* ✅ SUMMARY ROOT */}
                <div
                    data-cy="booking-summary"
                    className="mt-4 inline-block bg-white border rounded-full px-5 py-2"
                >
                    <span className="text-sm text-muted-foreground">
                        Référence :
                    </span>

                    {/* ✅ ID */}
                    <span
                        data-cy="booking-id"
                        className="font-bold font-mono text-primary ml-1"
                    >
                        {vm.bookingRef}
                    </span>
                </div>
            </div>

            {/* ── Contenu ── */}
            <div className="px-8 py-6 space-y-4">

                {/* Hôtel */}
                <div className="flex justify-between">
                    <div>
                        <p className="text-xs text-muted-foreground">Hôtel</p>
                        <p className="font-semibold">{vm.hotelName}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-muted-foreground">Chambre</p>
                        <p className="font-semibold">{vm.roomName}</p>
                    </div>
                </div>

                <div className="border-t" />

                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div
                        data-cy="booking-checkin"
                        className="flex items-center gap-2"
                    >
                        <Calendar className="h-4 w-4 text-primary" />
                        Arrivée : <strong>{vm.checkIn}</strong>
                    </div>

                    <div
                        data-cy="booking-checkout"
                        className="flex items-center gap-2"
                    >
                        <Calendar className="h-4 w-4 text-primary" />
                        Départ : <strong>{vm.checkOut}</strong>
                    </div>

                    <div className="flex items-center gap-2">
                        <Moon className="h-4 w-4 text-primary" />
                        {vm.nights}
                    </div>

                    <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-primary" />
                        {vm.guests}
                    </div>
                </div>

                <div className="border-t" />

                {/* Voyageur */}
                <div>
                    <p className="text-xs text-muted-foreground">Voyageur</p>
                    <p className="font-medium">{vm.guestName}</p>
                </div>

                <div className="border-t" />

                {/* ✅ PRICE */}
                <div className="flex justify-between items-center">
                    <div>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Tag className="h-3.5 w-3.5" />
                            Statut
                        </p>
                        <span className={`font-semibold ${vm.statusColor}`}>
                            {vm.status}
                        </span>
                    </div>

                    <div
                        data-cy="booking-price"
                        className="text-right"
                    >
                        <p className="text-xs text-muted-foreground">
                            Total payé
                        </p>
                        <p className="text-2xl font-bold text-primary">
                            {vm.totalPrice}
                        </p>
                    </div>
                </div>
            </div>

            {/* ── Actions ── */}
            {vm.canCancel && (
                <div className="px-8 pb-6">
                    <button
                        onClick={onCancel}
                        data-cy="cancel-booking"
                        className="w-full border border-destructive text-destructive rounded-md py-2.5 text-sm font-medium"
                    >
                        Annuler cette réservation
                    </button>
                </div>
            )}
        </div>
    );
}