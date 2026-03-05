import { gradeRepository } from "../repositories/grade.repository";
import { prisma } from "@/lib/db";
import { EvaluationInput, BulkMarksInput } from "../validations/grade.schema";

export const gradeService = {
    getCourseEvaluations: async (courseId: string) => {
        return await gradeRepository.getEvaluationsByCourse(courseId);
    },

    // Lógica para armar la "Planilla de Notas"
    getMarkingRoster: async (evaluationId: string) => {
        const evaluation = await gradeRepository.getEvaluationWithMarks(evaluationId);
        if (!evaluation) throw new Error("Evaluación no encontrada");

        // Obtenemos a todos los estudiantes inscritos actualmente en ese paralelo
        const enrollments = await prisma.enrollment.findMany({
            where: {
                classroomId: evaluation.course.classroomId,
                academicYear: new Date().getFullYear(),
                status: "ACTIVE"
            },
            include: { student: { include: { user: true } } },
            orderBy: { student: { user: { name: 'asc' } } }
        });

        // Mezclamos: Si el alumno ya tiene nota guardada, la mostramos; si no, score = 0
        const roster = enrollments.map(enrollment => {
            const existingMark = evaluation.marks.find(m => m.studentId === enrollment.studentId);
            return {
                studentId: enrollment.studentId,
                name: enrollment.student.user.name,
                documentId: enrollment.student.documentId,
                // Conservamos la nota si existe, o dejamos vacío (null) para que el profesor la llene
                score: existingMark ? existingMark.score : null,
                feedback: existingMark ? (existingMark.feedback || "") : ""
            };
        });

        return { evaluation, roster };
    },

    createEvaluation: async (input: EvaluationInput, createdById: string) => {
        const targetDate = new Date(`${input.date}T00:00:00Z`);

        return await gradeRepository.createEvaluation({
            title: input.title,
            description: input.description,
            date: targetDate,
            term: input.term,
            maxScore: input.maxScore,
            course: { connect: { id: input.courseId } },
            createdBy: { connect: { id: createdById } }
        });
    },

    saveMarks: async (input: BulkMarksInput) => {
        // Validar que las notas no superen el maxScore de la evaluación
        const evaluation = await prisma.evaluation.findUnique({ where: { id: input.evaluationId } });
        if (!evaluation) throw new Error("Evaluación no encontrada");

        const invalidMarks = input.marks.filter(m => m.score > evaluation.maxScore);
        if (invalidMarks.length > 0) {
            throw new Error(`Hay notas que superan el máximo permitido (${evaluation.maxScore} pts).`);
        }

        return await gradeRepository.saveMarksBulk(input.evaluationId, input.marks);
    }
};