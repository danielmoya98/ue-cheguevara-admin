import { z } from "zod";
import { AttendanceStatus } from "@/app/generated/prisma/client";

export const attendanceRecordSchema = z.object({
    studentId: z.string().uuid(),
    status: z.nativeEnum(AttendanceStatus),
    notes: z.string().nullable().optional(),
});

export const bulkAttendanceSchema = z.object({
    classroomId: z.string().uuid(),
    date: z.string(), // Recibimos "YYYY-MM-DD" desde el formulario
    records: z.array(attendanceRecordSchema)
});

export type BulkAttendanceInput = z.infer<typeof bulkAttendanceSchema>;