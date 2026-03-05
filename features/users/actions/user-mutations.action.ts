"use server";

import { revalidatePath } from "next/cache";
import { userSchema } from "../validations/user.schema";
import { userService } from "../services/user.service";

export async function createUserAction(prevState: any, formData: FormData) {
    // 1. Extraer y Validar datos
    const rawData = Object.fromEntries(formData.entries());
    const validated = userSchema.safeParse(rawData);

    if (!validated.success) {
        return { success: false, message: "Datos inválidos", errors: validated.error.flatten().fieldErrors };
    }

    try {
        // 2. Llamar al servicio
        await userService.createUser(validated.data);

        // 3. Recargar la tabla
        revalidatePath("/admin/users");

        return { success: true, message: "Usuario creado correctamente" };
    } catch (error: any) {
        return { success: false, message: error.message || "Error al crear usuario" };
    }
}

export async function updateUserAction(prevState: any, formData: FormData) {
    // 1. Extraemos el ID que el formulario nos envía (input type="hidden")
    const id = formData.get("id") as string;
    if (!id) {
        return { success: false, message: "ID de usuario requerido" };
    }

    // 2. Extraer y Validar el resto de los datos
    const rawData = Object.fromEntries(formData.entries());
    const validated = userSchema.safeParse(rawData);

    if (!validated.success) {
        return { success: false, message: "Datos inválidos", errors: validated.error.flatten().fieldErrors };
    }

    try {
        // 3. Llamar al servicio para actualizar
        await userService.updateUser(id, validated.data);

        // 4. Recargar la tabla
        revalidatePath("/admin/users");

        return { success: true, message: "Usuario actualizado correctamente" };
    } catch (error: any) {
        return { success: false, message: error.message || "Error al actualizar" };
    }
}

export async function deleteUserAction(id: string) {
    try {
        await userService.deleteUser(id);
        revalidatePath("/admin/users");
        return { success: true, message: "Usuario eliminado correctamente" };
    } catch (error: any) {
        return { success: false, message: error.message || "Error al eliminar usuario" };
    }
}