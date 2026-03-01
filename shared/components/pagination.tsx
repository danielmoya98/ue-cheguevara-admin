"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination() {
    return (
        <div className="flex justify-between items-center pt-6 border-t border-uecg-line mt-4">
      <span className="text-[10px] font-black uppercase text-uecg-gray tracking-[0.2em]">
        Mostrando 1-10 de 124
      </span>

            <div className="flex gap-2">
                <button
                    className="flex items-center gap-2 px-4 py-2 border-2 border-uecg-line text-uecg-gray hover:border-uecg-blue hover:text-uecg-blue disabled:opacity-30 disabled:hover:border-uecg-line disabled:hover:text-uecg-gray transition-colors text-xs font-black uppercase tracking-widest"
                    disabled
                >
                    <ChevronLeft size={14} strokeWidth={3} />
                    Anterior
                </button>

                {/* Indicador de página actual estilo Suizo */}
                <div className="px-4 py-2 bg-uecg-blue text-white text-xs font-black border-2 border-uecg-blue">
                    1
                </div>

                <button
                    className="flex items-center gap-2 px-4 py-2 border-2 border-uecg-line text-uecg-black hover:border-uecg-blue hover:text-uecg-blue transition-colors text-xs font-black uppercase tracking-widest"
                >
                    Siguiente
                    <ChevronRight size={14} strokeWidth={3} />
                </button>
            </div>
        </div>
    );
}