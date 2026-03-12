/**
 * src/components/search/GuestSelector.tsx
 * Sélecteur de nombre de voyageurs avec boutons +/−.
 *
 * Ouvre un petit popover au clic.
 * Min : 1 personne / Max : 10 personnes.
 */
import { useState, useRef, useEffect } from "react";
import { Users, Minus, Plus } from "lucide-react";

interface GuestSelectorProps {
    count: number;
    onChange: (count: number) => void;
    height?: string;
}

export function GuestSelector({ count, onChange, height = "h-14" }: GuestSelectorProps) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const label = count === 1 ? "1 personne" : `${count} personnes`;

    return (
        <div ref={ref} className="relative w-full">
            <button
                type="button"
                onClick={() => setOpen(!open)}
                className={`w-full flex items-center gap-3 px-4 rounded-2xl transition-all border-2 ${open
                    ? "bg-white border-black shadow-sm"
                    : "bg-gray-100 border-transparent hover:bg-gray-200"
                    } ${height}`}
            >
                <Users className="h-5 w-5 text-gray-500 shrink-0" />
                <div className="flex flex-col text-left">
                    <span className="text-[10px] uppercase font-black text-gray-400 leading-none mb-1">Voyageurs</span>
                    <span className="text-sm font-bold text-black">{label}</span>
                </div>
            </button>

            {open && (
                <div className="absolute top-[calc(100%+10px)] left-0 md:right-0 z-[100] bg-white border-2 border-gray-100 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.2)] p-6 w-64 animate-in fade-in zoom-in duration-200">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">
                        Nombre de personnes
                    </p>

                    <div className="flex items-center justify-between bg-gray-50 p-4 rounded-2xl">
                        <button
                            type="button"
                            onClick={() => onChange(Math.max(1, count - 1))}
                            disabled={count <= 1}
                            className="h-10 w-10 border-2 border-gray-200 rounded-xl flex items-center justify-center hover:border-black hover:bg-black hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-all"
                        >
                            <Minus className="h-4 w-4 stroke-[3px]" />
                        </button>

                        <div className="text-center">
                            <span className="text-2xl font-black text-black leading-none">{count}</span>
                        </div>

                        {/* Bouton + */}
                        <button
                            type="button"
                            onClick={() => onChange(Math.min(10, count + 1))}
                            disabled={count >= 10}
                            className="h-10 w-10 border-2 border-gray-200 rounded-xl flex items-center justify-center hover:border-black hover:bg-black hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-all"
                        >
                            <Plus className="h-4 w-4 stroke-[3px]" />
                        </button>
                    </div>

                    <button
                        onClick={() => setOpen(false)}
                        className="mt-4 w-full py-3 bg-black text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-gray-800 transition-colors shadow-lg shadow-black/10"
                    >
                        Valider
                    </button>
                </div>
            )}
        </div>
    );
}