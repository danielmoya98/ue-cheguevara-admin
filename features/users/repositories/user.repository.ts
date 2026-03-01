import { User } from "../validations/user.schema";

// Datos Mock (Añadí imageUrl a algunos)
// @ts-ignore
const MOCK_USERS: User[] = [
    { id: "1", name: "DANIEL ADMIN", email: "admin@uecg.edu.bo", role: "admin", status: "active", imageUrl: "https://i.pravatar.cc/150?u=1", createdAt: new Date() },
    { id: "2", name: "MARIA DOCENTE", email: "maria@uecg.edu.bo", role: "teacher", status: "active", imageUrl: null, createdAt: new Date() }, // Sin foto
    { id: "3", name: "JUAN PEREZ", email: "juan@uecg.edu.bo", role: "student", status: "inactive", imageUrl: null, createdAt: new Date() },
    // ... más usuarios
];

interface FindAllParams {
    query?: string;
    role?: string;
}

export const userRepository = {
    findAll: async ({ query, role }: FindAllParams = {}): Promise<User[]> => {
        await new Promise((resolve) => setTimeout(resolve, 300)); // Menos delay para sentirlo "real-time"

        let users = [...MOCK_USERS];

        // 1. Filtrar por Búsqueda (Nombre o Email)
        if (query) {
            const lowerQuery = query.toLowerCase();
            users = users.filter(user =>
                user.name.toLowerCase().includes(lowerQuery) ||
                user.email.toLowerCase().includes(lowerQuery)
            );
        }

        // 2. Filtrar por Rol
        if (role && role !== 'all') {
            users = users.filter(user => user.role === role);
        }

        return users;
    }
};