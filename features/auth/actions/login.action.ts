"use server";

import { loginSchema } from "../validations/auth.schema";
import { authService } from "../services/auth.service";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export async function loginAction(prevState: any, formData: FormData) {
    // 1. Validar Inputs
    const rawData = Object.fromEntries(formData.entries());
    const validated = loginSchema.safeParse(rawData);

    if (!validated.success) {
        return {
            success: false,
            errors: validated.error.flatten().fieldErrors,
            message: "Error en los datos ingresados."
        };
    }

    // Variable para almacenar a dónde vamos a redirigir
    let destination = "";

    try {
        // 2. Llamar al Servicio
        const user = await authService.login(validated.data);

        // 3. Crear Sesión
        (await cookies()).set("uecg_session", user.id);

        // 4. Decidir la ruta (PERO NO REDIRIGIR TODAVÍA)
        if (user.forcePasswordChange) {
            destination = "/onboarding";
        } else {
            destination = "/admin/dashboard";
        }

    } catch (error: any) {
        return {
            success: false,
            message: error.message || "Error al iniciar sesión"
        };
    }

    // 5. REDIRIGIR FUERA DEL TRY-CATCH
    // Así Next.js puede manejar su error interno NEXT_REDIRECT correctamente
    redirect(destination);
}