import { User } from "../validations/user.schema";

export function UserStatusBadge({ status }: { status: User["status"] }) {
    const styles = {
        active: "bg-green-100 text-green-800 border-green-200",
        inactive: "bg-gray-100 text-gray-600 border-gray-200"
    };

    return (
        <span className={`
      border px-2 py-1 text-[10px] font-bold uppercase tracking-widest
      ${styles[status]}
    `}>
      {status === "active" ? "Activo" : "Inactivo"}
    </span>
    );
}