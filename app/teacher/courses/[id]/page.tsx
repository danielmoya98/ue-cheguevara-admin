import { prisma } from "@/lib/db";
import Link from "next/link";
import { ChevronLeft, Plus, Edit3, Calendar } from "lucide-react";
import { gradeService } from "@/features/grades/services/grade.service";
import CreateEvaluationModal from "@/features/grades/components/create-evaluation-modal";

export const dynamic = "force-dynamic";

export default async function TeacherCourseNotebookPage(props: { params: Promise<{ id: string }>, searchParams: Promise<{ action?: string }> }) {
    const params = await props.params;
    const searchParams = await props.searchParams;
    const courseId = params.id;
    const action = searchParams?.action;

    // Obtener datos de la materia
    const course = await prisma.course.findUnique({
        where: { id: courseId },
        include: { subject: true, classroom: { include: { grade: true } } }
    });

    if (!course) return <div className="p-8 font-black text-red-500 uppercase tracking-widest text-sm text-center">Curso no encontrado.</div>;

    // Obtener las evaluaciones (exámenes) de este curso
    const evaluations = await gradeService.getCourseEvaluations(courseId);

    return (
        <div className="space-y-8 animate-in fade-in duration-500 relative">


            <CreateEvaluationModal
                courseId={courseId}
                isOpen={action === "create"}
                returnPath={`/teacher/courses/${courseId}`} // Nueva prop sugerida
            />

            {/* Header */}
            <div className="border-b-4 border-uecg-black pb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <Link
                        href="/teacher/courses"
                        className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-uecg-gray hover:text-uecg-blue mb-4 transition-colors"
                    >
                        <ChevronLeft size={14} strokeWidth={3} />
                        Volver a Mis Materias
                    </Link>
                    <h1 className="text-3xl font-black text-uecg-black uppercase tracking-tighter leading-none mb-1 flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: course.subject.color || '#000' }} />
                        {course.subject.name}
                    </h1>
                    <p className="text-uecg-gray font-bold text-xs uppercase tracking-widest mt-2 ml-7">
                        {course.classroom.grade.name} "{course.classroom.name}" • Nivel {course.classroom.grade.level}
                    </p>
                </div>

                <Link
                    href={`/teacher/courses/${courseId}?action=create`}
                    scroll={false}
                    className="flex items-center gap-2 px-6 py-3 bg-uecg-black text-white font-black uppercase text-xs tracking-widest hover:bg-uecg-blue transition-colors border-2 border-uecg-black shadow-sm"
                >
                    <Plus size={16} strokeWidth={3} />
                    Nueva Evaluación
                </Link>
            </div>

            {/* Lista de Evaluaciones (Cuaderno) */}
            <div className="grid grid-cols-1 gap-4">
                {evaluations.length === 0 ? (
                    <div className="p-16 text-center border-4 border-dashed border-gray-200 bg-white">
                        <span className="font-black text-uecg-gray uppercase tracking-widest text-sm block mb-2">Cuaderno Vacío</span>
                        <span className="text-xs font-bold text-gray-400 uppercase">Haga clic en "Nueva Evaluación" para registrar el primer examen o tarea.</span>
                    </div>
                ) : (
                    evaluations.map(evaluation => (
                        <Link
                            key={evaluation.id}
                            href={`/teacher/courses/${courseId}/evaluate/${evaluation.id}`} // Ruta a la planilla
                            className="group flex flex-col md:flex-row justify-between items-start md:items-center bg-white border-2 border-uecg-line p-5 hover:border-uecg-black transition-colors"
                        >
                            <div className="flex items-start gap-5">
                                <div className="bg-gray-50 text-uecg-gray p-3 border-2 border-transparent group-hover:border-uecg-blue group-hover:bg-blue-50 group-hover:text-uecg-blue transition-colors">
                                    <Edit3 size={24} strokeWidth={2} />
                                </div>
                                <div>
                                    <span className="inline-block bg-uecg-black text-white px-2 py-0.5 text-[9px] font-black uppercase tracking-widest mb-1.5">
                                        {evaluation.term.replace('_', ' ')}
                                    </span>
                                    <h3 className="text-lg font-black uppercase text-uecg-black leading-tight group-hover:text-uecg-blue transition-colors">
                                        {evaluation.title}
                                    </h3>
                                    <span className="flex items-center gap-1.5 text-[10px] font-bold text-uecg-gray uppercase tracking-widest mt-2">
                                        <Calendar size={12} strokeWidth={2.5} />
                                        {evaluation.date.toLocaleDateString('es-BO')}
                                    </span>
                                </div>
                            </div>

                            <div className="mt-4 md:mt-0 flex items-center gap-6 self-stretch md:self-auto">
                                <div className="text-right hidden sm:block">
                                    <span className="block text-[10px] font-black uppercase tracking-widest text-uecg-gray mb-1">Calificados</span>
                                    <span className="block text-sm font-black text-uecg-black">{evaluation._count.marks} Alumnos</span>
                                </div>
                                <div className="bg-gray-50 px-5 py-3 border-2 border-uecg-line group-hover:bg-uecg-black group-hover:text-white transition-colors h-full flex flex-col justify-center">
                                    <span className="block text-[10px] font-black uppercase tracking-widest">Máx</span>
                                    <span className="block text-2xl font-mono font-black leading-none">{evaluation.maxScore}</span>
                                </div>
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
}