import { prisma } from "@/lib/db";
import { getCoursesByClassroomAction } from "@/features/academic/actions/course.action";
import { getSubjectsAction } from "@/features/academic/actions/subject.action";
import { getUsersAction } from "@/features/users/actions/get-users.action";
import { scheduleService } from "@/features/academic/services/schedule.service"; // NUEVO: Importamos el servicio de horarios
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import CourseModals from "@/features/academic/components/course-modals";
import ClassroomDashboard from "@/features/academic/components/classroom-dashboard";
import ClassroomSchedule from "@/features/academic/components/classroom-schedule"; // NUEVO: Importamos el componente de horario

export default async function ClassroomPage({ params }: { params: Promise<{ id: string }> }) {
    // 1. Obtener el ID de la URL
    const { id: classroomId } = await params;

    // 2. Cargar los datos del Aula
    const classroom = await prisma.classroom.findUnique({
        where: { id: classroomId },
        include: { grade: true }
    });

    if (!classroom) {
        return <div className="p-8 font-black uppercase text-red-500">Aula no encontrada.</div>;
    }

    // 3. Obtener Datos Paralelos (Asignaturas del aula, Materias disponibles, Docentes disponibles, y Horarios)
    const [coursesRes, subjectsRes, teachersRes, schedules] = await Promise.all([
        getCoursesByClassroomAction(classroomId),
        getSubjectsAction(),
        getUsersAction({ role: "TEACHER" }),
        scheduleService.getClassroomSchedule(classroomId) // NUEVO: Cargamos los horarios asignados
    ]);

    const courses = coursesRes.data || [];
    const subjects = subjectsRes.data || [];
    // Filtramos solo los activos
    const availableSubjects = subjects.filter((s: any) => s.isActive);
    const teachers = teachersRes.data || [];

    return (
        <div className="space-y-12 relative"> {/* Aumentamos space-y para separar más las secciones */}

            {/* Modales Controlados por URL */}
            <CourseModals
                classroomId={classroomId}
                subjects={availableSubjects}
                teachers={teachers}
            />

            {/* Header del Aula (Oculto al imprimir: print:hidden) */}
            <div className="border-b-4 border-uecg-black pb-6 print:hidden">
                <Link
                    href="/admin/academic/grades"
                    className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-uecg-gray hover:text-uecg-blue mb-4 transition-colors"
                >
                    <ChevronLeft size={14} strokeWidth={3} />
                    Volver a Estructura Escolar
                </Link>

                <div className="flex items-end gap-4">
                    <div className="w-16 h-16 bg-uecg-black text-white flex items-center justify-center text-3xl font-black">
                        {classroom.name}
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-uecg-black uppercase tracking-tighter leading-none">
                            {classroom.grade.name} de {classroom.grade.level}
                        </h1>
                        <p className="text-uecg-gray font-bold text-xs uppercase tracking-widest mt-2">
                            Turno {classroom.shift} • Capacidad: {classroom.capacity} Alumnos
                        </p>
                    </div>
                </div>
            </div>

            {/* Dashboard Visual de la Malla (Oculto al imprimir: print:hidden) */}
            <div className="print:hidden">
                <ClassroomDashboard classroomId={classroomId} courses={courses} />
            </div>

            {/* NUEVO: Planificador de Horarios (Visible al imprimir) */}
            <div className="border-t-4 border-uecg-black pt-12 print:border-none print:pt-0">
                <ClassroomSchedule
                    classroomId={classroomId}
                    classroomName={`${classroom.grade.name} de ${classroom.grade.level} "${classroom.name}"`}
                    courses={courses} // Pasamos las asignaturas para el menú desplegable
                    schedules={schedules} // Pasamos los horarios guardados
                />
            </div>

        </div>
    );
}