"use client";

import { useState, useEffect } from "react";
import RoleCard from "@/features/roles/components/role-card";
import Modal from "@/shared/components/modal";
import PermissionMatrix from "@/features/roles/components/permission-matrix";
import { getRolesOverviewAction, updatePermissionsAction } from "@/features/roles/actions/role.action";
import { ShieldCheck } from "lucide-react";
import { toast } from "sonner";

// Type inferido para usar en el estado
type RoleData = { id: string; name: string; description: string; isSystem: boolean; usersCount: number; permissions: string[] };

export default function RolesPage() {
    const [roles, setRoles] = useState<RoleData[]>([]);
    const [selectedRole, setSelectedRole] = useState<RoleData | null>(null);
    const [draftPermissions, setDraftPermissions] = useState<string[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Cargar datos reales de la BD al montar
    useEffect(() => {
        const fetchRoles = async () => {
            const result = await getRolesOverviewAction();
            if (result.success && result.data) {
                setRoles(result.data);
            } else {
                toast.error("Error al conectar con la base de datos");
            }
            setIsLoading(false);
        };
        fetchRoles();
    }, []);

    // Abrir Modal y preparar el "borrador" de permisos
    const handleEditRole = (role: RoleData) => {
        setSelectedRole(role);
        setDraftPermissions(role.permissions);
    };

    // Lógica del "Switch Suizo"
    const handleTogglePermission = (permissionId: string, isGranted: boolean) => {
        if (isGranted) {
            setDraftPermissions(prev => [...prev, permissionId]);
        } else {
            setDraftPermissions(prev => prev.filter(id => id !== permissionId));
        }
    };

    // Guardar en Base de Datos
    const handleSave = async () => {
        if (!selectedRole) return;
        setIsSaving(true);

        const result = await updatePermissionsAction(selectedRole.id, draftPermissions);

        if (result.success) {
            toast.success(result.message);
            // Actualizamos la UI localmente sin recargar
            setRoles(roles.map(r => r.id === selectedRole.id ? { ...r, permissions: draftPermissions } : r));
            setSelectedRole(null);
        } else {
            toast.error(result.message);
        }

        setIsSaving(false);
    };

    if (isLoading) return <div className="p-8 font-bold text-uecg-gray uppercase">Cargando Estructura de Roles...</div>;

    return (
        <div className="space-y-8 relative">

            {/* Header */}
            <div className="flex justify-between items-end border-b border-uecg-line pb-6">
                <div>
                    <h1 className="text-3xl font-black text-uecg-black uppercase tracking-tighter mb-2">
                        Roles y Permisos
                    </h1>
                    <p className="text-uecg-gray font-medium text-sm">
                        Define el nivel de acceso para cada tipo de usuario.
                    </p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-uecg-blue text-white text-[10px] font-black uppercase tracking-widest">
                    <ShieldCheck size={16} />
                    Sistema Seguro
                </div>
            </div>

            {/* Grid de Roles */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {roles.map((role) => (
                    <RoleCard
                        key={role.id}
                        role={role}
                        onEdit={() => handleEditRole(role)}
                    />
                ))}
            </div>

            {/* Modal de Configuración (Matriz) */}
            <Modal
                title={`Permisos: ${selectedRole?.name}`}
                isOpen={!!selectedRole}
                onClose={() => setSelectedRole(null)}
            >
                {selectedRole && (
                    <div className="space-y-6">
                        <div className="bg-blue-50 border-l-4 border-uecg-blue p-4">
                            <p className="text-sm text-uecg-black font-bold">
                                Estás editando los permisos globales.
                            </p>
                            <p className="text-xs text-uecg-gray mt-1 font-mono">
                                AFECTA A: {selectedRole.usersCount} USUARIOS INMEDIATAMANTE.
                            </p>
                        </div>

                        {/* Matriz de Permisos */}
                        <PermissionMatrix
                            selectedPermissions={draftPermissions}
                            onChange={handleTogglePermission}
                            readOnly={selectedRole.isSystem} // Bloquea los switches si es ADMIN
                        />

                        <div className="flex gap-4 pt-4">
                            <button
                                onClick={() => setSelectedRole(null)}
                                className="flex-1 py-4 border-2 border-gray-300 text-xs font-black uppercase tracking-widest text-uecg-gray hover:text-uecg-black hover:border-uecg-black transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={isSaving || selectedRole.isSystem}
                                className="flex-1 py-4 bg-uecg-blue text-white text-xs font-black uppercase tracking-widest hover:bg-uecg-dark transition-colors disabled:opacity-50"
                            >
                                {isSaving ? "Guardando..." : "Guardar Cambios"}
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}