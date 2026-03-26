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
        <div ref={ref} className="relative w-full">
            <div className="flex gap-1 bg-gray-100 p-1 rounded-2xl">
                <button
                    data-cy="checkin-trigger"
                    type="button"
                    onClick={() => { setOpen(true); setSelecting("checkIn"); }}
                    className={`flex-1 flex items-center gap-3 px-4 rounded-xl text-left transition-all ${height} ${selecting === "checkIn" && open
                        ? "bg-white shadow-sm ring-2 ring-black"
                        : "bg-transparent hover:bg-gray-200"
                        } ${error ? "border-2 border-red-500" : ""}`}
                >
                    <Calendar className="h-5 w-5 text-gray-500" />
                    <div className="flex flex-col">
                        <span className="text-[10px] uppercase font-bold text-gray-400 leading-none mb-1">Arrivée</span>
                        <span className={`text-sm font-bold ${checkIn ? "text-black" : "text-gray-400"}`}>
                            {formatDate(checkIn) ?? "Ajouter"}
                        </span>
                    </div>
                </button>

                {/* Séparateur visuel */}
                <div className="w-[1px] h-8 bg-gray-300 self-center" />

                <button
                    data-cy="checkout-trigger"
                    type="button"
                    onClick={() => { setOpen(true); setSelecting("checkOut"); }}
                    className={`flex-1 flex items-center gap-3 px-4 rounded-xl text-left transition-all ${height} ${selecting === "checkOut" && open
                        ? "bg-white shadow-sm ring-2 ring-black"
                        : "bg-transparent hover:bg-gray-200"
                        } ${error ? "border-2 border-red-500" : ""}`}
                >
                    <Calendar className="h-5 w-5 text-gray-500" />
                    <div className="flex flex-col">
                        <span className="text-[10px] uppercase font-bold text-gray-400 leading-none mb-1">Départ</span>
                        <span className={`text-sm font-bold ${checkOut ? "text-black" : "text-gray-400"}`}>
                            {formatDate(checkOut) ?? "Ajouter"}
                        </span>
                    </div>
                </button>
            </div>

            {open && (
                <div className="absolute top-[calc(100%+10px)] left-0 z-[100] bg-white border-2 border-gray-100 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] p-6 w-[340px] animate-in fade-in zoom-in duration-200">
                    <div className="flex justify-between items-center mb-6">
                        <p className="text-sm font-black uppercase tracking-widest text-black">
                            {selecting === "checkIn" ? "Date d'arrivée" : "Date de départ"}
                        </p>
                    </div>

                    <div className="grid grid-cols-7 gap-1 mb-2">
                        {["LU", "MA", "ME", "JE", "VE", "SA", "DI"].map((d) => (
                            <div key={d} className="text-center text-[10px] font-black text-gray-400 py-2">
                                {d}
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 gap-1">
                        {days.map((day, i) => {
                            const disabled = isDayDisabled(day);
                            const selected = isSelected(day);
                            const inRange = isInRange(day);

                            return (
                                <button
                                    data-cy="calendar-day"
                                    key={i}
                                    type="button"
                                    disabled={disabled}
                                    onClick={() => handleDayClick(day)}
                                    className={`text-xs h-10 w-10 rounded-xl flex items-center justify-center transition-all ${disabled
                                        ? "text-gray-200 cursor-not-allowed"
                                        : selected
                                            ? "bg-black text-white font-black scale-110 shadow-lg"
                                            : inRange
                                                ? "bg-gray-100 text-black font-bold"
                                                : "hover:bg-gray-100 text-gray-800 font-medium"
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