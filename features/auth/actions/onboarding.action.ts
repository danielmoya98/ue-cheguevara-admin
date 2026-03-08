"use server";

import { redirect } from "next/navigation";
import { apiFetch } from "../../../app/lib/api-client";

export async function completeOnboardingAction(prevState: any, formData: FormData) {
    // 1. Extraemos los 3 campos del formulario
    const oldPassword = formData.get("oldPassword") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    // 2. Validaciones básicas en el frontend
    if (!oldPassword) {
        return { success: false, message: "Debes ingresar tu contraseña actual" };
    }

    if (!password || password.length < 6) {
        return { success: false, message: "La nueva contraseña debe tener mínimo 6 caracteres" };
    }

    if (password !== confirmPassword) {
        return { success: false, message: "Las contraseñas nuevas no coinciden" };
    }

    if (oldPassword === password) {
        return { success: false, message: "La nueva contraseña no puede ser igual a la anterior" };
    }

    let destination = "";

    try {
        // 3. LLAMADA A LA API DE NESTJS
        // apiFetch inyectará el token JWT en las cabeceras automáticamente
        const response = await apiFetch<{ role: string }>("/auth/change-password", {
            method: "POST",
            body: JSON.stringify({
                oldPassword: oldPassword,
                newPassword: password // Aquí la mapeamos a 'newPassword' como espera NestJS
            }),
        });

        // 4. Redirección dinámica según el rol devuelto
        const roleRoutes: Record<string, string> = {
            ADMIN: "/admin/dashboard",
            TEACHER: "/teacher/dashboard",
            STUDENT: "/student/dashboard",
        };
        destination = roleRoutes[response.role] || "/login";

    } catch (error: any) {
        // Capturamos si NestJS dice "La contraseña antigua es incorrecta" (Status 400 o 401)
        return {
            success: false,
            message: error.message || "Error al actualizar la contraseña. Verifica tu clave actual."
        };
    }

    redirect(destination);
}