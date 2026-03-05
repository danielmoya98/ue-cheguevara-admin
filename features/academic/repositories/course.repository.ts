import { prisma } from "@/lib/db";
import { Prisma } from "@/app/generated/prisma/client";

export const courseRepository = {
    // 1. Obtener todas las asignaturas de un Paralelo específico (Ej: Todo lo de 1ro A)
    findByClassroom: async (classroomId: string) => {
        return await prisma.course.findMany({
            where: { classroomId },
            include: {
                subject: true, // Trae los datos de la materia (nombre, color, horas)
                teacher: {     // Trae los datos del profesor
                    select: { id: true, name: true, email: true }
                }
            },
            orderBy: { subject: { name: 'asc' } }
        });
    },

    // 2. Asignar una materia a un paralelo (con o sin profesor)
    create: async (data: Prisma.CourseCreateInput) => {
        return await prisma.course.create({ data });
    },

    // 3. Cambiar de profesor o materia
    update: async (id: string, data: Prisma.CourseUpdateInput) => {
        return await prisma.course.update({ where: { id }, data });
    },

    // 4. Quitar la materia del paralelo
    delete: async (id: string) => {
        return await prisma.course.delete({ where: { id } });
    }
};