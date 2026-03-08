"use server";

import { revalidatePath } from "next/cache";
import { courseService } from "../services/course.service";
import { courseSchema } from "../validations/academic.schema";

export async function getCoursesByClassroomAction(classroomId: string) {
    try {
        const courses = await courseService.getCoursesByClassroom(classroomId);
        return { success: true, data: courses };
    } catch (error) {
        return { success: false, error: "Error al cargar las asignaturas" };
    }
}

export async function assignCourseAction(prevState: any, formData: FormData) {
    const rawData = Object.fromEntries(formData.entries());
    const validated = courseSchema.safeParse(rawData);

    if (!validated.success) {
        console.error("ZOD ERROR (Course):", validated.error.flatten().fieldErrors);
        return { success: false, message: "Datos inválidos", errors: validated.error.flatten().fieldErrors };
    }

    try {
        await courseService.assignCourse(validated.data);
        // Recargamos la página del detalle del paralelo (la crearemos luego)
        revalidatePath(`/admin/academic/classrooms/${validated.data.classroomId}`);
        return { success: true, message: "Asignatura añadida a la malla" };
    } catch (error: any) {
        return { success: false, message: error.message || "Error al asignar" };
    }
}

export async function removeCourseAction(id: string, classroomId: string) {
    try {
        await courseService.removeCourse(id);
        revalidatePath(`/admin/academic/classrooms/${classroomId}`);
        return { success: true, message: "Asignatura removida de la malla" };
    } catch (error: any) {
        return { success: false, message: error.message || "Error al remover" };
    }
}

export async function getTeacherCoursesAction(teacherId?: string, activeYear?: number) {
    try {
        // Ahora pasamos también el activeYear al servicio de base de datos
        const courses = await courseService.getTeacherCourses(teacherId, activeYear);
        return { success: true, data: courses };
    } catch (error) {
        return { success: false, error: "Error al cargar las materias del docente" };
    }
}