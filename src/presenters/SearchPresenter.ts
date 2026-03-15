/**
 * src/presenters/SearchPresenter.ts
 * Implémentation du presenter pour la barre de recherche.
 *
 * PATTERN : Le Presenter reçoit un callback onChange dans son constructeur.
 * À chaque modification, il met à jour son ViewModel interne et appelle onChange.
 * Le Hook React (useSearch) passe setViewModel comme callback → React re-render automatique.
 *
 * Ce pattern évite toute dépendance React dans le Presenter (pur TypeScript testable).
 */
import { ISearchPresenter } from "@/interfaces/presenters/ISearchPresenter";
import { SearchViewModel } from "@/viewmodels/SearchViewModel";

export class SearchPresenter implements ISearchPresenter {
  /** État interne du Presenter */
  private vm: SearchViewModel = {
    city: "",
    checkIn: null,
    checkOut: null,
    guestCount: 2,
    isValid: false,
  };

  /**
   * @param onChange Callback appelé à chaque modification du ViewModel.
   *                 Dans le hook useSearch, c'est le setState de React.
   */
  constructor(private onChange: (vm: SearchViewModel) => void) {}

  onCityChange(city: string): void {
    this.update({
      city,
      // Efface l'erreur si l'utilisateur commence à taper
      cityError: city.length === 0 ? "Veuillez entrer une destination" : undefined,
    });
    this.validate();
  }

  onDateChange(checkIn: Date | null, checkOut: Date | null): void {
    // Règle métier : checkOut doit être après checkIn
    let dateError: string | undefined;
    if (checkIn && checkOut && checkOut <= checkIn) {
      dateError = "La date de départ doit être après la date d'arrivée";
    }
    this.update({ checkIn, checkOut, dateError });
    this.validate();
  }

  onGuestCountChange(count: number): void {
    // Règle métier : entre 1 et 10 voyageurs
    this.update({ guestCount: Math.max(1, Math.min(10, count)) });
  }

  onSubmit(): void {
    // La navigation est gérée par le Hook (useSearch) qui connait React Router
    // Le Presenter valide uniquement, ne navigue pas directement
    this.validate();
  }

  /** Calcule si le formulaire peut être soumis */
  private validate(): void {
    const isValid =
      this.vm.city.trim().length > 0 &&
      this.vm.checkIn !== null &&
      this.vm.checkOut !== null &&
      !this.vm.dateError;
    this.update({ isValid });
  }

  /** Met à jour le ViewModel et notifie React */
  private update(partial: Partial<SearchViewModel>): void {
    this.vm = { ...this.vm, ...partial };
    this.onChange(this.vm);
  }

  getViewModel(): SearchViewModel {
    return this.vm;
  }
}
