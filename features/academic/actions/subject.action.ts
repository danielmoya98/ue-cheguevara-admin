"use server";

import { revalidatePath } from "next/cache";
import { subjectService } from "../services/subject.service";
import { subjectSchema } from "../validations/academic.schema";

export async function getSubjectsAction(query?: string) {
    try {
        const subjects = await subjectService.getSubjects(query);
        return { success: true, data: subjects };
    } catch (error) {
        return { success: false, error: "Error al cargar materias" };
    }
}

export async function saveSubjectAction(prevState: any, formData: FormData) {
    const id = formData.get("id") as string | null;
    const rawData = Object.fromEntries(formData.entries());

    // CORRECCIÓN: Convertir explícitamente a un Booleano Real (true/false), no a string
    rawData.isActive = formData.get("isActive") === "on";

    const validated = subjectSchema.safeParse(rawData);

    if (!validated.success) {
        // PRO-TIP: Esto imprimirá en tu terminal EXACTAMENTE por qué falló Zod
        console.error("ZOD ERROR:", validated.error.flatten().fieldErrors);

        return {
            success: false,
            message: "Datos inválidos",
            errors: validated.error.flatten().fieldErrors
        };
    }

    try {
        if (id) {
            await subjectService.updateSubject(id, validated.data);
            revalidatePath("/admin/academic");
            return { success: true, message: "Materia actualizada exitosamente" };
        } else {
            await subjectService.createSubject(validated.data);
            revalidatePath("/admin/academic");
            return { success: true, message: "Materia creada exitosamente" };
        }
    } catch (error: any) {
        return { success: false, message: error.message || "Error en el servidor" };
    }
}

export async function deleteSubjectAction(id: string) {
    try {
        await subjectService.deleteSubject(id);
        revalidatePath("/admin/academic");
        return { success: true, message: "Materia eliminada" };
    } catch (error: any) {
        return { success: false, message: error.message || "Error al eliminar" };
    }
}