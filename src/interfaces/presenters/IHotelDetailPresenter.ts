import { HotelDetailViewModel } from "@/viewmodels/HotelDetailViewModel";

export interface IHotelDetailPresenter {
    loadHotel(id: string, checkIn: Date, checkOut: Date, guestCount: number): Promise<void>;
    onRoomSelect(roomId: string): void;
    getViewModel(): HotelDetailViewModel;
}