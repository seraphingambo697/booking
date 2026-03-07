/**
 * src/presenters/BookingPresenter.ts
 *
 * Presenter du tunnel de réservation multi-étapes.
 *
 * Gère :
 * 1. L'initialisation avec le contexte (hôtel, chambre, dates)
 * 2. Le formulaire GuestInfo et sa validation
 * 3. La navigation entre les étapes (onNextStep / onPreviousStep)
 * 4. La soumission finale et la redirection vers la confirmation
 *
 * onSuccess est injecté pour découpler le presenter de React Router.
 * Le hook useBooking passe navigate() comme onSuccess.
 */

import { IBookingPresenter } from "@/interfaces/presenters/IBookingPresenter";
import { BookingViewModel, BookingStepViewModel } from "@/viewmodels/BookingViewModel";
import { GuestInfo } from "@/core/entities/Booking";
import { RoomViewModel } from "@/viewmodels/RoomViewModel";
import { formatPrice, formatDate, formatNights, formatGuests } from "@/lib/formatters";
import { IBookingService } from "@/interfaces/services/IBookingService";

/** Contexte de réservation stocké en mémoire */
interface BookingContext {
    hotelName: string;
    room: RoomViewModel;
    checkIn: Date;
    checkOut: Date;
    guestCount: number;
}

export class BookingPresenter implements IBookingPresenter {
    private vm: BookingViewModel = {
        hotelName: "", roomName: "", roomType: "",
        checkIn: "", checkOut: "", nights: "", guests: "",
        pricePerNight: "", basePrice: "", taxes: "", totalPrice: "", currency: "EUR",
        steps: this.buildInitialSteps(),
        currentStep: 1,
        isSubmitting: false, canSubmit: false, hasError: false,
    };

    private guestInfo: GuestInfo | null = null;
    private context: BookingContext | null = null;

    constructor(
        private bookingService: IBookingService,
        private onChange: (vm: BookingViewModel) => void,
        /** Callback de navigation après succès — reçoit l'id de la réservation */
        private onSuccess: (bookingId: string) => void
    ) { }

    init(
        hotelName: string,
        room: RoomViewModel,
        checkIn: Date,
        checkOut: Date,
        guestCount: number
    ): void {
        this.context = { hotelName, room, checkIn, checkOut, guestCount };

        // Calcule le prix dès l'initialisation
        const price = this.bookingService.calculatePrice(room.priceRaw, checkIn, checkOut);

        this.update({
            hotelName,
            roomName: room.name,
            roomType: room.type,
            // Dates formatées pour l'affichage
            checkIn: formatDate(checkIn),
            checkOut: formatDate(checkOut),
            nights: formatNights(price.nights),
            guests: formatGuests(guestCount),
            // Prix formatés
            pricePerNight: formatPrice(room.priceRaw),
            basePrice: formatPrice(price.basePrice),
            taxes: formatPrice(price.taxes),
            totalPrice: formatPrice(price.total),
        });
    }

    onGuestInfoChange(info: GuestInfo): void {
        this.guestInfo = info;
        // Valide que tous les champs requis sont remplis
        const isValid =
            info.firstName.trim().length > 0 &&
            info.lastName.trim().length > 0 &&
            info.email.includes("@") &&
            info.phone.trim().length > 0;
        this.update({ canSubmit: isValid });
    }

    onNextStep(): void {
        const next = Math.min(3, this.vm.currentStep + 1);
        this.update({
            currentStep: next,
            steps: this.updateSteps(next),
        });
    }

    onPreviousStep(): void {
        const prev = Math.max(1, this.vm.currentStep - 1);
        this.update({
            currentStep: prev,
            steps: this.updateSteps(prev),
        });
    }

    async onSubmit(userId: string): Promise<void> {
        if (!this.guestInfo || !this.context) return;

        this.update({ isSubmitting: true, hasError: false });

        try {
            const { hotelName, room, checkIn, checkOut, guestCount } = this.context;
            const price = this.bookingService.calculatePrice(room.priceRaw, checkIn, checkOut);

            const booking = await this.bookingService.create({
                userId,
                hotelId: room.id.substring(0, 2),  // "r1" → "h1" (simplification mock)
                roomId: room.id,
                hotelName,
                roomName: room.name,
                checkIn,
                checkOut,
                guestCount,
                guestInfo: this.guestInfo,
                totalPrice: price.total,
                currency: "EUR",
            });

            this.update({ isSubmitting: false });
            // Redirige vers la page de confirmation
            this.onSuccess(booking.id);
        } catch (error: any) {
            this.update({
                isSubmitting: false,
                hasError: true,
                errorMessage: error.message ?? "Une erreur est survenue lors de la réservation.",
            });
        }
    }

    /** Construit les étapes initiales du stepper */
    private buildInitialSteps(): BookingStepViewModel[] {
        return [
            { id: 1, label: "Informations", isCompleted: false, isActive: true },
            { id: 2, label: "Récapitulatif", isCompleted: false, isActive: false },
            { id: 3, label: "Confirmation", isCompleted: false, isActive: false },
        ];
    }

    /** Met à jour les étapes selon l'étape courante */
    private updateSteps(currentStep: number): BookingStepViewModel[] {
        return this.vm.steps.map((step) => ({
            ...step,
            isCompleted: step.id < currentStep,
            isActive: step.id === currentStep,
        }));
    }

    private update(partial: Partial<BookingViewModel>): void {
        this.vm = { ...this.vm, ...partial };
        this.onChange(this.vm);
    }

    getViewModel(): BookingViewModel {
        return this.vm;
    }
}