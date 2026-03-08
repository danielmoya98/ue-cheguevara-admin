import { cookies } from "next/headers";

/**
 * Servicio centralizado para manejar el Año Académico (Gestión) activo en la sesión del usuario.
 */
export const academicYearService = {
    /**
     * Obtiene el año académico que el usuario está visualizando actualmente.
     * Si no ha seleccionado ninguno, retorna el año real (calendario).
     */
    getActiveYear: async (): Promise<number> => {
        const cookieStore = await cookies();
        const yearCookie = cookieStore.get("uecg_academic_year");

        if (yearCookie && yearCookie.value) {
            const parsedYear = parseInt(yearCookie.value, 10);
            if (!isNaN(parsedYear)) {
                return parsedYear;
            }
        }

        // Fallback: Si no hay cookie válida, usamos el año actual real.
        return new Date().getFullYear();
    }
};