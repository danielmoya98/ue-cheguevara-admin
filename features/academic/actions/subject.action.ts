"use server";

import { revalidatePath } from "next/cache";
import { subjectSchema } from "../validations/academic.schema";
import { apiFetch } from "../../../app/lib/api-client";

export async function getSubjectsAction(query?: string) {
    try {
        const url = query ? `/subjects?q=${query}` : "/subjects";
        const subjects = await apiFetch<any[]>(url);
        return { success: true, data: subjects };
    } catch (error) {
        return { success: false, error: "Error al cargar materias de la API" };
    }
}

export async function saveSubjectAction(prevState: any, formData: FormData) {
    const id = formData.get("id") as string | null;
    const rawData = Object.fromEntries(formData.entries());

    rawData.isActive = formData.get("isActive") === "on";
    const validated = subjectSchema.safeParse(rawData);

    if (!validated.success) {
        return { success: false, message: "Datos inválidos", errors: validated.error.flatten().fieldErrors };
    }

    try {
        if (id) {
            // Extraemos el id para no mandarlo en el body (NestJS strict DTO)
            const { id: _id, ...updatePayload } = validated.data;
            await apiFetch(`/subjects/${id}`, { method: "PATCH", body: JSON.stringify(updatePayload) });
            revalidatePath("/admin/academic");
            return { success: true, message: "Materia actualizada exitosamente" };
        } else {
            const { id: _id, ...createPayload } = validated.data;
            await apiFetch("/subjects", { method: "POST", body: JSON.stringify(createPayload) });
            revalidatePath("/admin/academic");
            return { success: true, message: "Materia creada exitosamente" };
        }
    } catch (error: any) {
        return { success: false, message: error.message || "Error de conexión con la API" };
    }
}

export async function deleteSubjectAction(id: string) {
    try {
        await apiFetch(`/subjects/${id}`, { method: "DELETE" });
        revalidatePath("/admin/academic");
        return { success: true, message: "Materia eliminada" };
    } catch (error: any) {
        return { success: false, message: error.message || "Error al eliminar" };
    }
}