/**
 * src/pages/RegisterPage.tsx
 * Page d'inscription — centre le RegisterForm dans la page.
 */

import { RegisterForm } from "@/components/auth/RegisterForm";
import { useAuth } from "@/hooks/useAuth";

export function RegisterPage() {
    const { vm, onRegister } = useAuth();

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
            <RegisterForm
                isLoading={vm.isLoading}
                hasError={vm.hasError}
                errorMessage={vm.errorMessage}
                onSubmit={onRegister}
            />
        </div>
    );
}