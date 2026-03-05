import { prisma } from "@/lib/db";
import { Prisma } from "@/app/generated/prisma/client";

export const studentRepository = {
    // 1. Obtener estudiantes (con búsqueda y filtros)
    findAll: async (query?: string, classroomId?: string) => {
        const where: Prisma.StudentProfileWhereInput = {};

        if (query) {
            where.OR = [
                { user: { name: { contains: query, mode: 'insensitive' } } },
                { documentId: { contains: query } },
            ];
        }

        if (classroomId) {
            where.enrollments = {
                some: {
                    classroomId: classroomId,
                    academicYear: new Date().getFullYear(), // Asumimos el año actual por ahora
                    status: "ACTIVE"
                }
            };
        }

        return await prisma.studentProfile.findMany({
            where,
            include: {
                user: { select: { name: true, email: true, status: true } },
                enrollments: {
                    where: { academicYear: new Date().getFullYear(), status: "ACTIVE" },
                    include: {
                        classroom: { include: { grade: true } }
                    }
                }
            },
            orderBy: { user: { name: 'asc' } }
        });
    },

    // 2. Obtener un estudiante por ID
    findById: async (id: string) => {
        return await prisma.studentProfile.findUnique({
            where: { id },
            include: {
                user: true,
                enrollments: {
                    include: { classroom: { include: { grade: true } } },
                    orderBy: { academicYear: 'desc' }
                }
            }
        });
    },

    // 3. Matricular estudiante (Crear Enrollment)
    enrollStudent: async (studentId: string, classroomId: string, academicYear: number) => {
        // Upsert: Si ya está inscrito ese año, actualiza el aula. Si no, crea la inscripción.
        return await prisma.enrollment.upsert({
            where: {
                studentId_academicYear: { studentId, academicYear }
            },
            update: { classroomId, status: "ACTIVE" },
            create: { studentId, classroomId, academicYear, status: "ACTIVE" }
        });
    }
};