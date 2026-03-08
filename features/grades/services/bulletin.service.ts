import { prisma } from "@/lib/db";

export const bulletinService = {
    getStudentBulletin: async (studentId: string, academicYear: number) => {
        // 1. Obtener datos del estudiante y su aula en la gestión solicitada
        const enrollment = await prisma.enrollment.findFirst({
            where: {
                studentId,
                academicYear, // ✅ Verificamos que esté inscrito ese año
                status: "ACTIVE"
            },
            include: {
                student: { include: { user: true } },
                classroom: { include: { grade: true } }
            }
        });

        if (!enrollment) {
            throw new Error(`El estudiante no se encuentra matriculado en la gestión ${academicYear}.`);
        }

        // 2. Obtener todas las materias que se dictan en su aula ESE AÑO
        const courses = await prisma.course.findMany({
            where: {
                classroomId: enrollment.classroomId,
                academicYear // ✅ Aseguramos traer la malla curricular exacta de ese año
            },
            include: { subject: true },
            orderBy: { subject: { name: 'asc' } }
        });

        if (courses.length === 0) {
            throw new Error(`No hay materias registradas para este curso en la gestión ${academicYear}.`);
        }

        // 3. Obtener TODAS las notas del estudiante en esta gestión
        const marks = await prisma.mark.findMany({
            where: {
                studentId,
                evaluation: {
                    course: {
                        academicYear // ✅ Solo exámenes rendidos en la gestión solicitada
                    }
                }
            },
            include: { evaluation: true }
        });

        // 4. Calcular promedios por Materia y Trimestre
        const grades = courses.map(course => {
            // Filtrar solo las notas de esta materia específica
            const courseMarks = marks.filter(m => m.evaluation.courseId === course.id);

            // Función interna para calcular el promedio de un trimestre específico
            const getTermAverage = (term: string) => {
                const termMarks = courseMarks.filter(m => m.evaluation.term === term);
                if (termMarks.length === 0) return null; // Aún no hay notas en este trimestre

                // Suma de los puntajes obtenidos por el alumno
                const totalScore = termMarks.reduce((acc, m) => acc + m.score, 0);
                // Suma de los puntajes máximos posibles de esos exámenes
                const totalMax = termMarks.reduce((acc, m) => acc + m.evaluation.maxScore, 0);

                if (totalMax === 0) return 0; // Evitar división por cero

                // Regla de 3 simple para sacar la nota sobre 100
                return Math.round((totalScore / totalMax) * 100);
            };

            const t1 = getTermAverage("TRIMESTRE_1");
            const t2 = getTermAverage("TRIMESTRE_2");
            const t3 = getTermAverage("TRIMESTRE_3");

            // Cálculo Final: Promedio de los trimestres que ya tienen nota validada (no nulos)
            let final = null;
            const activeTerms = [t1, t2, t3].filter(t => t !== null) as number[];

            if (activeTerms.length > 0) {
                // Sumamos los trimestres cursados y dividimos entre la cantidad de trimestres cursados
                final = Math.round(activeTerms.reduce((acc, val) => acc + val, 0) / activeTerms.length);
            }

            return {
                subjectName: course.subject.name,
                t1,
                t2,
                t3,
                final
            };
        });

        return {
            student: enrollment.student,
            classroom: enrollment.classroom,
            academicYear,
            grades
        };
    }
};