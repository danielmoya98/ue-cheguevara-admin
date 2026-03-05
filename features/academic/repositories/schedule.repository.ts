import { prisma } from "@/lib/db";
import { Prisma } from "@/app/generated/prisma/client";

export const scheduleRepository = {
    getScheduleByClassroom: async (classroomId: string) => {
        return await prisma.schedule.findMany({
            where: { classroomId },
            include: {
                course: {
                    include: { subject: true, teacher: true }
                }
            }
        });
    },

    // Buscar si un profesor ya tiene una clase asignada en un día/hora específico
    checkTeacherAvailability: async (teacherId: string, dayOfWeek: number, period: number) => {
        return await prisma.schedule.findFirst({
            where: {
                dayOfWeek,
                period,
                course: { teacherId }
            },
            include: { classroom: true }
        });
    },

    // Upsert: Si ya hay una materia en ese bloque, la actualiza. Si no, la crea.
    upsertSlot: async (classroomId: string, courseId: string, dayOfWeek: number, period: number) => {
        return await prisma.schedule.upsert({
            where: {
                classroomId_dayOfWeek_period: { classroomId, dayOfWeek, period }
            },
            update: { courseId },
            create: { classroomId, courseId, dayOfWeek, period }
        });
    },

    deleteSlot: async (id: string) => {
        return await prisma.schedule.delete({ where: { id } });
    }
};