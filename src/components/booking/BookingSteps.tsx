/**
 * src/components/booking/BookingSteps.tsx
 * Indicateur de progression du tunnel de réservation.
 *
 * Affiche 3 étapes avec :
 * - Numéro ou icône ✓ si complétée
 * - Ligne de connexion entre les étapes
 * - Couleurs différentes selon l'état (actif / complété / inactif)
 */
import { Check } from "lucide-react";
import { BookingStepViewModel } from "@/viewmodels/BookingViewModel";

interface BookingStepsProps {
    steps: BookingStepViewModel[];
}

export function BookingSteps({ steps }: BookingStepsProps) {
    return (
        <div className="flex items-center justify-center mb-8">
            {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                    {/* Cercle de l'étape */}
                    <div className="flex flex-col items-center">
                        <div
                            className={`h-9 w-9 rounded-full flex items-center justify-center font-semibold text-sm border-2 transition-all ${step.isCompleted
                                ? "bg-primary border-primary text-primary-foreground"   // Terminée : fond plein
                                : step.isActive
                                    ? "border-primary text-primary bg-primary/10"            // Active : bordure colorée
                                    : "border-muted text-muted-foreground bg-background"    // Inactive : grise
                                }`}
                        >
                            {step.isCompleted ? <Check className="h-4 w-4" /> : step.id}
                        </div>

                        {/* Label sous le cercle */}
                        <span
                            className={`mt-1.5 text-xs font-medium ${step.isActive ? "text-primary" : "text-muted-foreground"
                                }`}
                        >
                            {step.label}
                        </span>
                    </div>

                    {/* Ligne de connexion (sauf après le dernier) */}
                    {index < steps.length - 1 && (
                        <div
                            className={`h-0.5 w-16 md:w-24 mx-2 mb-5 transition-colors ${steps[index + 1].isCompleted || steps[index].isCompleted
                                ? "bg-primary"
                                : "bg-muted"
                                }`}
                        />
                    )}
                </div>
            ))}
        </div>
    );
}