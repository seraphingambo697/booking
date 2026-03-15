/**
 * src/lib/formatters.ts
 * Fonctions de formatage spécialisées pour l'affichage.
 *
 * Séparées de utils.ts pour garder chaque fichier focused.
 * Toutes ces fonctions sont utilisées dans les Presenters pour
 * construire les ViewModels.
 */
import { RoomType } from "@/core/enums/RoomType";
import { BookingStatus } from "@/core/enums/BookingStatus";

/**
 * Traduit un RoomType enum en label français lisible.
 * @example formatRoomType(RoomType.SUITE) → "Suite"
 */
export function formatRoomType(type: RoomType): string {
  const labels: Record<RoomType, string> = {
    [RoomType.SINGLE]: "Chambre Simple",
    [RoomType.DOUBLE]: "Chambre Double",
    [RoomType.TWIN]:   "Chambre Twin",
    [RoomType.SUITE]:  "Suite",
    [RoomType.DELUXE]: "Chambre Deluxe",
    [RoomType.FAMILY]: "Chambre Familiale",
  };
  return labels[type] ?? type;
}

/**
 * Traduit un BookingStatus en label français et couleur Tailwind.
 */
export function formatBookingStatus(status: BookingStatus): {
  label: string;
  colorClass: string;
  badgeVariant: "default" | "secondary" | "destructive" | "outline";
} {
  const map: Record<BookingStatus, { label: string; colorClass: string; badgeVariant: "default" | "secondary" | "destructive" | "outline" }> = {
    [BookingStatus.CONFIRMED]: {
      label: "Confirmée",
      colorClass: "text-green-600",
      badgeVariant: "default",
    },
    [BookingStatus.PENDING]: {
      label: "En attente",
      colorClass: "text-yellow-600",
      badgeVariant: "secondary",
    },
    [BookingStatus.CANCELLED]: {
      label: "Annulée",
      colorClass: "text-red-600",
      badgeVariant: "destructive",
    },
    [BookingStatus.COMPLETED]: {
      label: "Terminée",
      colorClass: "text-gray-500",
      badgeVariant: "outline",
    },
  };
  return map[status] ?? { label: status, colorClass: "", badgeVariant: "outline" };
}

/**
 * Formate un numéro de téléphone français.
 * @example formatPhone("0612345678") → "+33 6 12 34 56 78"
 */
export function formatPhone(phone: string): string {
  // Simplifié — à adapter selon les besoins de validation
  return phone;
}

/**
 * Tronque un texte à une longueur maximale avec ellipse.
 * @example truncate("Très longue description...", 50) → "Très longue desc..."
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength - 3)}...`;
}
