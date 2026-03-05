import { prisma } from "@/lib/db";
import { Role } from "@/app/generated/prisma/client";

export const roleRepository = {
    // 1. Obtener todos los permisos de un rol específico
    getPermissionsByRole: async (role: Role) => {
        const permissions = await prisma.rolePermission.findMany({
            where: { role },
            select: { permissionId: true }
        });
        return permissions.map(p => p.permissionId);
    },

    // 2. Obtener la cantidad de usuarios por cada rol (Para las Tarjetas UI)
    getUserCountsByRole: async () => {
        const groupUsers = await prisma.user.groupBy({
            by: ['role'],
            _count: { id: true }
        });

        // Convertimos el array a un objeto: { ADMIN: 2, TEACHER: 10, ... }
        return groupUsers.reduce((acc, curr) => {
            acc[curr.role] = curr._count.id;
            return acc;
        }, {} as Record<Role, number>);
    },

    // 3. Actualizar permisos (Transacción: Borrar anteriores e insertar nuevos)
    updatePermissions: async (role: Role, permissions: string[]) => {
        return await prisma.$transaction([
            // Limpiamos los permisos actuales de ese rol
            prisma.rolePermission.deleteMany({ where: { role } }),
            // Insertamos la nueva matriz
            prisma.rolePermission.createMany({
                data: permissions.map(permissionId => ({
                    role,
                    permissionId
                }))
            })
        ]);
    }
};