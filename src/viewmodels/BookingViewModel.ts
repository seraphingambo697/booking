/**
 * src/viewmodels/BookingViewModel.ts
 *
 * ViewModel du tunnel de réservation (BookingPage).
 *
 * Toutes les données financières sont formatées (string) sauf aucune :
 * une fois dans ce ViewModel, le composant n'a jamais à calculer.
 *
 * La gestion des étapes (steps) est aussi dans le ViewModel :
 * le composant BookingSteps lit steps[] et affiche l'indicateur visuel
 * sans aucune logique de quel step est actif.
 */

/** Représentation d'une étape dans le stepper visuel */
export interface BookingStepViewModel {
    /** Numéro de l'étape (1, 2, 3) */
    id: number;

    /** Label affiché : "Informations", "Récapitulatif", "Confirmation" */
    label: string;

    /** true si l'étape est terminée → affiche une coche verte */
    isCompleted: boolean;

    /** true si c'est l'étape courante → mise en valeur visuelle */
    isActive: boolean;
}

export interface BookingViewModel {
    /** Nom de l'hôtel */
    hotelName: string;

    /** Nom de la chambre */
    roomName: string;

    /** Type de chambre : "SUITE" */
    roomType: string;

    /** Date arrivée formatée : "lun. 3 mars 2025" */
    checkIn: string;

    /** Date départ formatée */
    checkOut: string;

    /** Durée formatée : "4 nuits" */
    nights: string;

    /** Voyageurs formatés : "2 voyageurs" */
    guests: string;

    /** Prix par nuit formaté : "350 €" */
    pricePerNight: string;

    /** Prix de base formaté : "1 400 €" */
    basePrice: string;

    /** Taxes formatées : "140 €" */
    taxes: string;

    /** Total formaté : "1 540 €" */
    totalPrice: string;

    /** Code devise (pour référence) */
    currency: string;

    /** État des étapes du stepper */
    steps: BookingStepViewModel[];

    /** Étape courante (1, 2 ou 3) */
    currentStep: number;

    /** true pendant la soumission → désactive le bouton, affiche un spinner */
    isSubmitting: boolean;

    /**
     * true si le formulaire est complet et peut être soumis.
     * Calculé par le Presenter quand guestInfo est valide.
     */
    canSubmit: boolean;

    /** true si une erreur est survenue lors de la soumission */
    hasError: boolean;

    /** Message d'erreur à afficher */
    errorMessage?: string;
}