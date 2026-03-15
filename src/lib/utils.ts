/**
 * src/lib/utils.ts
 * Utilitaires partagés dans toute l'application.
 *
 * Contient :
 * - cn() : fusion de classes Tailwind (requis par shadcn/ui)
 * - Fonctions de formatage utilisées par les Presenters
 *
 * Ces fonctions sont PURES (pas d'effet de bord, pas de state)
 * et facilement testables unitairement.
 */
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, differenceInDays } from "date-fns";
import { fr } from "date-fns/locale";

/**
 * Fusionne des classes CSS Tailwind de manière intelligente.
 * Résout les conflits (ex: "p-4 p-6" → "p-6").
 * Requis par shadcn/ui pour tous ses composants.
 *
 * @example cn("flex p-4", isActive && "bg-primary", "text-sm")
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Formate un montant en devise lisible.
 * @example formatPrice(1540, "EUR") → "1 540 €"
 */
export function formatPrice(amount: number, currency: string = "EUR"): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency,
    maximumFractionDigits: 0, // Pas de centimes pour les hôtels
  }).format(amount);
}

/**
 * Formate une date au format long en français.
 * @example formatDate(new Date("2025-06-15")) → "dim. 15 juin 2025"
 */
export function formatDate(date: Date): string {
  return format(date, "EEE d MMM yyyy", { locale: fr });
}

/**
 * Formate une date au format court pour les formulaires.
 * @example formatDateShort(new Date("2025-06-15")) → "15/06/2025"
 */
export function formatDateShort(date: Date): string {
  return format(date, "dd/MM/yyyy");
}

/**
 * Calcule le nombre de nuits entre deux dates.
 * @returns Minimum 1 nuit (jamais 0 même si même jour)
 */
export function countNights(checkIn: Date, checkOut: Date): number {
  return Math.max(1, differenceInDays(checkOut, checkIn));
}

/**
 * Formate un nombre de nuits.
 * @example formatNights(1) → "1 nuit" | formatNights(4) → "4 nuits"
 */
export function formatNights(nights: number): string {
  return nights === 1 ? "1 nuit" : `${nights} nuits`;
}

/**
 * Formate un nombre de voyageurs.
 * @example formatGuests(1) → "1 voyageur" | formatGuests(3) → "3 voyageurs"
 */
export function formatGuests(count: number): string {
  return count === 1 ? "1 voyageur" : `${count} voyageurs`;
}

/**
 * Formate un nombre d'avis de manière compacte.
 * @example formatReviewCount(1284) → "1,3k avis" | formatReviewCount(142) → "142 avis"
 */
export function formatReviewCount(count: number): string {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k avis`;
  }
  return `${count} avis`;
}

/**
 * Génère les initiales d'un utilisateur pour l'Avatar.
 * @example getInitials("Marie", "Dupont") → "MD"
 */
export function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}
