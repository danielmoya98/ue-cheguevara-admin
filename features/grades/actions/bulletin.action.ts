"use server";

import { apiFetch } from "../../../app/lib/api-client";

// 1. Obtener la lista de alumnos para el Select
export async function getStudentsForBulletinAction(classroomId: string, academicYear: number) {
    try {
        const enrollments = await apiFetch<any[]>(`/enrollments?classroomId=${classroomId}&academicYear=${academicYear}`);
        // Mapeamos para devolver solo la parte del estudiante
        return { success: true, data: enrollments.map(e => e.student) };
    } catch (error: any) {
        return { success: false, data: [] };
    }
}

// 2. Obtener la data matemática calculada del boletín
export async function getStudentBulletinAction(studentId: string, academicYear: number) {
    try {
        // Llamamos al nuevo endpoint de NestJS que hace todo el cálculo pesado
        const bulletinData = await apiFetch<any>(`/grades/bulletin/${studentId}?academicYear=${academicYear}`);
        return { success: true, data: bulletinData };
    } catch (error: any) {
        return { success: false, message: error.message || "Error al generar el boletín. Verifica que el estudiante tenga notas registradas." };
    }
}