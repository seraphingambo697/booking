/**
 * src/viewmodels/BookingSummaryViewModel.ts
 *
 * ViewModel d'une réservation dans la liste "Mes réservations".
 *
 * Plus léger que BookingConfirmationViewModel :
 * on affiche moins d'informations dans la liste que dans le détail.
 *
 * statusColor est typé avec les variantes de Badge shadcn/ui
 * pour un typage strict des props du composant Badge.
 */

/** ViewModel d'une ligne dans la liste des réservations */
export interface BookingSummaryViewModel {
    id: string;

    /** Référence lisible : "LX-B1ABC2" */
    bookingRef: string;

    hotelName: string;
    roomName: string;

    checkIn: string;
    checkOut: string;

    /** "4 nuits" */
    nights: string;

    /** "1 540 €" */
    totalPrice: string;

    /** "Confirmée", "En attente"... */
    status: string;

    /**
     * Variante du composant Badge shadcn/ui.
     * Typé strictement pour correspondre aux props du composant.
     */
    statusColor: "default" | "secondary" | "destructive" | "outline";

    /** true si l'annulation est possible depuis la liste */
    canCancel: boolean;
}

/** ViewModel de la page "Mes réservations" */
export interface MyBookingsViewModel {
    bookings: BookingSummaryViewModel[];
    isLoading: boolean;
    hasError: boolean;
    errorMessage?: string;

    /** true si l'utilisateur n'a aucune réservation → état vide */
    isEmpty: boolean;
}