import { getStudentsAction } from "@/features/students/actions/student.action";
import { getGradesAction } from "@/features/academic/actions/grade.action";
import StudentTable from "@/features/students/components/student-table";
import EnrollmentModal from "@/features/students/components/enrollment-modal";
import { UserPlus, Search, Filter, CalendarDays } from "lucide-react";
import Link from "next/link";
// 1. IMPORTAMOS EL SERVICIO DE GESTIÓN ACADÉMICA
import { academicYearService } from "@/features/academic/services/academic-year.service";

interface PageProps {
    searchParams: Promise<{ [key: string]: string | undefined }>
}

export default async function StudentsPage({ searchParams }: PageProps) {
    const params = await searchParams;
    const query = params.q;

    // 2. OBTENEMOS EL AÑO ACTIVO DE LA SESIÓN DEL USUARIO
    const activeYear = await academicYearService.getActiveYear();

    // 3. PASAMOS EL AÑO A LA ACCIÓN (Tendrás que actualizar getStudentsAction para que reciba el año)
    const { data: students, success: studentsSuccess } = await getStudentsAction(query, activeYear);

    // 4. Obtener Estructura Escolar
    // (Dependiendo de tu lógica, los grados y paralelos también podrían depender del año)
    const { data: grades, success: gradesSuccess } = await getGradesAction();

    if (!studentsSuccess || !gradesSuccess) {
        return <div className="p-8 font-black text-red-500 uppercase tracking-widest text-xs">Error al cargar el directorio de estudiantes.</div>;
    }

    // Filtramos solo los grados que tienen paralelos creados
    const gradesWithClassrooms = (grades || []).filter(g => g.classrooms.length > 0);

    return (
        <div className="space-y-6 relative animate-in fade-in duration-500">

            {/* Modal de Matrícula Controlado por URL
                NOTA: Le pasamos el activeYear para que al matricular, guarde ese año exacto en la BD
            */}
            <EnrollmentModal classrooms={gradesWithClassrooms} activeYear={activeYear} />

            {/* Header con Estilo Suizo */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b-4 border-uecg-black pb-6">
                <div>
                    <h1 className="text-3xl font-black text-uecg-black uppercase tracking-tighter mb-2 leading-none">
                        Directorio Estudiantil
                    </h1>
                    <p className="text-uecg-gray font-bold text-[10px] uppercase tracking-[0.2em] flex items-center gap-2">
                        <CalendarDays size={14} /> Gestión Académica {activeYear}
                    </p>
                </div>

                <Link
                    href="/admin/students/new"
                    className="mt-6 md:mt-0 flex items-center gap-2 bg-uecg-black text-white px-6 py-4 font-black uppercase text-[10px] tracking-[0.2em] hover:bg-uecg-blue transition-colors border-2 border-uecg-black hover:border-uecg-blue"
                >
                    <UserPlus size={16} strokeWidth={2.5} />
                    Registrar Nuevo
                </Link>
            </div>

            {/* Toolbar Simple (Buscador) */}
            <div className="flex flex-col md:flex-row gap-4 bg-white p-2 border-2 border-uecg-line shadow-sm">
                <form className="flex-1 relative" action="/admin/students">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-uecg-gray">
                        <Search size={16} strokeWidth={3} />
                    </div>
                    <input
                        name="q"
                        defaultValue={query || ""}
                        placeholder="BUSCAR POR NOMBRE O CARNET..."
                        className="w-full pl-12 pr-4 py-3 border-none bg-transparent font-bold text-uecg-black text-xs uppercase placeholder:text-gray-400 focus:outline-none transition-colors"
                    />
                    <button type="submit" className="hidden">Buscar</button>
                </form>
            </div>

            {/* Tabla de Estudiantes */}
            <div className="bg-white border-2 border-uecg-line shadow-sm overflow-hidden">
                <StudentTable students={students || []} />
            </div>

        </div>
    );
}