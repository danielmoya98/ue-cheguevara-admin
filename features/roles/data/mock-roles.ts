import { Role, Permission } from "../types/roles.types";

export const ALL_PERMISSIONS: Permission[] = [
    { id: "users:read", module: "users", action: "read", label: "Ver Usuarios" },
    { id: "users:write", module: "users", action: "write", label: "Crear/Editar Usuarios" },
    { id: "users:delete", module: "users", action: "delete", label: "Eliminar Usuarios" },

    { id: "academic:read", module: "academic", action: "read", label: "Ver Notas/Cursos" },
    { id: "academic:grade", module: "academic", action: "write", label: "Calificar Estudiantes" },

    { id: "settings:manage", module: "settings", action: "write", label: "Configurar Sistema" },
];

export const MOCK_ROLES: Role[] = [
    {
        id: "admin",
        name: "Administrador",
        description: "Acceso total al sistema",
        usersCount: 3,
        permissions: ["users:read", "users:write", "users:delete", "academic:read", "academic:grade", "settings:manage"],
        isSystem: true
    },
    {
        id: "teacher",
        name: "Docente",
        description: "Gestión académica y calificación",
        usersCount: 45,
        permissions: ["academic:read", "academic:grade"]
    },
    {
        id: "student",
        name: "Estudiante",
        description: "Acceso limitado a información personal",
        usersCount: 1200,
        permissions: ["academic:read"]
    },
];