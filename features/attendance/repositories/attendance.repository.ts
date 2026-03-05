import { prisma } from "@/lib/db";
import { AttendanceStatus } from "@/app/generated/prisma/client";

export const attendanceRepository = {
    // 1. Obtener la asistencia de un aula en una fecha específica
    getAttendanceByDate: async (classroomId: string, date: Date) => {
        return await prisma.attendance.findMany({
            where: {
                classroomId,
                date: date
            }
        });
    },

    // 2. Guardar asistencia (Upsert masivo: si existe actualiza, si no, crea)
    saveAttendanceBulk: async (
        classroomId: string,
        date: Date,
        records: { studentId: string; status: AttendanceStatus; notes?: string }[],
        recordedById: string
    ) => {
        // Prisma no tiene "upsertMany", así que usamos una transacción con upserts individuales
        const upsertPromises = records.map(record =>
            prisma.attendance.upsert({
                where: {
                    studentId_classroomId_date: {
                        studentId: record.studentId,
                        classroomId: classroomId,
                        date: date
                    }
                },
                update: {
                    status: record.status,
                    notes: record.notes,
                    recordedById
                },
                create: {
                    studentId: record.studentId,
                    classroomId: classroomId,
                    date: date,
                    status: record.status,
                    notes: record.notes,
                    recordedById
                }
            })
        );

        return await prisma.$transaction(upsertPromises);
    }
};