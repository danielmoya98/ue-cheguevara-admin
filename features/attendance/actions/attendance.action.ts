"use server";

import { revalidatePath } from "next/cache";
import { attendanceService } from "../services/attendance.service";
import { bulkAttendanceSchema } from "../validations/attendance.schema";
import { cookies } from "next/headers";

export async function saveAttendanceAction(prevState: any, formData: FormData) {
    // Obtenemos el ID del administrador actual desde las cookies (sesión simulada)
    const userId = (await cookies()).get("uecg_session")?.value;

    if (!userId) {
        return { success: false, message: "No autorizado. Sesión expirada." };
    }

    try {
        // Parseamos el JSON que enviamos desde el input hidden del componente cliente
        const rawData = JSON.parse(formData.get("data") as string);
        const validated = bulkAttendanceSchema.safeParse(rawData);

        if (!validated.success) {
            console.error("ZOD ERROR (Attendance):", validated.error.flatten().fieldErrors);
            return { success: false, message: "Datos inválidos verificando asistencia." };
        }

        await attendanceService.saveAttendance(validated.data, userId);

        revalidatePath(`/admin/attendance`);
        return { success: true, message: "Registro de asistencia guardado exitosamente." };
    } catch (error: any) {
        return { success: false, message: error.message || "Error al guardar asistencia" };
    }
}