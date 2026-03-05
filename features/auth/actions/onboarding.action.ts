"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";

export async function completeOnboardingAction(prevState: any, formData: FormData) {
    // 1. Obtener la sesión del usuario actual
    const userId = (await cookies()).get("uecg_session")?.value;
    if (!userId) return { success: false, message: "Sesión inválida" };

    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (!password || password.length < 6) {
        return { success: false, message: "La contraseña debe tener mínimo 6 caracteres" };
    }

    if (password !== confirmPassword) {
        return { success: false, message: "Las contraseñas no coinciden" };
    }

    try {
        // 2. Encriptar y actualizar en la BD
        const passwordHash = await bcrypt.hash(password, 10);

        await prisma.user.update({
            where: { id: userId },
            data: {
                passwordHash,
                forcePasswordChange: false // IMPORTANTE: Quitamos la bandera
            }
        });

    } catch (error) {
        return { success: false, message: "Error al actualizar la contraseña" };
    }

    // 3. Si todo sale bien, lo mandamos al dashboard
    redirect("/admin/dashboard");
}