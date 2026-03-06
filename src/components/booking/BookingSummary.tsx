/**
 * src/components/booking/BookingSummary.tsx
 * Récapitulatif de réservation affiché en sidebar.
 *
 * Toutes les valeurs sont déjà formatées dans le ViewModel.
 * Ce composant ne fait qu'afficher.
 */
import { Hotel, Calendar, Users, Moon } from "lucide-react";
import { BookingViewModel } from "@/viewmodels/BookingViewModel";

interface BookingSummaryProps {
    vm: BookingViewModel;
}

export function BookingSummary({ vm }: BookingSummaryProps) {
    return (
        <div className="bg-white border rounded-xl p-5 sticky top-24 space-y-4">
            <h3 className="font-semibold text-base">Récapitulatif</h3>

            {/* Hôtel + chambre */}
            <div className="space-y-1.5">
                <div className="flex items-start gap-2">
                    <Hotel className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <div>
                        <p className="font-medium text-sm">{vm.hotelName}</p>
                        <p className="text-xs text-muted-foreground">{vm.roomName}</p>
                    </div>
                </div>
            </div>

            <div className="border-t" />

            {/* Dates */}
            <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4 text-primary shrink-0" />
                    <span>Arrivée :</span>
                    <span className="font-medium text-foreground ml-auto">{vm.checkIn}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4 text-primary shrink-0" />
                    <span>Départ :</span>
                    <span className="font-medium text-foreground ml-auto">{vm.checkOut}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                    <Moon className="h-4 w-4 text-primary shrink-0" />
                    <span>Durée :</span>
                    <span className="font-medium text-foreground ml-auto">{vm.nights}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="h-4 w-4 text-primary shrink-0" />
                    <span>Voyageurs :</span>
                    <span className="font-medium text-foreground ml-auto">{vm.guests}</span>
                </div>
            </div>

            <div className="border-t" />

            {/* Détail du prix */}
            <div className="space-y-2 text-sm">
                <div className="flex justify-between text-muted-foreground">
                    <span>{vm.pricePerNight} × {vm.nights}</span>
                    <span>{vm.basePrice}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                    <span>Taxes (10%)</span>
                    <span>{vm.taxes}</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-bold text-base">
                    <span>Total</span>
                    <span className="text-primary">{vm.totalPrice}</span>
                </div>
            </div>
        </div>
    );
}