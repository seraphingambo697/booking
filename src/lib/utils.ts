/**
 * src/lib/utils.ts
 *
 * Fonction utilitaire principale : cn()
 * Générée par shadcn/ui et utilisée dans tous les composants UI.
 *
 * cn() combine clsx (gestion conditionnelle des classes CSS)
 * et twMerge (résolution des conflits Tailwind).
 *
 * Exemple :
 * cn("px-4 py-2", isActive && "bg-primary", className)
 * → "px-4 py-2 bg-primary" si isActive = true
 *
 * twMerge résout les conflits :
 * cn("px-4", "px-8") → "px-8" (pas "px-4 px-8")
 */

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combine et déduplique les classes CSS Tailwind.
 * Usage standard dans tous les composants shadcn/ui.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}