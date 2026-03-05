import { UserStatus } from "@/app/generated/prisma/client";

export function UserStatusBadge({ status }: { status: UserStatus | string }) {
    const styles: Record<string, string> = {
        ACTIVE: "bg-green-100 text-green-800 border-green-200",
        INACTIVE: "bg-gray-100 text-gray-600 border-gray-200",
        SUSPENDED: "bg-red-100 text-red-800 border-red-200"
    };

    return (
        <span className={`border px-2 py-1 text-[10px] font-bold uppercase tracking-widest ${styles[status] || styles.INACTIVE}`}>
      {status === "ACTIVE" ? "Activo" : status === "SUSPENDED" ? "Suspendido" : "Inactivo"}
    </span>
    );
}