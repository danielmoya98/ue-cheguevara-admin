import { getTeacherCoursesAction } from "@/features/academic/actions/course.action";
import Link from "next/link";
import { BookOpen, ChevronRight, CalendarDays } from "lucide-react";
// 1. IMPORTAMOS EL SERVICIO DE LA MÁQUINA DEL TIEMPO
import { academicYearService } from "@/features/academic/services/academic-year.service";

export default async function GradesPortalPage() {
    // 2. OBTENEMOS LA GESTIÓN ACTIVA DEL USUARIO
    const activeYear = await academicYearService.getActiveYear();

    // 3. PASAMOS EL AÑO A LA ACCIÓN
    // Al no pasar teacherId (undefined), traerá TODAS las materias para el Admin,
    // pero ahora filtradas estrictamente por el año seleccionado.
    const { data: courses, success } = await getTeacherCoursesAction(undefined, activeYear);

    if (!success || !courses) {
        return <div className="p-8 text-red-500 font-black uppercase text-xs tracking-widest">Error al cargar las asignaturas.</div>;
    }

    return (
        <div className="space-y-8 relative animate-in fade-in duration-500">
            {/* Header Estilo Suizo */}
            <div className="border-b-4 border-uecg-black pb-6">
                <h1 className="text-3xl font-black text-uecg-black uppercase tracking-tighter leading-none mb-2">
                    Portal de Calificaciones
                </h1>
                <p className="text-uecg-gray font-bold text-[10px] uppercase tracking-[0.2em] mt-2 flex items-center gap-2">
                    <CalendarDays size={14} /> Gestión Académica {activeYear}
                </p>
            </div>

            {/* Grid de Materias (Cuadernos) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                {/* Estado Vacío Dinámico */}
                {courses.length === 0 && (
                    <div className="col-span-full p-16 text-center border-4 border-dashed border-gray-200 bg-gray-50">
                        <span className="font-black text-uecg-gray uppercase tracking-widest text-lg block mb-2">
                            Sin Materias Asignadas
                        </span>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                            No se encontraron asignaturas creadas para la gestión {activeYear}.
                        </span>
                    </div>
                )}

                {/* Tarjetas de Materias */}
                {courses.map((course) => (
                    <Link
                        key={course.id}
                        href={`/admin/grades/course/${course.id}`} // Ruta al Cuaderno
                        className="group flex flex-col bg-white border-2 border-uecg-line hover:border-uecg-blue transition-colors relative overflow-hidden h-40 shadow-sm"
                    >
                        {/* Banda de color de la materia */}
                        <div className="absolute top-0 left-0 w-2 h-full" style={{ backgroundColor: course.subject.color }} />

                        <div className="p-5 pl-8 flex-1">
                            <span className="inline-block bg-uecg-black text-white px-2 py-1 text-[10px] font-black uppercase tracking-widest mb-2">
                                {course.classroom.grade.name} "{course.classroom.name}"
                            </span>
                            <h2 className="text-lg font-black uppercase text-uecg-black leading-tight line-clamp-2">
                                {course.subject.name}
                            </h2>
                            <span className="text-[10px] font-bold text-uecg-gray uppercase tracking-widest mt-2 block">
                                Nivel: {course.classroom.grade.level}
                            </span>
                        </div>

                        <div className="bg-gray-50 border-t-2 border-uecg-line p-3 pl-8 flex justify-between items-center group-hover:bg-blue-50 transition-colors">
                            <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-uecg-blue">
                                <BookOpen size={14} strokeWidth={2.5} />
                                {course._count.evaluations} Evaluaciones
                            </span>
                            <ChevronRight size={16} strokeWidth={3} className="text-uecg-gray group-hover:text-uecg-blue transition-colors" />
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}