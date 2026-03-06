/**
 * src/pages/BookingConfirmationPage.tsx
 * Page affichée après une réservation confirmée.
 */

import { useParams, useNavigate } from "react-router-dom";
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { BookingConfirmationCard } from "@/components/booking/BookingConfirmation";
import { useBookingConfirmation } from "@/hooks/useBookingConfirmation";
import { ROUTES } from "@/router/routes";

export function BookingConfirmationPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { vm, onCancel } = useBookingConfirmation(id!);

    if (vm.isLoading) {
        return (
            <div className="container py-16 max-w-2xl space-y-4">
                <Skeleton className="h-16 w-16 rounded-full mx-auto" />
                <Skeleton className="h-8 w-1/2 mx-auto" />
                <Skeleton className="h-48 w-full rounded-xl" />
            </div>
        );
    }

    if (vm.hasError) {
        return (
            <div className="container py-8">
                <Alert variant="destructive">
                    <AlertDescription>{vm.errorMessage}</AlertDescription>
                </Alert>
            </div>
        );
    }

    return (
        <div className="container py-12">
            <BookingConfirmationCard vm={vm} onCancel={onCancel} />
            <div className="max-w-2xl mx-auto mt-6 flex gap-3 justify-center">
                <Button variant="outline" onClick={() => navigate(ROUTES.MY_BOOKINGS)}>
                    <BookOpen className="h-4 w-4 mr-2" /> Mes réservations
                </Button>
                <Button onClick={() => navigate(ROUTES.HOME)}>Retour à l'accueil</Button>
            </div>
        </div>
    );
}