import { courseRepository } from "../repositories/course.repository";
import { CourseInput } from "../validations/academic.schema";
import { prisma } from "@/lib/db";

export const courseService = {
    getCoursesByClassroom: async (classroomId: string) => {
        return await courseRepository.findByClassroom(classroomId);
    },

    assignCourse: async (input: CourseInput) => {
        // Regla: No se puede asignar la misma materia dos veces al mismo paralelo
        const existing = await prisma.course.findUnique({
            where: {
                classroomId_subjectId_academicYear: {
                    classroomId: input.classroomId,
                    subjectId: input.subjectId,
                    academicYear: input.academicYear
                }
            }
        });

        if (existing) {
            throw new Error("Esta materia ya está asignada a este paralelo para este año.");
        }

        // Limpiar teacherId si viene vacío
        const teacherId = input.teacherId && input.teacherId.trim() !== "" ? input.teacherId : undefined;

        return await courseRepository.create({
            classroom: { connect: { id: input.classroomId } },
            subject: { connect: { id: input.subjectId } },
            // Conectar el profesor solo si se envió un ID válido
            ...(teacherId && { teacher: { connect: { id: teacherId } } }),
            academicYear: input.academicYear
        });
    },

    removeCourse: async (id: string) => {
        // Validaremos en el futuro si hay notas antes de borrar
        return await courseRepository.delete(id);
    },

    getTeacherCourses: async (teacherId?: string) => {
        const whereClause = teacherId ? { teacherId } : {};

        return await prisma.course.findMany({
            where: {
                ...whereClause,
                academicYear: new Date().getFullYear() // Solo del año actual
            },
            include: {
                subject: true,
                classroom: {
                    include: { grade: true }
                },
                _count: {
                    select: { evaluations: true } // Contar cuántos exámenes ya tomó
                }
            },
            orderBy: [
                { classroom: { grade: { level: 'asc' } } },
                { classroom: { grade: { numericOrder: 'asc' } } },
                { subject: { name: 'asc' } }
            ]
        });
    },
};