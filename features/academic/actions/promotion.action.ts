"use server";

import { promotionService } from "../services/promotion.service";
import { revalidatePath } from "next/cache";

export async function executePromotionAction(classroomId: string, academicYear: number) {
    try {
        const result = await promotionService.executePromotion(classroomId, academicYear);
        revalidatePath("/admin/academic-promotion");
        return {
            success: true,
            message: `Gestión cerrada. ${result.promotedCount} promovidos y ${result.retainedCount} retenidos para ${result.nextYear}.`
        };
    } catch (error: any) {
        return { success: false, message: error.message || "Error al ejecutar la promoción." };
    }
}