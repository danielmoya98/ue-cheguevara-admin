import { CreditCard, Users } from "lucide-react";
import StudentIdCard from "@/features/students/components/student-id-card";
import PrintIdCardsButton from "@/features/students/components/print-id-cards-button";
import { apiFetch } from "../../../lib/api-client";

export const dynamic = "force-dynamic";

export default async function AdminIdCardsPage(props: { searchParams: Promise<{ classroomId?: string }> }) {
    const searchParams = await props.searchParams;
    const classroomId = searchParams?.classroomId;
    const currentYear = new Date().getFullYear();

    let classrooms: any[] = [];
    let enrollments: any[] = [];

    try {
        // Obtenemos los grados y paralelos para pintar el <select>
        const gradesOverview = await apiFetch<any[]>("/grades/overview");

        // Aplastamos los paralelos para que sea un solo array fácil de mapear
        classrooms = gradesOverview.flatMap(grade =>
            grade.classrooms.map((c: any) => ({ ...c, grade }))
        );

        // Si hay un aula seleccionada, buscamos a los alumnos matriculados ahí
        if (classroomId) {
            enrollments = await apiFetch<any[]>(`/enrollments?classroomId=${classroomId}&academicYear=${currentYear}`);
        }
    } catch (error) {
        console.error("Error al cargar datos de carnetización", error);
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500 relative">
            <div className="border-b-4 border-uecg-black pb-6 print:hidden">
                <h1 className="text-3xl font-black text-uecg-black uppercase tracking-tighter leading-none mb-2">
                    Carnetización Digital
                </h1>
                <p className="text-uecg-gray font-bold text-xs uppercase tracking-widest mt-2 flex items-center gap-2">
                    <CreditCard size={14} /> Emisión de Credenciales QR
                </p>
            </div>

            <div className="bg-white border-2 border-uecg-line p-6 shadow-sm print:hidden">
                <form method="GET" className="flex flex-col md:flex-row gap-6 items-end">
                    <div className="flex-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-uecg-gray mb-2 flex items-center gap-2">
                            <Users size={14} /> 1. Seleccionar Aula para Imprimir Lote
                        </label>
                        <div className="relative">
                            <select name="classroomId" defaultValue={classroomId || ""} className="w-full border-2 border-gray-300 p-3 text-sm font-bold text-uecg-black uppercase appearance-none bg-transparent relative z-10 cursor-pointer focus:border-uecg-blue outline-none transition-colors" required>
                                <option value="" disabled>-- Elija un curso --</option>
                                {classrooms.map(c => (
                                    <option key={c.id} value={c.id}>
                                        {c.grade.name} "{c.name}" - {c.grade.level}
                                    </option>
                                ))}
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-uecg-black font-black text-xs z-0">▼</div>
                        </div>
                    </div>

                    <button type="submit" className="bg-uecg-black text-white font-black uppercase tracking-widest text-xs px-8 py-3 h-[48px] border-2 border-uecg-black hover:bg-uecg-blue transition-colors">
                        Generar Carnets
                    </button>

                    {enrollments.length > 0 && <PrintIdCardsButton />}
                </form>
            </div>

            <div className="mt-8">
                {classroomId && enrollments.length === 0 ? (
                    <div className="p-16 text-center border-4 border-dashed border-gray-200 bg-white print:hidden">
                        <span className="font-black text-uecg-gray uppercase tracking-widest text-sm block mb-2">Aula Vacía</span>
                        <span className="text-xs font-bold text-gray-400 uppercase">No hay alumnos matriculados.</span>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6 print:grid-cols-4 print:gap-4 print:fixed print:inset-0 print:bg-white print:z-[9999] print:p-8">
                        {enrollments.map((enrollment) => (
                            <div key={enrollment.id} className="flex justify-center">
                                <StudentIdCard
                                    student={enrollment.student}
                                    classroom={enrollment.classroom}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}