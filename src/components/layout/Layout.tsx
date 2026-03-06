/**
 * src/components/layout/Layout.tsx
 * Composant de mise en page principale.
 * Enveloppe toutes les pages avec Header en haut, Footer en bas.
 * Le contenu s'étire pour remplir l'espace disponible (flex-1).
 */
import { Header } from "./Header";
import { Footer } from "./Footer";

interface LayoutProps {
    children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            {/* flex-1 : le contenu occupe tout l'espace entre Header et Footer */}
            <main className="flex-1">
                {children}
            </main>
            <Footer />
        </div>
    );
}