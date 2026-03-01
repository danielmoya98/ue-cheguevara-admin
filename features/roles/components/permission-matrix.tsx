"use client";

import { Permission } from "../types/roles.types";
import { ALL_PERMISSIONS } from "../data/mock-roles";
import SwissSwitch from "@/shared/components/swiss-switch";

interface PermissionMatrixProps {
    selectedPermissions: string[];
    onChange: (permissionId: string, isGranted: boolean) => void;
    readOnly?: boolean;
}

export default function PermissionMatrix({
                                             selectedPermissions,
                                             onChange,
                                             readOnly = false
                                         }: PermissionMatrixProps) {

    // Agrupar permisos por módulo
    const groups = ALL_PERMISSIONS.reduce((acc, perm) => {
        if (!acc[perm.module]) acc[perm.module] = [];
        acc[perm.module].push(perm);
        return acc;
    }, {} as Record<string, Permission[]>);

    return (
        <div className="border border-uecg-line">
            {Object.entries(groups).map(([module, permissions]) => (
                <div key={module} className="border-b border-uecg-line last:border-b-0">

                    {/* Header del Módulo */}
                    <div className="bg-gray-50 p-3 border-b border-uecg-line">
                        <h4 className="text-xs font-black uppercase tracking-widest text-uecg-blue">
                            Módulo: {module}
                        </h4>
                    </div>

                    {/* Lista de Permisos */}
                    <div className="p-4 space-y-4">
                        {permissions.map((perm) => {
                            const isChecked = selectedPermissions.includes(perm.id);

                            return (
                                <div key={perm.id} className="flex items-center justify-between group">
                                    <div className="flex flex-col">
                    <span className="text-sm font-bold text-uecg-black uppercase">
                      {perm.label}
                    </span>
                                        <span className="text-[10px] font-mono text-uecg-gray">
                      ID: {perm.id}
                    </span>
                                    </div>

                                    <SwissSwitch
                                        checked={isChecked}
                                        onChange={(checked) => onChange(perm.id, checked)}
                                        disabled={readOnly}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
}