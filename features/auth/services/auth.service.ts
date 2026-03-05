import { LoginInput } from "../validations/auth.schema";
import { authRepository } from "../repositories/auth.repository";
import bcrypt from "bcryptjs";

export const authService = {
    login: async (input: LoginInput) => {
        // 1. Buscar usuario
        const user = await authRepository.findByEmail(input.email);

        if (!user) {
            throw new Error("Credenciales inválidas");
        }

        if (user.status !== "ACTIVE") {
            throw new Error("Usuario inactivo o suspendido");
        }

        // 2. Comparar contraseña plana vs el Hash en BD
        const isValidPassword = await bcrypt.compare(input.password, user.passwordHash);

        if (!isValidPassword) {
            throw new Error("Credenciales inválidas");
        }

        // 3. Retornamos el usuario seguro sin el hash
        const { passwordHash, ...safeUser } = user;
        return safeUser;
    }
};