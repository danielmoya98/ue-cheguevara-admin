import { prisma } from "@/lib/db";
import Link from "next/link";
import { BookOpen, Users, CheckCircle, PenTool, CalendarDays } from "lucide-react";
import { cookies } from "next/headers";
import NoticeBoard from "@/features/announcements/components/notice-board";
import { getAnnouncementsAction } from "@/features/announcements/actions/announcement.action";
// 1. IMPORTAMOS EL SERVICIO DE LA MÁQUINA DEL TIEMPO
import { academicYearService } from "@/features/academic/services/academic-year.service";

export const dynamic = "force-dynamic";

export default async function TeacherDashboardPage() {

    const userId = (await cookies()).get("uecg_session")?.value || "";

    // 2. OBTENEMOS LA GESTIÓN ACTIVA DEL USUARIO
    const activeYear = await academicYearService.getActiveYear();

    // 3. Obtenemos las materias filtradas estrictamente por el AÑO ACTIVO
    const teacherCourses = await prisma.course.findMany({
        where: { teacherId: userId, academicYear: activeYear }, // <--- LA MAGIA
        include: { classroom: true }
    });

    const totalCourses = teacherCourses.length;

    // 4. Contar cuántos estudiantes únicos tiene a su cargo EN ESE AÑO
    const classroomIds = teacherCourses.map(c => c.classroomId);
    const uniqueStudentsCount = await prisma.enrollment.count({
        where: {
            classroomId: { in: classroomIds },
            academicYear: activeYear, // <--- LA MAGIA APLICADA AQUÍ TAMBIÉN
            status: "ACTIVE"
        }
    });

    // 5. Obtener comunicados PERO filtrados para el rol TEACHER
    const announcementsRes = await getAnnouncementsAction("TEACHER");
    const announcements = announcementsRes.data || [];

    return (
        <div className="space-y-8 animate-in fade-in duration-500 relative">

            {/* Header / Bienvenida Estilo Suizo */}
            <div className="border-b-4 border-uecg-black pb-6">
                <h1 className="text-4xl font-black text-uecg-black uppercase tracking-tighter leading-none mb-2">
                    Resumen Docente
                </h1>
                <p className="text-uecg-gray font-bold text-[10px] uppercase tracking-[0.2em] mt-2 flex items-center gap-2">
                    <CalendarDays size={14} /> Gestión Académica {activeYear} • Sus materias y comunicados
                </p>
            </div>

            {/* KPI Cards (Métricas Rápidas del Profe) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border-2 border-uecg-line p-6 relative overflow-hidden group hover:border-uecg-blue transition-colors shadow-sm">
                    <BookOpen size={80} className="absolute -bottom-4 -right-4 text-gray-100 group-hover:scale-110 group-hover:text-blue-50 transition-all" />
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-uecg-gray mb-2">Mis Materias</h3>
                    <span className="block text-5xl font-black font-mono leading-none text-uecg-black relative z-10">{totalCourses}</span>
                    <span className="text-[10px] font-bold text-uecg-gray uppercase tracking-widest mt-4 block relative z-10">Cursos asignados en {activeYear}</span>
                </div>

                <div className="bg-white border-2 border-uecg-line p-6 relative overflow-hidden group hover:border-uecg-black transition-colors shadow-sm">
                    <Users size={80} className="absolute -bottom-4 -right-4 text-gray-100 group-hover:scale-110 transition-transform" />
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-uecg-gray mb-2">Estudiantes a Cargo</h3>
                    <span className="block text-5xl font-black font-mono leading-none text-uecg-black relative z-10">{uniqueStudentsCount}</span>
                    <span className="text-[10px] font-bold text-uecg-gray uppercase tracking-widest mt-4 block relative z-10">Alumnos inscritos en sus clases</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Columna Izquierda: Accesos Directos */}
                <div className="lg:col-span-1 space-y-4">
                    <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-uecg-gray mb-4 border-b-2 border-uecg-line pb-2">
                        Acciones Rápidas
                    </h2>

                    <Link href="/teacher/attendance" className="bg-uecg-black text-white p-6 flex items-center justify-between group hover:bg-uecg-blue transition-colors border-2 border-uecg-black shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)]">
                        <div>
                            <span className="block text-sm font-black uppercase tracking-widest mb-1.5">Tomar Lista</span>
                            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest group-hover:text-blue-200">Registrar asistencia diaria</span>
                        </div>
                        <CheckCircle size={24} strokeWidth={2.5} className="text-gray-400 group-hover:text-white" />
                    </Link>

                    <Link href="/teacher/courses" className="bg-white text-uecg-black p-6 flex items-center justify-between group hover:border-uecg-black transition-colors border-2 border-uecg-line shadow-sm">
                        <div>
                            <span className="block text-sm font-black uppercase tracking-widest mb-1.5">Calificar</span>
                            <span className="text-[9px] text-uecg-gray font-bold uppercase tracking-widest">Ingresar notas a la planilla</span>
                        </div>
                        <PenTool size={24} strokeWidth={2.5} className="text-uecg-gray group-hover:text-uecg-black transition-colors" />
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