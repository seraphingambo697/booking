/**
 * src/types/common.types.ts
 *
 * Types communs réutilisables dans toute l'application.
 *
 * Contient des types utilitaires génériques qui ne sont pas
 * liés à un domaine métier spécifique.
 */

/** État de chargement générique */
export type LoadingState = "idle" | "loading" | "success" | "error";

/** Résultat d'une opération asynchrone (pattern Result) */
export type Result<T, E = Error> =
    | { success: true; data: T }
    | { success: false; error: E };

/** Options pour les composants Select/Dropdown */
export interface SelectOption<T = string> {
    value: T;
    label: string;
    disabled?: boolean;
}

/** Coordonnées GPS */
export interface Coordinates {
    latitude: number;
    longitude: number;
}

/** Plage de prix */
export interface PriceRange {
    min: number;
    max: number;
    currency: string;
}

/** Props communes aux composants avec état de chargement */
export interface AsyncComponentProps {
    isLoading: boolean;
    hasError: boolean;
    errorMessage?: string;
}

/** Props communes à tous les composants de page */
export interface PageProps {
    title?: string;
}