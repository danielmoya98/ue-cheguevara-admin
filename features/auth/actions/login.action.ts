"use server";

import { loginSchema } from "../validations/auth.schema";
import { redirect } from "next/navigation";
import { apiFetch } from "../../../app/lib/api-client";
import { sessionService } from "../../../app/lib/session";

export async function loginAction(prevState: any, formData: FormData) {
    // 1. VALIDACIÓN ESTRUCTURAL (Zod) en el Frontend
    const rawData = Object.fromEntries(formData.entries());
    const validated = loginSchema.safeParse(rawData);

    if (!validated.success) {
        return {
            success: false,
            errors: validated.error.flatten().fieldErrors,
            message: "Datos de acceso no válidos."
        };
    }

    let destination = "";

    try {
        // 2. LLAMADA A LA API (NestJS)
        // Usamos requireAuth: false porque es el login
        const response = await apiFetch<{
            user: { id: string; name: string; role: string; forcePasswordChange: boolean };
            accessToken: string;
            refreshToken: string;
        }>("/auth/login", {
            method: "POST",
            requireAuth: false,
            body: JSON.stringify(validated.data),
        });

        // 3. PERSISTENCIA DE SESIÓN (Cookies Seguras)
        // Guardamos tanto el Access como el Refresh Token
        await sessionService.setTokens({
            accessToken: response.accessToken,
            refreshToken: response.refreshToken
        });

        // 4. LÓGICA DE REDIRECCIÓN BASADA EN LA RESPUESTA DE LA API
        if (response.user.forcePasswordChange) {
            destination = "/onboarding"; // O "/auth/change-password"
        } else {
            const roleRoutes: Record<string, string> = {
                ADMIN: "/admin/dashboard",
                TEACHER: "/teacher/dashboard",
                STUDENT: "/student/dashboard",
                SECRETARY: "/admin/dashboard", // O una ruta específica para secretaría
            };
            destination = roleRoutes[response.user.role] || "/";
        }

    } catch (error: any) {
        // Manejamos errores de la API (401, 403, 500, etc.)
        return {
            success: false,
            message: error.message || "Error al conectar con el servidor"
        };
    }

    // 5. REDIRECCIÓN FINAL
    redirect(destination);
}