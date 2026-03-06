import { HotelListViewModel } from "@/viewmodels/HotelListViewModel";
import { SearchParams } from "../repositories/IHotelRepository";
import { SortOption, HotelFilters } from "../services/IHotelService";

export interface IHotelListPresenter {
    loadHotels(params: SearchParams): Promise<void>;
    onSortChange(sort: SortOption): void;
    onFilterChange(filters: HotelFilters): void;
    getViewModel(): HotelListViewModel;
}