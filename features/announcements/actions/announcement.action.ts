"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function getAnnouncementsAction(role?: "TEACHER" | "STUDENT" | "ADMIN") {
    // Definir qué comunicados puede ver según su rol
    const targets = ["ALL"];
    if (role === "TEACHER") targets.push("TEACHERS");
    if (role === "STUDENT") targets.push("STUDENTS");
    if (role === "ADMIN") targets.push("TEACHERS", "STUDENTS");

    try {
        const announcements = await prisma.announcement.findMany({
            where: { target: { in: targets as any[] } },
            include: { author: { select: { name: true } } },
            orderBy: { createdAt: 'desc' },
            take: 5
        });
        return { success: true, data: announcements };
    } catch (error) {
        return { success: false, error: "Error al cargar comunicados", data: [] };
    }
}

export async function createAnnouncementAction(prevState: any, formData: FormData) {
    const userId = (await cookies()).get("uecg_session")?.value;
    if (!userId) return { success: false, message: "No autorizado. Inicie sesión." };

    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const target = formData.get("target") as any;
    const isImportant = formData.get("isImportant") === "true";

    if (!title || title.length < 3) return { success: false, message: "El título es muy corto." };
    if (!content || content.length < 5) return { success: false, message: "El contenido es muy corto." };

    try {
        await prisma.announcement.create({
            data: {
                title,
                content,
                target,
                isImportant,
                authorId: userId
            }
        });

        // Refrescamos el dashboard para que el tablón se actualice instantáneamente
        revalidatePath("/admin/dashboard");
        return { success: true, message: "Comunicado publicado exitosamente." };
    } catch (error: any) {
        return { success: false, message: error.message || "Error al publicar el comunicado." };
    }
}