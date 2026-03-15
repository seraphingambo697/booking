/**
 * src/lib/dateUtils.ts
 * Utilitaires spécifiques à la manipulation des dates.
 *
 * Centralisés ici pour faciliter les tests unitaires
 * et éviter la duplication dans les Presenters.
 */
import { addDays, isBefore, isAfter, startOfDay } from "date-fns";

/**
 * Vérifie si une date est dans le passé (avant aujourd'hui).
 * Utilisé pour désactiver les jours passés dans le calendrier.
 */
export function isPastDate(date: Date): boolean {
    return isBefore(startOfDay(date), startOfDay(new Date()));
}

/**
 * Vérifie si une date de départ est valide par rapport à l'arrivée.
 * @param checkIn Date d'arrivée
 * @param checkOut Date de départ souhaitée
 * @returns true si checkOut est strictement après checkIn
 */
export function isValidCheckOut(checkIn: Date, checkOut: Date): boolean {
    return isAfter(checkOut, checkIn);
}

/**
 * Retourne la date de départ minimum suggérée (lendemain de l'arrivée).
 * @param checkIn Date d'arrivée sélectionnée
 */
export function getMinCheckOut(checkIn: Date): Date {
    return addDays(checkIn, 1);
}

/**
 * Retourne la date d'arrivée minimum (aujourd'hui).
 */
export function getMinCheckIn(): Date {
    return startOfDay(new Date());
}

/**
 * Re-export depuis utils.ts pour compatibilité des imports existants.
 * Les fonctions résident dans utils.ts mais sont accessibles depuis dateUtils.ts.
 */
export { countNights } from "@/lib/utils";