import { scheduleRepository } from "../repositories/schedule.repository";
import { prisma } from "@/lib/db";

export const scheduleService = {
    getClassroomSchedule: async (classroomId: string) => {
        return await scheduleRepository.getScheduleByClassroom(classroomId);
    },

    assignScheduleSlot: async (classroomId: string, courseId: string, dayOfWeek: number, period: number) => {
        // 1. Obtener la asignatura (course) para saber quién es el profesor
        const course = await prisma.course.findUnique({ where: { id: courseId } });
        if (!course) throw new Error("Asignatura no encontrada");

        // 2. Validar que el profesor no esté dando clases en otra aula a esa misma hora
        if (course.teacherId) {
            const conflict = await scheduleRepository.checkTeacherAvailability(course.teacherId, dayOfWeek, period);
            // Si hay conflicto y NO es en esta misma aula (ej: estamos reemplazando una clase en la misma aula, eso está bien)
            if (conflict && conflict.classroomId !== classroomId) {
                throw new Error(`Conflicto de horario: El docente ya dicta clases en ${conflict.classroom.name} a esta hora.`);
            }
        }

        return await scheduleRepository.upsertSlot(classroomId, courseId, dayOfWeek, period);
    },

    removeScheduleSlot: async (scheduleId: string) => {
        return await scheduleRepository.deleteSlot(scheduleId);
    }
};