import { prisma } from "@/lib/db";
import { Prisma, Role } from "@/app/generated/prisma/client";

export const userRepository = {

    // 1. OBTENER Y FILTRAR
    findAll: async (filters?: { query?: string; role?: string }) => {
        const where: Prisma.UserWhereInput = {};

        // Filtro de texto (Nombre o Email)
        if (filters?.query) {
            where.OR = [
                { name: { contains: filters.query, mode: "insensitive" } },
                { email: { contains: filters.query, mode: "insensitive" } },
            ];
        }

        // Filtro de Rol (Convirtiendo a MAYÚSCULAS para que coincida con Prisma)
        if (filters?.role && filters.role !== "all") {
            where.role = filters.role.toUpperCase() as Role;
        }

        return await prisma.user.findMany({
            where,
            orderBy: { createdAt: "desc" },
            select: { id: true, name: true, email: true, role: true, status: true, createdAt: true }
        });
    },

    // 2. CREAR
    create: async (data: Prisma.UserCreateInput) => {
        return await prisma.user.create({ data });
    },

    // 3. ACTUALIZAR (¡Nuevo!)
    update: async (id: string, data: Prisma.UserUpdateInput) => {
        return await prisma.user.update({
            where: { id },
            data
        });
    },

    // 4. ELIMINAR (¡Nuevo!)
    delete: async (id: string) => {
        return await prisma.user.delete({
            where: { id }
        });
    }
};