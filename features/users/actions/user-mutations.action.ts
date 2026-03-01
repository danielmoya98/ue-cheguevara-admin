"use server";

import { revalidatePath } from "next/cache";

// Simulación de Crear
export async function createUserAction(formData: FormData) {
    await new Promise(r => setTimeout(r, 1000)); // Delay artificial
    console.log("Creando usuario:", Object.fromEntries(formData));
    revalidatePath("/admin/users"); // Recargar tabla
    return { success: true, message: "Usuario creado correctamente" };
}

// Simulación de Editar
export async function updateUserAction(formData: FormData) {
    await new Promise(r => setTimeout(r, 1000));
    console.log("Actualizando usuario:", Object.fromEntries(formData));
    revalidatePath("/admin/users");
    return { success: true, message: "Usuario actualizado correctamente" };
}

// Simulación de Eliminar
export async function deleteUserAction(id: string) {
    await new Promise(r => setTimeout(r, 1000));
    console.log("Eliminando usuario ID:", id);
    revalidatePath("/admin/users");
    return { success: true, message: "Usuario eliminado" };
}