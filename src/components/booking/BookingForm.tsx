/**
 * src/components/booking/BookingForm.tsx
 * Formulaire des informations du voyageur (étape 1 du tunnel).
 *
 * À chaque modification d'un champ → appelle onUpdate avec les données courantes.
 * Le Presenter (via useBooking) met à jour canSubmit en fonction des valeurs.
 *
 * Les attributs data-cy sont pour les tests Cypress.
 */
import { useState } from "react";
import { User, Mail, Phone } from "lucide-react";
import { GuestInfo } from "@/core/entities/Booking";

interface GuestInfoFormProps {
    /** Appelé à chaque changement pour que le Presenter recalcule canSubmit */
    onUpdate: (info: GuestInfo) => void;
}

export function GuestInfoForm({ onUpdate }: GuestInfoFormProps) {
    const [info, setInfo] = useState<GuestInfo>({
        firstName: "", lastName: "", email: "", phone: "",
    });

    const handleChange = (field: keyof GuestInfo, value: string) => {
        const updated = { ...info, [field]: value };
        setInfo(updated);
        onUpdate(updated);
    };

    return (
        <div className="bg-white border rounded-xl p-6 space-y-5">
            <h2 className="font-semibold text-lg">Informations du voyageur principal</h2>

            {/* Prénom + Nom sur une ligne (desktop) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1.5">
                        Prénom <span className="text-destructive">*</span>
                    </label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input
                            type="text"
                            value={info.firstName}
                            onChange={(e) => handleChange("firstName", e.target.value)}
                            placeholder="Marie"
                            data-cy="guest-firstname"
                            className="w-full pl-9 pr-3 h-10 border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1.5">
                        Nom <span className="text-destructive">*</span>
                    </label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input
                            type="text"
                            value={info.lastName}
                            onChange={(e) => handleChange("lastName", e.target.value)}
                            placeholder="Dupont"
                            data-cy="guest-lastname"
                            className="w-full pl-9 pr-3 h-10 border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                        />
                    </div>
                </div>
            </div>

            {/* Email */}
            <div>
                <label className="block text-sm font-medium mb-1.5">
                    Email <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                        type="email"
                        value={info.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        placeholder="marie.dupont@email.com"
                        data-cy="guest-email"
                        className="w-full pl-9 pr-3 h-10 border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                </div>
            </div>

            {/* Téléphone */}
            <div>
                <label className="block text-sm font-medium mb-1.5">
                    Téléphone <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                        type="tel"
                        value={info.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
                        placeholder="+33 6 12 34 56 78"
                        data-cy="guest-phone"
                        className="w-full pl-9 pr-3 h-10 border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                </div>
            </div>

            <p className="text-xs text-muted-foreground">
                <span className="text-destructive">*</span> Champs obligatoires
            </p>
        </div>
    );
}