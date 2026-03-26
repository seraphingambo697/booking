import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { BookingSteps } from "@/components/booking/BookingSteps";
import { BookingSummary } from "@/components/booking/BookingSummary";
import { GuestInfoForm } from "@/components/booking/BookingForm";
import { useBooking } from "@/hooks/useBooking";
import { ROUTES } from "@/router/routes";

export function BookingPage() {
    const navigate = useNavigate();
    const { vm, onGuestInfo, onNext, onPrev, onSubmit } = useBooking();

    if (!vm.hotelName) return (
        <div className="container py-16 text-center">
            <p className="text-muted-foreground mb-4">Aucune réservation en cours.</p>
            <button onClick={() => navigate(ROUTES.HOME)} className="text-primary hover:underline">
                Retour à l'accueil
            </button>
        </div>
    );

    return (
        <div className="container py-8 max-w-5xl">
            <BookingSteps steps={vm.steps} />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                    {vm.currentStep === 1 && (
                        <>
                            <GuestInfoForm onUpdate={onGuestInfo} />
                            <div className="flex justify-between pt-4">
                                <button onClick={() => navigate(-1)} className="text-sm text-muted-foreground">← Retour</button>
                                <button onClick={onNext} disabled={!vm.canSubmit}
                                    className="bg-primary text-primary-foreground px-6 py-2 rounded-md text-sm font-medium disabled:opacity-50 flex items-center gap-2">
                                    Continuer <ArrowRight className="h-4 w-4" />
                                </button>
                            </div>
                        </>
                    )}
                    {vm.currentStep === 2 && (
                        <>
                            <div className="bg-white border rounded-xl p-6">
                                <h2 className="font-semibold text-lg mb-4">Vérification de votre réservation</h2>
                                <p className="text-muted-foreground text-sm">Vérifiez les informations avant de confirmer.</p>
                                {vm.hasError && (
                                    <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">{vm.errorMessage}</div>
                                )}
                            </div>
                            <div className="flex justify-between pt-4">
                                <button onClick={onPrev} className="text-sm text-muted-foreground">← Retour</button>
                                <button onClick={onSubmit} disabled={vm.isSubmitting}
                                    data-cy="confirm-booking-btn"
                                    //data-cy="confirm-booking"
                                    className="bg-primary text-primary-foreground px-6 py-2 rounded-md text-sm font-medium disabled:opacity-70">
                                    {vm.isSubmitting ? "Confirmation..." : `Confirmer et payer ${vm.totalPrice}`}
                                </button>
                            </div>
                        </>
                    )}
                </div>
                <div><BookingSummary vm={vm} /></div>
            </div>
        </div>
    );
}