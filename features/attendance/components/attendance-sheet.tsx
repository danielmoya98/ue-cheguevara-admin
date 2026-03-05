"use client";

import { useState, useActionState, useEffect } from "react";
import { toast } from "sonner";
import { saveAttendanceAction } from "../actions/attendance.action";
import { Save, CheckCircle, XCircle, Clock, FileText } from "lucide-react";

interface RosterStudent {
    studentId: string;
    documentId: string;
    name: string;
    status: "PRESENT" | "ABSENT" | "LATE" | "EXCUSED";
    notes: string | null;
}

interface AttendanceSheetProps {
    classroomId: string;
    date: string;
    initialRoster: RosterStudent[];
}

const initialState = { success: false, message: "" };

export default function AttendanceSheet({ classroomId, date, initialRoster }: AttendanceSheetProps) {
    // Estado local para manejar los cambios antes de guardar
    const [roster, setRoster] = useState<RosterStudent[]>(initialRoster);
    const [state, formAction, isPending] = useActionState(saveAttendanceAction, initialState);

    useEffect(() => {
        if (state && state.message) {
            if (state.success) {
                toast.success(state.message);
            } else {
                toast.error(state.message);
            }
        }
    }, [state]);

    // Función para cambiar el estado de un estudiante específico
    const handleStatusChange = (studentId: string, newStatus: RosterStudent["status"]) => {
        setRoster(current =>
            current.map(student =>
                student.studentId === studentId ? { ...student, status: newStatus } : student
            )
        );
    };

    // Función para actualizar las notas (ej: "Trajo certificado")
    const handleNotesChange = (studentId: string, notes: string) => {
        setRoster(current =>
            current.map(student =>
                student.studentId === studentId ? { ...student, notes } : student
            )
        );
    };

    const statusConfig = {
        PRESENT: { label: "Presente", color: "bg-green-100 text-green-800 border-green-500", icon: <CheckCircle size={14} /> },
        ABSENT: { label: "Falta", color: "bg-red-100 text-red-800 border-red-500", icon: <XCircle size={14} /> },
        LATE: { label: "Atraso", color: "bg-orange-100 text-orange-800 border-orange-500", icon: <Clock size={14} /> },
        EXCUSED: { label: "Licencia", color: "bg-gray-200 text-gray-800 border-gray-500", icon: <FileText size={14} /> }
    };

    if (roster.length === 0) {
        return (
            <div className="p-12 text-center border-2 border-dashed border-gray-300 bg-white">
                <span className="font-black uppercase tracking-widest text-sm text-uecg-gray block">Aula Vacía</span>
                <span className="text-xs text-gray-500">No hay estudiantes matriculados en este curso para la gestión actual.</span>
            </div>
        );
    }

    // Calculamos estadísticas en tiempo real
    const stats = {
        present: roster.filter(s => s.status === "PRESENT").length,
        absent: roster.filter(s => s.status === "ABSENT").length,
        late: roster.filter(s => s.status === "LATE").length,
        excused: roster.filter(s => s.status === "EXCUSED").length,
    };

    return (
        <form action={formAction} className="space-y-6 animate-in fade-in duration-300">
            {/* Enviamos toda la planilla como un string JSON en un input oculto */}
            <input type="hidden" name="data" value={JSON.stringify({ classroomId, date, records: roster })} />

            {/* Resumen Superior */}
            <div className="flex flex-wrap gap-4 bg-gray-50 p-4 border-2 border-uecg-line justify-between items-center">
                <div className="flex gap-4 text-xs font-black uppercase tracking-widest">
                    <span className="text-green-700">Presentes: {stats.present}</span>
                    <span className="text-red-700">Faltas: {stats.absent}</span>
                    <span className="text-orange-700">Atrasos: {stats.late}</span>
                    <span className="text-gray-600">Licencias: {stats.excused}</span>
                </div>

                <button
                    type="submit"
                    disabled={isPending}
                    className="flex items-center gap-2 px-6 py-3 bg-uecg-blue text-white font-black uppercase tracking-widest text-xs hover:bg-uecg-dark transition-colors border-2 border-uecg-blue disabled:opacity-50"
                >
                    <Save size={16} strokeWidth={2.5} />
                    {isPending ? "Guardando..." : "Guardar Planilla"}
                </button>
            </div>

            {/* Tabla de Asistencia Estilo Suizo */}
            <div className="w-full overflow-x-auto border-2 border-uecg-black bg-white">
                <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                    <tr className="bg-uecg-black text-white border-b-2 border-uecg-black">
                        <th className="p-4 text-xs font-black uppercase tracking-widest w-12 text-center">Nº</th>
                        <th className="p-4 text-xs font-black uppercase tracking-widest">Estudiante</th>
                        <th className="p-4 text-xs font-black uppercase tracking-widest text-center">Estado de Asistencia</th>
                        <th className="p-4 text-xs font-black uppercase tracking-widest w-1/4">Observaciones (Opcional)</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y-2 divide-gray-200">
                    {roster.map((student, index) => (
                        <tr key={student.studentId} className="hover:bg-gray-50 transition-colors">
                            <td className="p-4 text-center font-mono text-xs font-bold text-uecg-gray border-r-2 border-gray-200">
                                {index + 1}
                            </td>
                            <td className="p-4 border-r-2 border-gray-200">
                                <span className="font-black text-sm uppercase text-uecg-black block leading-none">{student.name}</span>
                                <span className="text-[10px] font-mono text-uecg-gray mt-1 block">CI: {student.documentId}</span>
                            </td>
                            <td className="p-4 border-r-2 border-gray-200">
                                {/* Botones de Segmentación Estilo Suizo */}
                                <div className="flex bg-gray-100 p-1 border-2 border-gray-300 w-fit mx-auto">
                                    {(Object.keys(statusConfig) as Array<keyof typeof statusConfig>).map((statusKey) => {
                                        const isSelected = student.status === statusKey;
                                        const config = statusConfig[statusKey];
                                        return (
                                            <button
                                                key={statusKey}
                                                type="button"
                                                onClick={() => handleStatusChange(student.studentId, statusKey)}
                                                className={`
                                                        flex items-center gap-1 px-3 py-2 text-[10px] font-black uppercase tracking-widest border-2 transition-all
                                                        ${isSelected ? config.color : 'border-transparent text-gray-500 hover:text-uecg-black hover:bg-white'}
                                                    `}
                                            >
                                                {config.icon}
                                                <span className="hidden xl:inline">{config.label}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </td>
                            <td className="p-4">
                                <input
                                    type="text"
                                    placeholder="Ej: Certificado Médico..."
                                    value={student.notes || ""}
                                    onChange={(e) => handleNotesChange(student.studentId, e.target.value)}
                                    className="w-full border-b-2 border-gray-300 bg-transparent p-2 text-xs font-bold text-uecg-black uppercase placeholder:text-gray-400 focus:border-uecg-blue outline-none transition-colors"
                                />
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </form>
    );
}