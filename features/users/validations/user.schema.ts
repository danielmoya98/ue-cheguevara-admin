import { z } from "zod";

// 1. Replicamos los Enums de Prisma para el tipado estricto en el Frontend
export enum Role {
    ADMIN = "ADMIN",
    TEACHER = "TEACHER",
    STUDENT = "STUDENT",
    SECRETARY = "SECRETARY"
}

export enum UserStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    SUSPENDED = "SUSPENDED"
}

// 2. Interfaz pura del Usuario para los componentes
export interface User {
    id: string;
    name: string;
    email: string;
    role: Role;
    status: UserStatus;
    createdAt?: Date | string;
}

// 3. Esquema Zod para validación de formularios
export const userSchema = z.object({
    id: z.string().optional(),

    name: z.string().min(3, "El nombre es muy corto").max(100),

    email: z.string().email("Correo inválido"),

    role: z.nativeEnum(Role, { errorMap: () => ({ message: "Rol no válido" }) }),

    status: z.nativeEnum(UserStatus).optional().default(UserStatus.ACTIVE),

    password: z.string()
        .optional()
        .transform((val) => (val === "" ? undefined : val))
        .refine((val) => val === undefined || val.length >= 6, {
            message: "Mínimo 6 caracteres",
        }),
});

export type UserInput = z.infer<typeof userSchema>;