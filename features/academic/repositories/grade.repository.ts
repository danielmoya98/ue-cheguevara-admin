import { prisma } from "@/lib/db";
import { Prisma, AcademicLevel } from "@/app/generated/prisma/client";

export const gradeRepository = {
    // 1. Obtener todos los grados con sus paralelos, ordenados por nivel y número
    findAllWithClassrooms: async () => {
        return await prisma.grade.findMany({
            include: {
                classrooms: {
                    orderBy: { name: 'asc' } // Ordena los paralelos: A, B, C...
                }
            },
            orderBy: [
                { level: 'asc' },        // PRIMARIA primero, luego SECUNDARIA
                { numericOrder: 'asc' }  // 1ro, 2do, 3ro...
            ]
        });
    },

    // 2. Crear un Grado (Ej: "Primero de Primaria")
    createGrade: async (data: Prisma.GradeCreateInput) => {
        return await prisma.grade.create({ data });
    },

    // 3. Añadir un Paralelo a un Grado existente (Ej: Crear "A" en 1ro de Primaria)
    createClassroom: async (gradeId: string, name: string, shift: string, capacity: number) => {
        return await prisma.classroom.create({
            data: {
                name: name.toUpperCase(),
                shift: shift.toUpperCase(),
                capacity,
                grade: { connect: { id: gradeId } }
            }
        });
    },

    // 4. Eliminar un paralelo
    deleteClassroom: async (id: string) => {
        return await prisma.classroom.delete({ where: { id } });
    }
};