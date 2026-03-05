import { getStudentsAction } from "@/features/students/actions/student.action";
import { getGradesAction } from "@/features/academic/actions/grade.action";
import StudentTable from "@/features/students/components/student-table";
import EnrollmentModal from "@/features/students/components/enrollment-modal";
import { UserPlus, Search, Filter } from "lucide-react";
import Link from "next/link";

interface PageProps {
    searchParams: Promise<{ [key: string]: string | undefined }>
}

export default async function StudentsPage({ searchParams }: PageProps) {
    const params = await searchParams;
    const query = params.q;

    // 1. Obtener Estudiantes (Con sus perfiles)
    const { data: students, success: studentsSuccess } = await getStudentsAction(query);

    // 2. Obtener Estructura Escolar (Para el modal de matrícula)
    const { data: grades, success: gradesSuccess } = await getGradesAction();

    if (!studentsSuccess || !gradesSuccess) {
        return <div className="p-8 font-black text-red-500">Error al cargar el directorio de estudiantes.</div>;
    }

    // Filtramos solo los grados que tienen paralelos creados
    const gradesWithClassrooms = (grades || []).filter(g => g.classrooms.length > 0);

    return (
        <div className="space-y-6 relative">

            {/* Modal de Matrícula Controlado por URL */}
            <EnrollmentModal classrooms={gradesWithClassrooms} />

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-uecg-line pb-6">
                <div>
                    <h1 className="text-3xl font-black text-uecg-black uppercase tracking-tighter mb-2">
                        Directorio Estudiantil
                    </h1>
                    <p className="text-uecg-gray font-medium text-sm">
                        Gestión de expedientes, tutores y matriculación.
                    </p>
                </div>

                {/* Por ahora, crear estudiante requiere crear el Usuario y luego su perfil.
                    Redirigimos al administrador a crear el perfil. */}
                <Link
                    href="/admin/students/new"
                    className="mt-4 md:mt-0 flex items-center gap-2 bg-uecg-blue text-white px-6 py-3 font-bold uppercase text-xs tracking-widest hover:bg-uecg-dark transition-colors border-2 border-uecg-blue"
                >
                    <UserPlus size={16} strokeWidth={3} />
                    Registrar Perfil
                </Link>
            </div>

            {/* Toolbar Simple (Buscador) */}
            <div className="flex flex-col md:flex-row gap-4 bg-white p-4 border border-uecg-line">
                <form className="flex-1 relative" action="/admin/students">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-uecg-blue">
                        <Search size={18} strokeWidth={2.5} />
                    </div>
                    <input
                        name="q"
                        defaultValue={query || ""}
                        placeholder="BUSCAR POR NOMBRE O CARNET..."
                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 font-bold text-uecg-black text-xs uppercase placeholder:text-gray-400 focus:border-uecg-blue focus:outline-none transition-colors"
                    />
                </form>
            </div>

            {/* Tabla de Estudiantes */}
            <StudentTable students={students || []} />

        </div>
    );
}