import { prisma } from "@/lib/db";
import { Prisma, Term } from "@/app/generated/prisma/client";

export const gradeRepository = {
    // 1. Obtener todas las evaluaciones de un Curso específico
    getEvaluationsByCourse: async (courseId: string, term?: Term) => {
        const where: Prisma.EvaluationWhereInput = { courseId };
        if (term) where.term = term;

        return await prisma.evaluation.findMany({
            where,
            include: {
                _count: { select: { marks: true } } // Saber a cuántos ya se les calificó
            },
            orderBy: { date: 'desc' }
        });
    },

    // 2. Obtener una evaluación específica con las notas de los alumnos
    getEvaluationWithMarks: async (evaluationId: string) => {
        return await prisma.evaluation.findUnique({
            where: { id: evaluationId },
            include: {
                marks: {
                    include: { student: { include: { user: true } } }
                },
                course: {
                    include: {
                        subject: true,
                        // ¡AQUÍ ESTÁ LA MAGIA! Incluimos el grade dentro del classroom
                        classroom: {
                            include: { grade: true }
                        }
                    }
                }
            }
        });
    },

    // 3. Crear una nueva Evaluación (El examen en sí)
    createEvaluation: async (data: Prisma.EvaluationCreateInput) => {
        return await prisma.evaluation.create({ data });
    },

    // 4. Guardar notas masivamente (Upsert igual que la asistencia)
    saveMarksBulk: async (evaluationId: string, marks: { studentId: string; score: number; feedback?: string }[]) => {
        const upsertPromises = marks.map(mark =>
            prisma.mark.upsert({
                where: {
                    evaluationId_studentId: {
                        evaluationId,
                        studentId: mark.studentId
                    }
                },
                update: {
                    score: mark.score,
                    feedback: mark.feedback
                },
                create: {
                    evaluationId,
                    studentId: mark.studentId,
                    score: mark.score,
                    feedback: mark.feedback
                }
            })
        );

        return await prisma.$transaction(upsertPromises);
    }
};