import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import { Users, Search, Phone, HeartPulse, ShieldAlert, CalendarDays } from "lucide-react";
// 1. IMPORTAMOS EL SERVICIO DE LA MÁQUINA DEL TIEMPO
import { academicYearService } from "@/features/academic/services/academic-year.service";

export const dynamic = "force-dynamic";

export default async function TeacherStudentsPage(props: { searchParams: Promise<{ query?: string }> }) {
    const searchParams = await props.searchParams;
    const query = searchParams?.query || "";

    // 2. Identificar al Profesor logueado
    const userId = (await cookies()).get("uecg_session")?.value || "";

    // 3. OBTENER LA GESTIÓN ACTIVA
    const activeYear = await academicYearService.getActiveYear();

    // 4. Obtener las aulas donde dicta clases este profesor EN ESE AÑO
    const teacherCourses = await prisma.course.findMany({
        where: { teacherId: userId, academicYear: activeYear },
        select: { classroomId: true, classroom: { include: { grade: true } } }
    });

    const allowedClassroomIds = [...new Set(teacherCourses.map(c => c.classroomId))];

    // 5. Obtener a los estudiantes matriculados en esas aulas
    const enrollments = await prisma.enrollment.findMany({
        where: {
            classroomId: { in: allowedClassroomIds },
            academicYear: activeYear, // <--- MAGIA: Filtramos por la gestión activa
            status: "ACTIVE",
            // Corrección de esquema: Buscamos por nombre (User) o por documentId (StudentProfile)
            student: query ? {
                OR: [
                    { user: { name: { contains: query, mode: "insensitive" } } },
                    { documentId: { contains: query, mode: "insensitive" } }
                ]
            } : undefined
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

            {/* Header Estilo Suizo */}
            <div className="border-b-4 border-uecg-black pb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-3xl font-black text-uecg-black uppercase tracking-tighter leading-none mb-2">
                        Directorio Estudiantil
                    </h1>
                    <p className="text-uecg-gray font-bold text-[10px] uppercase tracking-[0.2em] mt-2 flex items-center gap-2">
                        <CalendarDays size={14} /> Estudiantes a mi cargo • Fichas Médicas • Gestión {activeYear}
                    </p>
                </div>

                {/* Buscador Simple */}
                <form className="w-full md:w-auto relative group" action="/teacher/students">
                    <input
                        type="text"
                        name="query"
                        defaultValue={query}
                        placeholder="Buscar por nombre o CI..."
                        className="w-full md:w-80 bg-white border-2 border-uecg-black p-3 pl-12 text-[10px] font-black tracking-widest text-uecg-black uppercase focus:border-uecg-blue outline-none transition-colors"
                    />
                    <Search size={16} strokeWidth={3} className="absolute left-4 top-1/2 -translate-y-1/2 text-uecg-gray group-hover:text-uecg-blue transition-colors" />
                    <button type="submit" className="hidden">Buscar</button>
                </form>
            </div>

            {/* Listado Agrupado por Aulas */}
            <div className="space-y-12">
                {Object.keys(studentsByClassroom).length === 0 ? (
                    <div className="p-16 text-center border-4 border-dashed border-gray-200 bg-gray-50">
                        <span className="font-black text-uecg-gray uppercase tracking-widest text-lg block mb-2">Sin Resultados</span>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                            {query ? `No se encontró a ningún estudiante en la gestión ${activeYear}.` : `Aún no tiene estudiantes matriculados en sus materias para ${activeYear}.`}
                        </span>
                    </div>
                ) : (
                    Object.entries(studentsByClassroom).map(([classroomName, students]) => (
                        <div key={classroomName} className="space-y-4">

                            {/* Título del Aula (Cinta Negra) */}
                            <div className="bg-uecg-black text-white px-4 py-2 inline-flex items-center gap-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)]">
                                <h2 className="text-[10px] font-black uppercase tracking-[0.2em]">
                                    {classroomName}
                                </h2>
                                <span className="bg-white/20 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest rounded-sm">
                                    {students.length} Alumnos
                                </span>
                            </div>

                            {/* Grid de Tarjetas (Carnets de Estudiantes) */}
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {students.map(student => {
                                    // Verificamos si tiene alertas médicas usando los campos correctos del schema
                                    const hasMedicalAlert = !!(student.allergies || student.medicalNotes);

                                    return (
                                        <div
                                            key={student.id}
                                            className="bg-white border-2 border-uecg-line p-5 hover:border-uecg-blue hover:shadow-sm transition-all relative flex flex-col justify-between"
                                        >
                                            {/* Alerta Médica (Si tiene alergias/condiciones) */}
                                            {hasMedicalAlert && (
                                                <div className="absolute top-0 right-0 bg-red-50 text-red-600 p-2 border-l-2 border-b-2 border-red-200" title="Alerta Médica Activa">
                                                    <ShieldAlert size={16} strokeWidth={2.5} />
                                                </div>
                                            )}

                                            <div>
                                                {/* Datos del Estudiante */}
                                                <div className="flex items-center gap-4 mb-5 mt-1">
                                                    <div className="w-12 h-12 bg-gray-50 text-uecg-black flex items-center justify-center font-black text-sm border-2 border-uecg-line">
                                                        {student.user.name.substring(0, 2).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <h3 className="text-sm font-black uppercase tracking-tight text-uecg-black leading-none mb-1.5 line-clamp-1">
                                                            {student.user.name}
                                                        </h3>
                                                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block bg-gray-100 px-1.5 py-0.5 inline-block">
                                                            CI: {student.documentId}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Datos de Emergencia (Info Block) */}
                                                <div className="space-y-3 bg-gray-50/50 p-4 border-t-2 border-uecg-line">
                                                    <div className="flex items-center gap-3">
                                                        <div className="bg-blue-100 p-1.5">
                                                            <Phone size={12} strokeWidth={3} className="text-uecg-blue" />
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-[9px] font-black uppercase tracking-widest text-uecg-gray">Tutor Responsable</span>
                                                            <span className="text-[10px] font-bold text-uecg-black uppercase leading-tight mt-0.5">
                                                                {student.guardianName} ({student.guardianPhone})
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-start gap-3">
                                                        <div className={`p-1.5 ${hasMedicalAlert ? "bg-red-100" : "bg-gray-200"}`}>
                                                            <HeartPulse size={12} strokeWidth={3} className={hasMedicalAlert ? "text-red-600" : "text-gray-400"} />
                                                        </div>
                                                        <div className="flex flex-col flex-1">
                                                            <span className="text-[9px] font-black uppercase tracking-widest text-uecg-gray">Salud / Alergias</span>
                                                            <span className={`text-[10px] font-bold uppercase leading-tight mt-0.5 line-clamp-2 ${hasMedicalAlert ? "text-red-600" : "text-gray-500"}`}>
                                                                {student.allergies || student.medicalNotes || "Sin condiciones reportadas"}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}