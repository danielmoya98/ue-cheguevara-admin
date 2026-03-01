export type Permission = {
    id: string;
    module: "users" | "academic" | "finance" | "settings";
    action: "read" | "write" | "delete";
    label: string;
};

export type Role = {
    id: string;
    name: string;
    description: string;
    usersCount: number;
    permissions: string[]; // IDs de los permisos
    isSystem?: boolean; // Si es true, no se puede borrar (ej: Admin)
};