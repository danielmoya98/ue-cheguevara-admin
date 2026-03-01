"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function logoutAction() {
    // Destruir sesión
    (await cookies()).delete("uecg_session");

    // Redirigir al login
    redirect("/login");
}