"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, BookOpen, CheckCircle, Users, LogOut, Menu } from "lucide-react";
import { useSidebar } from "@/shared/context/sidebar-context";

const NAV_ITEMS = [
    { name: "Inicio", href: "/teacher/dashboard", icon: LayoutDashboard },
    { name: "Cuaderno Pedagógico", href: "/teacher/courses", icon: BookOpen },
    { name: "Asistencia", href: "/teacher/attendance", icon: CheckCircle },
    { name: "Mis Estudiantes", href: "/teacher/students", icon: Users },
];

export default function TeacherSidebar() {
    const pathname = usePathname();
    const { isCollapsed, toggleSidebar } = useSidebar();

    return (
        <aside
            className={`
                fixed top-0 left-0 h-screen bg-uecg-black text-white border-r-4 border-uecg-blue
                transition-all duration-300 ease-in-out z-50 flex flex-col
                ${isCollapsed ? "w-20" : "w-64"}
            `}
        >
            {/* Logo y Menú Hamburgesa */}
            <div className="h-20 flex items-center justify-between px-6 border-b border-gray-800">
                {!isCollapsed && (
                    <div className="flex flex-col">
                        <span className="text-2xl font-black uppercase tracking-tighter text-white leading-none">UECG</span>
                        <span className="text-[9px] font-bold text-uecg-blue uppercase tracking-widest mt-1">Portal Docente</span>
                    </div>
                )}
                <button
                    onClick={toggleSidebar}
                    className={`text-gray-400 hover:text-white transition-colors ${isCollapsed ? "mx-auto" : ""}`}
                >
                    <Menu size={24} strokeWidth={2.5} />
                </button>
            </div>

            {/* Navegación Principal */}
            <nav className="flex-1 py-8 flex flex-col gap-2 px-4">
                {NAV_ITEMS.map((item) => {
                    const isActive = pathname.startsWith(item.href);
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`
                                flex items-center gap-4 px-4 py-3 transition-colors relative group
                                ${isActive ? "bg-uecg-blue text-white font-black" : "text-gray-400 hover:bg-gray-900 hover:text-white font-bold"}
                                ${isCollapsed ? "justify-center" : "justify-start"}
                            `}
                        >
                            <Icon size={20} strokeWidth={isActive ? 3 : 2} />

                            {!isCollapsed && (
                                <span className="text-xs uppercase tracking-widest">{item.name}</span>
                            )}

                            {/* Tooltip cuando está colapsado */}
                            {isCollapsed && (
                                <div className="absolute left-full ml-4 px-3 py-2 bg-white text-uecg-black text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 pointer-events-none z-50 whitespace-nowrap border-2 border-uecg-black">
                                    {item.name}
                                </div>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Cerrar Sesión */}
            <div className="p-4 border-t border-gray-800">
                <Link
                    href="/"
                    className={`
                        flex items-center gap-4 px-4 py-3 text-red-500 hover:bg-red-500/10 transition-colors font-bold
                        ${isCollapsed ? "justify-center" : "justify-start"}
                    `}
                >
                    <LogOut size={20} strokeWidth={2.5} />
                    {!isCollapsed && <span className="text-xs uppercase tracking-widest">Cerrar Sesión</span>}
                </Link>
            </div>
        </aside>
    );
}