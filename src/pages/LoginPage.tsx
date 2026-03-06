/**
 * src/pages/LoginPage.tsx
 * Page de connexion — centre le LoginForm dans la page.
 */

import { LoginForm } from "@/components/auth/LoginForm";
import { useAuth } from "@/hooks/useAuth";

export function LoginPage() {
    const { vm, onLogin } = useAuth();

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
            <LoginForm
                isLoading={vm.isLoading}
                hasError={vm.hasError}
                errorMessage={vm.errorMessage}
                onSubmit={onLogin}
            />
        </div>
    );
}