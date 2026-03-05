import { z } from "zod";

export const subjectSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(3, "El nombre de la materia es muy corto").max(100),
    code: z.string().min(2, "El código es muy corto").max(10).toUpperCase(),
    color: z.string().regex(/^#([0-9A-F]{3}){1,2}$/i, "Color HEX inválido"),
    weeklyHours: z.coerce.number().min(1, "Debe tener al menos 1 hora").max(40, "Excede el límite de horas"),
    isActive: z.boolean().default(true).optional(),
});

export type SubjectInput = z.infer<typeof subjectSchema>;


import { AcademicLevel } from "@/app/generated/prisma/client";

// Validación para crear un Grado
export const gradeSchema = z.object({
    name: z.string().min(3, "Nombre muy corto (Ej: Primero)"),
    numericOrder: z.coerce.number().min(1).max(12),
    level: z.nativeEnum(AcademicLevel, { errorMap: () => ({ message: "Nivel inválido" }) }),
});

export type GradeInput = z.infer<typeof gradeSchema>;

// Validación para crear un Paralelo
export const classroomSchema = z.object({
    gradeId: z.string().uuid("ID de Grado inválido"),
    name: z.string().min(1, "Debe ingresar una letra (A, B, C)").max(5).toUpperCase(),
    shift: z.enum(["MAÑANA", "TARDE", "NOCHE"]).default("MAÑANA"),
    capacity: z.coerce.number().min(1).max(50).default(30),
});

export type ClassroomInput = z.infer<typeof classroomSchema>;


// ... al final de academic.schema.ts

export const courseSchema = z.object({
    id: z.string().optional(),
    classroomId: z.string().uuid("ID de Paralelo inválido"),
    subjectId: z.string().uuid("Debe seleccionar una materia"),
    // El profesor es opcional (puede estar "Por asignar")
    teacherId: z.string().uuid().optional().or(z.literal("")),
    academicYear: z.coerce.number().int().default(new Date().getFullYear()),
});

export type CourseInput = z.infer<typeof courseSchema>;