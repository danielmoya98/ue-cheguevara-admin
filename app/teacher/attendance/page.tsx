import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import { CheckCircle, Calendar, Users, AlertTriangle, Info } from "lucide-react";
// Importamos el componente de planilla que creamos para el Admin
import AttendanceSheet from "@/features/attendance/components/attendance-sheet";

export const dynamic = "force-dynamic";

export default async function TeacherAttendancePage(props: { searchParams: Promise<{ date?: string, classroomId?: string }> }) {
    const searchParams = await props.searchParams;
    const selectedDateStr = searchParams?.date || new Date().toISOString().split('T')[0];
    const selectedClassroomId = searchParams?.classroomId;

    // 1. Identificar al Profesor logueado
    // (Asegúrate de poner un ID válido para probar si aún no conectas el login real)
    const userId = (await cookies()).get("uecg_session")?.value || "74084bb7-1f04-481a-9f30-282d8d37f054";
    const currentYear = new Date().getFullYear();

    // 2. CANDADO DE SEGURIDAD: Obtener solo las aulas donde dicta clases este profesor
    const teacherCourses = await prisma.course.findMany({
        where: { teacherId: userId, academicYear: currentYear },
        select: { classroomId: true }
    });

    // Extraer IDs únicos de las aulas permitidas
    const allowedClassroomIds = [...new Set(teacherCourses.map(c => c.classroomId))];

    // Obtener los datos completos de esas aulas
    const allowedClassrooms = await prisma.classroom.findMany({
        where: { id: { in: allowedClassroomIds } },
        include: { grade: true },
        orderBy: [
            { grade: { level: 'asc' } },
            { grade: { numericOrder: 'asc' } }
        ]
    });

    // 3. Obtener la lista de alumnos y sus asistencias si hay un aula seleccionada
    let roster: any[] = [];
    let selectedClassroomData = null;

    // Verificamos que el ID seleccionado esté en su lista permitida
    if (selectedClassroomId && allowedClassroomIds.includes(selectedClassroomId)) {
        selectedClassroomData = allowedClassrooms.find(c => c.id === selectedClassroomId);

        // Alumnos matriculados en esta aula
        const enrollments = await prisma.enrollment.findMany({
            where: { classroomId: selectedClassroomId, academicYear: currentYear, status: "ACTIVE" },
            include: { student: { include: { user: true } } },
            orderBy: { student: { user: { name: 'asc' } } }
        });

        // Registros de asistencia existentes para la fecha seleccionada
        const attendances = await prisma.attendance.findMany({
            where: {
                classroomId: selectedClassroomId,
                date: new Date(selectedDateStr)
            }
        });

        // Mezclar alumnos con sus registros
        roster = enrollments.map(enrollment => {
            const record = attendances.find(a => a.studentId === enrollment.studentId);
            return {
                student: enrollment.student,
                attendance: record || null
            };
        });
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500 relative">

            {/* Header */}
            <div className="border-b-4 border-uecg-black pb-6">
                <h1 className="text-3xl font-black text-uecg-black uppercase tracking-tighter leading-none mb-2">
                    Control de Asistencia
                </h1>
                <p className="text-uecg-gray font-bold text-xs uppercase tracking-widest mt-2 flex items-center gap-2">
                    <CheckCircle size={14} /> Registro Diario • Mis Aulas
                </p>
            </div>

            {/* Panel de Filtros (Selector Inteligente) */}
            <div className="bg-white border-2 border-uecg-line p-6 shadow-sm">
                <form className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">

                    {/* Selector de Fecha */}
                    <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-uecg-gray mb-2 flex items-center gap-2">
                            <Calendar size={14} /> Fecha del Registro
                        </label>
                        <input
                            type="date"
                            name="date"
                            defaultValue={selectedDateStr}
                            className="w-full border-2 border-gray-300 p-3 text-sm font-bold text-uecg-black uppercase focus:border-uecg-blue outline-none transition-colors"
                        />
                    </div>

                    {/* Selector de Aula (Filtrado por el Candado) */}
                    <div className="md:col-span-2 flex gap-4 items-end">
                        <div className="flex-1">
                            <label className="text-[10px] font-black uppercase tracking-widest text-uecg-gray mb-2 flex items-center gap-2">
                                <Users size={14} /> Seleccionar Aula
                            </label>
                            <div className="relative">
                                <select
                                    name="classroomId"
                                    defaultValue={selectedClassroomId || ""}
                                    required
                                    className="w-full border-2 border-gray-300 p-3 text-sm font-bold text-uecg-black uppercase focus:border-uecg-blue outline-none transition-colors appearance-none bg-transparent relative z-10 cursor-pointer"
                                >
                                    <option value="" disabled>-- Elija un aula asignada --</option>
                                    {allowedClassrooms.map(classroom => (
                                        <option key={classroom.id} value={classroom.id}>
                                            {classroom.grade.name} "{classroom.name}" - Nivel {classroom.grade.level}
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-uecg-black font-black text-xs z-0">▼</div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="bg-uecg-black text-white font-black uppercase tracking-widest text-xs px-8 py-3 h-[48px] border-2 border-uecg-black hover:bg-uecg-blue hover:border-uecg-blue transition-colors"
                        >
                            Cargar Lista
                        </button>
                    </div>
                </form>
            </div>

            {/* Área de la Planilla */}
            {selectedClassroomId ? (
                <>
                    {/* Seguridad: Mensaje si alguien intenta modificar la URL con un aula que no le toca */}
                    {!selectedClassroomData ? (
                        <div className="bg-red-50 border-2 border-red-200 p-6 flex items-start gap-4">
                            <AlertTriangle className="text-red-500 mt-1" size={24} />
                            <div>
                                <h3 className="text-sm font-black uppercase tracking-widest text-red-700 mb-1">Acceso Denegado</h3>
                                <p className="text-xs font-bold text-red-600/80 uppercase">
                                    No tiene permisos para tomar asistencia en esta aula. Comuníquese con administración si cree que es un error.
                                </p>
                            </div>
                        </div>
                    ) : (
                        /* LA MAGIA: Reutilizamos el Componente de la Planilla */
                        <div className="mt-8">
                            <div className="mb-4 flex items-center gap-2 text-uecg-gray border-l-4 border-uecg-blue pl-3">
                                <Info size={16} className="text-uecg-blue" />
                                <span className="text-xs font-bold uppercase tracking-widest text-uecg-black">
                                    Registrando asistencia para: {selectedClassroomData.grade.name} "{selectedClassroomData.name}"
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
                <div className="p-16 text-center border-4 border-dashed border-gray-200 bg-white">
                    <span className="font-black text-uecg-gray uppercase tracking-widest text-sm block mb-2">Seleccione un Aula</span>
                    <span className="text-xs font-bold text-gray-400 uppercase">Use el panel superior para cargar la lista de estudiantes.</span>
                </div>
            )}
        </div>
    );
}