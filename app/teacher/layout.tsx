import { SidebarProvider } from "@/shared/context/sidebar-context";
import TeacherSidebar from "@/shared/components/teacher-sidebar";
import TeacherShell from "@/shared/components/teacher-shell";
import { redirect } from "next/navigation";
// 1. IMPORTAMOS NUESTRO CLIENTE API (Adiós Prisma y Cookies manuales)
import { apiFetch } from "../../app/lib/api-client";
import { academicYearService } from "@/features/academic/services/academic-year.service";

export default async function TeacherLayout({
                                                children
                                            }: {
    children: React.ReactNode
}) {
    // 1. Obtenemos el Año Activo de la Máquina del Tiempo
    const activeYear = await academicYearService.getActiveYear();

    let user;

    try {
        // 2. VERIFICACIÓN DE SESIÓN VÍA API EN NESTJS
        // apiFetch automáticamente lee la cookie httpOnly, envía el JWT,
        // y si el token expiró, lo refresca antes de devolver los datos.
        user = await apiFetch<{
            id: string;
            name: string;
            email: string;
            role: string;
            forcePasswordChange: boolean;
        }>("/auth/me");

    } catch (error) {
        // Si el token es inválido, no existe, o el servidor rechaza la conexión,
        // capturamos el error y lo devolvemos al login de forma segura.
        redirect("/login");
    }

    // 3. Redirecciones de seguridad estrictas (Solo PROFESORES)
    if (!user || user.role !== "TEACHER") {
        redirect("/login");
    }

    // Obligamos a cambiar la clave si es su primera vez
    if (user.forcePasswordChange) {
        redirect("/onboarding");
    }

    return (
        <SidebarProvider>
            <div className="min-h-screen bg-gray-50 font-sans text-uecg-black">
                <TeacherSidebar />
                <TeacherShell user={{ name: user.name, email: user.email }} activeYear={activeYear}>
                    {children}
                </TeacherShell>
            </div>
        </SidebarProvider>
    );
}