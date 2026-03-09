import { AlertTriangle, TrendingUp, Search } from "lucide-react";
import { academicYearService } from "@/features/academic/services/academic-year.service";
import { analyzePromotionAction } from "@/features/academic/actions/promotion.action";
import { apiFetch } from "../../../app/lib/api-client";
import PromotionExecutor from "./promotion-executor";

export const dynamic = "force-dynamic";

export default async function AcademicPromotionPage(props: { searchParams: Promise<{ classroomId?: string }> }) {
    const params = await props.searchParams;
    const classroomId = params?.classroomId;
    const activeYear = await academicYearService.getActiveYear();

    // 1. Obtener aulas disponibles desde la API
    let classrooms: any[] = [];
    try {
        const gradesOverview = await apiFetch<any[]>("/grades/overview");
        classrooms = gradesOverview.flatMap(grade =>
            grade.classrooms.map((c: any) => ({ ...c, grade }))
        );
    } catch (error) {
        console.error("Error al cargar aulas", error);
    }

    // 2. Análisis vía Server Action (NestJS hace el cálculo)
    let analysis: any[] = [];
    if (classroomId) {
        const res = await analyzePromotionAction(classroomId, activeYear);
        if (res.success) analysis = res.data || [];
    }

    const promoted = analysis.filter(a => a.status === "PROMOTED" || a.status === "REMEDIAL").length;
    const remedial = analysis.filter(a => a.status === "REMEDIAL").length;
    const retained = analysis.filter(a => a.status === "RETAINED").length;

    return (
        <div className="space-y-8 animate-in fade-in duration-500 relative">
            <div className="border-b-4 border-uecg-black pb-6">
                <h1 className="text-3xl font-black text-uecg-black uppercase tracking-tighter leading-none mb-2">
                    Cierre de Gestión
                </h1>
                <p className="text-uecg-gray font-bold text-[10px] uppercase tracking-[0.2em] mt-2 flex items-center gap-2">
                    <TrendingUp size={14} /> Promoción Automática • {activeYear} → {activeYear + 1}
                </p>
            </div>

            <div className="bg-white border-2 border-uecg-line p-6 shadow-sm">
                <form method="GET" className="flex gap-4 items-end">
                    <div className="flex-1">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-uecg-gray mb-2 block">
                            Aula a Evaluar
                        </label>
                        <div className="relative">
                            <select name="classroomId" defaultValue={classroomId || ""} required className="w-full border-2 border-gray-300 p-3 text-xs font-bold text-uecg-black uppercase appearance-none focus:border-uecg-black outline-none transition-colors bg-transparent">
                                <option value="" disabled>-- Elija un curso --</option>
                                {classrooms.map(c => (
                                    <option key={c.id} value={c.id}>{c.grade.name} "{c.name}" - {c.grade.level}</option>
                                ))}
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-uecg-black font-black text-xs pointer-events-none">▼</div>
                        </div>
                    </div>
                    <button type="submit" className="bg-uecg-black text-white px-8 py-[14px] text-[10px] font-black uppercase tracking-widest border-2 border-uecg-black hover:bg-uecg-blue transition-colors flex items-center gap-2 h-[48px]">
                        <Search size={16} /> Analizar Gestión
                    </button>
                </form>
            </div>

            {classroomId && (
                <div className="space-y-6">
                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-green-50 border-2 border-green-200 p-4 text-center">
                            <span className="block text-3xl font-black text-green-700">{promoted}</span>
                            <span className="text-[10px] font-black text-green-700 uppercase tracking-widest">Aprobados</span>
                        </div>
                        <div className="bg-yellow-50 border-2 border-yellow-200 p-4 text-center">
                            <span className="block text-3xl font-black text-yellow-700">{remedial}</span>
                            <span className="text-[10px] font-black text-yellow-700 uppercase tracking-widest">Con Arrastre</span>
                        </div>
                        <div className="bg-red-50 border-2 border-red-200 p-4 text-center">
                            <span className="block text-3xl font-black text-red-700">{retained}</span>
                            <span className="text-[10px] font-black text-red-700 uppercase tracking-widest">Repitentes</span>
                        </div>
                    </div>

                    <div className="bg-blue-50 border-l-4 border-uecg-blue p-4 flex gap-4 items-start">
                        <AlertTriangle className="text-uecg-blue mt-0.5" />
                        <div>
                            <h3 className="text-xs font-black uppercase tracking-widest text-uecg-black">Previsualización de Resultados</h3>
                            <p className="text-[10px] font-bold text-uecg-gray mt-1 uppercase leading-relaxed">
                                Verifique la lista. Al ejecutar el cierre, los promedios se congelarán y se crearán las nuevas matrículas para {activeYear + 1}.
                            </p>
                        </div>
                    </div>

                    <PromotionExecutor classroomId={classroomId} academicYear={activeYear} />

                    <div className="border-2 border-uecg-black overflow-hidden bg-white">
                        <table className="w-full text-left">
                            <thead className="bg-uecg-black text-white">
                            <tr>
                                <th className="p-4 text-[10px] font-black uppercase tracking-widest">Estudiante</th>
                                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-center">Materias Reprobadas</th>
                                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-right">Estatus Final</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                            {analysis.map((res: any, index: number) => (
                                /* CORRECCIÓN: Usamos un identificador único garantizado o el index */
                                <tr key={res.enrollmentId || res.student?.id || index} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4 text-xs font-bold uppercase text-uecg-black">{res.student?.user?.name || 'ESTUDIANTE SIN NOMBRE'}</td>
                                    <td className="p-4 text-xs font-black text-center text-uecg-gray">{res.failedCount}</td>
                                    <td className="p-4 text-right">
                                        {res.status === "PROMOTED" && <span className="bg-green-100 text-green-700 px-2 py-1 text-[9px] font-black uppercase tracking-widest">Promovido</span>}
                                        {res.status === "REMEDIAL" && <span className="bg-yellow-100 text-yellow-700 px-2 py-1 text-[9px] font-black uppercase tracking-widest">Arrastre</span>}
                                        {res.status === "RETAINED" && <span className="bg-red-100 text-red-700 px-2 py-1 text-[9px] font-black uppercase tracking-widest">Retenido</span>}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}