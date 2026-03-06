/**
 * tailwind.config.ts
 * Configuration de Tailwind CSS.
 *
 * Points clés :
 * - "content" : liste les fichiers à analyser pour purger les classes inutilisées en prod
 * - "theme.extend.colors" : utilise des variables CSS (--primary, etc.) définies dans index.css
 *   Cela permet de changer le thème entier depuis un seul endroit
 * - Le plugin "tailwindcss-animate" est requis par shadcn/ui pour les animations
 */
import type { Config } from "tailwindcss";
import animatePlugin from "tailwindcss-animate";


const config: Config = {
    /* Active le mode sombre via la classe "dark" sur <html> */
    darkMode: "class",

    /* Fichiers analysés pour supprimer les classes non utilisées en production */
    content: [
        "./index.html",
        "./src/**/*.{ts,tsx}",
    ],

    theme: {
        container: {
            center: true,
            padding: "2rem",
            screens: { "2xl": "1400px" },
        },
        extend: {
            /* Couleurs basées sur des variables CSS pour permettre le theming dynamique */
            colors: {
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                primary: {
                    DEFAULT: "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))",
                },
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                },
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
            },
            /* Rayons de bordure basés sur la variable CSS --radius */
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
            /* Animations utilisées par les composants shadcn/ui */
            keyframes: {
                "accordion-down": {
                    from: { height: "0" },
                    to: { height: "var(--radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: "0" },
                },
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
            },
        },
    },
    /* Plugin requis par shadcn/ui pour les transitions et animations */
    plugins: [animatePlugin],
};

export default config;