"use server";

import { revalidatePath } from "next/cache";
import { roleService } from "../services/role.service";

export async function getRolesOverviewAction() {
    try {
        const roles = await roleService.getRolesOverview();
        return { success: true, data: roles };
    } catch (error) {
        return { success: false, error: "Error al cargar los roles" };
    }
}

export async function updatePermissionsAction(roleId: string, permissions: string[]) {
    try {
        await roleService.updateRolePermissions(roleId, permissions);
        revalidatePath("/admin/roles");
        return { success: true, message: "Permisos actualizados correctamente" };
    } catch (error: any) {
        return { success: false, message: error.message || "Error al actualizar permisos" };
    }
}