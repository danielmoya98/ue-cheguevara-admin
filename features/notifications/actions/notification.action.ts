"use server";

import { prisma } from "@/lib/db";
import { cookies } from "next/headers";

export async function getNotificationsAction() {
    // 1. Identificar al usuario logueado
    const userId = (await cookies()).get("uecg_session")?.value;
    if (!userId) return { success: false, data: [], unreadCount: 0 };

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return { success: false, data: [], unreadCount: 0 };

    // 2. Definir qué comunicados puede ver según su rol
    const targets = ["ALL"];
    if (user.role === "TEACHER") targets.push("TEACHERS");
    if (user.role === "STUDENT") targets.push("STUDENTS");
    if (user.role === "ADMIN") targets.push("TEACHERS", "STUDENTS"); // El Admin ve todo

    try {
        // 3. Traer los últimos 10 comunicados y revisar si este usuario ya los leyó
        const announcements = await prisma.announcement.findMany({
            where: { target: { in: targets } },
            orderBy: { createdAt: 'desc' },
            take: 10,
            include: {
                reads: { where: { userId: userId } } // Solo trae el registro si ESTE usuario lo leyó
            }
        });

        // 4. Mapear los datos para el frontend
        const notifications = announcements.map(a => ({
            id: a.id,
            title: a.title,
            content: a.content,
            isImportant: a.isImportant,
            createdAt: a.createdAt,
            isRead: a.reads.length > 0 // Si el arreglo 'reads' tiene algo, ya lo leyó
        }));

        const unreadCount = notifications.filter(n => !n.isRead).length;

        return { success: true, data: notifications, unreadCount };
    } catch (error) {
        return { success: false, data: [], unreadCount: 0 };
    }
}

export async function markAsReadAction(announcementId: string) {
    const userId = (await cookies()).get("uecg_session")?.value;
    if (!userId) return { success: false };

    try {
        // Usamos upsert para evitar errores si hace doble clic
        await prisma.notificationRead.upsert({
            where: { userId_announcementId: { userId, announcementId } },
            update: {},
            create: { userId, announcementId }
        });
        return { success: true };
    } catch (error) {
        return { success: false };
    }
}