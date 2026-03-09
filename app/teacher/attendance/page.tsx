import { CheckCircle, CalendarDays, Users, AlertTriangle, Info } from "lucide-react";
import AttendanceSheet from "@/features/attendance/components/attendance-sheet";
import { academicYearService } from "@/features/academic/services/academic-year.service";
import { apiFetch } from "../../../app/lib/api-client";

export const dynamic = "force-dynamic";

export default async function TeacherAttendancePage(props: { searchParams: Promise<{ date?: string, classroomId?: string }> }) {
    const searchParams = await props.searchParams;
    const selectedDateStr = searchParams?.date || new Date().toLocaleDateString('en-CA');
    const selectedClassroomId = searchParams?.classroomId;

    // 1. Obtenemos la gestión activa
    const activeYear = await academicYearService.getActiveYear();

    // 2. Obtenemos las aulas permitidas para ESTE profesor desde la API
    let allowedClassrooms: any[] = [];
    try {
        allowedClassrooms = await apiFetch<any[]>(`/classrooms/teacher/me?academicYear=${activeYear}`);
    } catch (error) {
        console.error("Error cargando las aulas del profesor", error);
    }

    const allowedClassroomIds = allowedClassrooms.map(c => c.id);

    // 3. Obtener la planilla (roster) usando el endpoint de NestJS
    let roster: any[] = [];
    let selectedClassroomData = null;

    // Verificamos que el ID seleccionado esté en su lista permitida (Seguridad Frontend)
    if (selectedClassroomId && allowedClassroomIds.includes(selectedClassroomId)) {
        selectedClassroomData = allowedClassrooms.find(c => c.id === selectedClassroomId);

        try {
            // Reutilizamos el endpoint que ya tienes mapeado en NestJS
            roster = await apiFetch<any[]>(`/attendance/roster?classroomId=${selectedClassroomId}&date=${selectedDateStr}&academicYear=${activeYear}`);
        } catch (error) {
            console.error("Error cargando la planilla de asistencia", error);
        }
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500 relative">

            {/* Header Estilo Suizo */}
            <div className="border-b-4 border-uecg-black pb-6">
                <h1 className="text-3xl font-black text-uecg-black uppercase tracking-tighter leading-none mb-2">
                    Control de Asistencia
                </h1>
                <p className="text-uecg-gray font-bold text-[10px] uppercase tracking-[0.2em] mt-2 flex items-center gap-2">
                    <CheckCircle size={14} /> Registro Diario • Mis Aulas • Gestión {activeYear}
                </p>
            </div>

            {/* Panel de Filtros (Selector Inteligente) */}
            <div className="bg-white border-2 border-uecg-line p-6 shadow-sm">
                <form className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">

                    {/* Selector de Fecha */}
                    <div>
                        <label className="text-[10px] font-black uppercase tracking-[0.15em] text-uecg-gray mb-2 flex items-center gap-2">
                            <CalendarDays size={14} /> Fecha del Registro
                        </label>
                        <input
                            type="date"
                            name="date"
                            defaultValue={selectedDateStr}
                            required
                            className="w-full border-2 border-gray-300 bg-white p-3 font-bold text-uecg-black uppercase focus:border-uecg-black outline-none transition-colors text-sm"
                        />
                    </div>

                    {/* Selector de Aula (Filtrado por las aulas que le devuelve la API) */}
                    <div className="md:col-span-2 flex gap-4 items-end">
                        <div className="flex-1">
                            <label className="text-[10px] font-black uppercase tracking-[0.15em] text-uecg-gray mb-2 flex items-center gap-2">
                                <Users size={14} /> Seleccionar Aula
                            </label>
                            <div className="relative border-2 border-gray-300 bg-white focus-within:border-uecg-black transition-colors">
                                <select
                                    name="classroomId"
                                    defaultValue={selectedClassroomId || ""}
                                    required
                                    className="w-full p-3 font-bold text-uecg-black bg-transparent outline-none appearance-none cursor-pointer z-10 relative text-xs uppercase"
                                >
                                    <option value="" disabled>-- Elija un aula asignada --</option>
                                    {allowedClassrooms.map(classroom => (
                                        <option key={classroom.id} value={classroom.id}>
                                            {classroom.grade?.name} "{classroom.name}" - Nivel {classroom.grade?.level}
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-uecg-black font-black text-xs z-0">▼</div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="bg-uecg-black text-white font-black uppercase tracking-widest text-[10px] px-8 py-[14px] border-2 border-uecg-black hover:bg-uecg-blue hover:border-uecg-blue transition-colors"
                        >
                            Cargar Lista
                        </button>
                    </div>
                </form>
            </div>

            {/* Área de la Planilla */}
            {selectedClassroomId ? (
                <>
                    {/* Seguridad Frontend: Mensaje si altera la URL */}
                    {!selectedClassroomData ? (
                        <div className="bg-red-50 border-2 border-red-200 p-6 flex items-start gap-4 shadow-sm">
                            <AlertTriangle className="text-red-600 mt-1" size={24} strokeWidth={2.5} />
                            <div>
                                <h3 className="text-sm font-black uppercase tracking-widest text-red-700 mb-1">Acceso Denegado</h3>
                                <p className="text-[10px] font-bold text-red-600/80 uppercase tracking-widest">
                                    No tiene permisos para tomar asistencia en esta aula. Comuníquese con administración si cree que es un error.
                                </p>
                            </div>
                        </div>
                    ) : (
                        /* LA MAGIA: Reutilizamos el Componente de la Planilla */
                        <div className="mt-8 animate-in slide-in-from-bottom-4 duration-500">
                            <div className="mb-4 flex items-center justify-between border-b-2 border-uecg-line pb-4">
                                <div className="flex items-center gap-2 border-l-4 border-uecg-blue pl-3">
                                    <Info size={16} className="text-uecg-blue" strokeWidth={3} />
                                    <span className="text-xs font-black uppercase tracking-widest text-uecg-black">
                                        Registrando: {selectedClassroomData.grade?.name} "{selectedClassroomData.name}"
                                    </span>
                                </div>
                                <span className="bg-uecg-black text-white px-4 py-2 text-[9px] font-black uppercase tracking-widest hidden md:block">
                                    {new Date(selectedDateStr + 'T12:00:00').toLocaleDateString('es-BO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                </span>
                            </div>

                            <AttendanceSheet
                                classroomId={selectedClassroomId}
                                date={selectedDateStr}
                                initialRoster={roster}
                            />
                        </div>
                    )}
                </>
            ) : (
                /* Estado Vacío: Antes de seleccionar un aula */
                <div className="p-16 text-center border-4 border-dashed border-gray-200 bg-gray-50">
                    <span className="font-black text-uecg-gray uppercase tracking-widest text-lg block mb-2">Seleccione un Aula</span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Use el panel superior para cargar la lista de estudiantes matriculados en {activeYear}.</span>
                </div>
            )}
        </div>
    );
}