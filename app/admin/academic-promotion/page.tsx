import { prisma } from "@/lib/db";
import { AlertTriangle, CheckCircle, TrendingUp, Search } from "lucide-react";
import { academicYearService } from "@/features/academic/services/academic-year.service";
import { promotionService } from "@/features/academic/services/promotion.service";
import PromotionExecutor from "./promotion-executor";

export const dynamic = "force-dynamic";

export default async function AcademicPromotionPage(props: { searchParams: Promise<{ classroomId?: string }> }) {
    const params = await props.searchParams;
    const classroomId = params?.classroomId;

    const activeYear = await academicYearService.getActiveYear();

    // 1. Obtener aulas disponibles
    const classrooms = await prisma.classroom.findMany({
        include: { grade: true },
        orderBy: [{ grade: { level: 'asc' } }, { grade: { numericOrder: 'asc' } }]
    });

    // 2. Si se seleccionó un aula, ejecutar el ANÁLISIS (Simulación, no guarda nada)
    let analysis: any[] = [];
    if (classroomId) {
        analysis = await promotionService.analyzeClassroom(classroomId, activeYear);
    }

    // Contadores para el resumen visual
    const promoted = analysis.filter(a => a.status === "PROMOTED").length;
    const remedial = analysis.filter(a => a.status === "REMEDIAL").length;
    const retained = analysis.filter(a => a.status === "RETAINED").length;

    return (
        <div className="space-y-8 animate-in fade-in duration-500 relative">

            {/* Header */}
            <div className="border-b-4 border-uecg-black pb-6">
                <h1 className="text-3xl font-black text-uecg-black uppercase tracking-tighter leading-none mb-2">
                    Cierre de Gestión
                </h1>
                <p className="text-uecg-gray font-bold text-[10px] uppercase tracking-[0.2em] mt-2 flex items-center gap-2">
                    <TrendingUp size={14} /> Promoción Automática de Estudiantes • Gestión {activeYear} a {activeYear + 1}
                </p>
            </div>

            {/* Selector de Aula */}
            <div className="bg-white border-2 border-uecg-line p-6 shadow-sm">
                <form method="GET" className="flex gap-4 items-end">
                    <div className="flex-1">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-uecg-gray mb-2 block">
                            Seleccionar Aula a Evaluar
                        </label>
                        <div className="relative">
                            <select name="classroomId" defaultValue={classroomId || ""} required className="w-full border-2 border-gray-300 p-3 text-xs font-bold text-uecg-black uppercase appearance-none focus:border-uecg-black outline-none transition-colors">
                                <option value="" disabled>-- Elija un curso --</option>
                                {classrooms.map(c => (
                                    <option key={c.id} value={c.id}>{c.grade.name} "{c.name}" - {c.grade.level}</option>
                                ))}
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-uecg-black font-black text-xs pointer-events-none">▼</div>
                        </div>
                    </div>
                    <button type="submit" className="bg-uecg-black text-white px-8 py-[14px] text-[10px] font-black uppercase tracking-widest border-2 border-uecg-black hover:bg-uecg-blue hover:border-uecg-blue transition-colors flex items-center gap-2">
                        <Search size={16} /> Analizar Notas
                    </button>
                </form>
            </div>

            {/* Resultados del Análisis */}
            {classroomId && (
                <div className="space-y-6">
                    {/* Resumen */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-green-50 border-2 border-green-200 p-4 text-center">
                            <span className="block text-3xl font-black text-green-700">{promoted}</span>
                            <span className="text-[10px] font-black text-green-700 uppercase tracking-widest">Promovidos (Limpios)</span>
                        </div>
                        <div className="bg-yellow-50 border-2 border-yellow-200 p-4 text-center">
                            <span className="block text-3xl font-black text-yellow-700">{remedial}</span>
                            <span className="text-[10px] font-black text-yellow-700 uppercase tracking-widest">Arrastre (1-2 Mat.)</span>
                        </div>
                        <div className="bg-red-50 border-2 border-red-200 p-4 text-center">
                            <span className="block text-3xl font-black text-red-700">{retained}</span>
                            <span className="text-[10px] font-black text-red-700 uppercase tracking-widest">Retenidos (Repiten)</span>
                        </div>
                    </div>

                    {/* Alerta importante */}
                    <div className="bg-blue-50 border-l-4 border-uecg-blue p-4 flex gap-4 items-start">
                        <AlertTriangle className="text-uecg-blue mt-0.5" />
                        <div>
                            <h3 className="text-xs font-black uppercase tracking-widest text-uecg-black">Previsualización de Cierre</h3>
                            <p className="text-[10px] font-bold text-uecg-gray mt-1 uppercase">Al ejecutar, las matrículas de {activeYear} se cerrarán y los estudiantes serán inscritos automáticamente en sus nuevos cursos para {activeYear + 1}. Esta acción no se puede deshacer masivamente.</p>
                        </div>
                    </div>

                    {/* Botón de Ejecución (Componente de Cliente) */}
                    <PromotionExecutor classroomId={classroomId} academicYear={activeYear} />

                    {/* Tabla de Detalle */}
                    <table className="w-full bg-white border-2 border-uecg-line text-left">
                        <thead className="bg-gray-50 border-b-2 border-uecg-line">
                        <tr>
                            <th className="p-4 text-[10px] font-black uppercase tracking-widest text-uecg-gray">Estudiante</th>
                            <th className="p-4 text-[10px] font-black uppercase tracking-widest text-uecg-gray">Materias Reprobadas</th>
                            <th className="p-4 text-[10px] font-black uppercase tracking-widest text-uecg-gray">Destino {activeYear + 1}</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                        {analysis.map((res) => (
                            <tr key={res.enrollmentId} className="hover:bg-gray-50 transition-colors">
                                <td className="p-4 text-xs font-bold uppercase text-uecg-black">{res.student.user.name}</td>
                                <td className="p-4 text-xs font-black text-uecg-gray">{res.failedCount}</td>
                                <td className="p-4">
                                    {res.status === "PROMOTED" && <span className="bg-green-100 text-green-700 px-2 py-1 text-[9px] font-black uppercase tracking-widest">Aprobado</span>}
                                    {res.status === "REMEDIAL" && <span className="bg-yellow-100 text-yellow-700 px-2 py-1 text-[9px] font-black uppercase tracking-widest">Aprobado c/ Arrastre</span>}
                                    {res.status === "RETAINED" && <span className="bg-red-100 text-red-700 px-2 py-1 text-[9px] font-black uppercase tracking-widest">Repite Curso</span>}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}