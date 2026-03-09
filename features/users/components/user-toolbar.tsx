"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search, Filter } from "lucide-react";

export default function UserToolbar() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Actualiza la URL al escribir en el buscador
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const params = new URLSearchParams(searchParams);
        if (e.target.value) {
            params.set("q", e.target.value);
        } else {
            params.delete("q");
        }
        router.push(`?${params.toString()}`, { scroll: false });
    };

    // Actualiza la URL al cambiar el select de Rol
    const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const params = new URLSearchParams(searchParams);
        if (e.target.value && e.target.value !== "all") {
            params.set("role", e.target.value);
        } else {
            params.delete("role");
        }
        router.push(`?${params.toString()}`, { scroll: false });
    };

    return (
        <div className="flex flex-col md:flex-row gap-4 mb-6 bg-white p-4 border border-uecg-line">
            <div className="flex-1 relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-uecg-blue">
                    <Search size={18} strokeWidth={2.5} />
                </div>
                <input
                    placeholder="BUSCAR POR NOMBRE O CORREO..."
                    defaultValue={searchParams.get("q") || ""}
                    onChange={handleSearch}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 font-bold text-uecg-black text-xs uppercase placeholder:text-gray-400 focus:border-uecg-blue focus:outline-none transition-colors"
                />
            </div>
            <div className="flex gap-4">
                <div className="relative w-48">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-uecg-blue pointer-events-none z-10">
                        <Filter size={16} strokeWidth={2.5} />
                    </div>
                    <select
                        defaultValue={searchParams.get("role") || "all"}
                        onChange={handleRoleChange}
                        className="w-full pl-10 pr-8 py-3 border-2 border-gray-300 font-bold text-uecg-black text-xs uppercase appearance-none bg-transparent focus:border-uecg-blue focus:outline-none cursor-pointer"
                    >
                        <option value="all">Todos los Roles</option>
                        <option value="ADMIN">Administrador</option>
                        <option value="TEACHER">Docente</option>
                        <option value="STUDENT">Estudiante</option>
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-uecg-black text-[10px]">▼</div>
                </div>
            </div>
        </div>
    );
}