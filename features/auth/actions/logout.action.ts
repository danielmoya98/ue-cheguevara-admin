"use server";

import { redirect } from "next/navigation";
import { sessionService } from "../../../app/lib/session";

export async function logoutAction() {
    // Usamos el servicio centralizado para limpiar ambos tokens
    await sessionService.clearSession();

    // Redirigimos al inicio
    redirect("/login");
}