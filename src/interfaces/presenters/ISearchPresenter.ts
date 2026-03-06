import { SearchViewModel } from "@/viewmodels/SearchViewModel";

export interface ISearchPresenter {
    onCityChange(city: string): void;
    onDateChange(checkIn: Date, checkOut: Date): void;
    onGuestCountChange(count: number): void;
    onSubmit(): void;
    getViewModel(): SearchViewModel;
}