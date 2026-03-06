/**
 * src/components/search/DateRangePicker.tsx
 * Sélecteur de plage de dates : arrivée → départ.
 *
 * Affiche deux champs (Arrivée / Départ) qui ouvrent un calendrier au clic.
 * Le calendrier est un popover simple sans dépendance externe lourde.
 * Sélection séquentielle : d'abord checkIn, puis checkOut.
 */
import { useState, useRef, useEffect } from "react";
import { Calendar } from "lucide-react";
import { format, addDays, isBefore, startOfDay } from "date-fns";
import { fr } from "date-fns/locale";

interface DateRangePickerProps {
    checkIn: Date | null;
    checkOut: Date | null;
    onChange: (checkIn: Date | null, checkOut: Date | null) => void;
    error?: string;
    height?: string;
}

export function DateRangePicker({ checkIn, checkOut, onChange, error, height = "h-12" }: DateRangePickerProps) {
    const [open, setOpen] = useState(false);
    const [selecting, setSelecting] = useState<"checkIn" | "checkOut">("checkIn");
    const ref = useRef<HTMLDivElement>(null);

    /* Ferme le calendrier au clic extérieur */
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    const handleDayClick = (date: Date) => {
        if (selecting === "checkIn") {
            onChange(date, null);
            setSelecting("checkOut");
        } else {
            /* checkOut doit être après checkIn */
            if (checkIn && isBefore(date, checkIn)) {
                onChange(date, null);
                setSelecting("checkOut");
            } else {
                onChange(checkIn, date);
                setSelecting("checkIn");
                setOpen(false);
            }
        }
    };

    /* Génère les 42 jours à partir d'aujourd'hui */
    const today = startOfDay(new Date());
    const days = Array.from({ length: 42 }, (_, i) => addDays(today, i));

    const formatDate = (d: Date | null) =>
        d ? format(d, "dd MMM", { locale: fr }) : null;

    const isDayDisabled = (day: Date) => isBefore(day, today);
    const isInRange = (day: Date) =>
        checkIn && checkOut && day > checkIn && day < checkOut;
    const isSelected = (day: Date) =>
        (checkIn && day.toDateString() === checkIn.toDateString()) ||
        (checkOut && day.toDateString() === checkOut.toDateString());

    return (
        <div ref={ref} className="relative">
            {/* Deux boutons : Arrivée / Départ */}
            <div className="flex">
                <button
                    type="button"
                    onClick={() => { setOpen(true); setSelecting("checkIn"); }}
                    data-cy="date-checkin"
                    className={`flex-1 flex items-center gap-2 pl-3 pr-2 border border-r-0 rounded-l-lg bg-muted/30 text-sm text-left focus:outline-none focus:ring-2 focus:ring-primary/40 ${height} ${error ? "border-destructive" : "border-input"
                        } ${selecting === "checkIn" && open ? "ring-2 ring-primary/40" : ""}`}
                >
                    <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className={checkIn ? "text-foreground" : "text-muted-foreground"}>
                        {formatDate(checkIn) ?? "Arrivée"}
                    </span>
                </button>

                <button
                    type="button"
                    onClick={() => { setOpen(true); setSelecting("checkOut"); }}
                    data-cy="date-checkout"
                    className={`flex-1 flex items-center gap-2 pl-3 pr-2 border rounded-r-lg bg-muted/30 text-sm text-left focus:outline-none focus:ring-2 focus:ring-primary/40 ${height} ${error ? "border-destructive" : "border-input"
                        } ${selecting === "checkOut" && open ? "ring-2 ring-primary/40" : ""}`}
                >
                    <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className={checkOut ? "text-foreground" : "text-muted-foreground"}>
                        {formatDate(checkOut) ?? "Départ"}
                    </span>
                </button>
            </div>

            {error && <p className="text-destructive text-xs mt-1">{error}</p>}

            {/* Calendrier popover */}
            {open && (
                <div className="absolute top-full left-0 mt-2 z-50 bg-white border rounded-xl shadow-xl p-4 w-80">
                    <p className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
                        {selecting === "checkIn" ? "Sélectionnez votre arrivée" : "Sélectionnez votre départ"}
                    </p>

                    {/* En-têtes des jours */}
                    <div className="grid grid-cols-7 gap-1 mb-1">
                        {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((d) => (
                            <div key={d} className="text-center text-xs text-muted-foreground font-medium py-1">
                                {d}
                            </div>
                        ))}
                    </div>

                    {/* Grille des jours */}
                    <div className="grid grid-cols-7 gap-1">
                        {days.map((day, i) => {
                            const disabled = isDayDisabled(day);
                            const selected = isSelected(day);
                            const inRange = isInRange(day);

                            return (
                                <button
                                    key={i}
                                    type="button"
                                    disabled={disabled}
                                    onClick={() => handleDayClick(day)}
                                    className={`text-xs h-8 w-8 rounded-md flex items-center justify-center transition-colors ${disabled
                                        ? "text-muted-foreground/40 cursor-not-allowed"
                                        : selected
                                            ? "bg-primary text-primary-foreground font-bold"
                                            : inRange
                                                ? "bg-primary/10 text-primary"
                                                : "hover:bg-muted"
                                        }`}
                                >
                                    {format(day, "d")}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}