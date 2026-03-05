"use client";

import { useSidebar } from "@/shared/context/sidebar-context";
import NotificationBell from "@/features/notifications/components/notification-bell";

export default function TeacherShell({ children }: { children: React.ReactNode }) {
    const { isCollapsed } = useSidebar();

    return (
        <main
            className={`
                min-h-screen flex flex-col transition-[margin] duration-300 ease-in-out bg-gray-50/50
                ${isCollapsed ? "ml-20" : "ml-64"}
            `}
        >
            {/* HEADER SUPERIOR */}
            <header className="h-20 bg-white border-b-2 border-uecg-line flex items-center px-8 justify-between sticky top-0 z-40">
                <div className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-uecg-gray">
                        Área Académica
                    </span>
                    <h2 className="text-xl font-black text-uecg-black uppercase tracking-tight leading-none mt-1">
                        Mi Tablero
                    </h2>
                </div>

                {/* CONTROLES DERECHOS (Notificaciones + Perfil) */}
                <div className="flex items-center gap-6">

                    {/* 1. CAMPANITA DE NOTIFICACIONES (Reutilizada) */}
                    <NotificationBell />

                    {/* 2. LÍNEA DIVISORIA ESTILO SUIZO */}
                    <div className="h-8 w-[2px] bg-uecg-line hidden md:block"></div>

                    {/* 3. PERFIL DE USUARIO DOCENTE */}
                    <div className="flex items-center gap-4">
                        <div className="text-xs text-right hidden md:block">
                            <p className="font-black text-uecg-black uppercase tracking-widest">Profesor</p>
                            <p className="font-mono text-[10px] text-uecg-blue uppercase font-bold">Docente Titular</p>
                        </div>
                        <div className="h-10 w-10 bg-uecg-blue text-white flex items-center justify-center font-black text-sm border-2 border-uecg-blue hover:bg-uecg-black hover:border-uecg-black transition-colors cursor-pointer">
                            PR
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