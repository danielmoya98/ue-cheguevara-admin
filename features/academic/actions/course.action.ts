"use server";

import { revalidatePath } from "next/cache";
import { courseSchema } from "../validations/academic.schema";
import { apiFetch } from "../../../app/lib/api-client";

// --- COURSES (Malla Curricular) ---
export async function getCoursesByClassroomAction(classroomId: string) {
    try {
        const courses = await apiFetch<any[]>(`/courses/classroom/${classroomId}`);
        return { success: true, data: courses };
    } catch (error) {
        return { success: false, error: "Error al cargar las asignaturas" };
    }
}

export async function assignCourseAction(prevState: any, formData: FormData) {
    const rawData = Object.fromEntries(formData.entries());
    const validated = courseSchema.safeParse(rawData);

    if (!validated.success) return { success: false, message: "Datos inválidos", errors: validated.error.flatten().fieldErrors };

    try {
        await apiFetch("/courses", { method: "POST", body: JSON.stringify(validated.data) });
        revalidatePath(`/admin/academic/classrooms/${validated.data.classroomId}`);
        return { success: true, message: "Asignatura añadida a la malla" };
    } catch (error: any) {
        return { success: false, message: error.message || "Error al asignar" };
    }
}

export async function removeCourseAction(id: string, classroomId: string) {
    try {
        await apiFetch(`/courses/${id}`, { method: "DELETE" });
        revalidatePath(`/admin/academic/classrooms/${classroomId}`);
        return { success: true, message: "Asignatura removida de la malla" };
    } catch (error: any) {
        return { success: false, message: error.message || "Error al remover" };
    }
}

// --- SCHEDULES (Horarios) ---
export async function assignScheduleAction(classroomId: string, courseId: string, dayOfWeek: number, period: number) {
    try {
        await apiFetch("/schedules", {
            method: "POST",
            body: JSON.stringify({ classroomId, courseId, dayOfWeek, period })
        });
        revalidatePath(`/admin/academic/classrooms/${classroomId}`);
        return { success: true, message: "Horario asignado" };
    } catch (error: any) {
        // Aquí capturamos el 409 Conflict de NestJS (Ej: "El docente ya da clases a esta hora")
        return { success: false, message: error.message || "Conflicto de horario" };
    }
}

export async function removeScheduleAction(scheduleId: string, classroomId: string) {
    try {
        await apiFetch(`/schedules/${scheduleId}`, { method: "DELETE" });
        revalidatePath(`/admin/academic/classrooms/${classroomId}`);
        return { success: true, message: "Horario liberado" };
    } catch (error: any) {
        return { success: false, message: error.message || "Error al liberar horario" };
    }
}