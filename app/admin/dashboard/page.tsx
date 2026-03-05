import { prisma } from "@/lib/db";
import Link from "next/link";
import { Users, BookOpen, Clock, AlertTriangle, ArrowRight, UserPlus, CheckCircle } from "lucide-react";

import { getAnnouncementsAction } from "@/features/announcements/actions/announcement.action";
import NoticeBoard from "@/features/announcements/components/notice-board";
import CreateAnnouncementModal from "@/features/announcements/components/create-announcement-modal";

// Forzamos que la página sea dinámica para que los datos siempre estén frescos
export const dynamic = "force-dynamic";

export default async function AdminDashboardPage({ searchParams }: { searchParams: Promise<{ action?: string }> }) {
    // 1. Capturamos el parámetro de la URL para saber si abrir el modal
    const { action } = await searchParams;

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Medianoche de hoy
    const currentYear = today.getFullYear();

    // 2. Obtener Métricas Rápidas y Comunicados
    const [
        totalStudents,
        totalTeachers,
        totalClassrooms,
        todayAttendances,
        announcementsRes
    ] = await Promise.all([
        prisma.enrollment.count({ where: { academicYear: currentYear, status: "ACTIVE" } }),
        prisma.user.count({ where: { role: "TEACHER", status: "ACTIVE" } }),
        prisma.classroom.count(),
        prisma.attendance.findMany({ where: { date: today } }),
        getAnnouncementsAction() // Obtenemos los comunicados
    ]);

    const announcements = announcementsRes.data || [];

    // 3. Calcular estadísticas de asistencia de hoy
    const attendanceStats = {
        present: todayAttendances.filter(a => a.status === "PRESENT").length,
        absent: todayAttendances.filter(a => a.status === "ABSENT").length,
        late: todayAttendances.filter(a => a.status === "LATE").length,
        excused: todayAttendances.filter(a => a.status === "EXCUSED").length,
    };
    const totalRecordedToday = todayAttendances.length;

    // 4. Obtener "Alumnos en Riesgo" (Tienen al menos una nota menor a 51 en este año)
    const failingMarks = await prisma.mark.findMany({
        where: {
            score: { lt: 51 },
            evaluation: { date: { gte: new Date(`${currentYear}-01-01`) } }
        },
        include: {
            student: { include: { user: true } },
            evaluation: { include: { course: { include: { subject: true } } } }
        },
        take: 5, // Mostramos solo los 5 más recientes para no saturar
        orderBy: { createdAt: 'desc' }
    });

    return (
        <div className="space-y-8 animate-in fade-in duration-500">

            {/* AQUÍ INSERTAMOS EL MODAL INVISIBLE (Solo se abre si action === "new-notice") */}
            <CreateAnnouncementModal isOpen={action === "new-notice"} />

            {/* Header / Bienvenida */}
            <div className="border-b-4 border-uecg-black pb-6">
                <h1 className="text-4xl font-black text-uecg-black uppercase tracking-tighter leading-none mb-2">
                    Panel de Control
                </h1>
                <p className="text-uecg-gray font-bold text-sm uppercase tracking-widest mt-2">
                    Resumen general de la institución • Gestión {currentYear}
                </p>
            </div>

            {/* KPI Cards (Métricas Rápidas) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-uecg-black text-white p-6 relative overflow-hidden group">
                    <Users size={80} className="absolute -bottom-4 -right-4 opacity-10 group-hover:scale-110 transition-transform" />
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Estudiantes Activos</h3>
                    <span className="block text-5xl font-black font-mono leading-none">{totalStudents}</span>
                    <span className="text-xs font-bold text-gray-300 uppercase tracking-widest mt-4 block">Matriculados este año</span>
                </div>

                <div className="bg-uecg-blue text-white p-6 relative overflow-hidden group">
                    <BookOpen size={80} className="absolute -bottom-4 -right-4 opacity-10 group-hover:scale-110 transition-transform" />
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-blue-200 mb-2">Plantel Docente</h3>
                    <span className="block text-5xl font-black font-mono leading-none">{totalTeachers}</span>
                    <span className="text-xs font-bold text-blue-200 uppercase tracking-widest mt-4 block">Profesores registrados</span>
                </div>

                <div className="bg-white border-4 border-uecg-black text-uecg-black p-6 relative overflow-hidden group">
                    <div className="w-24 h-24 bg-gray-100 absolute -bottom-4 -right-4 rotate-12 group-hover:rotate-0 transition-transform" />
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-uecg-gray mb-2">Aulas Operativas</h3>
                    <span className="block text-5xl font-black font-mono leading-none relative z-10">{totalClassrooms}</span>
                    <span className="text-xs font-bold text-uecg-gray uppercase tracking-widest mt-4 block relative z-10">Paralelos creados</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Columna Izquierda (Doble ancho): Asistencia, Accesos Directos y COMUNICADOS */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Sección: Estado de Asistencia de Hoy */}
                    <section className="bg-white border-2 border-uecg-line">
                        <div className="bg-gray-50 border-b-2 border-uecg-line px-6 py-4 flex justify-between items-center">
                            <h2 className="text-sm font-black uppercase tracking-widest text-uecg-black flex items-center gap-2">
                                <Clock size={16} /> Estado de Asistencia Hoy
                            </h2>
                            <span className="text-xs font-bold text-uecg-gray uppercase">
                                {today.toLocaleDateString('es-BO', { weekday: 'long', day: 'numeric', month: 'long' })}
                            </span>
                        </div>

                        <div className="p-6">
                            {totalRecordedToday === 0 ? (
                                <div className="text-center py-8">
                                    <span className="block text-uecg-gray text-xs font-black uppercase tracking-widest mb-2">Sin registros aún</span>
                                    <p className="text-sm font-bold text-gray-400">Ningún docente ha tomado lista el día de hoy.</p>
                                </div>
                            ) : (
                                <div className="flex flex-wrap md:flex-nowrap gap-4">
                                    {/* Presentes */}
                                    <div className="flex-1 bg-green-50 border-2 border-green-200 p-4 text-center">
                                        <span className="block text-[10px] font-black uppercase tracking-widest text-green-700 mb-1">Presentes</span>
                                        <span className="block text-3xl font-black text-green-700 font-mono">{attendanceStats.present}</span>
                                    </div>
                                    {/* Faltas */}
                                    <div className="flex-1 bg-red-50 border-2 border-red-200 p-4 text-center">
                                        <span className="block text-[10px] font-black uppercase tracking-widest text-red-700 mb-1">Faltas</span>
                                        <span className="block text-3xl font-black text-red-700 font-mono">{attendanceStats.absent}</span>
                                    </div>
                                    {/* Atrasos */}
                                    <div className="flex-1 bg-orange-50 border-2 border-orange-200 p-4 text-center">
                                        <span className="block text-[10px] font-black uppercase tracking-widest text-orange-700 mb-1">Atrasos</span>
                                        <span className="block text-3xl font-black text-orange-700 font-mono">{attendanceStats.late}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Sección: Accesos Directos (Quick Actions) */}
                    <section className="grid grid-cols-2 gap-4">
                        <Link href="/admin/attendance" className="bg-white border-2 border-gray-200 hover:border-uecg-blue p-4 flex flex-col items-center justify-center text-center group transition-colors">
                            <CheckCircle size={24} className="text-uecg-gray group-hover:text-uecg-blue mb-2 transition-colors" />
                            <span className="text-xs font-black uppercase tracking-widest text-uecg-black">Tomar Asistencia</span>
                        </Link>
                        <Link href="/admin/students/new" className="bg-white border-2 border-gray-200 hover:border-uecg-blue p-4 flex flex-col items-center justify-center text-center group transition-colors">
                            <UserPlus size={24} className="text-uecg-gray group-hover:text-uecg-blue mb-2 transition-colors" />
                            <span className="text-xs font-black uppercase tracking-widest text-uecg-black">Nuevo Estudiante</span>
                        </Link>
                    </section>

                    {/* NUEVO: Tablón de Comunicados */}
                    <NoticeBoard announcements={announcements} />

                </div>

                {/* Columna Derecha: Alertas de Rendimiento */}
                <div className="space-y-6">
                    <section className="bg-white border-2 border-red-200">
                        <div className="bg-red-50 border-b-2 border-red-200 px-4 py-3 flex items-center gap-2 text-red-700">
                            <AlertTriangle size={16} strokeWidth={2.5} />
                            <h2 className="text-xs font-black uppercase tracking-widest">Alertas Académicas</h2>
                        </div>

                        <div className="p-0">
                            {failingMarks.length === 0 ? (
                                <div className="p-6 text-center">
                                    <span className="text-xs font-bold text-gray-500 uppercase">Sin alertas recientes.</span>
                                </div>
                            ) : (
                                <ul className="divide-y divide-red-100">
                                    {failingMarks.map((mark) => (
                                        <li key={mark.id} className="p-4 hover:bg-red-50/50 transition-colors">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <span className="block text-sm font-black uppercase text-uecg-black leading-tight">
                                                        {mark.student.user.name}
                                                    </span>
                                                    <span className="text-[10px] font-bold text-uecg-gray uppercase tracking-widest mt-1 block">
                                                        {mark.evaluation.course.subject.name}
                                                    </span>
                                                </div>
                                                <div className="bg-red-100 text-red-700 font-mono font-black px-2 py-1 text-sm">
                                                    {mark.score}
                                                </div>
                                            </div>
                                            {/* Link al expediente */}
                                            <Link
                                                href={`/admin/students/${mark.studentId}`}
                                                className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-red-500 hover:text-red-700 mt-3"
                                            >
                                                Ver Expediente <ArrowRight size={10} strokeWidth={3} />
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </section>
                </div>

            </div>
        </div>
    );
}