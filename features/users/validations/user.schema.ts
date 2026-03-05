import { z } from "zod";
import { Role, UserStatus, User } from "@/app/generated/prisma/client"; // Importamos 'User' de Prisma

export const userSchema = z.object({
    id: z.string().optional(),

    name: z.string().min(3, "El nombre es muy corto").max(100),

    email: z.string().email("Correo inválido"),

    role: z.nativeEnum(Role, { errorMap: () => ({ message: "Rol no válido" }) }),

    // CORRECCIÓN 1: El optional() va ANTES del default()
    status: z.nativeEnum(UserStatus).optional().default("ACTIVE"),

    // CORRECCIÓN 2: Manejo inteligente de strings vacíos desde FormData
    password: z.string()
        .optional()
        // Si el usuario deja el input vacío (""), lo convertimos a undefined
        .transform((val) => (val === "" ? undefined : val))
        // Si no es undefined, ENTONCES le exigimos mínimo 6 caracteres
        .refine((val) => val === undefined || val.length >= 6, {
            message: "Mínimo 6 caracteres",
        }),
});

export type UserInput = z.infer<typeof userSchema>;

// Re-exportamos el tipo User completo de Prisma para que los componentes de UI lo puedan usar
export type { User };