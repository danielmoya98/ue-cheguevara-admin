"use client";

import { useState, useTransition } from "react";
import { usePathname } from "next/navigation";
import { setAcademicYearAction } from "@/features/academic/actions/set-academic-year.action";
import { Calendar } from "lucide-react";

interface Props {
    currentActiveYear: number;
}

export default function AcademicYearSelector({ currentActiveYear }: Props) {
    const pathname = usePathname();
    const [isPending, startTransition] = useTransition();
    const [isOpen, setIsOpen] = useState(false);

    // Para el MVP, damos 3 opciones: El año pasado, este año, y el próximo.
    const realCurrentYear = new Date().getFullYear();
    const availableYears = [realCurrentYear - 1, realCurrentYear, realCurrentYear + 1];

    const handleYearChange = (year: number) => {
        if (year === currentActiveYear) {
            setIsOpen(false);
            return;
        }

        startTransition(() => {
            setAcademicYearAction(year, pathname).then(() => {
                setIsOpen(false);
            });
        });
    };

    return (
        <div className="relative">
            {/* Botón que muestra el año actual */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                disabled={isPending}
                className={`
                    flex items-center gap-2 h-10 px-4 border-2 transition-all font-black uppercase text-[10px] tracking-widest
                    ${isPending ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                    ${isOpen ? "bg-uecg-black text-white border-uecg-black" : "bg-white text-uecg-black border-uecg-line hover:border-uecg-black"}
                `}
                title="Cambiar Gestión Escolar"
            >
                <Calendar size={14} strokeWidth={2.5} className={isOpen ? "text-white" : "text-uecg-gray"} />
                <span>Gestión {currentActiveYear}</span>
            </button>

            {/* Menú Desplegable (Estilo Suizo Brutalista) */}
            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white border-2 border-uecg-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-50 flex flex-col">
                        <div className="p-3 bg-gray-50 border-b border-gray-200">
                            <span className="block text-[9px] font-bold text-uecg-gray uppercase tracking-[0.2em]">
                                Seleccionar Gestión
                            </span>
                        </div>

                        {availableYears.map((year) => (
                            <button
                                key={year}
                                onClick={() => handleYearChange(year)}
                                className={`
                                    w-full text-left px-4 py-3 text-[11px] font-black uppercase tracking-widest hover:bg-uecg-blue hover:text-white transition-colors
                                    ${year === currentActiveYear ? "bg-blue-50 text-uecg-blue" : "text-uecg-black"}
                                `}
                            >
                                Año Escolar {year}
                                {year === realCurrentYear && <span className="ml-2 text-[8px] text-gray-400 font-bold">(Actual)</span>}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}