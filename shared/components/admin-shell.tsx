"use client";

import { useSidebar } from "@/shared/context/sidebar-context";
import NotificationBell from "@/features/notifications/components/notification-bell";
import { usePathname } from "next/navigation";
import AcademicYearSelector from "@/shared/components/academic-year-selector";

interface AdminShellProps {
    children: React.ReactNode;
    user: {
        name: string;
        email: string;
    };
    activeYear: number; // Agregamos la propiedad para recibir el año
}

export default function AdminShell({ children, user, activeYear }: AdminShellProps) {
    const { isCollapsed } = useSidebar();
    const pathname = usePathname();

    // Lógica para obtener iniciales (Ej: "Juan Perez" -> "JP")
    const initials = user.name
        .split(" ")
        .map((word) => word[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();

    // Lógica para que el título cambie automáticamente según la ruta
    const currentRouteName = pathname === "/admin/dashboard"
        ? "Panel de Control"
        : pathname.split('/').pop()?.replace(/-/g, ' ') || "Panel de Control";

    return (
        <main
            className={`
                min-h-screen flex flex-col transition-[margin] duration-300 ease-in-out bg-gray-50/50
                ${isCollapsed ? "ml-20" : "ml-64"}
            `}
        >
            {/* HEADER SUPERIOR */}
            <header className="h-20 bg-white border-b-2 border-uecg-line flex items-center px-8 justify-between sticky top-0 z-40">

                {/* UBICACIÓN DINÁMICA */}
                <div className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-uecg-gray">
                        Ubicación Actual
                    </span>
                    <h2 className="text-xl font-black text-uecg-blue uppercase tracking-tight leading-none mt-1 capitalize">
                        {currentRouteName}
                    </h2>
                </div>

                {/* CONTROLES DERECHOS */}
                <div className="flex items-center gap-6">

                    {/* 1. SELECTOR DE AÑO ESCOLAR */}
                    <AcademicYearSelector currentActiveYear={activeYear} />

                    {/* 2. CAMPANITA DE NOTIFICACIONES */}
                    <NotificationBell />

                    {/* 3. LÍNEA DIVISORIA ESTILO SUIZO */}
                    <div className="h-8 w-[2px] bg-uecg-line hidden md:block"></div>

                    {/* 4. PERFIL DE USUARIO DINÁMICO */}
                    <div className="flex items-center gap-4">
                        <div className="text-xs text-right hidden md:block">
                            <p className="font-black text-uecg-black uppercase tracking-widest leading-tight">
                                {user.name}
                            </p>
                            <p className="font-mono text-[10px] text-uecg-gray uppercase tracking-tighter">
                                {user.email}
                            </p>
                        </div>
                        <div
                            title={user.name}
                            className="h-10 w-10 bg-uecg-black text-white flex items-center justify-center font-black text-sm border-2 border-uecg-black hover:bg-uecg-blue hover:border-uecg-blue transition-colors cursor-pointer"
                        >
                            {initials}
                        </div>
                    </div>
                </div>
            </header>

            {/* CONTENIDO PRINCIPAL */}
            <div className="p-8">
                {children}
            </div>
        </main>
    );
}