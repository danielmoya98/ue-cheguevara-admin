// src/features/announcements/actions/announcement.action.ts
"use server";

import { revalidatePath } from "next/cache";
import { apiFetch } from "../../../app/lib/api-client";

export async function getAnnouncementsAction(role?: "TEACHER" | "STUDENT" | "ADMIN") {
    try {
        // En NestJS, el endpoint GET /announcements leerá el JWT del usuario
        // y automáticamente devolverá los comunicados que le corresponden a su rol.
        // No necesitamos pasar el rol como parámetro en la URL por seguridad.
        const announcements = await apiFetch<any[]>("/announcements");
        return { success: true, data: announcements };
    } catch (error) {
        return { success: false, error: "Error al cargar comunicados", data: [] };
    }
}

export async function createAnnouncementAction(prevState: any, formData: FormData) {
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const target = formData.get("target") as string;
    const isImportant = formData.get("isImportant") === "true";

    if (!title || title.length < 3) return { success: false, message: "El título es muy corto." };
    if (!content || content.length < 5) return { success: false, message: "El contenido es muy corto." };

    try {
        // apiFetch enviará el JWT automáticamente, por lo que NestJS
        // sabrá exactamente qué usuario (authorId) está creando el anuncio.
        await apiFetch("/announcements", {
            method: "POST",
            body: JSON.stringify({
                title,
                content,
                target,
                isImportant
            })
        });

        revalidatePath("/admin/dashboard");
        return { success: true, message: "Comunicado publicado exitosamente." };
    } catch (error: any) {
        return { success: false, message: error.message || "Error al publicar el comunicado." };
    }
}