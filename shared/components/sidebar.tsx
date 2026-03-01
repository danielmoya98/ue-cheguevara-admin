"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard, Users, Shield, LogOut, BookOpen,
    ChevronLeft, ChevronRight
} from "lucide-react";
import { logoutAction } from "@/features/auth/actions/logout.action";
import { useSidebar } from "@/shared/context/sidebar-context";

const MENU_ITEMS = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Usuarios", href: "/admin/users", icon: Users },
    { name: "Roles", href: "/admin/roles", icon: Shield },
    { name: "Académico", href: "/admin/academic", icon: BookOpen },
];

export default function Sidebar() {
    const pathname = usePathname();
    const { isCollapsed, toggleSidebar } = useSidebar();

    return (
        <aside
            className={`
        fixed left-0 top-0 z-50 h-screen bg-white border-r border-uecg-line flex flex-col 
        transition-[width] duration-300 ease-in-out
        ${isCollapsed ? "w-20" : "w-64"}
      `}
        >
            {/* HEADER: LOGO Y TOGGLE */}
            <div className="h-20 bg-uecg-blue flex items-center justify-between px-0 relative">

                {/* Logo Lógica: Full vs Short */}
                <div className={`w-full flex justify-center transition-opacity duration-300 ${isCollapsed ? "px-0" : "px-4"}`}>
                    {isCollapsed ? (
                        <span className="text-white font-black text-xl tracking-tighter">UE</span>
                    ) : (
                        <h1 className="text-white font-black text-xl tracking-tighter leading-none text-center whitespace-nowrap">
                            U.E.<br />CHE GUEVARA
                        </h1>
                    )}
                </div>

                {/* Botón Toggle (Cuadrado Swiss Style absoluto) */}
                <button
                    onClick={toggleSidebar}
                    className="absolute -right-3 top-1/2 -translate-y-1/2 bg-white border border-uecg-blue text-uecg-blue w-6 h-6 flex items-center justify-center hover:bg-uecg-blue hover:text-white transition-colors z-50"
                    title={isCollapsed ? "Expandir" : "Colapsar"}
                >
                    {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                </button>
            </div>

            {/* NAVEGACIÓN */}
            <nav className="flex-1 flex flex-col py-6 overflow-hidden">
                {/* Label "Menu Principal" solo visible expandido */}
                <p className={`
            px-6 text-[10px] font-bold text-uecg-gray uppercase tracking-[0.2em] mb-4 transition-opacity duration-300 whitespace-nowrap
            ${isCollapsed ? "opacity-0 hidden" : "opacity-100"}
          `}>
                    Menu Principal
                </p>

                <ul className="flex flex-col gap-1 w-full">
                    {MENU_ITEMS.map((item) => {
                        const isActive = pathname.startsWith(item.href);
                        return (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    title={isCollapsed ? item.name : ""}
                                    className={`
                    flex items-center h-12 px-6 transition-all duration-200
                    font-bold uppercase text-xs tracking-widest whitespace-nowrap overflow-hidden
                    ${isActive
                                        ? "bg-uecg-blue text-white"
                                        : "text-uecg-blue hover:bg-uecg-blue hover:text-white"
                                    }
                    ${isCollapsed ? "justify-center px-0" : "gap-4"}
                  `}
                                >
                                    <item.icon size={20} strokeWidth={2.5} className="min-w-[20px]" />

                                    {/* Texto con transición de opacidad */}
                                    <span className={`transition-all duration-300 ${isCollapsed ? "opacity-0 w-0 translate-x-10" : "opacity-100 w-auto translate-x-0"}`}>
                    {item.name}
                  </span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* FOOTER */}
            <div className="p-4 border-t border-uecg-line overflow-hidden">
                <button
                    onClick={() => logoutAction()}
                    className={`
            w-full flex items-center h-10 border border-red-600 text-red-600 
            hover:bg-red-600 hover:text-white transition-all font-bold uppercase text-xs tracking-widest whitespace-nowrap
            ${isCollapsed ? "justify-center px-0" : "gap-4 px-4"}
          `}
                    title="Cerrar Sesión"
                >
                    <LogOut size={16} strokeWidth={2.5} className="min-w-[16px]" />
                    <span className={`transition-all duration-300 ${isCollapsed ? "opacity-0 w-0 hidden" : "opacity-100 w-auto"}`}>
            Salir
          </span>
                </button>
            </div>
        </aside>
    );
}