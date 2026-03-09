"use server";

import { apiFetch } from "../../../app/lib/api-client";
import { User } from "../validations/user.schema";

export async function getUsersAction(filters?: { query?: string; role?: string }) {
    try {
        // Construimos los Query Parameters para NestJS
        const queryParams = new URLSearchParams();
        if (filters?.query) queryParams.append('q', filters.query);
        if (filters?.role && filters.role !== "all") queryParams.append('role', filters.role);

        const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';

        // apiFetch inyecta el token y llama a GET /api/users?q=...
        const users = await apiFetch<User[]>(`/users${queryString}`);

        return { success: true, data: users };
    } catch (error: any) {
        return { success: false, error: error.message || "Error al cargar usuarios de la API" };
    }
}