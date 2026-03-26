// cypress/support/index.d.ts
// Déclarations TypeScript des commandes Cypress custom.
// Ce fichier est automatiquement inclus via cypress/tsconfig.json

declare namespace Cypress {
    interface Chainable {
        /**
         * Connecte un utilisateur via l'UI de connexion.
         * @param email    Email du compte
         * @param password Mot de passe
         */
        login(email: string, password: string): Chainable<void>;

        /**
         * Connecte l'admin (lit ADMIN_EMAIL / ADMIN_PASSWORD depuis cypress.config.ts)
         */
        loginAdmin(): Chainable<void>;

        /**
         * Connecte l'utilisateur démo (lit USER_EMAIL / USER_PASSWORD depuis cypress.config.ts)
         */
        loginUser(): Chainable<void>;

        /**
         * Déconnecte l'utilisateur courant (vide localStorage + visite /)
         */
        logout(): Chainable<void>;

        searchHotel(city: string, nights?: number, guestCount?: number): Chainable<void>;



    }
}