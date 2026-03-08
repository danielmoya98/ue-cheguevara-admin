import { attendanceRepository } from "../repositories/attendance.repository";
import { prisma } from "@/lib/db";
import { BulkAttendanceInput } from "../validations/attendance.schema";

export const attendanceService = {

    // Obtiene la lista de estudiantes del aula mezclada con su asistencia (si ya se tomó ese día)
    getAttendanceRoster: async (classroomId: string, dateString: string, activeYear: number) => {
        const targetDate = new Date(`${dateString}T00:00:00Z`); // Aseguramos medianoche UTC

        // 1. Obtenemos a los estudiantes activos en esa aula EN LA GESTIÓN SOLICITADA
        const enrollments = await prisma.enrollment.findMany({
            where: {
                classroomId,
                academicYear: activeYear, // ✅ CORREGIDO: Usamos la máquina del tiempo, no new Date()
                status: "ACTIVE"
            },
            include: {
                student: { include: { user: true } }
            },
            orderBy: { student: { user: { name: 'asc' } } }
        });

        // 2. Obtenemos los registros de asistencia que ya existan para esa fecha
        const existingAttendance = await attendanceRepository.getAttendanceByDate(classroomId, targetDate);

        // 3. Mezclamos los datos
        return enrollments.map(enrollment => {
            const record = existingAttendance.find(a => a.studentId === enrollment.studentId);
            return {
                studentId: enrollment.studentId,
                documentId: enrollment.student.documentId,
                name: enrollment.student.user.name,
                // Si no hay registro, por defecto todos están presentes (optimiza el trabajo del maestro)
                status: record ? record.status : "PRESENT",
                notes: record ? record.notes : ""
            };
        });
    },

    saveAttendance: async (input: BulkAttendanceInput, recordedById: string) => {
        // Aseguramos que la fecha se guarde correctamente a medianoche UTC
        const targetDate = new Date(`${input.date}T00:00:00Z`);

        // Transformar los nulls a undefined o vacíos para Prisma
        const safeRecords = input.records.map(r => ({
            studentId: r.studentId,
            status: r.status,
            notes: r.notes || ""
        }));

        return await attendanceRepository.saveAttendanceBulk(
            input.classroomId,
            targetDate,
            safeRecords,
            recordedById
        );
    }
};