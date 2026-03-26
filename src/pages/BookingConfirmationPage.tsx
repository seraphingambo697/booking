import { useParams, useNavigate } from "react-router-dom";
import { BookOpen } from "lucide-react";
import { BookingConfirmationCard } from "@/components/booking/BookingConfirmation";
import { useBookingConfirmation } from "@/hooks/useBookingConfirmation";
import { ROUTES } from "@/router/routes";

export function BookingConfirmationPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { vm, onCancel } = useBookingConfirmation(id!);

    if (vm.isLoading) return (
        <div className="container py-16 max-w-2xl space-y-4 animate-pulse">
            <div className="h-16 w-16 rounded-full bg-muted mx-auto" />
            <div className="h-8 bg-muted rounded w-1/2 mx-auto" />
            <div className="h-48 bg-muted rounded-xl" />
        </div>
    );

    if (vm.hasError) return (
        <div className="container py-8">
            <p className="text-destructive">{vm.errorMessage}</p>
        </div>
    );

    return (
        <div className="container py-12">
            <BookingConfirmationCard vm={vm} onCancel={onCancel} />
            <div className="max-w-2xl mx-auto mt-6 flex gap-3 justify-center flex-wrap">
                <button onClick={() => navigate(ROUTES.MY_BOOKINGS)}
                    data-cy="booking-confirm-btn"
                    className="border px-4 py-2 rounded-md text-sm font-medium hover:bg-accent flex items-center gap-2">
                    <BookOpen className="h-4 w-4" /> Mes réservations
                </button>
                <button onClick={() => navigate(ROUTES.HOME)}
                    className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium">
                    Retour à l'accueil
                </button>
            </div>
        </div>
    );
}