/**
 * src/hooks/useSearch.ts
 * Hook React — pont entre SearchPresenter et les composants.
 *
 * PATTERN DES HOOKS :
 * 1. useState : stocke le ViewModel (état React réactif)
 * 2. useRef : stocke le Presenter (instance stable, ne change pas entre les renders)
 * 3. Le Presenter reçoit setState comme callback → met à jour React quand il change
 *
 * Pourquoi useRef pour le Presenter ?
 * - Le Presenter doit être instancié UNE SEULE FOIS
 * - useState recréerait le Presenter à chaque render
 * - useRef conserve la même instance pendant toute la vie du composant
 */
import { useState, useRef, useCallback } from "react";
import { SearchPresenter } from "@/presenters/SearchPresenter";
import { SearchViewModel } from "@/viewmodels/SearchViewModel";

export function useSearch() {
  const [vm, setVm] = useState<SearchViewModel>({
    city: "", checkIn: null, checkOut: null, guestCount: 2, isValid: false,
  });

  /* useRef garantit que la même instance de Presenter est utilisée à chaque render */
  const presenterRef = useRef(new SearchPresenter(setVm));

  return {
    vm,
    presenter: presenterRef.current,
  };
}
