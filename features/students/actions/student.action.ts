"use server";

import { revalidatePath } from "next/cache";
import { studentService } from "../services/student.service";
import { enrollmentSchema, studentProfileSchema } from "../validations/student.schema";

export async function getStudentsAction(query?: string, classroomId?: string) {
    try {
        const students = await studentService.getStudents(query, classroomId);
        return { success: true, data: students };
    } catch (error) {
        return { success: false, error: "Error al cargar estudiantes" };
    }
}

export async function enrollStudentAction(prevState: any, formData: FormData) {
    const rawData = Object.fromEntries(formData.entries());
    const validated = enrollmentSchema.safeParse(rawData);

    if (!validated.success) {
        console.error("ZOD ERROR (Enrollment):", validated.error.flatten().fieldErrors);
        return { success: false, message: "Datos inválidos", errors: validated.error.flatten().fieldErrors };
    }

    try {
        await studentService.enrollStudent(validated.data);
        revalidatePath("/admin/students");
        return { success: true, message: "Estudiante matriculado exitosamente" };
    } catch (error: any) {
        return { success: false, message: error.message || "Error al matricular" };
    }
}

export async function updateStudentProfileAction(studentId: string, formData: FormData) {
    const rawData = Object.fromEntries(formData.entries());
    const validated = studentProfileSchema.safeParse(rawData);

    if (!validated.success) {
        return { success: false, message: "Datos de perfil inválidos", errors: validated.error.flatten().fieldErrors };
    }

    try {
        await studentService.updateProfile(studentId, validated.data);
        revalidatePath(`/admin/students/${studentId}`);
        return { success: true, message: "Perfil actualizado" };
    } catch (error: any) {
        return { success: false, message: error.message || "Error al actualizar perfil" };
    }
}

export async function createStudentProfileAction(prevState: any, formData: FormData) {
    const rawData = Object.fromEntries(formData.entries());
    const userId = rawData.userId as string;

    // Removemos userId del rawData porque no es parte del schema de perfil
    const { userId: _, ...profileData } = rawData;

    const validated = studentProfileSchema.safeParse(profileData);

    if (!validated.success) {
        console.error("ZOD ERROR (Profile):", validated.error.flatten().fieldErrors);
        return { success: false, message: "Datos de perfil inválidos", errors: validated.error.flatten().fieldErrors };
    }

    try {
        await studentService.createProfile(userId, validated.data);
        revalidatePath("/admin/students");
        return { success: true, message: "Perfil estudiantil registrado con éxito" };
    } catch (error: any) {
        return { success: false, message: error.message || "Error al crear perfil" };
    }
}