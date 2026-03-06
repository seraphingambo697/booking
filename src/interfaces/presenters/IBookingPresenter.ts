import { BookingViewModel } from "@/viewmodels/BookingViewModel";
import { GuestInfo } from "@/core/entities/Booking";

export interface IBookingPresenter {
    initBooking(hotelId: string, roomId: string, checkIn: Date, checkOut: Date, guestCount: number): Promise<void>;
    onGuestInfoChange(info: GuestInfo): void;
    onNextStep(): void;
    onPreviousStep(): void;
    onSubmit(): Promise<void>;
    getViewModel(): BookingViewModel;
}