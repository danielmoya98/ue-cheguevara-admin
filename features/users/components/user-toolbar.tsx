"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Search, Filter } from "lucide-react";
import { useDebouncedCallback } from "use-debounce"; // npm i use-debounce (Opcional, o usa timeout manual)

export default function UserToolbar() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    // Función que actualiza la URL
    const handleSearch = (term: string) => {
        const params = new URLSearchParams(searchParams);
        params.set("page", "1"); // Resetear a página 1 al buscar

        if (term) {
            params.set("q", term);
        } else {
            params.delete("q");
        }
        replace(`${pathname}?${params.toString()}`);
    };

    const handleRoleFilter = (role: string) => {
        const params = new URLSearchParams(searchParams);
        params.set("page", "1");

        if (role && role !== "all") {
            params.set("role", role);
        } else {
            params.delete("role");
        }
        replace(`${pathname}?${params.toString()}`);
    }

    return (
        <div className="flex flex-col md:flex-row gap-4 mb-6 bg-white p-4 border border-uecg-line">

            {/* BUSCADOR */}
            <div className="flex-1 relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-uecg-blue">
                    <Search size={18} strokeWidth={2.5} />
                </div>
                <input
                    placeholder="BUSCAR POR NOMBRE O CORREO..."
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 font-bold text-uecg-black text-xs uppercase placeholder:text-gray-400 focus:border-uecg-blue focus:outline-none transition-colors"
                    defaultValue={searchParams.get("q")?.toString()}
                    onChange={(e) => handleSearch(e.target.value)}
                />
            </div>

            {/* FILTROS */}
            <div className="flex gap-4">
                <div className="relative w-48">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-uecg-blue pointer-events-none z-10">
                        <Filter size={16} strokeWidth={2.5} />
                    </div>
                    <select
                        className="w-full pl-10 pr-8 py-3 border-2 border-gray-300 font-bold text-uecg-black text-xs uppercase appearance-none bg-transparent focus:border-uecg-blue focus:outline-none cursor-pointer"
                        defaultValue={searchParams.get("role")?.toString()}
                        onChange={(e) => handleRoleFilter(e.target.value)}
                    >
                        <option value="all">Todos los Roles</option>
                        <option value="admin">Administrador</option>
                        <option value="teacher">Docente</option>
                        <option value="student">Estudiante</option>
                    </select>
                    {/* Flecha Custom */}
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-uecg-black text-[10px]">▼</div>
                </div>
            </div>
        </div>
    );
}