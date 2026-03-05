import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import Link from "next/link";
import { Users, Search, Phone, HeartPulse, ExternalLink, ShieldAlert } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function TeacherStudentsPage(props: { searchParams: Promise<{ query?: string }> }) {
    const searchParams = await props.searchParams;
    const query = searchParams?.query || "";

    // 1. Identificar al Profesor logueado
    const userId = (await cookies()).get("uecg_session")?.value || "74084bb7-1f04-481a-9f30-282d8d37f054";
    const currentYear = new Date().getFullYear();

    // 2. Obtener las aulas donde dicta clases este profesor
    const teacherCourses = await prisma.course.findMany({
        where: { teacherId: userId, academicYear: currentYear },
        select: { classroomId: true, classroom: { include: { grade: true } } }
    });

    const allowedClassroomIds = [...new Set(teacherCourses.map(c => c.classroomId))];

    // 3. Obtener a los estudiantes de esas aulas
    // (Filtramos por nombre o CI si hay un query de búsqueda)
    const enrollments = await prisma.enrollment.findMany({
        where: {
            classroomId: { in: allowedClassroomIds },
            academicYear: currentYear,
            status: "ACTIVE",
            student: query ? {
                user: {
                    OR: [
                        { name: { contains: query, mode: "insensitive" } },
                        { ci: { contains: query, mode: "insensitive" } }
                    ]
                }
            } : {}
        },
        include: {
            student: { include: { user: true } },
            classroom: { include: { grade: true } }
        },
        orderBy: [
            { classroom: { grade: { level: 'asc' } } },
            { student: { user: { name: 'asc' } } }
        ]
    });

    // Agrupamos a los estudiantes por Aula para que la vista sea más ordenada
    const studentsByClassroom = enrollments.reduce((acc, enrollment) => {
        const classroomName = `${enrollment.classroom.grade.name} "${enrollment.classroom.name}"`;
        if (!acc[classroomName]) {
            acc[classroomName] = [];
        }
        acc[classroomName].push(enrollment.student);
        return acc;
    }, {} as Record<string, typeof enrollments[0]['student'][]>);

    return (
        <div className="space-y-8 animate-in fade-in duration-500 relative">

            {/* Header */}
            <div className="border-b-4 border-uecg-black pb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-3xl font-black text-uecg-black uppercase tracking-tighter leading-none mb-2">
                        Directorio Estudiantil
                    </h1>
                    <p className="text-uecg-gray font-bold text-xs uppercase tracking-widest mt-2 flex items-center gap-2">
                        <Users size={14} /> Estudiantes a mi cargo • Fichas Médicas
                    </p>
                </div>

                {/* Buscador Simple */}
                <form className="w-full md:w-auto relative group">
                    <input
                        type="text"
                        name="query"
                        defaultValue={query}
                        placeholder="Buscar alumno por nombre o CI..."
                        className="w-full md:w-80 bg-white border-2 border-uecg-line p-3 pl-10 text-sm font-bold text-uecg-black uppercase focus:border-uecg-blue outline-none transition-colors"
                    />
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-uecg-gray group-hover:text-uecg-blue transition-colors" />
                    <button type="submit" className="hidden">Buscar</button>
                </form>
            </div>

            {/* Listado Agrupado por Aulas */}
            <div className="space-y-12">
                {Object.keys(studentsByClassroom).length === 0 ? (
                    <div className="p-16 text-center border-4 border-dashed border-gray-200 bg-white">
                        <span className="font-black text-uecg-gray uppercase tracking-widest text-sm block mb-2">Sin Resultados</span>
                        <span className="text-xs font-bold text-gray-400 uppercase">
                            {query ? "No se encontró a ningún estudiante con ese nombre en sus aulas." : "Aún no tiene estudiantes matriculados en sus materias."}
                        </span>
                    </div>
                ) : (
                    Object.entries(studentsByClassroom).map(([classroomName, students]) => (
                        <div key={classroomName} className="space-y-4">
                            {/* Título del Aula */}
                            <div className="bg-uecg-black text-white px-4 py-2 inline-block">
                                <h2 className="text-xs font-black uppercase tracking-widest">
                                    {classroomName} <span className="text-gray-400 font-bold ml-2">({students.length} Alumnos)</span>
                                </h2>
                            </div>

                            {/* Grid de Tarjetas (Carnets de Estudiantes) */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {students.map(student => (
                                    <div
                                        key={student.id}
                                        className="bg-white border-2 border-uecg-line p-5 hover:border-uecg-blue transition-colors relative flex flex-col justify-between"
                                    >
                                        {/* Alerta Médica (Si tiene alergias/condiciones) */}
                                        {student.medicalConditions && student.medicalConditions.trim() !== "" && (
                                            <div className="absolute top-0 right-0 bg-red-50 text-red-600 p-2 border-l-2 border-b-2 border-red-200">
                                                <ShieldAlert size={16} strokeWidth={2.5} />
                                            </div>
                                        )}

                                        <div>
                                            {/* Datos del Estudiante */}
                                            <div className="flex items-center gap-4 mb-4">
                                                <div className="w-12 h-12 bg-gray-100 text-uecg-gray flex items-center justify-center font-black text-lg border border-gray-200">
                                                    {student.user.name.substring(0, 2).toUpperCase()}
                                                </div>
                                                <div>
                                                    <h3 className="text-sm font-black uppercase tracking-tight text-uecg-black leading-none mb-1">
                                                        {student.user.name}
                                                    </h3>
                                                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block">
                                                        CI: {student.user.ci}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Datos de Emergencia */}
                                            <div className="space-y-2 bg-gray-50 p-3 border border-gray-100">
                                                <div className="flex items-center gap-2">
                                                    <Phone size={12} className="text-uecg-blue" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-uecg-black">Tutor:</span>
                                                    <span className="text-[10px] font-bold text-gray-600 uppercase">
                                                        {student.guardianName} ({student.guardianPhone})
                                                    </span>
                                                </div>

                                                <div className="flex items-start gap-2">
                                                    <HeartPulse size={12} className={student.medicalConditions ? "text-red-500 mt-0.5" : "text-gray-400 mt-0.5"} />
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-uecg-black mt-0.5">Salud:</span>
                                                    <span className={`text-[10px] font-bold uppercase leading-tight ${student.medicalConditions ? "text-red-600" : "text-gray-500"}`}>
                                                        {student.medicalConditions || "Sin condiciones reportadas"}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Botón (Opcional) para ver el expediente completo usando la vista del admin (solo lectura) */}
                                        {/* Como el profesor no tiene permisos de edición, la vista de /admin/students/[id] debería bloquear la edición,
                                            o podríamos crear una vista rápida /teacher/students/[id]. Por ahora, esta tarjeta tiene lo esencial. */}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}