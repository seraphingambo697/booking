import type { Config } from "tailwindcss";
import animatePlugin from "tailwindcss-animate";

const config: Config = {
    darkMode: "class",
    content: ["./index.html", "./src/**/*.{ts,tsx}"],
    theme: {
        extend: {
            colors: {
                border: "hsl(var(--border))",
                primary: "hsl(var(--primary))",
            },
            borderColor: {
                border: "hsl(var(--border))",
                primary: "hsl(var(--primary))",
            },
        },
    },
    plugins: [animatePlugin],
};

export default config;