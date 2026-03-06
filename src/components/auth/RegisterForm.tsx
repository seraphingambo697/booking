/**
 * src/components/auth/RegisterForm.tsx
 * Formulaire de création de compte.
 *
 * Champs : prénom*, nom*, email*, mot de passe*, téléphone (optionnel).
 * Composant "vue stupide" : délègue la logique à AuthPresenter via useAuth.
 */
import { useState } from "react";
import { Link } from "react-router-dom";
import { User, Mail, Lock, Phone, Eye, EyeOff, Hotel } from "lucide-react";
import { RegisterPayload } from "@/interfaces/services/IAuthService";
import { ROUTES } from "@/router/routes";

interface RegisterFormProps {
    isLoading: boolean;
    hasError: boolean;
    errorMessage?: string;
    onSubmit: (payload: RegisterPayload) => void;
}

export function RegisterForm({ isLoading, hasError, errorMessage, onSubmit }: RegisterFormProps) {
    const [form, setForm] = useState<RegisterPayload>({
        firstName: "", lastName: "", email: "", password: "", phone: "",
    });
    const [showPwd, setShowPwd] = useState(false);

    const update = (field: keyof RegisterPayload, value: string) =>
        setForm((f) => ({ ...f, [field]: value }));

    const isValid =
        form.firstName.trim() &&
        form.lastName.trim() &&
        form.email.trim() &&
        form.password.length >= 6;

    const handleSubmit = () => {
        if (isValid) onSubmit(form);
    };

    return (
        <div className="w-full max-w-md">
            {/* Logo */}
            <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-2 text-primary text-2xl font-bold mb-2">
                    <Hotel className="h-7 w-7" />
                    LuxStay
                </div>
                <h1 className="text-2xl font-bold">Créer un compte</h1>
                <p className="text-muted-foreground mt-1">Rejoignez LuxStay et accédez aux meilleures offres.</p>
            </div>

            {/* Erreur */}
            {hasError && (
                <div className="bg-destructive/10 text-destructive border border-destructive/20 rounded-lg px-4 py-3 mb-4 text-sm">
                    {errorMessage}
                </div>
            )}

            <div className="space-y-4">
                {/* Prénom + Nom */}
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-sm font-medium mb-1.5">
                            Prénom <span className="text-destructive">*</span>
                        </label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <input
                                type="text"
                                value={form.firstName}
                                onChange={(e) => update("firstName", e.target.value)}
                                placeholder="Marie"
                                data-cy="register-firstname"
                                className="w-full pl-9 pr-3 h-11 border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
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
                                value={form.lastName}
                                onChange={(e) => update("lastName", e.target.value)}
                                placeholder="Dupont"
                                data-cy="register-lastname"
                                className="w-full pl-9 pr-3 h-11 border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
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
                            value={form.email}
                            onChange={(e) => update("email", e.target.value)}
                            placeholder="marie@email.com"
                            data-cy="register-email"
                            className="w-full pl-9 pr-3 h-11 border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                        />
                    </div>
                </div>

                {/* Mot de passe */}
                <div>
                    <label className="block text-sm font-medium mb-1.5">
                        Mot de passe <span className="text-destructive">*</span>
                    </label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input
                            type={showPwd ? "text" : "password"}
                            value={form.password}
                            onChange={(e) => update("password", e.target.value)}
                            placeholder="Minimum 6 caractères"
                            data-cy="register-password"
                            className="w-full pl-9 pr-10 h-11 border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPwd(!showPwd)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                        >
                            {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                    </div>
                    {form.password && form.password.length < 6 && (
                        <p className="text-xs text-destructive mt-1">Minimum 6 caractères</p>
                    )}
                </div>

                {/* Téléphone (optionnel) */}
                <div>
                    <label className="block text-sm font-medium mb-1.5">
                        Téléphone <span className="text-muted-foreground text-xs font-normal">(optionnel)</span>
                    </label>
                    <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input
                            type="tel"
                            value={form.phone}
                            onChange={(e) => update("phone", e.target.value)}
                            placeholder="+33 6 12 34 56 78"
                            data-cy="register-phone"
                            className="w-full pl-9 pr-3 h-11 border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                        />
                    </div>
                </div>
            </div>

            {/* Bouton inscription */}
            <button
                onClick={handleSubmit}
                disabled={!isValid || isLoading}
                data-cy="register-submit"
                className="mt-6 w-full bg-primary text-primary-foreground font-semibold h-11 rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                {isLoading ? "Création..." : "Créer mon compte"}
            </button>

            {/* Lien connexion */}
            <p className="text-center text-sm text-muted-foreground mt-5">
                Déjà un compte ?{" "}
                <Link to={ROUTES.LOGIN} className="text-primary hover:underline font-medium">
                    Se connecter
                </Link>
            </p>
        </div>
    );
}