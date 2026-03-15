
/**
 * src/repositories/UserRepository.ts
 * Connecté au backend Django — plus de données mock.
 */
import { IUserRepository } from "@/interfaces/repositories/IUserRepository";
import { User } from "@/core/entities/User";
import { authApi } from "@/api/authApi";
import { ApiUser } from "@/types/api.types";

function toUser(api: ApiUser): User {
    return {
        id: api.id,
        firstName: api.first_name,
        lastName: api.last_name,
        email: api.email,
        phone: api.phone ?? "",
        createdAt: new Date(api.created_at),
    };
}

export class UserRepository implements IUserRepository {

    async findById(_id: string): Promise<User | null> {
        // Le backend n'expose que /users/me/ — on appelle ça
        try {
            const api = await authApi.getMe();
            return toUser(api);
        } catch {
            return null;
        }
    }

    async findByEmail(_email: string): Promise<User | null> {
        // Pas d'endpoint de lookup par email côté frontend
        // La vérification se fait lors du login (erreur 401 si inconnu)
        return null;
    }

    async create(userData: Omit<User, "id" | "createdAt">): Promise<User> {
        const api = await authApi.register({
            first_name: userData.firstName,
            last_name: userData.lastName,
            email: userData.email,
            password: (userData as unknown as { password: string }).password,
            phone: userData.phone,
        });
        return toUser(api);
    }

    async update(id: string, data: Partial<User>): Promise<User> {
        const api = await authApi.updateMe({
            first_name: data.firstName,
            last_name: data.lastName,
            phone: data.phone,
            email: data.email,
        });
        return toUser(api);
    }
}
