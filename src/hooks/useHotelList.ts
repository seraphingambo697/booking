/**
 * src/hooks/useHotelList.ts
 * Hook React pour la liste des hôtels.
 *
 * Lance le chargement automatiquement quand les paramètres changent.
 * useEffect avec les paramètres comme dépendances → reload si la ville change.
 */
import { useState, useRef, useEffect, useCallback } from "react";
import { HotelListPresenter } from "@/presenters/HotelListPresenter";
import { HotelListViewModel } from "@/viewmodels/HotelListViewModel";
import { HotelRepository } from "@/repositories/HotelRepository";
import { HotelService } from "@/services/HotelService";
import { SearchParams } from "@/interfaces/repositories/IHotelRepository";
import { SortOption, HotelFilters } from "@/interfaces/services/IHotelService";

/* Singletons — instanciés une seule fois au niveau du module */
const hotelRepo = new HotelRepository();
const hotelService = new HotelService(hotelRepo);

export function useHotelList(params: Partial<SearchParams>) {
  const [vm, setVm] = useState<HotelListViewModel>({
    hotels: [], isLoading: false, hasError: false,
    totalResults: "", isEmpty: false,
    currentSort: { field: "rating", direction: "desc" },
    activeFilters: {},
  });

  const presenterRef = useRef(new HotelListPresenter(hotelService, setVm));

  /* Recharge les hôtels quand les paramètres de recherche changent */
  useEffect(() => {
    if (params.city !== undefined) {
      presenterRef.current.loadHotels({
        city: params.city ?? "",
        checkIn: params.checkIn ?? new Date(),
        checkOut: params.checkOut ?? new Date(),
        guestCount: params.guestCount ?? 2,
      });
    }
  }, [params.city, params.checkIn?.toISOString(), params.checkOut?.toISOString(), params.guestCount]);

  /* useCallback stabilise les références de fonctions (évite les re-renders inutiles) */
  const onSort = useCallback((sort: SortOption) => {
    presenterRef.current.onSortChange(sort);
  }, []);

  const onFilter = useCallback((filters: HotelFilters) => {
    presenterRef.current.onFilterChange(filters);
  }, []);

  return { vm, onSort, onFilter };
}
