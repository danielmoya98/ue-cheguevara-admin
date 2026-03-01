"use server";

import { loginSchema } from "../validations/auth.schema";
import { authService } from "../services/auth.service";
import { redirect } from "next/navigation";
import { cookies } from "next/headers"; // Para guardar sesión simulada

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

    try {
        // 2. Llamar al Servicio
        const user = await authService.login(validated.data);

        // 3. Crear Sesión (Simulado por ahora, luego usaremos JWT/Auth.js)
        // NOTA: En un futuro paso configuraremos 'lib/auth.ts'
        (await cookies()).set("uecg_session", user.id);

    } catch (error: any) {
        return {
            success: false,
            message: error.message || "Error al iniciar sesión"
        };
    }

    // 4. Redireccionar (Fuera del try-catch en Next.js actions)
    redirect("/admin/dashboard");
}