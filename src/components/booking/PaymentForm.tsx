/**
 * src/components/booking/PaymentForm.tsx
 * Formulaire de paiement (simulé — pas de vrai Stripe).
 *
 * En production : remplacer par <Stripe Elements /> ou <PaymentElement />.
 * Actuellement simule la saisie de CB sans vraiment traiter le paiement.
 *
 * Affiche un badge "🔒 Paiement sécurisé SSL" pour rassurer l'utilisateur.
 */
import { useState } from "react";
import { CreditCard, Lock } from "lucide-react";

interface PaymentFormProps {
    totalPrice: string;
    onConfirm: () => void;
    isLoading?: boolean;
}

export function PaymentForm({ totalPrice, onConfirm, isLoading }: PaymentFormProps) {
    const [card, setCard] = useState({
        number: "",
        name: "",
        expiry: "",
        cvv: "",
    });

    /** Formate le numéro de carte : "1234 5678 9012 3456" */
    const formatCardNumber = (value: string) => {
        return value
            .replace(/\D/g, "")
            .slice(0, 16)
            .replace(/(.{4})/g, "$1 ")
            .trim();
    };

    /** Formate la date d'expiration : "MM/YY" */
    const formatExpiry = (value: string) => {
        const digits = value.replace(/\D/g, "").slice(0, 4);
        if (digits.length >= 2) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
        return digits;
    };

    const isValid =
        card.number.replace(/\s/g, "").length === 16 &&
        card.name.trim().length > 0 &&
        card.expiry.length === 5 &&
        card.cvv.length >= 3;

    return (
        <div className="bg-white border rounded-xl p-6 space-y-5">
            {/* En-tête */}
            <div className="flex items-center justify-between">
                <h2 className="font-semibold text-lg flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-primary" />
                    Paiement
                </h2>
                <span className="flex items-center gap-1 text-xs text-green-600 font-medium">
                    <Lock className="h-3.5 w-3.5" />
                    Sécurisé SSL
                </span>
            </div>

            {/* Numéro de carte */}
            <div>
                <label className="block text-sm font-medium mb-1.5">Numéro de carte</label>
                <input
                    type="text"
                    value={card.number}
                    onChange={(e) => setCard({ ...card, number: formatCardNumber(e.target.value) })}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    data-cy="card-number"
                    className="w-full px-3 h-10 border border-input rounded-md text-sm font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
            </div>

            {/* Nom sur la carte */}
            <div>
                <label className="block text-sm font-medium mb-1.5">Nom sur la carte</label>
                <input
                    type="text"
                    value={card.name}
                    onChange={(e) => setCard({ ...card, name: e.target.value.toUpperCase() })}
                    placeholder="MARIE DUPONT"
                    data-cy="card-name"
                    className="w-full px-3 h-10 border border-input rounded-md text-sm uppercase tracking-wide focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
            </div>

            {/* Expiration + CVV */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1.5">Expiration</label>
                    <input
                        type="text"
                        value={card.expiry}
                        onChange={(e) => setCard({ ...card, expiry: formatExpiry(e.target.value) })}
                        placeholder="MM/AA"
                        maxLength={5}
                        data-cy="card-expiry"
                        className="w-full px-3 h-10 border border-input rounded-md text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1.5">CVV</label>
                    <input
                        type="password"
                        value={card.cvv}
                        onChange={(e) => setCard({ ...card, cvv: e.target.value.replace(/\D/g, "").slice(0, 4) })}
                        placeholder="123"
                        maxLength={4}
                        data-cy="card-cvv"
                        className="w-full px-3 h-10 border border-input rounded-md text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                </div>
            </div>

            {/* Bouton de paiement */}
            <button
                onClick={onConfirm}
                disabled={!isValid || isLoading}
                data-cy="pay-button"
                className="w-full bg-primary text-primary-foreground font-semibold py-3 rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
                <Lock className="h-4 w-4" />
                {isLoading ? "Traitement..." : `Payer ${totalPrice}`}
            </button>

            <p className="text-xs text-center text-muted-foreground">
                Paiement simulé — aucune donnée réelle n'est traitée.
            </p>
        </div>
    );
}