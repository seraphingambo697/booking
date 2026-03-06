/**
 * src/store/searchStore.ts
 *
 * Store Zustand pour les paramètres de recherche.
 *
 * Persiste les critères de recherche entre les pages :
 * HomePage (saisie) → SearchResultsPage (résultats) → HotelDetailPage (contexte)
 *
 * Sans ce store, les paramètres seraient perdus à chaque navigation.
 * Alternative : les passer en query params dans l'URL (plus SEO-friendly).
 */

import { create } from "zustand";
import { SearchParams } from "@/interfaces/repositories/IHotelRepository";

interface SearchStore {
    /** Paramètres de recherche courants (partiels car pas toujours complets) */
    params: Partial<SearchParams>;

    /** Met à jour les paramètres (merge avec les existants) */
    setParams: (params: Partial<SearchParams>) => void;

    /** Remet les paramètres à zéro */
    reset: () => void;
}

export const useSearchStore = create<SearchStore>((set) => ({
    // Valeurs par défaut
    params: { city: "", guestCount: 2 },

    setParams: (newParams) =>
        set((state) => ({
            params: { ...state.params, ...newParams },
        })),

    reset: () =>
        set({ params: { city: "", guestCount: 2 } }),
}));