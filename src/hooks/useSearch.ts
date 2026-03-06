/**
 * src/hooks/useSearch.ts
 *
 * Hook : barre de recherche (HomePage).
 *
 * Glue entre SearchPresenter et le composant SearchBar.
 * Gère aussi la navigation vers /search après soumission.
 *
 * Pattern :
 * 1. useState → stocke le ViewModel (React réactif)
 * 2. useRef → crée le Presenter une seule fois (pas recréé à chaque render)
 * 3. Le Presenter appelle setState quand le ViewModel change
 * 4. React re-render → le composant reçoit le nouveau ViewModel
 */

import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { SearchPresenter } from "@/presenters/SearchPresenter";
import { SearchViewModel } from "@/viewmodels/SearchViewModel";
import { useSearchStore } from "@/store/searchStore";
import { ROUTES } from "@/router/routes";

export function useSearch() {
    const navigate = useNavigate();
    const { setParams } = useSearchStore();

    // ViewModel initial
    const [vm, setVm] = useState<SearchViewModel>({
        city: "", checkIn: null, checkOut: null, guestCount: 2, isValid: false,
    });

    // useRef → le Presenter n'est créé qu'une fois
    const presenterRef = useRef(new SearchPresenter(setVm));

    // Soumission : persiste les params dans le store et navigue
    const handleSubmit = useCallback(() => {
        if (!vm.isValid) return;
        setParams({
            city: vm.city,
            checkIn: vm.checkIn!,
            checkOut: vm.checkOut!,
            guestCount: vm.guestCount,
        });
        navigate(ROUTES.SEARCH);
    }, [vm, setParams, navigate]);

    return {
        vm,
        presenter: presenterRef.current,
        handleSubmit,
    };
}