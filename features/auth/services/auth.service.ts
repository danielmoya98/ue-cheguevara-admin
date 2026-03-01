import { LoginInput } from "../validations/auth.schema";
import { authRepository } from "../repositories/auth.repository";

export const authService = {
    login: async (input: LoginInput) => {
        const user = await authRepository.findByEmail(input.email);

        if (!user) {
            throw new Error("Credenciales inválidas");
        }

        // Aquí compararías hashes de contraseña reales
        if (user.password !== input.password) {
            throw new Error("Credenciales inválidas");
        }

        // Retornamos el usuario sin el password (DTO seguro)
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
};