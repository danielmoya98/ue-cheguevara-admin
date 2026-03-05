import { z } from "zod";

// Validación del Perfil del Estudiante (Para cuando editen su perfil)
export const studentProfileSchema = z.object({
    birthDate: z.coerce.date({ required_error: "Fecha requerida", invalid_type_error: "Fecha inválida" }),
    documentId: z.string().min(5, "Carnet muy corto").max(20),
    gender: z.enum(["MASCULINO", "FEMENINO"]),
    address: z.string().min(5, "Dirección muy corta"),

    bloodType: z.string().optional(),
    allergies: z.string().optional(),
    medicalNotes: z.string().optional(),

    guardianName: z.string().min(3, "Nombre muy corto"),
    guardianPhone: z.string().min(7, "Teléfono inválido"),
    guardianEmail: z.string().email("Correo inválido").optional().or(z.literal("")),
    guardianRelation: z.string().min(2, "Relación muy corta"),
});

export type StudentProfileInput = z.infer<typeof studentProfileSchema>;

// Validación para la inscripción
export const enrollmentSchema = z.object({
    studentId: z.string().uuid(),
    classroomId: z.string().uuid("Seleccione un aula"),
    academicYear: z.coerce.number().int().default(new Date().getFullYear()),
});