import { prisma } from "@/lib/db";
import { FileText, Users, Search, AlertTriangle, CalendarDays } from "lucide-react";
import { bulletinService } from "@/features/grades/services/bulletin.service";
import BulletinPrintable from "@/features/grades/components/bulletin-printable";
// 1. IMPORTAMOS EL SERVICIO DE LA MÁQUINA DEL TIEMPO
import { academicYearService } from "@/features/academic/services/academic-year.service";

export const dynamic = "force-dynamic";

export default async function AdminBulletinsPage(props: { searchParams: Promise<{ classroomId?: string, studentId?: string }> }) {
    const params = await props.searchParams;
    const classroomId = params?.classroomId;
    const studentId = params?.studentId;

    // 2. OBTENEMOS LA GESTIÓN ACTIVA DEL USUARIO
    const activeYear = await academicYearService.getActiveYear();

    // 1. Obtener todas las aulas para el primer selector
    const classrooms = await prisma.classroom.findMany({
        include: { grade: true },
        orderBy: [{ grade: { level: 'asc' } }, { grade: { numericOrder: 'asc' } }]
    });

    // 2. Si se seleccionó un aula, obtener a sus estudiantes activos en la GESTIÓN ACTUAL
    let students: any[] = [];
    if (classroomId) {
        const enrollments = await prisma.enrollment.findMany({
            where: {
                classroomId,
                academicYear: activeYear, // <--- MAGIA: Filtramos por el año seleccionado
                status: "ACTIVE"
            },
            include: { student: { include: { user: true } } },
            orderBy: { student: { user: { name: 'asc' } } }
        });
        students = enrollments.map(e => e.student);
    }

    // 3. Si se seleccionó un estudiante, usamos nuestro Servicio pasándole la Gestión Activa
    let bulletinData = null;
    let bulletinError = null;

    if (studentId) {
        try {
            bulletinData = await bulletinService.getStudentBulletin(studentId, activeYear); // <--- AÑO PASADO AL SERVICIO
        } catch (error: any) {
            bulletinError = error.message;
        }
    }

    const labelClass = "text-[10px] font-black uppercase tracking-[0.2em] text-uecg-gray mb-2 block";
    const selectClass = "w-full border-2 border-gray-300 p-3 text-[10px] font-bold text-uecg-black uppercase appearance-none bg-transparent relative z-10 cursor-pointer focus:border-uecg-black outline-none transition-colors";

    return (
        <div className="space-y-8 animate-in fade-in duration-500 relative">

            {/* Header Estilo Suizo */}
            <div className="border-b-4 border-uecg-black pb-6">
                <h1 className="text-3xl font-black text-uecg-black uppercase tracking-tighter leading-none mb-2">
                    Emisión de Libretas
                </h1>
                <p className="text-uecg-gray font-bold text-[10px] uppercase tracking-[0.2em] mt-2 flex items-center gap-2">
                    <CalendarDays size={14} /> Boletines Escolares Oficiales • Gestión {activeYear}
                </p>
            </div>

            {/* Panel de Selección (Se oculta al imprimir) */}
            <div className="bg-white border-2 border-uecg-line p-6 shadow-sm print:hidden">
                <form method="GET" className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">

                    {/* PASO 1: Seleccionar Aula */}
                    <div>
                        <label className={labelClass}>1. Seleccionar Aula</label>
                        <div className="relative">
                            <select name="classroomId" defaultValue={classroomId || ""} className={selectClass} required>
                                <option value="" disabled>-- Elija un curso --</option>
                                {classrooms.map(c => (
                                    <option key={c.id} value={c.id}>
                                        {c.grade.name} "{c.name}" - {c.grade.level}
                                    </option>
                                ))}
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-uecg-black font-black text-xs z-0">▼</div>
                        </div>
                    </div>

                    {/* PASO 2: Seleccionar Estudiante (Solo aparece si hay un aula seleccionada en este año) */}
                    <div>
                        <label className={`${labelClass} ${!classroomId ? 'opacity-50' : ''}`}>2. Seleccionar Estudiante</label>
                        <div className="relative">
                            <select
                                name="studentId"
                                defaultValue={studentId || ""}
                                className={`${selectClass} ${!classroomId ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                                disabled={!classroomId}
                                required
                            >
                                <option value="" disabled>
                                    {classroomId ? `-- Estudiantes matriculados en ${activeYear} --` : "Primero seleccione un aula"}
                                </option>
                                {students.map(s => (
                                    <option key={s.id} value={s.id}>
                                        {s.user.name} (CI: {s.user.ci})
                                    </option>
                                ))}
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-uecg-black font-black text-xs z-0">▼</div>
                        </div>
                    </div>

                    {/* Botón de Cargar */}
                    <div>
                        <button
                            type="submit"
                            className="w-full bg-uecg-black text-white font-black uppercase tracking-widest text-[10px] px-8 py-[14px] border-2 border-uecg-black hover:bg-uecg-blue hover:border-uecg-blue transition-colors flex items-center justify-center gap-2"
                        >
                            <Search size={16} strokeWidth={2.5} /> Generar Boletín
                        </button>
                    </div>
                </form>
            </div>

            {/* ÁREA DE RESULTADOS */}
            <div className="mt-8 animate-in slide-in-from-bottom-4 duration-500">
                {bulletinError ? (
                    // Mensaje de Error
                    <div className="bg-red-50 border-2 border-red-200 p-6 flex items-start gap-4 shadow-sm">
                        <AlertTriangle className="text-red-600 mt-1" size={24} strokeWidth={2.5} />
                        <div>
                            <h3 className="text-sm font-black uppercase tracking-widest text-red-700 mb-1">Error al generar</h3>
                            <p className="text-[10px] font-bold text-red-600/80 uppercase tracking-widest">{bulletinError}</p>
                        </div>
                    </div>
                ) : bulletinData ? (
                    // EL BOLETÍN GENERADO
                    <div className="bg-white border-2 border-uecg-line shadow-sm overflow-hidden">
                        <BulletinPrintable data={bulletinData} />
                    </div>
                ) : (
                    // Estado Vacío Inicial
                    <div className="p-16 text-center border-4 border-dashed border-gray-200 bg-gray-50 print:hidden">
                        <span className="font-black text-uecg-gray uppercase tracking-widest text-sm block mb-2">Libreta no generada</span>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Utilice los filtros superiores para cargar el boletín oficial del estudiante en la gestión {activeYear}.</span>
                    </div>
                )}
            </div>

        </div>
    );
}