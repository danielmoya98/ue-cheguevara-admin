"use client";

import { useState } from "react";
import { toast } from "sonner";
import { executePromotionAction } from "@/features/academic/actions/promotion.action";
import { CheckCircle } from "lucide-react";

export default function PromotionExecutor({ classroomId, academicYear }: { classroomId: string, academicYear: number }) {
    const [isPending, setIsPending] = useState(false);

    const handleExecute = async () => {
        if (!confirm(`¿Estás seguro de cerrar la gestión ${academicYear} para esta aula?`)) return;

        setIsPending(true);
        const result = await executePromotionAction(classroomId, academicYear);
        setIsPending(false);

        if (result.success) {
            toast.success(result.message);
        } else {
            toast.error(result.message);
        }
    };

    return (
        <button
            onClick={handleExecute}
            disabled={isPending}
            className="w-full bg-red-600 text-white p-4 text-xs font-black uppercase tracking-[0.2em] border-2 border-red-700 hover:bg-red-700 transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
        >
            {isPending ? "Ejecutando Cierre Masivo..." : <><CheckCircle size={18} /> Ejecutar Promoción a Gestión {academicYear + 1}</>}
        </button>
    );
}