"use client";

import { useSearchParams, useRouter } from "next/navigation";
import Modal from "@/shared/components/modal";
import { deleteSubjectAction } from "../actions/subject.action";
import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { toast } from "sonner";

export default function DeleteSubjectModal() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const subjectId = searchParams.get("id");
    const isOpen = searchParams.get("action") === "delete-subject" && !!subjectId;

    const [isDeleting, setIsDeleting] = useState(false);

    const handleClose = () => router.push("/admin/academic", { scroll: false });

    const handleConfirm = async () => {
        if (!subjectId) return;
        setIsDeleting(true);

        const result = await deleteSubjectAction(subjectId);
        setIsDeleting(false);

        if (result.success) {
            toast.success(result.message);
            handleClose();
        } else {
            toast.error(result.message || "Error al eliminar");
        }
    };

    return (
        <Modal title="Eliminar Materia" isOpen={isOpen} onClose={handleClose}>
            <div className="flex flex-col items-center text-center space-y-6">
                <div className="h-16 w-16 bg-red-50 flex items-center justify-center text-red-600 border-2 border-red-200">
                    <AlertTriangle size={32} strokeWidth={2} />
                </div>
                <div>
                    <p className="text-uecg-black font-black uppercase tracking-widest text-lg">
                        ¿Borrar Materia?
                    </p>
                    <p className="text-uecg-gray text-xs mt-2 font-bold uppercase">
                        Esta acción la removerá del catálogo global. ID: <span className="font-mono text-uecg-black">#{subjectId?.slice(0, 8)}</span>
                    </p>
                </div>
                <div className="flex gap-4 w-full pt-4">
                    <button onClick={handleClose} className="flex-1 py-4 border-2 border-uecg-line text-xs font-black uppercase tracking-widest text-uecg-gray hover:border-uecg-black hover:text-uecg-black transition-colors">
                        Cancelar
                    </button>
                    <button onClick={handleConfirm} disabled={isDeleting} className="flex-1 py-4 bg-red-600 text-white text-xs font-black uppercase tracking-widest hover:bg-red-700 transition-colors disabled:opacity-50 border-2 border-red-600 hover:border-red-700">
                        {isDeleting ? "Borrando..." : "Sí, Eliminar"}
                    </button>
                </div>
            </div>
        </Modal>
    );
}