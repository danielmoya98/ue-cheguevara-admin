"use server";

import { revalidatePath } from "next/cache";
import { gradeService } from "../services/grade.service";
import { gradeSchema, classroomSchema } from "../validations/academic.schema";

export async function getGradesAction() {
    try {
        const grades = await gradeService.getGradesOverview();
        return { success: true, data: grades };
    } catch (error) {
        return { success: false, error: "Error al cargar los grados" };
    }
}

export async function createGradeAction(prevState: any, formData: FormData) {
    const rawData = Object.fromEntries(formData.entries());
    const validated = gradeSchema.safeParse(rawData);

    if (!validated.success) {
        return { success: false, message: "Datos inválidos", errors: validated.error.flatten().fieldErrors };
    }

    try {
        await gradeService.createGrade(validated.data);
        revalidatePath("/admin/academic/grades"); // Asumiremos que crearemos una sub-pestaña
        return { success: true, message: "Grado creado exitosamente" };
    } catch (error: any) {
        return { success: false, message: error.message || "Error al crear el grado" };
    }
}

export async function createClassroomAction(prevState: any, formData: FormData) {
    const rawData = Object.fromEntries(formData.entries());
    const validated = classroomSchema.safeParse(rawData);

    if (!validated.success) {
        return { success: false, message: "Datos inválidos", errors: validated.error.flatten().fieldErrors };
    }

    try {
        await gradeService.createClassroom(validated.data);
        revalidatePath("/admin/academic/grades");
        return { success: true, message: "Paralelo añadido exitosamente" };
    } catch (error: any) {
        return { success: false, message: error.message || "Error al añadir el paralelo" };
    }
}

export async function deleteClassroomAction(id: string) {
    try {
        await gradeService.deleteClassroom(id);
        revalidatePath("/admin/academic/grades");
        return { success: true, message: "Paralelo eliminado" };
    } catch (error: any) {
        return { success: false, message: error.message || "Error al eliminar" };
    }
}