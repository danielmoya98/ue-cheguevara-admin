import { prisma } from "@/lib/db";
import { Prisma } from "@/app/generated/prisma/client";

export const subjectRepository = {
    // 1. Obtener todas las materias (con buscador opcional)
    findAll: async (query?: string) => {
        const where: Prisma.SubjectWhereInput = query ? {
            OR: [
                { name: { contains: query, mode: "insensitive" } },
                { code: { contains: query, mode: "insensitive" } },
            ]
        } : {};

        return await prisma.subject.findMany({
            where,
            orderBy: { name: "asc" }
        });
    },

    // 2. Crear nueva materia
    create: async (data: Prisma.SubjectCreateInput) => {
        return await prisma.subject.create({ data });
    },

    // 3. Actualizar materia
    update: async (id: string, data: Prisma.SubjectUpdateInput) => {
        return await prisma.subject.update({ where: { id }, data });
    },

    // 4. Eliminar (Soft delete o real, por ahora real)
    delete: async (id: string) => {
        return await prisma.subject.delete({ where: { id } });
    }
};