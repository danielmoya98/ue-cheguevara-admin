import { getGradesAction } from "@/features/academic/actions/grade.action";
import GradeList from "@/features/academic/components/grade-list";
import GradeModals from "@/features/academic/components/grade-modals";
import Link from "next/link";

export default async function GradesPage() {
    const { data: grades, success } = await getGradesAction();

    if (!success || !grades) {
        return <div className="p-8 font-black uppercase text-red-500 tracking-widest">Error al cargar la estructura escolar.</div>;
    }

    return (
        <div className="space-y-8 relative">

            {/* Modales Orquestados por URL */}
            <GradeModals />

            {/* Header de la Página */}
            <div className="flex flex-col md:flex-row justify-between items-end border-b border-uecg-line pb-6">
                <div>
                    <h1 className="text-3xl font-black text-uecg-black uppercase tracking-tighter mb-2">
                        Gestión Académica
                    </h1>
                    <p className="text-uecg-gray font-medium text-sm">
                        Catálogo de materias, grados y asignación de horarios.
                    </p>
                </div>

                {/* TABS (Navegación entre Materias y Grados) */}
                <div className="flex gap-1 mt-4 md:mt-0">
                    <Link
                        href="/admin/academic"
                        className="px-6 py-3 text-xs font-black uppercase tracking-widest border-t-2 border-l-2 border-r-2 bg-gray-100 border-transparent text-gray-400 hover:text-uecg-black transition-colors"
                    >
                        Catálogo de Materias
                    </Link>
                    {/* Tab Activa */}
                    <button className="px-6 py-3 text-xs font-black uppercase tracking-widest border-t-2 border-l-2 border-r-2 bg-white border-uecg-line border-b-white translate-y-[1px] text-uecg-blue">
                        Estructura y Grados
                    </button>
                </div>
            </div>

            {/* Renderizamos la Lista de Grados */}
            <GradeList grades={grades} />

        </div>
    );
}