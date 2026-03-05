import { gradeRepository } from "../repositories/grade.repository";
import { GradeInput, ClassroomInput } from "../validations/academic.schema";
import { prisma } from "@/lib/db";

export const gradeService = {
    getGradesOverview: async () => {
        return await gradeRepository.findAllWithClassrooms();
    },

    createGrade: async (input: GradeInput) => {
        // Regla: No puede haber dos grados con el mismo orden numérico en el mismo nivel
        const existing = await prisma.grade.findUnique({
            where: {
                numericOrder_level: {
                    numericOrder: input.numericOrder,
                    level: input.level
                }
            }
        });

        if (existing) {
            throw new Error(`El grado ${input.numericOrder} ya existe en ${input.level}.`);
        }

        return await gradeRepository.createGrade({
            name: input.name,
            numericOrder: input.numericOrder,
            level: input.level
        });
    },

    createClassroom: async (input: ClassroomInput) => {
        // Regla: No puede haber dos paralelos con el mismo nombre y turno en el mismo grado
        const existing = await prisma.classroom.findUnique({
            where: {
                gradeId_name_shift: {
                    gradeId: input.gradeId,
                    name: input.name,
                    shift: input.shift
                }
            }
        });

        if (existing) {
            throw new Error(`El paralelo "${input.name}" ya existe en el turno ${input.shift} para este grado.`);
        }

        return await gradeRepository.createClassroom(input.gradeId, input.name, input.shift, input.capacity);
    },

    deleteClassroom: async (id: string) => {
        // Validaremos en el futuro que no haya alumnos inscritos antes de borrar
        return await gradeRepository.deleteClassroom(id);
    }
};