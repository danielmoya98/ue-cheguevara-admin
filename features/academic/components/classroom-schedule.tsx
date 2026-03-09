"use client";

import { useState } from "react";
import { Printer, X, Plus } from "lucide-react";
import { toast } from "sonner";
// CORRECCIÓN: Importamos las acciones centralizadas desde course.action.ts
import { assignScheduleAction, removeScheduleAction } from "../actions/course.action";

interface ClassroomScheduleProps {
    classroomId: string;
    classroomName: string;
    courses: any[]; // La malla curricular (materias disponibles para este curso)
    schedules: any[]; // Los horarios ya asignados desde la API
}

// Estructura de tiempo
const PERIODS = [
    { num: 1, time: "08:00 - 08:40", isBreak: false },
    { num: 2, time: "08:40 - 09:20", isBreak: false },
    { num: -1, time: "09:20 - 09:30", isBreak: true, label: "RECREO 1" },
    { num: 3, time: "09:30 - 10:10", isBreak: false },
    { num: 4, time: "10:10 - 10:50", isBreak: false },
    { num: -2, time: "10:50 - 11:00", isBreak: true, label: "RECREO 2" },
    { num: 5, time: "11:00 - 11:40", isBreak: false },
    { num: 6, time: "11:40 - 12:20", isBreak: false },
];
const DAYS = [
    { id: 1, name: "LUNES" }, { id: 2, name: "MARTES" },
    { id: 3, name: "MIÉRCOLES" }, { id: 4, name: "JUEVES" }, { id: 5, name: "VIERNES" }
];

