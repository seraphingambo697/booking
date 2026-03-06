/**
 * src/pages/BookingPage.tsx
 *
 * Tunnel de réservation multi-étapes.
 * Étape 1 : formulaire voyageur → Étape 2 : récapitulatif → Confirmation
 */

import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useBooking } from "@/hooks/useBooking";
import { ROUTES } from "@/router/routes";
import { BookingSteps } from "@/components/booking/BookingSteps";
import { GuestInfoForm } from "@/components/booking/BookingForm";
import { BookingSummary } from "@/components/booking/BookingSummary";

export function BookingPage() {
    const navigate = useNavigate();
    const { vm, onGuestInfo, onNext, onPrev, onSubmit } = useBooking();

    // Si pas de contexte de réservation → retour à l'accueil
    if (!vm.hotelName) {
        return (
            <div className="container py-16 text-center">
                <p className="text-muted-foreground mb-4">Aucune réservation en cours.</p>
                <Button onClick={() => navigate(ROUTES.HOME)}>Retour à l'accueil</Button>
            </div>
        );
    }

    return (
        <div className="container py-8 max-w-5xl">
            {/* Indicateur d'étapes */}
            <BookingSteps steps={vm.steps} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Contenu principal (2/3) */}
                <div className="lg:col-span-2 space-y-4">
                    {/* Étape 1 : Informations voyageur */}
                    {vm.currentStep === 1 && (
                        <>
                            <GuestInfoForm onUpdate={onGuestInfo} />
                            <div className="flex justify-between pt-2">
                                <Button variant="outline" onClick={() => navigate(-1)}>
                                    Retour
                                </Button>
                                <Button disabled={!vm.canSubmit} onClick={onNext} data-cy="booking-next">
                                    Continuer <ArrowRight className="h-4 w-4 ml-2" />
                                </Button>
                            </div>
                        </>
                    )}

                    {/* Étape 2 : Récapitulatif */}
                    {vm.currentStep === 2 && (
                        <>
                            <Card>
                                <CardContent className="p-6">
                                    <h2 className="font-semibold text-lg mb-3">Vérification de votre réservation</h2>
                                    <p className="text-muted-foreground text-sm">
                                        Veuillez vérifier les informations avant de confirmer.
                                        En confirmant, vous acceptez nos conditions générales de vente.
                                    </p>
                                    {vm.hasError && (
                                        <Alert variant="destructive" className="mt-4">
                                            <AlertDescription>{vm.errorMessage}</AlertDescription>
                                        </Alert>
                                    )}
                                </CardContent>
                            </Card>
                            <div className="flex justify-between pt-2">
                                <Button variant="outline" onClick={onPrev}>Retour</Button>
                                <Button
                                    //isLoading={vm.isSubmitting}
                                    onClick={onSubmit}
                                    data-cy="confirm-booking"
                                >
                                    Confirmer et payer {vm.totalPrice}
                                </Button>
                            </div>
                        </>
                    )}
                </div>

                {/* Récapitulatif (1/3) */}
                <div>
                    <BookingSummary vm={vm} />
                </div>
            </div>
        </div>
    );
}