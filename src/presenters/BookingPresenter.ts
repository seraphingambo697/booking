/**
 * src/presenters/BookingPresenter.ts
 * Presenter pour le tunnel de réservation multi-étapes.
 * Connecté au backend via BookingService → BookingRepository → bookingApi.
 */
import { IBookingPresenter } from "@/interfaces/presenters/IBookingPresenter";
import { IBookingService } from "@/interfaces/services/IBookingService";
import { BookingViewModel, BookingStepViewModel } from "@/viewmodels/BookingViewModel";
import { GuestInfo } from "@/core/entities/Booking";
import { formatPrice, formatDate, formatNights, formatGuests } from "@/lib/utils";

export class BookingPresenter implements IBookingPresenter {
    private vm: BookingViewModel = {
        hotelName: "", roomName: "", roomType: "",
        checkIn: "", checkOut: "", nights: "", guests: "",
        pricePerNight: "", basePrice: "", taxes: "", totalPrice: "", currency: "EUR",
        steps: [
            { id: 1, label: "Informations", isCompleted: false, isActive: true },
            { id: 2, label: "Récapitulatif", isCompleted: false, isActive: false },
            { id: 3, label: "Confirmation", isCompleted: false, isActive: false },
        ],
        currentStep: 1,
        isSubmitting: false,
        canSubmit: false,
        hasError: false,
    };

    private guestInfo: GuestInfo | null = null;
    private bookingContext: {
        hotelId: string;
        hotelName: string;
        room: any;
        checkIn: Date;
        checkOut: Date;
        guestCount: number;
    } | null = null;

    constructor(
        private bookingService: IBookingService,
        private onChange: (vm: BookingViewModel) => void,
        private onSuccess: (bookingId: string) => void
    ) { }

    init(hotelName: string, room: any, checkIn: Date, checkOut: Date, guestCount: number): void {
        this.bookingContext = {
            hotelId: room.hotelId ?? "",
            hotelName,
            room,
            checkIn,
            checkOut,
            guestCount,
        };

        // Calcule le prix via le service
        const price = this.bookingService.calculatePrice(room.priceRaw ?? room.pricePerNight, checkIn, checkOut);

        this.update({
            hotelName,
            roomName: room.name,
            roomType: room.type,
            checkIn: formatDate(checkIn),
            checkOut: formatDate(checkOut),
            nights: formatNights(price.nights),
            guests: formatGuests(guestCount),
            pricePerNight: formatPrice(room.priceRaw ?? room.pricePerNight),
            basePrice: formatPrice(price.basePrice),
            taxes: formatPrice(price.taxes),
            totalPrice: formatPrice(price.total),
        });
    }

    onGuestInfoChange(info: GuestInfo): void {
        this.guestInfo = info;
        const canSubmit = !!(
            info.firstName?.trim() &&
            info.lastName?.trim() &&
            info.email?.trim() &&
            info.phone?.trim()
        );
        this.update({ canSubmit });
    }

    onNextStep(): void {
        const next = Math.min(3, this.vm.currentStep + 1);
        this.update({ currentStep: next, steps: this.updateSteps(next) });
    }

    onPreviousStep(): void {
        const prev = Math.max(1, this.vm.currentStep - 1);
        this.update({ currentStep: prev, steps: this.updateSteps(prev) });
    }

    async onSubmit(userId: string): Promise<void> {
        if (!this.bookingContext) return;

        this.update({ isSubmitting: true, hasError: false });

        try {
            const { hotelId, hotelName, room, checkIn, checkOut, guestCount } = this.bookingContext;
            const price = this.bookingService.calculatePrice(
                room.priceRaw ?? room.pricePerNight,
                checkIn,
                checkOut
            );

            const booking = await this.bookingService.create({
                userId,
                hotelId,
                roomId: room.id,
                hotelName,
                roomName: room.name,
                checkIn,
                checkOut,
                guestCount,
                guestInfo: this.guestInfo ?? {
                    firstName: "", lastName: "", email: "", phone: "",
                },
                totalPrice: price.total,
                currency: "EUR",
            });

            this.update({ isSubmitting: false });
            this.onSuccess(booking.id);
        } catch (error: any) {
            this.update({
                isSubmitting: false,
                hasError: true,
                errorMessage: error.message ?? "La réservation a échoué. Veuillez réessayer.",
            });
        }
    }

    private updateSteps(activeStep: number): BookingStepViewModel[] {
        return this.vm.steps.map((step) => ({
            ...step,
            isCompleted: step.id < activeStep,
            isActive: step.id === activeStep,
        }));
    }

    private update(partial: Partial<BookingViewModel>): void {
        this.vm = { ...this.vm, ...partial };
        this.onChange(this.vm);
    }

    getViewModel(): BookingViewModel { return this.vm; }
}
