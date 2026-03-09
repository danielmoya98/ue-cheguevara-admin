"use server";

import { revalidatePath } from "next/cache";
import { userSchema } from "../validations/user.schema";
import { apiFetch } from "../../../app/lib/api-client";

export async function createUserAction(prevState: any, formData: FormData) {
    const rawData = Object.fromEntries(formData.entries());
    const validated = userSchema.safeParse(rawData);

    if (!validated.success) {
        return { success: false, message: "Datos inválidos", errors: validated.error.flatten().fieldErrors };
    }

    // El frontend verifica que haya mandado contraseña, ya que es nuevo
    if (!validated.data.password) {
        return { success: false, message: "La contraseña es obligatoria para nuevos usuarios" };
    }

    try {
        // Llamada a NestJS: POST /api/users
        await apiFetch("/users", {
            method: "POST",
            body: JSON.stringify(validated.data)
        });

        revalidatePath("/admin/users");
        return { success: true, message: "Usuario creado correctamente" };
    } catch (error: any) {
        return { success: false, message: error.message || "Error al conectar con la API" };
    }
}

export async function updateUserAction(prevState: any, formData: FormData) {
    // Obtenemos el ID desde el formulario (input type="hidden")
    const id = formData.get("id") as string;

    if (!id) {
        return { success: false, message: "ID de usuario requerido" };
    }

    const rawData = Object.fromEntries(formData.entries());
    const validated = userSchema.safeParse(rawData);

    if (!validated.success) {
        return { success: false, message: "Datos inválidos", errors: validated.error.flatten().fieldErrors };
    }

    try {
        // CORRECCIÓN CLAVE: Extraemos el 'id' del objeto validado.
        // NestJS (con ValidationPipe y whitelist:true) rechaza peticiones
        // si enviamos el 'id' dentro del body en un PATCH.
        const { id: _id, ...updatePayload } = validated.data;

        // Llamada a NestJS: PATCH /api/users/:id
        await apiFetch(`/users/${id}`, {
            method: "PATCH",
            body: JSON.stringify(updatePayload)
        });

        revalidatePath("/admin/users");
        return { success: true, message: "Usuario actualizado correctamente" };
    } catch (error: any) {
        return { success: false, message: error.message || "Error al actualizar en la API" };
    }
}
export async function deleteUserAction(id: string) {
    try {
        // Llamada a NestJS: DELETE /api/users/:id
        await apiFetch(`/users/${id}`, {
            method: "DELETE"
        });

        revalidatePath("/admin/users");
        return { success: true, message: "Usuario eliminado correctamente" };
    } catch (error: any) {
        return { success: false, message: error.message || "Error al eliminar en la API" };
    }
}