/**
 * Formulaire de connexion.
 *
 * Les data-cy sont pour les tests Cypress.
 *
 */
import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, Hotel } from "lucide-react";
import { LoginCredentials } from "@/interfaces/services/IAuthService";
import { ROUTES } from "@/router/routes";

interface LoginFormProps {
    isLoading: boolean;
    hasError: boolean;
    errorMessage?: string;
    onSubmit: (credentials: LoginCredentials) => void;
}

export function LoginForm({ isLoading, hasError, errorMessage, onSubmit }: LoginFormProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPwd, setShowPwd] = useState(false);

    const handleSubmit = () => {
        if (email && password) onSubmit({ email, password });
    };

    /*const fillDemo = () => {
        setEmail("demo@luxstay.fr");
        setPassword("demo123");
    };*/

    return (
        <div className="w-full max-w-md">
            <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-2 text-primary text-2xl font-bold mb-2">
                    <Hotel className="h-7 w-7" />
                    LuxStay
                </div>
                <h1 className="text-2xl font-bold">Connexion</h1>
                <p className="text-muted-foreground mt-1">Bienvenue ! Connectez-vous à votre compte.</p>
            </div>

            {/* Encart démo */}
            {/*<div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                <p className="text-sm font-medium text-blue-700 mb-1">🧪 Compte de démonstration</p>
                <p className="text-xs text-blue-600 mb-2">
                    Email : <code className="font-mono">demo@luxstay.fr</code>
                    {" / "}
                    Mot de passe : <code className="font-mono">demo123</code>
                </p>
                <button
                    onClick={fillDemo}
                    type="button"
                    className="text-xs text-blue-700 hover:underline font-medium"
                >
                    Utiliser le compte démo →
                </button>
            </div>*/}

            {/* Erreur */}
            {hasError && (
                <div
                    data-cy="login-error"
                    className="bg-destructive/10 text-destructive border border-destructive/20 rounded-lg px-4 py-3 mb-4 text-sm"
                >
                    {errorMessage}
                </div>
            )}

            {/* Champs */}
            <div className="space-y-4">
                {/* Email */}
                <div>
                    <label className="block text-sm font-medium mb-1.5">Email</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                            placeholder="marie@email.com"
                            data-cy="login-email"
                            className="w-full pl-9 pr-3 h-11 border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                        />
                    </div>
                </div>

                {/* Mot de passe */}
                <div>
                    <label className="block text-sm font-medium mb-1.5">Mot de passe</label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input
                            type={showPwd ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                            placeholder="••••••••"
                            data-cy="login-password"
                            className="w-full pl-9 pr-10 h-11 border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                        />
                        {/* Toggle visibilité */}
                        <button
                            type="button"
                            onClick={() => setShowPwd(!showPwd)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                            {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Bouton connexion */}
            <button
                onClick={handleSubmit}
                disabled={!email || !password || isLoading}
                data-cy="login-submit"
                className="mt-6 w-full bg-primary text-primary-foreground font-semibold h-11 rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                {isLoading ? "Connexion..." : "Se connecter"}
            </button>

            {/* Lien inscription */}
            <p className="text-center text-sm text-muted-foreground mt-5">
                Pas encore de compte ?{" "}
                <Link to={ROUTES.REGISTER} className="text-primary hover:underline font-medium">
                    S'inscrire gratuitement
                </Link>
            </p>
        </div>
    );
}