import { Role } from "../types/roles.types";
import { Users, ShieldCheck, Lock } from "lucide-react";

interface RoleCardProps {
    role: Role;
    onEdit: () => void;
}

export default function RoleCard({ role, onEdit }: RoleCardProps) {
    return (
        <div className="border-2 border-uecg-line bg-white hover:border-uecg-blue transition-colors group relative">
            {/* Header Colorido */}
            <div className="bg-uecg-black p-4 flex justify-between items-start">
                <div className="p-2 bg-white text-uecg-black">
                    <ShieldCheck size={24} strokeWidth={2} />
                </div>
                {role.isSystem && (
                    <span className="text-[10px] font-bold text-white uppercase tracking-widest border border-white px-2 py-0.5">
            Sistema
          </span>
                )}
            </div>

            {/* Contenido */}
            <div className="p-6">
                <h3 className="text-xl font-black uppercase text-uecg-black mb-2">
                    {role.name}
                </h3>
                <p className="text-sm text-uecg-gray min-h-[40px] mb-4 font-medium">
                    {role.description}
                </p>

                {/* Stats */}
                <div className="flex items-center gap-2 text-uecg-blue text-xs font-bold uppercase tracking-widest mb-6">
                    <Users size={14} />
                    {role.usersCount} Usuarios activos
                </div>

                {/* Acciones */}
                <button
                    onClick={onEdit}
                    className="w-full py-3 border-2 border-uecg-line text-uecg-black font-black uppercase tracking-widest text-xs hover:bg-uecg-blue hover:text-white hover:border-uecg-blue transition-all"
                >
                    Configurar Permisos
                </button>
            </div>
        </div>
    );
}