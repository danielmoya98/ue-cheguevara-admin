import Sidebar from "@/shared/components/sidebar";
import { SidebarProvider } from "@/shared/context/sidebar-context";
import AdminShell from "@/shared/components/admin-shell";
import { redirect } from "next/navigation";
import { apiFetch } from "../../app/lib/api-client";
import { academicYearService } from "@/features/academic/services/academic-year.service";

export default async function AdminLayout({
                                              children,
                                          }: {
    children: React.ReactNode;
}) {
    // 1. Obtenemos el Año Activo
    const activeYear = await academicYearService.getActiveYear();

    let user;

    try {
        // 2. VERIFICACIÓN DE SESIÓN VÍA API (Reemplaza a Prisma)
        // apiFetch automáticamente lee la cookie httpOnly, envía el JWT a NestJS
        // y si el token expiró, lo refresca antes de devolver los datos.
        user = await apiFetch<{
            id: string;
            name: string;
            email: string;
            role: string;
            forcePasswordChange: boolean;
        }>("/auth/me");
        // ^^^ Asegúrate de crear este endpoint GET /auth/me en tu NestJS

    } catch (error) {
        // Si el token es inválido o no existe, lo sacamos del sistema
        redirect("/login");
    }

    // 3. Redirecciones de seguridad por Rol y Onboarding
    if (!user || user.role !== "ADMIN") {
        redirect("/login");
    }

    if (user.forcePasswordChange) {
        redirect("/onboarding");
    }

    return (
        <SidebarProvider>
            <div className="min-h-screen bg-gray-50">
                <Sidebar />
                <AdminShell user={{ name: user.name, email: user.email }} activeYear={activeYear}>
                    {children}
                </AdminShell>
            </div>
        </SidebarProvider>
    );
}