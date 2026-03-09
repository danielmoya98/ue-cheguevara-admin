"use server";

import { revalidatePath } from "next/cache";
import { apiFetch } from "../../../app/lib/api-client";

export async function getStudentsAction(query?: string, academicYear?: number) {
    try {
        const params = new URLSearchParams();
        if (query) params.append("q", query);
        if (academicYear) params.append("academicYear", academicYear.toString());

        const queryString = params.toString() ? `?${params.toString()}` : '';
        const students = await apiFetch<any[]>(`/students${queryString}`);

        return { success: true, data: students };
    } catch (error: any) {
        return { success: false, error: error.message || "Error al cargar el directorio" };
    }
}

export async function createStudentProfileAction(prevState: any, formData: FormData) {
    const rawData = Object.fromEntries(formData.entries());

    // Convertir string de fecha a formato ISO o fecha válida si es necesario,
    // pero idealmente tu Zod Schema lo maneja. Asumimos que validamos los datos:
    try {
        await apiFetch("/students", {
            method: "POST",
            body: JSON.stringify(rawData)
        });

        revalidatePath("/admin/students");
        return { success: true, message: "Expediente creado con éxito." };
    } catch (error: any) {
        return { success: false, message: error.message || "Error al crear el expediente." };
    }
}

export async function enrollStudentAction(prevState: any, formData: FormData) {
    const studentId = formData.get("studentId") as string;
    const classroomId = formData.get("classroomId") as string;
    const academicYear = Number(formData.get("academicYear"));

    try {
        // La API de NestJS verificará la capacidad máxima del aula y los duplicados
        await apiFetch("/enrollments", {
            method: "POST",
            body: JSON.stringify({ studentId, classroomId, academicYear })
        });

        revalidatePath("/admin/students");
        return { success: true, message: "Estudiante matriculado exitosamente." };
    } catch (error: any) {
        return { success: false, message: error.message || "Error al matricular." };
    }
}