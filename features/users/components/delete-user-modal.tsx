"use client";

import { useSearchParams, useRouter } from "next/navigation";
import Modal from "@/shared/components/modal";
import { deleteUserAction } from "../actions/user-mutations.action";
import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { toast } from "sonner"; // IMPORTAMOS SONNER PARA LOS TOASTS

export default function DeleteUserModal() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const userId = searchParams.get("id");
    const isOpen = searchParams.get("action") === "delete" && !!userId;
    const [isDeleting, setIsDeleting] = useState(false);

    const handleClose = () => router.push("/admin/users", { scroll: false });

    const handleConfirm = async () => {
        if (!userId) return;
        setIsDeleting(true);

        // Capturamos el resultado de la Server Action
        const result = await deleteUserAction(userId);
        setIsDeleting(false);

        if (result.success) {
            toast.success(result.message); // Notificación de éxito
            handleClose(); // Cerramos el modal solo si fue exitoso
        } else {
            toast.error(result.message || "Error al eliminar usuario"); // Notificación de error
        }
    };

    return (
        <Modal title="Confirmar Eliminación" isOpen={isOpen} onClose={handleClose}>
            <div className="flex flex-col items-center text-center space-y-6">

                <div className="h-16 w-16 bg-red-50 flex items-center justify-center text-red-600">
                    <AlertTriangle size={32} strokeWidth={1.5} />
                </div>

                <div>
                    <p className="text-uecg-black font-bold text-lg">
                        ¿Estás seguro de eliminar este usuario?
                    </p>
                    <p className="text-uecg-gray text-sm mt-2">
                        Esta acción es irreversible y eliminará todos los datos asociados al usuario ID: <span className="font-mono text-uecg-black">#{userId?.slice(0, 8)}</span>.
                    </p>
                </div>

                <div className="flex gap-4 w-full pt-4">
                    <button
                        onClick={handleClose}
                        className="flex-1 py-3 border border-uecg-line text-xs font-bold uppercase tracking-widest text-uecg-gray hover:bg-gray-50 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={isDeleting}
                        className="flex-1 py-3 bg-red-600 text-white text-xs font-bold uppercase tracking-widest hover:bg-red-700 transition-colors disabled:opacity-50"
                    >
                        {isDeleting ? "Eliminando..." : "Sí, Eliminar"}
                    </button>
                </div>
            </div>
        </Modal>
    );
}