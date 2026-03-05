"use server";

import { revalidatePath } from "next/cache";
import { gradeService } from "../services/grade.service";
import { evaluationSchema, bulkMarksSchema } from "../validations/grade.schema";
import { cookies } from "next/headers";

export async function createEvaluationAction(prevState: any, formData: FormData) {
    const userId = (await cookies()).get("uecg_session")?.value;
    if (!userId) return { success: false, message: "Sesión expirada." };

    const rawData = Object.fromEntries(formData.entries());
    const validated = evaluationSchema.safeParse(rawData);

    if (!validated.success) {
        return { success: false, message: "Datos inválidos", errors: validated.error.flatten().fieldErrors };
    }

    try {
        await gradeService.createEvaluation(validated.data, userId);
        revalidatePath(`/admin/academic/courses/${validated.data.courseId}`); // Ruta futura
        return { success: true, message: "Evaluación creada correctamente." };
    } catch (error: any) {
        return { success: false, message: error.message || "Error al crear la evaluación." };
    }
}

export async function saveMarksAction(prevState: any, formData: FormData) {
    try {
        const rawData = JSON.parse(formData.get("data") as string);
        const validated = bulkMarksSchema.safeParse(rawData);

        if (!validated.success) {
            return { success: false, message: "Notas inválidas. Verifique que sean números." };
        }

        await gradeService.saveMarks(validated.data);

        revalidatePath(`/admin/grades/evaluate/${validated.data.evaluationId}`);
        return { success: true, message: "Planilla de notas guardada exitosamente." };
    } catch (error: any) {
        return { success: false, message: error.message || "Error al guardar notas." };
    }
}