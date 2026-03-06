/**
 * src/repositories/UserRepository.ts
 *
 * Implémentation concrète de IUserRepository.
 * Utilisé par AuthService pour les opérations sur les comptes utilisateurs.
 */

import { User } from "@/core/entities/User";
import { IUserRepository } from "@/interfaces/repositories/IUserRepository";

/** Utilisateur de démonstration */
const MOCK_USERS: User[] = [
    {
        id: "u1",
        firstName: "Marie",
        lastName: "Dupont",
        email: "demo@luxstay.fr",
        phone: "+33 6 12 34 56 78",
        createdAt: new Date("2024-01-01"),
    },
];

const userStore: User[] = [...MOCK_USERS];

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export class UserRepository implements IUserRepository {
    async findById(id: string): Promise<User | null> {
        await delay(200);
        return userStore.find((u) => u.id === id) ?? null;
    }

    async findByEmail(email: string): Promise<User | null> {
        await delay(200);
        return userStore.find((u) => u.email === email) ?? null;
    }

    async create(userData: Omit<User, "id" | "createdAt">): Promise<User> {
        await delay(400);
        const newUser: User = {
            id: `u${Date.now()}`,
            ...userData,
            createdAt: new Date(),
        };
        userStore.push(newUser);
        return newUser;
    }

    async update(id: string, data: Partial<User>): Promise<User> {
        await delay(300);
        const user = userStore.find((u) => u.id === id);
        if (!user) throw new Error("Utilisateur introuvable");
        Object.assign(user, data);
        return user;
    }
}