import { getGradesAction } from "@/features/academic/actions/grade.action";
// 1. IMPORTAMOS LA NUEVA ACCIÓN EN LUGAR DEL SERVICIO
import { getAttendanceRosterAction } from "@/features/attendance/actions/attendance.action";
import AttendanceSheet from "@/features/attendance/components/attendance-sheet";
import { CalendarDays, Users } from "lucide-react";
import { academicYearService } from "@/features/academic/services/academic-year.service";

interface PageProps {
    searchParams: Promise<{ [key: string]: string | undefined }>
}

export default async function AttendancePage({ searchParams }: PageProps) {
    const params = await searchParams;

    const activeYear = await academicYearService.getActiveYear();

    const today = new Date().toLocaleDateString('en-CA'); // Formato YYYY-MM-DD local
    const dateParam = params.date || today;
    const classroomIdParam = params.classroomId;

    // Obtener la lista de aulas para el menú desplegable (Reutilizamos la acción existente de grados)
    const { data: grades } = await getGradesAction();
    const gradesWithClassrooms = (grades || []).filter((g: any) => g.classrooms.length > 0);

    let roster: any[] = [];
    if (classroomIdParam) {
        // 2. OBTENEMOS LA PLANILLA A TRAVÉS DE LA ACCIÓN / API
        const { data } = await getAttendanceRosterAction(classroomIdParam, dateParam, activeYear);
        roster = data || [];
    }

    return (
        <div className="space-y-8 relative animate-in fade-in duration-500">
            {/* Header Estilo Suizo */}
            <div className="border-b-4 border-uecg-black pb-6">
                <h1 className="text-3xl font-black text-uecg-black uppercase tracking-tighter leading-none mb-2">
                    Control de Asistencia
                </h1>
                <p className="text-uecg-gray font-bold text-[10px] uppercase tracking-[0.2em] mt-2 flex items-center gap-2">
                    <CalendarDays size={14} /> Gestión Académica {activeYear}
                </p>
            </div>

            {/* Barra de Filtros (Navegación por URL) */}
            <div className="bg-white p-6 border-2 border-uecg-line shadow-sm">
                <form className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end" action="/admin/attendance">
                    {/* Filtro: Fecha */}
                    <div>
                        <label className="text-[10px] font-black uppercase tracking-[0.15em] text-uecg-gray mb-2 flex items-center gap-2">
                            <CalendarDays size={14} /> Fecha de Registro
                        </label>
                        <input
                            type="date"
                            name="date"
                            defaultValue={dateParam}
                            required
                            className="w-full border-2 border-gray-300 bg-white p-3 font-bold text-uecg-black uppercase focus:border-uecg-black outline-none transition-colors text-sm"
                        />
                    </div>

                    {/* Filtro: Aula */}
                    <div className="md:col-span-2 flex gap-4 items-end">
                        <div className="flex-1">
                            <label className="text-[10px] font-black uppercase tracking-[0.15em] text-uecg-gray mb-2 flex items-center gap-2">
                                <Users size={14} /> Aula / Paralelo
                            </label>
                            <div className="relative border-2 border-gray-300 bg-white focus-within:border-uecg-black transition-colors">
                                <select
                                    name="classroomId"
                                    defaultValue={classroomIdParam || ""}
                                    required
                                    className="w-full p-3 font-bold text-uecg-black bg-transparent outline-none appearance-none cursor-pointer z-10 relative text-xs uppercase"
                                >
                                    <option value="" disabled>Seleccione un aula para tomar lista...</option>
                                    {gradesWithClassrooms.map((grade: any) => (
                                        <optgroup key={grade.id} label={`${grade.name} de ${grade.level}`}>
                                            {grade.classrooms.map((classroom: any) => (
                                                <option key={classroom.id} value={classroom.id}>
                                                    Paralelo {classroom.name} (Turno {classroom.shift})
                                                </option>
                                            ))}
                                        </optgroup>
                                    ))}
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-uecg-black font-black text-xs">▼</div>
                            </div>
                        </div>

                        {/* Botón Buscar */}
                        <button type="submit" className="px-8 py-[14px] bg-uecg-black text-white font-black uppercase tracking-widest text-[10px] hover:bg-uecg-blue transition-colors border-2 border-uecg-black hover:border-uecg-blue">
                            Cargar Planilla
                        </button>
                    </div>
                </form>
            </div>

            {/* Renderizado Condicional de la Planilla */}
            {!classroomIdParam ? (
                <div className="p-16 text-center border-4 border-dashed border-gray-200 bg-gray-50">
                    <span className="font-black uppercase tracking-widest text-lg text-uecg-gray block mb-2">Seleccione un Aula</span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Utilice los filtros superiores para cargar la lista de estudiantes de {activeYear}.</span>
                </div>
            ) : (
                <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-500">
                    <div className="flex justify-between items-center border-b-2 border-uecg-line pb-4">
                        <h2 className="text-sm font-black uppercase tracking-widest text-uecg-blue">
                            Planilla Oficial
                        </h2>
                        <span className="bg-uecg-black text-white px-4 py-2 text-[9px] font-black uppercase tracking-widest">
                            {new Date(dateParam + 'T12:00:00').toLocaleDateString('es-BO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </span>
                    </div>

                    <AttendanceSheet
                        classroomId={classroomIdParam}
                        date={dateParam}
                        initialRoster={roster}
                    />
                </div>
            )}
        </div>
    );
}