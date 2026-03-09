import { getStudentsAction } from "@/features/students/actions/student.action";
import { getGradesAction } from "@/features/academic/actions/grade.action";
import StudentTable from "@/features/students/components/student-table";
import EnrollmentModal from "@/features/students/components/enrollment-modal";
import { UserPlus, CalendarDays } from "lucide-react";
import Link from "next/link";
import { academicYearService } from "@/features/academic/services/academic-year.service";
// 1. IMPORTAMOS EL NUEVO BUSCADOR EN TIEMPO REAL
import StudentSearch from "@/features/students/components/student-search";

interface PageProps {
    searchParams: Promise<{ [key: string]: string | undefined }>
}

export default async function StudentsPage({ searchParams }: PageProps) {
    const params = await searchParams;
    const query = params.q;

    const activeYear = await academicYearService.getActiveYear();

    // Obtenemos los datos desde NestJS a través de las Server Actions
    const [studentsRes, gradesRes] = await Promise.all([
        getStudentsAction(query, activeYear),
        getGradesAction()
    ]);

    if (!studentsRes.success || !gradesRes.success) {
        return <div className="p-8 font-black text-red-500 uppercase tracking-widest text-xs">Error al cargar el directorio de estudiantes.</div>;
    }

    const students = studentsRes.data || [];
    const grades = gradesRes.data || [];
    const gradesWithClassrooms = grades.filter((g: any) => g.classrooms.length > 0);

    return (
        <div className="space-y-6 relative animate-in fade-in duration-500">
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

            {/* Toolbar Simple (Buscador Integrado) */}
            <div className="flex flex-col md:flex-row gap-4 bg-white p-2 border-2 border-uecg-line shadow-sm">
                {/* 2. REEMPLAZAMOS EL FORMULARIO POR EL COMPONENTE CLIENTE */}
                <StudentSearch initialQuery={query || ""} />
            </div>

            {/* Tabla de Estudiantes */}
            <div className="bg-white border-2 border-uecg-line shadow-sm overflow-hidden">
                <StudentTable students={students} />
            </div>
        </div>
    );
}