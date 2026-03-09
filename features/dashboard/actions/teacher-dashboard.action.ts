"use server";

import { apiFetch } from "../../../app/lib/api-client";

export async function getTeacherSummaryAction(academicYear: number) {
    try {
        // El apiFetch inyecta automáticamente el Token JWT del docente
        const data = await apiFetch<any>(`/dashboard/admin/teacher/summary?academicYear=${academicYear}`);
        return { success: true, data };
    } catch (error: any) {
        console.error("Error cargando resumen del docente:", error);
        return {
            success: false,
            data: { totalCourses: 0, totalStudents: 0 }
        };
    }
}