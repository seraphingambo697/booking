/**
 * src/components/search/GuestSelector.tsx
 * Sélecteur de nombre de voyageurs avec boutons +/−.
 *
 * Ouvre un petit popover au clic.
 * Min : 1 voyageur / Max : 10 voyageurs.
 */
import { useState, useRef, useEffect } from "react";
import { Users, Minus, Plus } from "lucide-react";

interface GuestSelectorProps {
    count: number;
    onChange: (count: number) => void;
    height?: string;
}

export function GuestSelector({ count, onChange, height = "h-12" }: GuestSelectorProps) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    /* Ferme le popover au clic extérieur */
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const label = count === 1 ? "1 voyageur" : `${count} voyageurs`;

    return (
        <div ref={ref} className="relative">
            {/* Bouton d'ouverture */}
            <button
                type="button"
                onClick={() => setOpen(!open)}
                data-cy="guest-selector"
                className={`w-full flex items-center gap-2 pl-3 pr-3 border border-gray-200 rounded-lg bg-slate-50 text-sm text-left hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/40 ${height}`}
            >
                <Users className="h-4 w-4 text-gray-400 shrink-0" />
                <span className="text-gray-800">{label}</span>
            </button>

            {/* Popover */}
            {open && (
                <div className="absolute top-full left-0 mt-2 z-50 bg-white border rounded-xl shadow-xl p-4 w-56">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                        Voyageurs
                    </p>

                    <div className="flex items-center justify-between">
                        {/* Bouton − */}
                        <button
                            type="button"
                            onClick={() => onChange(Math.max(1, count - 1))}
                            disabled={count <= 1}
                            data-cy="guest-decrease"
                            className="h-8 w-8 border rounded-md flex items-center justify-center hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                            <Minus className="h-4 w-4" />
                        </button>

                        {/* Compteur */}
                        <div className="text-center">
                            <span className="text-2xl font-bold">{count}</span>
                            <p className="text-xs text-muted-foreground">
                                {count === 1 ? "voyageur" : "voyageurs"}
                            </p>
                        </div>

                        {/* Bouton + */}
                        <button
                            type="button"
                            onClick={() => onChange(Math.min(10, count + 1))}
                            disabled={count >= 10}
                            data-cy="guest-increase"
                            className="h-8 w-8 border rounded-md flex items-center justify-center hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                            <Plus className="h-4 w-4" />
                        </button>
                    </div>

                    {/* Fermer */}
                    <button
                        onClick={() => setOpen(false)}
                        className="mt-4 w-full text-sm text-primary hover:underline text-center"
                    >
                        Valider
                    </button>
                </div>
            )}
        </div>
    );
}