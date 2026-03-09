"use server";

import { revalidatePath } from "next/cache";
import { evaluationSchema, bulkMarksSchema } from "../validations/grade.schema";
import { apiFetch } from "@/app/lib/api-client";

export async function createEvaluationAction(prevState: any, formData: FormData) {
    const rawData = Object.fromEntries(formData.entries());
    const validated = evaluationSchema.safeParse(rawData);

    if (!validated.success) {
        return { success: false, message: "Datos inválidos", errors: validated.error.flatten().fieldErrors };
    }

    try {
        // CORRECCIÓN CLAVE 1: Añadimos "/grades" al inicio de la ruta
        const newEval = await apiFetch<any>("/grades/evaluations", {
            method: "POST",
            body: JSON.stringify(validated.data)
        });

        revalidatePath(`/admin/grades/course/${validated.data.courseId}`);
        // Retornamos el ID para que el modal sepa a dónde redirigir
        return { success: true, message: "Evaluación creada.", evaluationId: newEval.id };
    } catch (error: any) {
        return { success: false, message: error.message || "Error al crear evaluación." };
    }
}

export async function saveMarksAction(prevState: any, formData: FormData) {
    try {
        const rawData = JSON.parse(formData.get("data") as string);
        const validated = bulkMarksSchema.safeParse(rawData);

        if (!validated.success) {
            return { success: false, message: "Datos inválidos en la planilla." };
        }

        // CORRECCIÓN CLAVE 2: Añadimos "/grades" al inicio de la ruta
        await apiFetch("/grades/marks/bulk", {
            method: "POST",
            body: JSON.stringify(validated.data)
        });

        revalidatePath(`/admin/grades/evaluate/${validated.data.evaluationId}`);
        return { success: true, message: "Calificaciones guardadas exitosamente." };
    } catch (error: any) {
        return { success: false, message: error.message || "Error de red al guardar notas." };
    }
}