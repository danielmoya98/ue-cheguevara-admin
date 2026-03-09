import Link from "next/link";
import { ChevronLeft, Plus, Edit3, Calendar, AlertCircle } from "lucide-react";
import CreateEvaluationModal from "@/features/grades/components/create-evaluation-modal";
import { apiFetch } from "../../../../lib/api-client";

export default async function CourseNotebookPage({ params, searchParams }: { params: Promise<{ id: string }>, searchParams: Promise<{ action?: string }> }) {
    const { id: courseId } = await params;
    const { action } = await searchParams;

    let course: any = null;
    let evaluations: any[] = [];

    // Variables para guardar el error exacto de cada endpoint
    let errorCourse = "";
    let errorEvals = "";

    // 1. Intentamos cargar el curso individualmente
    try {
        course = await apiFetch<any>(`/courses/${courseId}`);
    } catch (error: any) {
        errorCourse = error.message || "Fallo desconocido al obtener el curso";
    }

    // 2. Intentamos cargar las evaluaciones individualmente
    try {
        evaluations = await apiFetch<any[]>(`/grades/evaluations/course/${courseId}`);
    } catch (error: any) {
        errorEvals = error.message || "Fallo desconocido al obtener evaluaciones";
    }

    // SI HAY ALGÚN ERROR, MOSTRAMOS LA PANTALLA ROJA DE DEPURACIÓN
    if (errorCourse || errorEvals) {
        return (
            <div className="p-8 border-4 border-red-500 bg-red-50 space-y-6">
                <div className="flex items-center gap-2 text-red-600 font-black uppercase text-2xl tracking-tighter">
                    <AlertCircle size={32} strokeWidth={3} />
                    Reporte de Error de la API (NestJS)
                </div>

                {errorCourse && (
                    <div className="bg-white p-4 border-l-4 border-red-500">
                        <h3 className="font-black text-uecg-black uppercase text-sm mb-1">Error en endpoint de Curso:</h3>
                        <code className="text-red-600 bg-red-50 px-2 py-1 text-xs font-bold block mb-2">GET /api/v1/courses/{courseId}</code>
                        <p className="text-xs text-uecg-gray font-mono">{errorCourse}</p>
                    </div>
                )}

                {errorEvals && (
                    <div className="bg-white p-4 border-l-4 border-red-500">
                        <h3 className="font-black text-uecg-black uppercase text-sm mb-1">Error en endpoint de Evaluaciones:</h3>
                        <code className="text-red-600 bg-red-50 px-2 py-1 text-xs font-bold block mb-2">GET /api/v1/grades/evaluations/course/{courseId}</code>
                        <p className="text-xs text-uecg-gray font-mono">{errorEvals}</p>
                    </div>
                )}
            </div>
        );
    }

    // SI NO HAY ERRORES, PINTAMOS EL CUADERNO NORMALMENTE
    return (
        <div className="space-y-8 relative">
            <CreateEvaluationModal
                courseId={courseId}
                isOpen={action === "create"}
            />

            {/* Header */}
            <div className="border-b-4 border-uecg-black pb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <Link
                        href="/admin/grades"
                        className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-uecg-gray hover:text-uecg-blue mb-4 transition-colors"
                    >
                        <ChevronLeft size={14} strokeWidth={3} />
                        Volver a Mis Materias
                    </Link>
                    <h1 className="text-3xl font-black text-uecg-black uppercase tracking-tighter leading-none mb-1">
                        {course?.subject?.name}
                    </h1>
                    <p className="text-uecg-gray font-bold text-xs uppercase tracking-widest mt-2">
                        {course?.classroom?.grade?.name} "{course?.classroom?.name}" • Nivel {course?.classroom?.grade?.level}
                    </p>
                </div>

                <Link
                    href={`/admin/grades/course/${courseId}?action=create`}
                    scroll={false}
                    className="flex items-center gap-2 px-6 py-3 bg-uecg-blue text-white font-black uppercase text-xs tracking-widest hover:bg-uecg-dark transition-colors border-2 border-uecg-blue shadow-sm"
                >
                    <Plus size={16} strokeWidth={3} />
                    Nueva Evaluación
                </Link>
            </div>

            {/* Lista de Evaluaciones (Cuaderno) */}
            <div className="grid grid-cols-1 gap-4">
                {(!evaluations || evaluations.length === 0) ? (
                    <div className="p-16 text-center border-4 border-dashed border-gray-200 bg-gray-50">
                        <span className="font-black text-uecg-gray uppercase tracking-widest text-sm block mb-2">Cuaderno Vacío</span>
                        <span className="text-xs font-bold text-gray-400 uppercase">Aún no has registrado evaluaciones para esta materia.</span>
                    </div>
                ) : (
                    evaluations.map((evaluation: any) => {
                        const evalDate = new Date(evaluation.date);
                        return (
                            <Link
                                key={evaluation.id}
                                href={`/admin/grades/evaluate/${evaluation.id}`}
                                className="group flex flex-col md:flex-row justify-between items-start md:items-center bg-white border-2 border-uecg-line p-4 hover:border-uecg-black transition-colors"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="bg-gray-100 text-uecg-gray p-3 border-2 border-transparent group-hover:border-uecg-blue group-hover:text-uecg-blue transition-colors">
                                        <Edit3 size={24} strokeWidth={1.5} />
                                    </div>
                                    <div>
                                        <span className="inline-block bg-uecg-black text-white px-2 py-0.5 text-[9px] font-black uppercase tracking-widest mb-1">
                                            {evaluation.term.replace('_', ' ')}
                                        </span>
                                        <h3 className="text-lg font-black uppercase text-uecg-black leading-tight">
                                            {evaluation.title}
                                        </h3>
                                        <span className="flex items-center gap-1 text-[10px] font-bold text-uecg-gray uppercase tracking-widest mt-1">
                                            <Calendar size={12} />
                                            {evalDate.toLocaleDateString('es-BO')}
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-4 md:mt-0 flex items-center gap-6">
                                    <div className="text-right">
                                        <span className="block text-[10px] font-black uppercase tracking-widest text-uecg-gray mb-1">Progreso</span>
                                        <span className="block text-sm font-black text-uecg-blue">{evaluation._count?.marks || 0} Calificados</span>
                                    </div>
                                    <div className="bg-gray-50 px-4 py-2 border-2 border-uecg-line group-hover:bg-uecg-black group-hover:text-white transition-colors">
                                        <span className="block text-[10px] font-black uppercase tracking-widest">Puntaje</span>
                                        <span className="block text-xl font-mono font-black">{evaluation.maxScore}</span>
                                    </div>
                                </div>
                            </Link>
                        );
                    })
                )}
            </div>
        </div>
    );
}