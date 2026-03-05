"use server";

import { userService } from "../services/user.service";

export async function getUsersAction(filters?: { query?: string; role?: string }) {
    try {
        // CORRECCIÓN: Ahora pasamos los 'filters' al servicio
        const users = await userService.getUsers(filters);
        return { success: true, data: users };
    } catch (error) {
        return { success: false, error: "Error al cargar usuarios" };
    }
}