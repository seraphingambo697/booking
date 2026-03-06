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
            {/* ── En-tête vert ── */}
            <div className="bg-green-50 border-b px-8 py-8 text-center">
                <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-3" />
                <h1 className="text-2xl font-bold text-green-700">Réservation confirmée !</h1>
                <p className="text-green-600 mt-1">
                    Un email de confirmation a été envoyé à{" "}
                    <strong>{vm.guestEmail}</strong>
                </p>

                {/* Référence */}
                <div className="mt-4 inline-block bg-white border rounded-full px-5 py-2">
                    <span className="text-sm text-muted-foreground">Référence : </span>
                    <span className="font-bold font-mono text-primary">{vm.bookingRef}</span>
                </div>
            </div>

            {/* ── Détails de la réservation ── */}
            <div className="px-8 py-6 space-y-4">
                {/* Hôtel + chambre */}
                <div className="flex justify-between">
                    <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">Hôtel</p>
                        <p className="font-semibold">{vm.hotelName}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">Chambre</p>
                        <p className="font-semibold">{vm.roomName}</p>
                    </div>
                </div>

                <div className="border-t" />

                {/* Informations séjour */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4 text-primary shrink-0" />
                        <span>Arrivée : <strong className="text-foreground">{vm.checkIn}</strong></span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4 text-primary shrink-0" />
                        <span>Départ : <strong className="text-foreground">{vm.checkOut}</strong></span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Moon className="h-4 w-4 text-primary shrink-0" />
                        <span>Durée : <strong className="text-foreground">{vm.nights}</strong></span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Users className="h-4 w-4 text-primary shrink-0" />
                        <span>Voyageurs : <strong className="text-foreground">{vm.guests}</strong></span>
                    </div>
                </div>

                <div className="border-t" />

                {/* Voyageur principal */}
                <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Voyageur principal</p>
                    <p className="font-medium">{vm.guestName}</p>
                </div>

                <div className="border-t" />

                {/* Prix + statut */}
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs text-muted-foreground mb-0.5 flex items-center gap-1">
                            <Tag className="h-3.5 w-3.5" /> Statut
                        </p>
                        <span className={`font-semibold ${vm.statusColor}`}>{vm.status}</span>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-muted-foreground mb-0.5">Total payé</p>
                        <p className="text-2xl font-bold text-primary">{vm.totalPrice}</p>
                    </div>
                </div>
            </div>

            {/* ── Actions ── */}
            {vm.canCancel && (
                <div className="px-8 pb-6">
                    <button
                        onClick={onCancel}
                        data-cy="cancel-booking"
                        className="w-full border border-destructive text-destructive rounded-md py-2.5 text-sm font-medium hover:bg-destructive/5 transition-colors"
                    >
                        Annuler cette réservation
                    </button>
                </div>
            )}
        </div>
    );
}