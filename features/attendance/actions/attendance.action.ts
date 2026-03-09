"use server";

import { revalidatePath } from "next/cache";
import { bulkAttendanceSchema } from "../validations/attendance.schema";
import { apiFetch } from "../../../app/lib/api-client";

export async function getAttendanceRosterAction(classroomId: string, date: string, academicYear: number) {
    try {
        // Obtenemos la planilla ya combinada directamente desde NestJS
        const roster = await apiFetch<any[]>(`/attendance/roster?classroomId=${classroomId}&date=${date}&academicYear=${academicYear}`);
        return { success: true, data: roster };
    } catch (error) {
        return { success: false, data: [] };
    }
}

export async function saveAttendanceAction(prevState: any, formData: FormData) {
    try {
        // Parseamos el JSON que enviamos desde el input hidden
        const rawData = JSON.parse(formData.get("data") as string);
        const validated = bulkAttendanceSchema.safeParse(rawData);

        if (!validated.success) {
            return { success: false, message: "Datos inválidos al verificar asistencia." };
        }

        // Llamada a NestJS: POST /api/attendance/bulk
        // Nota: apiFetch inyecta automáticamente el JWT, así que NestJS sabrá exactamente qué profesor o admin está guardando esto.
        await apiFetch("/attendance/bulk", {
            method: "POST",
            body: JSON.stringify(validated.data)
        });

        revalidatePath(`/admin/attendance`);
        return { success: true, message: "Registro de asistencia guardado exitosamente." };
    } catch (error: any) {
        return { success: false, message: error.message || "Error al conectar con la API." };
    }
}