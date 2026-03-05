import { z } from "zod";
import { Term } from "@/app/generated/prisma/client";

// Validación para crear el Examen/Tarea
export const evaluationSchema = z.object({
    title: z.string().min(3, "El título es muy corto").max(100),
    description: z.string().optional(),
    date: z.string(), // "YYYY-MM-DD"
    term: z.nativeEnum(Term),
    maxScore: z.coerce.number().min(10).max(100).default(100),
    courseId: z.string().uuid()
});

export type EvaluationInput = z.infer<typeof evaluationSchema>;

// Validación para el guardado masivo de notas
export const markRecordSchema = z.object({
    studentId: z.string().uuid(),
    score: z.coerce.number().min(0).max(100),
    feedback: z.string().optional()
});

export const bulkMarksSchema = z.object({
    evaluationId: z.string().uuid(),
    marks: z.array(markRecordSchema)
});

export type BulkMarksInput = z.infer<typeof bulkMarksSchema>;