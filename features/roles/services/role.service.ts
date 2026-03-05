import { roleRepository } from "../repositories/role.repository";
import { Role } from "@/app/generated/prisma/client";
// Importamos la lista maestra de permisos que creamos antes en el mock
import { ALL_PERMISSIONS } from "../data/mock-roles";

export const roleService = {

    // Construye la data para las tarjetas de la UI combinando BD y Enums
    getRolesOverview: async () => {
        const counts = await roleRepository.getUserCountsByRole();

        // Definimos la estructura base de nuestros roles
        const rolesDef = [
            { id: Role.ADMIN, name: "Administrador", description: "Acceso total al sistema. Funciones críticas.", isSystem: true },
            { id: Role.TEACHER, name: "Docente", description: "Gestión académica, notas y asistencia.", isSystem: false },
            { id: Role.STUDENT, name: "Estudiante", description: "Acceso a su propio historial y horario.", isSystem: false },
        ];

        // Mapeamos los permisos reales desde la BD a cada rol
        return await Promise.all(rolesDef.map(async (r) => {
            // Si es ADMIN, por regla de negocio le damos TODOS los permisos siempre
            const permissions = r.id === Role.ADMIN
                ? ALL_PERMISSIONS.map(p => p.id)
                : await roleRepository.getPermissionsByRole(r.id);

            return {
                ...r,
                usersCount: counts[r.id] || 0,
                permissions
            };
        }));
    },

    updateRolePermissions: async (role: string, newPermissions: string[]) => {
        // Validación de seguridad: No se pueden editar los permisos del ADMIN
        if (role === Role.ADMIN) {
            throw new Error("Los permisos del Administrador del Sistema no pueden ser modificados.");
        }

        // Validar que el rol exista en el Enum
        if (!Object.values(Role).includes(role as Role)) {
            throw new Error("Rol inválido");
        }

        return await roleRepository.updatePermissions(role as Role, newPermissions);
    }
};