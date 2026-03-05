import { prisma } from "@/lib/db";
import Link from "next/link";
import { BookOpen, Users, CheckCircle, PenTool } from "lucide-react";
import { cookies } from "next/headers";
import NoticeBoard from "@/features/announcements/components/notice-board";
import { getAnnouncementsAction } from "@/features/announcements/actions/announcement.action";

export const dynamic = "force-dynamic";

export default async function TeacherDashboardPage() {
    // 1. Simular la obtención del ID del profesor logueado
    // En producción, esto vendría de tu sistema de Auth real.
    // IMPORTANTE: Asegúrate de reemplazar "ID_DEL_PROFESOR_AQUI" por el ID real de un User con rol TEACHER de tu BD para probar.
    const userId = (await cookies()).get("uecg_session")?.value || "74084bb7-1f04-481a-9f30-282d8d37f054";

    const currentYear = new Date().getFullYear();

    // 2. Obtener los cursos asignados a este profesor
    const teacherCourses = await prisma.course.findMany({
        where: { teacherId: userId, academicYear: currentYear },
        include: { classroom: true }
    });

    const totalCourses = teacherCourses.length;

    // 3. Contar cuántos estudiantes únicos tiene a su cargo
    const classroomIds = teacherCourses.map(c => c.classroomId);
    const uniqueStudentsCount = await prisma.enrollment.count({
        where: {
            classroomId: { in: classroomIds },
            academicYear: currentYear,
            status: "ACTIVE"
        }
    });

    // 4. Obtener comunicados PERO filtrados para el rol TEACHER
    const announcementsRes = await getAnnouncementsAction("TEACHER");
    const announcements = announcementsRes.data || [];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">

            {/* Header / Bienvenida */}
            <div className="border-b-4 border-uecg-black pb-6">
                <h1 className="text-4xl font-black text-uecg-black uppercase tracking-tighter leading-none mb-2">
                    Resumen Docente
                </h1>
                <p className="text-uecg-gray font-bold text-sm uppercase tracking-widest mt-2">
                    Gestión Académica {currentYear} • Sus materias y comunicados
                </p>
            </div>

            {/* KPI Cards (Métricas Rápidas del Profe) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border-2 border-uecg-line p-6 relative overflow-hidden group hover:border-uecg-blue transition-colors">
                    <BookOpen size={80} className="absolute -bottom-4 -right-4 text-gray-100 group-hover:scale-110 group-hover:text-blue-50 transition-all" />
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-uecg-gray mb-2">Mis Materias</h3>
                    <span className="block text-5xl font-black font-mono leading-none text-uecg-black relative z-10">{totalCourses}</span>
                    <span className="text-xs font-bold text-uecg-gray uppercase tracking-widest mt-4 block relative z-10">Cursos asignados</span>
                </div>

                <div className="bg-white border-2 border-uecg-line p-6 relative overflow-hidden group hover:border-uecg-black transition-colors">
                    <Users size={80} className="absolute -bottom-4 -right-4 text-gray-100 group-hover:scale-110 transition-transform" />
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-uecg-gray mb-2">Estudiantes a Cargo</h3>
                    <span className="block text-5xl font-black font-mono leading-none text-uecg-black relative z-10">{uniqueStudentsCount}</span>
                    <span className="text-xs font-bold text-uecg-gray uppercase tracking-widest mt-4 block relative z-10">Alumnos inscritos en sus clases</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Columna Izquierda: Accesos Directos */}
                <div className="lg:col-span-1 space-y-4">
                    <h2 className="text-xs font-black uppercase tracking-widest text-uecg-gray mb-4">Acciones Rápidas</h2>

                    <Link href="/teacher/attendance" className="bg-uecg-black text-white p-6 flex items-center justify-between group hover:bg-uecg-blue transition-colors border-2 border-uecg-black">
                        <div>
                            <span className="block text-sm font-black uppercase tracking-widest mb-1">Tomar Lista</span>
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest group-hover:text-blue-200">Registrar asistencia diaria</span>
                        </div>
                        <CheckCircle size={24} strokeWidth={2.5} className="text-gray-400 group-hover:text-white" />
                    </Link>

                    <Link href="/teacher/courses" className="bg-white text-uecg-black p-6 flex items-center justify-between group hover:border-uecg-black transition-colors border-2 border-uecg-line">
                        <div>
                            <span className="block text-sm font-black uppercase tracking-widest mb-1">Calificar</span>
                            <span className="text-[10px] text-uecg-gray font-bold uppercase tracking-widest">Ingresar notas a la planilla</span>
                        </div>
                        <PenTool size={24} strokeWidth={2.5} className="text-uecg-gray group-hover:text-uecg-black" />
                    </Link>
                </div>

                {/* Columna Derecha: El Tablón de Comunicados (REUTILIZADO) */}
                <div className="lg:col-span-2">
                    <NoticeBoard announcements={announcements} />
                </div>
            </div>
        </div>
    );
}