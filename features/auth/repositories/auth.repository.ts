import { LoginInput } from "../validations/auth.schema";

// Simulamos la BD
const MOCK_USER = {
    id: "1",
    name: "Admin UECG",
    email: "admin@uecg.edu.bo",
    password: "password123", // En producción esto estaría hasheado
    role: "admin"
};

export const authRepository = {
    findByEmail: async (email: string) => {
        // Simular delay de red
        await new Promise((resolve) => setTimeout(resolve, 500));

        if (email === MOCK_USER.email) {
            return MOCK_USER;
        }
        return null;
    }
};