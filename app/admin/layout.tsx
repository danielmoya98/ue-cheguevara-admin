import Sidebar from "@/shared/components/sidebar";
import { SidebarProvider } from "@/shared/context/sidebar-context";
import AdminShell from "@/shared/components/admin-shell";

export default function AdminLayout({
                                        children,
                                    }: {
    children: React.ReactNode;
}) {
    return (
        <SidebarProvider>
            <div className="min-h-screen bg-gray-50">
                <Sidebar />
                <AdminShell>
                    {children}
                </AdminShell>
            </div>
        </SidebarProvider>
    );
}