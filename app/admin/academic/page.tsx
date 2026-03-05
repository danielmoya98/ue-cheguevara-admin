import { getSubjectsAction } from "@/features/academic/actions/subject.action";
import SubjectCatalog from "@/features/academic/components/subject-catalog";
import SubjectFormModal from "@/features/academic/components/subject-form-modal";
import DeleteSubjectModal from "@/features/academic/components/delete-subject-modal";
import Link from "next/link";

export default async function AcademicPage() {
    // 1. Obtener todas las materias de PostgreSQL (Vía Server Action)
    const { data: subjects, success } = await getSubjectsAction();

    if (!success || !subjects) {
        return <div className="p-8 font-black uppercase text-red-500 tracking-widest">Error al cargar datos académicos.</div>;
    }

    return (
        <div className="space-y-8 relative">

            {/* 2. Modales (Orquestados por URL) */}
            <SubjectFormModal subjects={subjects} />
            <DeleteSubjectModal />

            {/* 3. Header de la Página */}
            <div className="flex flex-col md:flex-row justify-between items-end border-b border-uecg-line pb-6">
                <div>
                    <h1 className="text-3xl font-black text-uecg-black uppercase tracking-tighter mb-2">
                        Gestión Académica
                    </h1>
                    <p className="text-uecg-gray font-medium text-sm">
                        Catálogo de materias, grados y asignación de horarios.
                    </p>
                </div>

                {/* TABS (Preparando el terreno para el constructor de currículas) */}
                <div className="flex gap-1 mt-4 md:mt-0">
                    <button className="px-6 py-3 text-xs font-black uppercase tracking-widest border-t-2 border-l-2 border-r-2 bg-white border-uecg-line border-b-white translate-y-[1px] text-uecg-blue">
                        Catálogo de Materias
                    </button>
                    <Link
                        href="/admin/academic/grades"
                        className="px-6 py-3 text-xs font-black uppercase tracking-widest border-t-2 border-l-2 border-r-2 bg-gray-100 border-transparent text-gray-400 hover:text-uecg-black transition-colors"
                    >
                        Estructura y Grados
                    </Link>
                </div>
            </div>

            {/* 4. Renderizamos el Catálogo con la data real */}
            <SubjectCatalog subjects={subjects} />

        </div>
    );
}