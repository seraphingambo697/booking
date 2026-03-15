/**
 * src/store/searchStore.ts
 * Store Zustand pour les paramètres de recherche.
 *
 * Persiste les critères de recherche entre les pages :
 * - HomePage : l'utilisateur remplit le formulaire et cherche
 * - SearchResultsPage : lit les params pour charger les hôtels
 * - HotelDetailPage : conserve les dates pour pré-remplir la réservation
 *
 * Alternative aux query params URL (plus simple pour les dates).
 */
import { create } from "zustand";
import { SearchParams } from "@/interfaces/repositories/IHotelRepository";

interface SearchStore {
  /** Paramètres courants de recherche (partiels car l'utilisateur peut chercher sans tout remplir) */
  params: Partial<SearchParams>;

  /** Met à jour les paramètres (merge partiel) */
  setParams: (params: Partial<SearchParams>) => void;

  /** Réinitialise à l'état initial */
  reset: () => void;
}

const DEFAULT_PARAMS: Partial<SearchParams> = {
  city: "",
  guestCount: 2,
};

export const useSearchStore = create<SearchStore>((set) => ({
  params: DEFAULT_PARAMS,

  /** Merge partiel : setParams({ city: "Paris" }) ne perd pas les autres params */
  setParams: (params) =>
    set((state) => ({ params: { ...state.params, ...params } })),

  reset: () => set({ params: DEFAULT_PARAMS }),
}));
