import { SidebarProvider } from "@/shared/context/sidebar-context";
import TeacherSidebar from "@/shared/components/teacher-sidebar";
import TeacherShell from "@/shared/components/teacher-shell";

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <div className="min-h-screen bg-gray-50 font-sans text-uecg-black">
                <TeacherSidebar />
                <TeacherShell>{children}</TeacherShell>
            </div>
        </SidebarProvider>
    );
}