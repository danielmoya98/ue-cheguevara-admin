import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import StudentProfileForm from "@/features/students/components/student-profile-form";
import { apiFetch } from "../../../lib/api-client";

export default async function NewStudentPage() {
    let orphanUsers: any[] = [];

    try {
        // 1. Obtenemos de la API los usuarios que no tienen expediente
        orphanUsers = await apiFetch<any[]>("/students/orphans");
    } catch (error) {
        console.error("Error cargando usuarios huérfanos:", error);
    }

    return (
        <div className="space-y-6 relative max-w-4xl mx-auto">
            <div className="border-b-4 border-uecg-black pb-6">
                <Link
                    href="/admin/students"
                    className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-uecg-gray hover:text-uecg-blue mb-4 transition-colors"
                >
                    <ChevronLeft size={14} strokeWidth={3} />
                    Volver al Directorio
                </Link>

                <div>
                    <h1 className="text-3xl font-black text-uecg-black uppercase tracking-tighter leading-none">
                        Nuevo Expediente
                    </h1>
                    <p className="text-uecg-gray font-bold text-xs uppercase tracking-widest mt-2">
                        Registro de información personal, médica y de tutores.
                    </p>
                </div>
            </div>

            {orphanUsers.length === 0 ? (
                <div className="p-12 text-center border-2 border-dashed border-gray-300 bg-gray-50">
                    <span className="font-black uppercase tracking-widest text-sm text-uecg-black block mb-2">
                        No hay cuentas pendientes
                    </span>
                    <span className="text-xs text-uecg-gray">
                        Primero debes crear un Usuario con rol "Estudiante" desde la sección de Gestión de Usuarios.
                    </span>
                    <Link
                        href="/admin/users?action=create"
                        className="mt-4 inline-block px-6 py-3 bg-uecg-blue text-white text-[10px] font-black uppercase tracking-widest"
                    >
                        Crear Cuenta Base
                    </Link>
                </div>
            ) : (
                <StudentProfileForm availableUsers={orphanUsers} />
            )}
        </div>
    );
}