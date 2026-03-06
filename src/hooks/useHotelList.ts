/**
 * src/hooks/useHotelList.ts
 *
 * Hook : liste des hôtels (SearchResultsPage).
 *
 * Lance le chargement automatiquement quand les params changent (useEffect).
 * Expose onSort et onFilter pour les interactions UI.
 *
 * Les singletons (hotelService) sont créés une fois en dehors du hook
 * pour éviter des re-créations inutiles.
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { HotelListPresenter } from "@/presenters/HotelListPresenter";
import { HotelListViewModel } from "@/viewmodels/HotelListViewModel";
import { HotelService } from "@/services/HotelService";
import { HotelRepository } from "@/repositories/HotelRepository";
import { SearchParams } from "@/interfaces/repositories/IHotelRepository";
import { SortOption, HotelFilters } from "@/interfaces/services/IHotelService";

// ── Singletons — créés une seule fois pour toute l'application ────────────────
const hotelRepository = new HotelRepository();
const hotelService = new HotelService(hotelRepository);

export function useHotelList(params: Partial<SearchParams>) {
    const [vm, setVm] = useState<HotelListViewModel>({
        hotels: [], isLoading: false, hasError: false,
        totalResults: "", isEmpty: false,
        currentSort: { field: "rating", direction: "desc" },
        activeFilters: {},
    });

    const presenterRef = useRef(new HotelListPresenter(hotelService, setVm));

    // Recharge quand les paramètres de recherche changent
    useEffect(() => {
        if (params.city !== undefined) {
            presenterRef.current.loadHotels({
                city: params.city ?? "",
                checkIn: params.checkIn ?? new Date(),
                checkOut: params.checkOut ?? new Date(Date.now() + 86400000 * 2),
                guestCount: params.guestCount ?? 2,
            });
        }
    }, [params.city, params.checkIn, params.checkOut, params.guestCount]);

    const onSort = useCallback(
        (sort: SortOption) => presenterRef.current.onSortChange(sort),
        []
    );

    const onFilter = useCallback(
        (filters: HotelFilters) => presenterRef.current.onFilterChange(filters),
        []
    );

    return { vm, onSort, onFilter };
}