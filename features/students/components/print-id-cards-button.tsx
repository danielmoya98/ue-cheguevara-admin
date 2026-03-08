"use client";

import { Printer } from "lucide-react";

export default function PrintIdCardsButton() {
    return (
        <button
            type="button"
            onClick={() => window.print()}
            className="bg-uecg-blue text-white font-black uppercase tracking-widest text-xs px-6 py-3 h-[48px] border-2 border-uecg-blue hover:bg-uecg-dark transition-colors flex items-center gap-2"
        >
            <Printer size={16} /> Imprimir Lote
        </button>
    );
}