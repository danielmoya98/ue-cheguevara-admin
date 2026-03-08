import { prisma } from "@/lib/db";
import { bulletinService } from "@/features/grades/services/bulletin.service";

export const promotionService = {
    /**
     * Analiza las notas de toda un aula y determina el destino de cada estudiante.
     */
    analyzeClassroom: async (classroomId: string, academicYear: number) => {
        const enrollments = await prisma.enrollment.findMany({
            where: { classroomId, academicYear, status: "ACTIVE" },
            include: { student: { include: { user: true } } }
        });

        const results = [];

        // Analizamos estudiante por estudiante usando el servicio de boletines
        for (const enr of enrollments) {
            try {
                const bulletin = await bulletinService.getStudentBulletin(enr.studentId, academicYear);
                let failedCount = 0;

                // Contamos cuántas materias tienen promedio final menor a 51
                bulletin.grades.forEach(g => {
                    if (g.final !== null && g.final < 51) failedCount++;
                });

                let status: "PROMOTED" | "RETAINED" | "REMEDIAL" = "PROMOTED";
                if (failedCount >= 3) status = "RETAINED";
                else if (failedCount > 0) status = "REMEDIAL"; // 1 o 2 reprobadas (Arrastre)

                results.push({
                    enrollmentId: enr.id,
                    student: enr.student,
                    failedCount,
                    status
                });
            } catch (error) {
                // Si el alumno no tiene notas o materias, lo ignoramos por ahora
                console.log(`Error analizando alumno ${enr.studentId}:`, error);
            }
        }

        return results;
    },

    /**
     * Ejecuta el cierre de gestión: Cambia el estado actual y crea las matrículas del próximo año.
     */
    executePromotion: async (classroomId: string, academicYear: number) => {
        const analysis = await promotionService.analyzeClassroom(classroomId, academicYear);
        const nextYear = academicYear + 1;

        const currentClassroom = await prisma.classroom.findUnique({
            where: { id: classroomId },
            include: { grade: true }
        });

        if (!currentClassroom) throw new Error("Aula no encontrada");

        // Lógica para encontrar el grado siguiente (Ej: de 1ro a 2do)
        let targetGradeId = null;
        const nextGrade = await prisma.grade.findFirst({
            where: {
                numericOrder: currentClassroom.grade.numericOrder + 1,
                level: currentClassroom.grade.level
            }
        });

        targetGradeId = nextGrade?.id;

        // Si terminó 6to de Primaria, el siguiente es 1ro de Secundaria
        if (!targetGradeId && currentClassroom.grade.numericOrder === 6 && currentClassroom.grade.level === "PRIMARIA") {
            const secGrade = await prisma.grade.findFirst({ where: { numericOrder: 1, level: "SECUNDARIA" } });
            targetGradeId = secGrade?.id;
        }

        // Buscar el aula equivalente en el nuevo grado (Ej: "A" -> "A")
        let nextClassroomId = null;
        if (targetGradeId) {
            const nextClassroom = await prisma.classroom.findFirst({
                where: { gradeId: targetGradeId, name: currentClassroom.name, shift: currentClassroom.shift }
            });
            nextClassroomId = nextClassroom?.id;
        }

        // TRANSACCIÓN: Hacemos todos los cambios en la BD de forma segura
        return await prisma.$transaction(async (tx) => {
            let promotedCount = 0;
            let retainedCount = 0;

            for (const result of analysis) {
                const isRetained = result.status === "RETAINED";
                const finalStatus = isRetained ? "RETAINED" : "PROMOTED";

                // 1. Cerrar la matrícula actual
                await tx.enrollment.update({
                    where: { id: result.enrollmentId },
                    data: { status: finalStatus }
                });

                // 2. Inscribir al próximo año
                // Si repite, se queda en el aula actual. Si pasa, va al aula nueva.
                // Si no existe el aula nueva (ej. Promoción de último año), no lo inscribimos.
                const targetClassId = isRetained ? classroomId : nextClassroomId;

                if (targetClassId) {
                    // Verificamos que no esté matriculado ya para evitar errores
                    const existing = await tx.enrollment.findUnique({
                        where: { studentId_academicYear: { studentId: result.student.id, academicYear: nextYear } }
                    });

                    if (!existing) {
                        await tx.enrollment.create({
                            data: {
                                studentId: result.student.id,
                                classroomId: targetClassId,
                                academicYear: nextYear,
                                status: "ACTIVE"
                            }
                        });
                    }
                }

                if (isRetained) retainedCount++;
                else promotedCount++;
            }

            return { promotedCount, retainedCount, nextYear };
        });
    }
};