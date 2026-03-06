/**
 * src/lib/formatters.ts
 *
 * Fonctions de formatage pour l'affichage UI.
 *
 * Ces fonctions transforment des valeurs brutes (number, Date)
 * en strings prêtes à afficher.
 *
 * Règle : appelées UNIQUEMENT dans les Presenters, jamais dans les composants.
 * Si un composant a besoin d'une valeur formatée, le Presenter la met
 * directement dans le ViewModel sous forme de string.
 *
 * Utilise l'API Intl native pour le formatage monétaire (respect des locales).
 */

import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { countNights } from "@/lib/dateUtils";

/**
 * Formate un montant en devise locale.
 * Utilise l'API Intl.NumberFormat pour respecter les conventions locales.
 *
 * @param amount - Montant brut (ex: 350)
 * @param currency - Code devise ISO (ex: "EUR")
 * @returns Montant formaté (ex: "350 €" en locale fr-FR)
 */
export function formatPrice(amount: number, currency: string = "EUR"): string {
    return new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency,
        maximumFractionDigits: 0,
    }).format(amount);
}

/**
 * Formate une date en format long lisible.
 * Utilisé dans les récapitulatifs de réservation.
 *
 * @param date - Date à formater
 * @returns Ex: "lun. 3 mars 2025"
 */
export function formatDate(date: Date): string {
    return format(date, "EEE d MMM yyyy", { locale: fr });
}

/**
 * Formate une date en format court pour les inputs.
 *
 * @param date - Date à formater
 * @returns Ex: "03/03/2025"
 */
export function formatDateShort(date: Date): string {
    return format(date, "dd/MM/yyyy");
}

/**
 * Formate une durée de séjour.
 *
 * @param nights - Nombre de nuits
 * @returns Ex: "1 nuit" ou "4 nuits"
 */
export function formatNights(nights: number): string {
    return nights === 1 ? "1 nuit" : `${nights} nuits`;
}

/**
 * Formate le nombre de voyageurs.
 *
 * @param count - Nombre de voyageurs
 * @returns Ex: "1 voyageur" ou "3 voyageurs"
 */
export function formatGuests(count: number): string {
    return count === 1 ? "1 voyageur" : `${count} voyageurs`;
}

/**
 * Formate un nombre d'avis pour l'affichage compact.
 *
 * @param count - Nombre brut d'avis
 * @returns Ex: "1.3k avis" si count >= 1000, "876 avis" sinon
 */
export function formatReviewCount(count: number): string {
    if (count >= 1000) return `${(count / 1000).toFixed(1)}k avis`;
    return `${count} avis`;
}

/**
 * Génère les initiales d'un nom complet.
 * Utilisé pour l'avatar dans le Header.
 *
 * @param firstName - Prénom
 * @param lastName - Nom
 * @returns Ex: "MD" pour "Marie Dupont"
 */
export function getInitials(firstName: string, lastName: string): string {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

/**
 * Formate un résumé de période avec le nombre de nuits.
 *
 * @param checkIn - Date d'arrivée
 * @param checkOut - Date de départ
 * @returns Ex: "3 mars → 7 mars (4 nuits)"
 */
export function formatDateRange(checkIn: Date, checkOut: Date): string {
    const nights = countNights(checkIn, checkOut);
    const from = format(checkIn, "d MMM", { locale: fr });
    const to = format(checkOut, "d MMM", { locale: fr });
    return `${from} → ${to} (${formatNights(nights)})`;
}