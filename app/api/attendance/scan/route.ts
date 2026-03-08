import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
    try {
        // 1. Recibimos el ID del estudiante escaneado desde la App Móvil
        const body = await request.json();
        const { studentId } = body;

        if (!studentId) {
            return NextResponse.json({ success: false, message: "QR Inválido: Falta el ID del estudiante" }, { status: 400 });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const currentYear = today.getFullYear();

        // 2. Buscamos en qué aula está matriculado el alumno este año
        const enrollment = await prisma.enrollment.findFirst({
            where: { studentId, academicYear: currentYear, status: "ACTIVE" },
            include: { student: { include: { user: true } } }
        });

        if (!enrollment) {
            return NextResponse.json({ success: false, message: "Estudiante no matriculado en la gestión actual" }, { status: 404 });
        }

        // 3. Verificamos si ya se le tomó asistencia hoy (para no duplicar)
        const existingRecord = await prisma.attendance.findFirst({
            where: {
                studentId: studentId,
                date: today
            }
        });

        // 4. Registramos o actualizamos la asistencia a "PRESENTE"
        if (existingRecord) {
            await prisma.attendance.update({
                where: { id: existingRecord.id },
                data: { status: "PRESENT" }
            });
        } else {
            await prisma.attendance.create({
                data: {
                    studentId: studentId,
                    classroomId: enrollment.classroomId,
                    date: today,
                    status: "PRESENT"
                }
            });
        }

        // 5. Respondemos a la App Móvil con éxito para que suene el "Beep" y muestre el nombre
        return NextResponse.json({
            success: true,
            message: "Asistencia registrada",
            studentName: enrollment.student.user.name
        });

    } catch (error) {
        return NextResponse.json({ success: false, message: "Error interno del servidor" }, { status: 500 });
    }
}