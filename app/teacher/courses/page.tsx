import { prisma } from "@/lib/db";
import Link from "next/link";
import { BookOpen, ChevronRight, User, CalendarDays } from "lucide-react";
import { cookies } from "next/headers";
// 1. IMPORTAMOS EL SERVICIO DE LA MÁQUINA DEL TIEMPO
import { academicYearService } from "@/features/academic/services/academic-year.service";

export const dynamic = "force-dynamic";

export default async function TeacherCoursesPage() {
    // 2. OBTENEMOS EL ID DEL PROFESOR LOGUEADO
    const userId = (await cookies()).get("uecg_session")?.value || "";

    // 3. OBTENEMOS LA GESTIÓN ACTIVA DEL USUARIO (La Máquina del Tiempo)
    const activeYear = await academicYearService.getActiveYear();

    // 4. Obtener las materias asignadas a este profesor FILTRADAS POR AÑO
    const courses = await prisma.course.findMany({
        where: {
            teacherId: userId,
            academicYear: activeYear // <--- MAGIA: Solo materias de la gestión seleccionada
        },
        include: {
            subject: true,
            classroom: {
                include: { grade: true }
            },
            _count: {
                select: { evaluations: true }
            }
        },
        orderBy: [
            { classroom: { grade: { level: 'asc' } } },
            { classroom: { grade: { numericOrder: 'asc' } } },
            { subject: { name: 'asc' } }
        ]
    });

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

            {/* Grid de Materias (Cuadernos) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                {/* Estado Vacío Dinámico */}
                {courses.length === 0 ? (
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
                            <div className="absolute top-0 left-0 w-2 h-full" style={{ backgroundColor: course.subject.color || '#000000' }} />

                            <div className="p-6 pl-8 flex-1">
                                <span className="inline-block bg-uecg-black text-white px-2 py-1 text-[10px] font-black uppercase tracking-widest mb-3">
                                    {course.classroom.grade.name} "{course.classroom.name}"
                                </span>
                                <h2 className="text-xl font-black uppercase text-uecg-black leading-tight line-clamp-2">
                                    {course.subject.name}
                                </h2>
                                <span className="text-[10px] font-bold text-uecg-gray uppercase tracking-widest mt-2 block">
                                    Nivel: {course.classroom.grade.level}
                                </span>
                            </div>

                            <div className="bg-gray-50 border-t-2 border-uecg-line p-3 pl-8 flex justify-between items-center group-hover:bg-blue-50 transition-colors">
                                <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-uecg-blue">
                                    <BookOpen size={14} strokeWidth={2.5} />
                                    {course._count.evaluations} Evaluaciones
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