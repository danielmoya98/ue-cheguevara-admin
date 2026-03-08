"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

/**
 * Server Action para cambiar la gestión (año escolar) activa del usuario.
 */
export async function setAcademicYearAction(year: number, currentPath: string) {
    try {
        const cookieStore = await cookies();

        // Guardamos el año elegido en una cookie que dura 1 semana
        cookieStore.set("uecg_academic_year", year.toString(), {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24 * 7,
            path: "/",
        });

        // Forzamos a Next.js a recargar los datos de la página en la que está el usuario
        revalidatePath(currentPath);

        return { success: true };
    } catch (error) {
        return { success: false, message: "Error al cambiar de gestión." };
    }
}