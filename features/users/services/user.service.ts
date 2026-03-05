import { userRepository } from "../repositories/user.repository";
import { UserInput } from "../validations/user.schema";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db"; // Mantengo tu importación 'prisma'

export const userService = {
    getUsers: async (filters?: { query?: string; role?: string }) => {
        return await userRepository.findAll(filters);
    },

    createUser: async (input: UserInput) => {
        // 1. Validar que el email no exista
        const existingUser = await prisma.user.findUnique({ where: { email: input.email } });
        if (existingUser) {
            throw new Error("El correo electrónico ya está registrado");
        }

        // 2. Contraseña obligatoria al crear
        if (!input.password) {
            throw new Error("La contraseña es obligatoria para nuevos usuarios");
        }

        // 3. Encriptar contraseña
        const passwordHash = await bcrypt.hash(input.password, 10);

        // 4. Guardar en BD
        return await userRepository.create({
            name: input.name,
            email: input.email,
            role: input.role,
            passwordHash: passwordHash,
            status: "ACTIVE",
        });
    },

    updateUser: async (id: string, input: UserInput) => {
        // 1. Verificamos que el usuario exista
        const existingUser = await prisma.user.findUnique({ where: { id } });
        if (!existingUser) {
            throw new Error("Usuario no encontrado");
        }

        // 2. Preparamos los datos básicos a actualizar
        const dataToUpdate: any = {
            name: input.name,
            email: input.email,
            role: input.role,
        };

        // 3. Si escribió una contraseña nueva, la encriptamos. Si no, conserva la anterior.
        if (input.password && input.password.trim() !== "") {
            dataToUpdate.passwordHash = await bcrypt.hash(input.password, 10);
        }

        // 4. Guardar cambios
        return await userRepository.update(id, dataToUpdate);
    },

    deleteUser: async (id: string) => {
        // 1. Verificamos que exista antes de intentar borrar
        const existingUser = await prisma.user.findUnique({ where: { id } });
        if (!existingUser) {
            throw new Error("Usuario no encontrado");
        }

        return await userRepository.delete(id);
    }
};