export default function ClassroomSchedule({ classroomId, classroomName, courses, schedules }: ClassroomScheduleProps) {
    const [activeCell, setActiveCell] = useState<{ day: number, period: number } | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Encuentra qué materia está asignada a una celda específica
    const getSlot = (day: number, period: number) => {
        return schedules.find(s => s.dayOfWeek === day && s.period === period);
    };

    // Imprimir a PDF usando el navegador nativo
    const handlePrintPDF = () => {
        window.print();
    };

    const handleAssign = async (courseId: string) => {
        if (!activeCell) return;
        setIsLoading(true);
        // LLAMADA A LA SERVER ACTION ACTUALIZADA
        const res = await assignScheduleAction(classroomId, courseId, activeCell.day, activeCell.period);
        setIsLoading(false);
        if (res.success) {
            toast.success(res.message);
            setActiveCell(null);
        } else {
            toast.error(res.message); // Aquí mostrará el 409 Conflict si el profesor está ocupado
        }
    };

    const handleRemove = async (scheduleId: string) => {
        if (!confirm("¿Liberar este bloque de horario?")) return;
        setIsLoading(true);
        // LLAMADA A LA SERVER ACTION ACTUALIZADA
        const res = await removeScheduleAction(scheduleId, classroomId);
        setIsLoading(false);
        if (res.success) toast.success(res.message);
        else toast.error(res.message);
    };

    return (
        <div className="space-y-6 relative">

            {/* TOOLBAR (Se oculta al imprimir: print:hidden) */}
            <div className="flex justify-between items-center bg-uecg-black text-white p-4 print:hidden">
                <h3 className="text-sm font-black uppercase tracking-widest">Planificador de Horario</h3>
                <button onClick={handlePrintPDF} className="flex items-center gap-2 bg-white text-uecg-black px-4 py-2 text-xs font-black uppercase tracking-widest hover:bg-uecg-blue hover:text-white transition-colors border-2 border-transparent hover:border-uecg-black">
                    <Printer size={16} strokeWidth={3} />
                    Exportar a PDF
                </button>
            </div>

            {/* ENCABEZADO PARA EL PDF (Solo visible al imprimir: hidden print:block) */}
            <div className="hidden print:block text-center border-b-4 border-uecg-black pb-4 mb-8 mt-8">
                <h1 className="text-4xl font-black uppercase tracking-tighter text-uecg-black">UNIDAD EDUCATIVA U.E.C.G.</h1>
                <h2 className="text-2xl font-black uppercase tracking-widest text-uecg-blue mt-2">Horario Escolar Oficial</h2>
                <div className="mt-4 py-2 border-y-2 border-uecg-black inline-block px-12 text-xl font-bold font-mono">
                    CURSO: {classroomName}
                </div>
            </div>

            {/* TABLA DE HORARIO (Swiss Style) */}
            <div className="w-full overflow-x-auto print:overflow-visible">
                <table className="w-full border-4 border-uecg-black text-center border-collapse">
                    <thead>
                    <tr>
                        <th className="border-4 border-uecg-black p-3 bg-gray-100 text-xs font-black uppercase tracking-widest text-uecg-gray w-32">Hora</th>
                        {DAYS.map(day => (
                            <th key={day.id} className="border-4 border-uecg-black p-3 bg-gray-100 text-sm font-black uppercase tracking-widest text-uecg-blue print:text-black">
                                {day.name}
                            </th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {PERIODS.map(period => (
                        <tr key={`row-${period.num}`}>
                            {/* Columna de la Hora */}
                            <td className="border-4 border-uecg-black p-2 font-mono text-xs font-bold text-uecg-gray whitespace-nowrap bg-white">
                                <span className="block text-[14px] font-black text-uecg-black">{period.num > 0 ? `${period.num}° Per.` : ''}</span>
                                {period.time}
                            </td>

                            {/* Descansos (Ocupan toda la fila) */}
                            {period.isBreak ? (
                                <td colSpan={5} className="border-4 border-uecg-black bg-gray-200 print:bg-gray-100 py-3">
                                    <span className="text-xs font-black uppercase tracking-[0.3em] text-uecg-gray">{period.label}</span>
                                </td>
                            ) : (
                                /* Días (Celdas editables) */
                                DAYS.map(day => {
                                    const slot = getSlot(day.id, period.num);
                                    const isSelecting = activeCell?.day === day.id && activeCell?.period === period.num;

                                    return (
                                        <td key={`${day.id}-${period.num}`} className="border-4 border-uecg-black p-0 bg-white relative group h-20 w-40 align-top">
                                            {isSelecting ? (
                                                /* Menú para asignar materia (No visible en impresión) */
                                                <div className="absolute inset-0 bg-white z-20 p-2 border-4 border-uecg-blue flex flex-col gap-1 overflow-y-auto print:hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]">
                                                    <div className="flex justify-between items-center mb-1 border-b-2 border-uecg-line pb-1">
                                                        <span className="text-[10px] font-black uppercase tracking-widest text-uecg-blue">Asignar Materia</span>
                                                        <button onClick={() => setActiveCell(null)} className="text-red-500 hover:bg-red-50 p-1"><X size={14} strokeWidth={3}/></button>
                                                    </div>
                                                    {courses.length === 0 && <span className="text-[10px] font-bold text-uecg-gray uppercase text-center mt-2">Malla vacía</span>}
                                                    {courses.map(c => (
                                                        <button
                                                            key={c.id} onClick={() => handleAssign(c.id)} disabled={isLoading}
                                                            className="text-left p-1.5 text-[10px] font-bold uppercase border-2 border-transparent hover:border-uecg-blue hover:bg-blue-50 transition-colors"
                                                        >
                                                            <span className="truncate block">{c.subject.name}</span>
                                                        </button>
                                                    ))}
                                                </div>
                                            ) : slot ? (
                                                /* Celda con Materia Asignada */
                                                <div className="absolute inset-0 flex flex-col">
                                                    {/* Color decorativo de la materia */}
                                                    <div className="h-1.5 w-full print:hidden" style={{ backgroundColor: slot.course?.subject?.color || '#000' }} />
                                                    <div className="flex-1 p-2 flex flex-col justify-center items-center relative group-hover:bg-gray-50 transition-colors">
                                                        <span className="font-black text-[10px] uppercase leading-tight tracking-widest text-uecg-black text-center line-clamp-2">
                                                            {slot.course?.subject?.name}
                                                        </span>
                                                        <span className="text-[9px] font-bold uppercase tracking-widest text-uecg-gray mt-1 truncate max-w-full print:text-[10px]">
                                                            {slot.course?.teacher?.name || "SIN DOCENTE"}
                                                        </span>

                                                        {/* Botón Borrar (Solo Hover, oculto en PDF) */}
                                                        <button
                                                            onClick={() => handleRemove(slot.id)}
                                                            className="absolute top-1 right-1 text-red-500 opacity-0 group-hover:opacity-100 print:hidden bg-white hover:bg-red-50 p-1 border-2 border-transparent hover:border-red-200 transition-all"
                                                            title="Liberar Horario"
                                                        >
                                                            <X size={14} strokeWidth={3} />
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                /* Celda Vacía */
                                                <button
                                                    onClick={() => setActiveCell({ day: day.id, period: period.num })}
                                                    className="absolute inset-0 w-full h-full flex justify-center items-center text-gray-200 hover:bg-uecg-blue hover:text-white transition-colors print:hidden group"
                                                >
                                                    <Plus size={24} strokeWidth={3} className="group-hover:scale-125 transition-transform" />
                                                </button>
                                            )}
                                        </td>
                                    );
                                })
                            )}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* PIE DE PÁGINA PARA PDF */}
            <div className="hidden print:block text-center mt-8 pt-8 border-t-4 border-uecg-black text-[10px] font-black uppercase text-uecg-black tracking-widest">
                Documento generado por el Sistema ERP • Unidad Educativa U.E.C.G.
            </div>

            {/* ESTILOS GLOBALES PARA IMPRESIÓN (PDF) */}
            <style dangerouslySetInnerHTML={{__html: `
                @media print {
                    @page { size: landscape; margin: 15mm; }
                    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; background: white; }
                    /* Ocultar la barra lateral y navegación de Next.js si es necesario */
                    header, nav, aside { display: none !important; }
                    main { padding: 0 !important; margin: 0 !important; }
                }
            `}} />
        </div>
    );
}