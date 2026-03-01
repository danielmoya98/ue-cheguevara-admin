import { z } from "zod";

export const userSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(3, "El nombre es muy corto").max(50),
    email: z.string().email("Correo inválido"),
    role: z.enum(["admin", "teacher", "student"], {
        errorMap: () => ({ message: "Rol no válido" })
    }),
    status: z.enum(["active", "inactive"]),
    createdAt: z.date().optional()
});

export type User = z.infer<typeof userSchema>;