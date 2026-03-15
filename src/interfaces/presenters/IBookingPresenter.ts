
import { BookingViewModel } from "@/viewmodels/BookingViewModel";
import { GuestInfo } from "@/core/entities/Booking";

export interface IBookingPresenter {
    init(hotelName: string, room: any, checkIn: Date, checkOut: Date, guestCount: number): void;
    onGuestInfoChange(info: GuestInfo): void;
    onNextStep(): void;
    onPreviousStep(): void;
    onSubmit(userId: string): Promise<void>;
    getViewModel(): BookingViewModel;
}