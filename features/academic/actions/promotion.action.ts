"use server";

import { apiFetch } from "../../../app/lib/api-client";
import { revalidatePath } from "next/cache";

// 1. Acción para Analizar (GET)
export async function analyzePromotionAction(classroomId: string, academicYear: number) {
    try {
        const data = await apiFetch<any[]>(`/promotions/analyze/${classroomId}?academicYear=${academicYear}`);
        return { success: true, data };
    } catch (error: any) {
        return { success: false, message: error.message || "Error al analizar el curso." };
    }
}

// 2. Acción para Ejecutar (POST)
export async function executePromotionAction(classroomId: string, academicYear: number) {
    try {
        const result = await apiFetch<any>("/promotions/execute", {
            method: "POST",
            body: JSON.stringify({ classroomId, academicYear })
        });

        revalidatePath("/admin/academic-promotion");
        return {
            success: true,
            message: `Cierre de gestión exitoso. ${result.promotedCount} alumnos promovidos y ${result.retainedCount} retenidos.`
        };
    } catch (error: any) {
        return { success: false, message: error.message || "Error al ejecutar el cierre." };
    }
}