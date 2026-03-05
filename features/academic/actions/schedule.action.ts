"use server";

import { revalidatePath } from "next/cache";
import { scheduleService } from "../services/schedule.service";

export async function assignScheduleSlotAction(classroomId: string, courseId: string, dayOfWeek: number, period: number) {
    try {
        await scheduleService.assignScheduleSlot(classroomId, courseId, dayOfWeek, period);
        revalidatePath(`/admin/academic/classrooms/${classroomId}`);
        return { success: true, message: "Horario actualizado" };
    } catch (error: any) {
        return { success: false, message: error.message || "Error al asignar el horario" };
    }
}

export async function removeScheduleSlotAction(scheduleId: string, classroomId: string) {
    try {
        await scheduleService.removeScheduleSlot(scheduleId);
        revalidatePath(`/admin/academic/classrooms/${classroomId}`);
        return { success: true, message: "Bloque de horario liberado" };
    } catch (error: any) {
        return { success: false, message: error.message || "Error al liberar el horario" };
    }
}