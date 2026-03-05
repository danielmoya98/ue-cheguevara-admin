import { subjectRepository } from "../repositories/subject.repository";
import { SubjectInput } from "../validations/academic.schema";
import { prisma } from "@/lib/db";

export const subjectService = {
    getSubjects: async (query?: string) => {
        return await subjectRepository.findAll(query);
    },

    createSubject: async (input: SubjectInput) => {
        // Regla: El código de la materia debe ser único
        const existing = await prisma.subject.findUnique({ where: { code: input.code } });
        if (existing) {
            throw new Error(`El código ${input.code} ya está en uso por otra materia.`);
        }

        return await subjectRepository.create({
            name: input.name,
            code: input.code,
            color: input.color,
            weeklyHours: input.weeklyHours,
            isActive: input.isActive ?? true
        });
    },

    updateSubject: async (id: string, input: SubjectInput) => {
        // Verificar existencia
        const existing = await prisma.subject.findUnique({ where: { id } });
        if (!existing) throw new Error("Materia no encontrada");

        // Si cambia el código, verificar que el nuevo no colisione con otra
        if (input.code !== existing.code) {
            const codeTaken = await prisma.subject.findUnique({ where: { code: input.code } });
            if (codeTaken) throw new Error(`El código ${input.code} ya está en uso.`);
        }

        return await subjectRepository.update(id, {
            name: input.name,
            code: input.code,
            color: input.color,
            weeklyHours: input.weeklyHours,
            isActive: input.isActive
        });
    },

    deleteSubject: async (id: string) => {
        const existing = await prisma.subject.findUnique({ where: { id } });
        if (!existing) throw new Error("Materia no encontrada");

        // Futuro: Aquí validaremos si la materia está asignada a un horario antes de borrarla
        return await subjectRepository.delete(id);
    }
};