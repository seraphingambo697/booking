/**
 * src/lib/dateUtils.ts
 *
 * Utilitaires de manipulation et de calcul de dates.
 *
 * Toutes les fonctions retournent des valeurs brutes (nombre, Date).
 * Le formatage visuel (string) est dans formatters.ts.
 *
 * Utilise date-fns pour des calculs précis qui gèrent :
 * - Les fuseaux horaires
 * - Les années bissextiles
 * - Les changements d'heure (été/hiver)
 */

import { differenceInDays, addDays, isAfter, isBefore, isSameDay } from "date-fns";

/**
 * Calcule le nombre de nuits entre deux dates.
 * Minimum 1 nuit (même si checkIn = checkOut).
 *
 * @param checkIn - Date d'arrivée
 * @param checkOut - Date de départ
 * @returns Nombre de nuits (≥ 1)
 */
export function countNights(checkIn: Date, checkOut: Date): number {
    return Math.max(1, differenceInDays(checkOut, checkIn));
}

/**
 * Retourne la date minimale de départ (lendemain du check-in).
 * Utilisée pour désactiver les dates invalides dans le DatePicker.
 *
 * @param checkIn - Date d'arrivée sélectionnée
 * @returns Date minimum de départ
 */
export function getMinCheckOut(checkIn: Date): Date {
    return addDays(checkIn, 1);
}

/**
 * Vérifie si une date est dans le passé.
 * Utilisée pour désactiver les dates passées dans le calendrier.
 *
 * @param date - Date à vérifier
 * @returns true si la date est passée
 */
export function isPastDate(date: Date): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return isBefore(date, today);
}

/**
 * Vérifie si une date est comprise dans une plage.
 * Utilisée pour mettre en surbrillance les dates entre checkIn et checkOut.
 *
 * @param date - Date à tester
 * @param start - Début de la plage
 * @param end - Fin de la plage
 * @returns true si la date est dans la plage
 */
export function isInRange(date: Date, start: Date, end: Date): boolean {
    return isAfter(date, start) && isBefore(date, end);
}

/**
 * Retourne aujourd'hui à minuit (pour des comparaisons propres).
 */
export function getToday(): Date {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
}