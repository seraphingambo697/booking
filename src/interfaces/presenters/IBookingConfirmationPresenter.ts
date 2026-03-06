import { BookingConfirmationViewModel } from "@/viewmodels/BookingConfirmationViewModel";

export interface IBookingConfirmationPresenter {
    loadConfirmation(bookingId: string): Promise<void>;
    onCancel(bookingId: string): Promise<void>;
    getViewModel(): BookingConfirmationViewModel;
}