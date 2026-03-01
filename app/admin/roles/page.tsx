"use client";

import { useState } from "react";
import { MOCK_ROLES } from "@/features/roles/data/mock-roles";
import RoleCard from "@/features/roles/components/role-card";
import Modal from "@/shared/components/modal";
import PermissionMatrix from "@/features/roles/components/permission-matrix";
import { Plus } from "lucide-react";

export default function RolesPage() {
    const [selectedRole, setSelectedRole] = useState<string | null>(null);

    // Encontrar el rol seleccionado
    const activeRole = MOCK_ROLES.find(r => r.id === selectedRole);

    return (
        <div className="space-y-8">

            {/* Header */}
            <div className="flex justify-between items-end border-b border-uecg-line pb-6">
                <div>
                    <h1 className="text-3xl font-black text-uecg-black uppercase tracking-tighter mb-2">
                        Roles y Permisos
                    </h1>
                    <p className="text-uecg-gray font-medium text-sm">
                        Define quién puede hacer qué en la plataforma.
                    </p>
                </div>

                <button className="flex items-center gap-2 bg-uecg-blue text-white px-6 py-3 font-bold uppercase text-xs tracking-widest hover:bg-uecg-dark transition-colors border-2 border-uecg-blue">
                    <Plus size={16} strokeWidth={3} />
                    Nuevo Rol
                </button>
            </div>

            {/* Grid de Roles */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {MOCK_ROLES.map((role) => (
                    <RoleCard
                        key={role.id}
                        role={role}
                        onEdit={() => setSelectedRole(role.id)}
                    />
                ))}
            </div>

            {/* Modal de Configuración (Reutilizando tu Modal Full Screen) */}
            {activeRole && (
                <Modal
                    title={`Permisos: ${activeRole.name}`}
                    isOpen={!!selectedRole}
                    onClose={() => setSelectedRole(null)}
                >
                    <div className="space-y-6">
                        <div className="bg-blue-50 border-l-4 border-uecg-blue p-4">
                            <p className="text-sm text-uecg-black font-bold">
                                Estás editando los permisos globales para este rol.
                            </p>
                            <p className="text-xs text-uecg-gray mt-1">
                                Los cambios afectarán a {activeRole.usersCount} usuarios inmediatamente.
                            </p>
                        </div>

                        {/* Matriz de Permisos */}
                        <PermissionMatrix
                            selectedPermissions={activeRole.permissions}
                            onChange={(id, val) => console.log("Toggle permission:", id, val)}
                            readOnly={activeRole.isSystem && false} // Admin podría ser read-only
                        />

                        <div className="flex gap-4 pt-4">
                            <button
                                onClick={() => setSelectedRole(null)}
                                className="flex-1 py-4 border-2 border-gray-300 text-xs font-black uppercase tracking-widest hover:bg-gray-100"
                            >
                                Cancelar
                            </button>
                            <button className="flex-1 py-4 bg-uecg-blue text-white text-xs font-black uppercase tracking-widest hover:bg-uecg-dark">
                                Guardar Cambios
                            </button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
}