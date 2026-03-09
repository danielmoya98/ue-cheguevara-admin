import Link from "next/link";
import { BookOpen, ChevronRight, CalendarDays, AlertTriangle } from "lucide-react";
import { academicYearService } from "@/features/academic/services/academic-year.service";
import { apiFetch } from "../../../app/lib/api-client";

export const dynamic = "force-dynamic";

export default async function TeacherCoursesPage() {
    // 1. OBTENEMOS LA GESTIÓN ACTIVA DEL USUARIO (La Máquina del Tiempo)
    const activeYear = await academicYearService.getActiveYear();

    // 2. Obtener las materias asignadas a este profesor FILTRADAS POR AÑO desde la API
    let courses: any[] = [];
    let errorMessage = "";

    try {
        courses = await apiFetch<any[]>(`/courses/teacher/me?academicYear=${activeYear}`);
    } catch (error: any) {
        errorMessage = error.message;
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500 relative">

            {/* Header Estilo Suizo */}
            <div className="border-b-4 border-uecg-black pb-6">
                <h1 className="text-3xl font-black text-uecg-black uppercase tracking-tighter leading-none mb-2">
                    Mi Cuaderno Pedagógico
                </h1>
                <p className="text-uecg-gray font-bold text-[10px] uppercase tracking-[0.2em] mt-2 flex items-center gap-2">
                    <CalendarDays size={14} /> Materias Asignadas • Gestión {activeYear}
                </p>
            </div>

            {/* Control de Errores */}
            {errorMessage && (
                <div className="bg-red-50 border-2 border-red-200 p-6 flex items-start gap-4 shadow-sm">
                    <AlertTriangle className="text-red-600 mt-1" size={24} strokeWidth={2.5} />
                    <div>
                        <h3 className="text-sm font-black uppercase tracking-widest text-red-700 mb-1">Error de Conexión</h3>
                        <p className="text-[10px] font-bold text-red-600/80 uppercase tracking-widest">
                            Falta crear el endpoint GET /api/v1/courses/teacher/me?academicYear={activeYear} en el backend.
                        </p>
                    </div>
                </div>
            )}

            {/* Grid de Materias (Cuadernos) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                {/* Estado Vacío Dinámico */}
                {(!errorMessage && courses.length === 0) ? (
                    <div className="col-span-full p-16 text-center border-4 border-dashed border-gray-200 bg-gray-50">
                        <span className="font-black text-uecg-gray uppercase tracking-widest text-lg block mb-2">
                            Sin Materias Asignadas
                        </span>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                            No se encontraron cursos asignados a usted en la gestión {activeYear}. Comuníquese con administración.
                        </span>
                    </div>
                ) : (
                    courses.map((course) => (
                        <Link
                            key={course.id}
                            href={`/teacher/courses/${course.id}`} // Ruta al Cuaderno Específico
                            className="group flex flex-col bg-white border-2 border-uecg-line hover:border-uecg-blue transition-colors relative overflow-hidden min-h-[160px] shadow-sm"
                        >
                            {/* Banda de color de la materia */}
                            <div className="absolute top-0 left-0 w-2 h-full" style={{ backgroundColor: course.subject?.color || '#000000' }} />

                            <div className="p-6 pl-8 flex-1">
                                <span className="inline-block bg-uecg-black text-white px-2 py-1 text-[10px] font-black uppercase tracking-widest mb-3">
                                    {course.classroom?.grade?.name} "{course.classroom?.name}"
                                </span>
                                <h2 className="text-xl font-black uppercase text-uecg-black leading-tight line-clamp-2">
                                    {course.subject?.name}
                                </h2>
                                <span className="text-[10px] font-bold text-uecg-gray uppercase tracking-widest mt-2 block">
                                    Nivel: {course.classroom?.grade?.level}
                                </span>
                            </div>

                            <div className="bg-gray-50 border-t-2 border-uecg-line p-3 pl-8 flex justify-between items-center group-hover:bg-blue-50 transition-colors">
                                <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-uecg-blue">
                                    <BookOpen size={14} strokeWidth={2.5} />
                                    {course._count?.evaluations || 0} Evaluaciones
                                </span>
                                <ChevronRight size={16} strokeWidth={3} className="text-uecg-gray group-hover:text-uecg-blue transition-colors" />
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
}