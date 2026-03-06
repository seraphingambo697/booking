/**
 * src/viewmodels/BookingConfirmationViewModel.ts
 *
 * ViewModel de la page de confirmation (après réservation).
 *
 * statusColor est une classe CSS Tailwind précalculée par le Presenter.
 * Le composant écrit juste : <span className={vm.statusColor}>{vm.status}</span>
 * Sans aucune logique de "si CONFIRMED alors vert, si CANCELLED alors rouge".
 */

export interface BookingConfirmationViewModel {
    /** ID technique de la réservation */
    bookingId: string;

    /** Référence lisible : "LX-B1ABC2" */
    bookingRef: string;

    hotelName: string;
    roomName: string;

    /** Date arrivée formatée : "lun. 3 mars 2025" */
    checkIn: string;

    /** Date départ formatée */
    checkOut: string;

    /** Durée : "4 nuits" */
    nights: string;

    /** Voyageurs : "2 voyageurs" */
    guests: string;

    /** Total formaté : "1 540 €" */
    totalPrice: string;

    /** Label du statut : "Confirmée", "Annulée"... */
    status: string;

    /**
     * Classe CSS Tailwind pour colorier le statut.
     * Ex: "text-green-600", "text-red-600"
     * Le Presenter calcule la couleur selon BookingStatus.
     */
    statusColor: string;

    /** Nom complet du voyageur : "Marie Dupont" */
    guestName: string;

    /** Email du voyageur */
    guestEmail: string;

    /**
     * true si la réservation peut encore être annulée.
     * CONFIRMED ou PENDING → canCancel = true
     * CANCELLED ou COMPLETED → canCancel = false
     */
    canCancel: boolean;

    isLoading: boolean;
    hasError: boolean;
    errorMessage?: string;
}