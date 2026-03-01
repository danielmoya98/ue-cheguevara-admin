import Link from "next/link";
import { getUsersAction } from "@/features/users/actions/get-users.action";
import UserTable from "@/features/users/components/user-table";
import UserToolbar from "@/features/users/components/user-toolbar"; // Toolbar
import Pagination from "@/shared/components/pagination"; // Nueva Paginación
import UserFormModal from "@/features/users/components/user-form-modal";
import DeleteUserModal from "@/features/users/components/delete-user-modal";
import { Plus } from "lucide-react";

interface PageProps {
    searchParams: Promise<{ [key: string]: string | undefined }>
}

export default async function UsersPage({ searchParams }: PageProps) {
    // 1. Leer parámetros de URL (Next.js 15 requiere await en searchParams)
    const params = await searchParams;
    const query = params.q;
    const role = params.role;

    // 2. Obtener datos filtrados
    const { data: users, success } = await getUsersAction({ query, role });

    if (!success || !users) return <div>Error...</div>;

    return (
        <div className="space-y-6 relative">
            <UserFormModal />
            <DeleteUserModal />

            <div className="flex justify-between items-end border-b border-uecg-line pb-6">
                <div>
                    <h1 className="text-3xl font-black text-uecg-black uppercase tracking-tighter mb-2">
                        Gestión de Usuarios
                    </h1>
                    <p className="text-uecg-gray font-medium text-sm">
                        Administración de cuentas
                    </p>
                </div>

                <Link
                    href="/admin/users?action=create"
                    scroll={false}
                    className="flex items-center gap-2 bg-uecg-blue text-white px-6 py-3 font-bold uppercase text-xs tracking-widest hover:bg-uecg-dark transition-colors border-2 border-uecg-blue hover:border-uecg-dark"
                >
                    <Plus size={16} strokeWidth={3} />
                    Nuevo Usuario
                </Link>
            </div>

            {/* TOOLBAR DE BÚSQUEDA Y FILTROS */}
            <UserToolbar />

            {/* TABLA */}
            <UserTable users={users} />

            {/* PAGINACIÓN */}
            <Pagination />
        </div>
    );
}