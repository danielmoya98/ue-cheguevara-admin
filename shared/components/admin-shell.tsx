"use client";

import { useSidebar } from "@/shared/context/sidebar-context";

export default function AdminShell({ children }: { children: React.ReactNode }) {
    const { isCollapsed } = useSidebar();

    return (
        <main
            className={`
        min-h-screen flex flex-col transition-[margin] duration-300 ease-in-out
        ${isCollapsed ? "ml-20" : "ml-64"}
      `}
        >
            {/* HEADER SUPERIOR */}
            <header className="h-20 bg-white border-b border-uecg-line flex items-center px-8 justify-between sticky top-0 z-40">
                <div className="flex flex-col">
           <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-uecg-gray">
             Ubicación Actual
           </span>
                    <h2 className="text-xl font-black text-uecg-blue uppercase tracking-tight">
                        Panel de Control
                    </h2>
                </div>

                <div className="flex items-center gap-4">
                    <div className="h-8 w-8 bg-uecg-blue text-white flex items-center justify-center font-bold text-xs">
                        AD
                    </div>
                    <div className="text-xs text-right hidden md:block">
                        <p className="font-bold text-uecg-black uppercase">Administrador</p>
                        <p className="text-uecg-gray">admin@uecg.edu.bo</p>
                    </div>
                </div>
            </header>

            {/* CONTENIDO */}
            <div className="p-8">
                {children}
            </div>
        </main>
    );
}