/**
 * src/presenters/SearchPresenter.ts
 *
 * Presenter de la barre de recherche.
 *
 * Gère l'état du formulaire de recherche et sa validation.
 * Ne fait pas d'appel API — il prépare juste les paramètres
 * pour que le hook useSearch puisse naviguer vers /search.
 *
 * Pattern de notification :
 * Le presenter appelle onChange(newViewModel) à chaque mise à jour.
 * Le hook useSearch passe setState comme onChange → React re-render.
 */

import { ISearchPresenter } from "@/interfaces/presenters/ISearchPresenter";
import { SearchViewModel } from "@/viewmodels/SearchViewModel";

export class SearchPresenter implements ISearchPresenter {
    /** État interne du ViewModel */
    private vm: SearchViewModel = {
        city: "",
        checkIn: null,
        checkOut: null,
        guestCount: 2,
        isValid: false,
    };

    /**
     * @param onChange - Callback appelé à chaque mise à jour du ViewModel
     *                   → passe React setState dans le hook
     */
    constructor(private onChange: (vm: SearchViewModel) => void) { }

    onCityChange(city: string): void {
        this.update({
            city,
            cityError: city.trim() ? undefined : "Veuillez entrer une destination",
        });
        this.validate();
    }

    onDateChange(checkIn: Date | null, checkOut: Date | null): void {
        this.update({ checkIn, checkOut, dateError: undefined });
        this.validate();
    }

    onGuestCountChange(count: number): void {
        // Contrainte métier : entre 1 et 10 voyageurs
        this.update({ guestCount: Math.max(1, Math.min(10, count)) });
    }

    onSubmit(): void {
        // La navigation est gérée dans le hook useSearch (nécessite useNavigate)
        // Le presenter valide mais ne navigue pas (pas de dépendance React Router)
        this.validate();
    }

    /** Recalcule isValid à partir de l'état courant */
    private validate(): void {
        const isValid =
            this.vm.city.trim().length > 0 &&
            this.vm.checkIn !== null &&
            this.vm.checkOut !== null;
        this.update({ isValid });
    }

    /** Met à jour le ViewModel et notifie la vue */
    private update(partial: Partial<SearchViewModel>): void {
        this.vm = { ...this.vm, ...partial };
        this.onChange(this.vm);
    }

    getViewModel(): SearchViewModel {
        return this.vm;
    }
}