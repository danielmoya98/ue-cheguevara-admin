"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

interface ModalProps {
    title: string;
    children: React.ReactNode;
    isOpen: boolean;
    onClose: () => void;
}

export default function Modal({ title, children, isOpen, onClose }: ModalProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            document.body.style.overflow = "hidden";
        } else {
            const timer = setTimeout(() => setIsVisible(false), 200);
            document.body.style.overflow = "unset";
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!isVisible && !isOpen) return null;

    return (
        // CAMBIO 1: z-[9999] y 'fixed inset-0 h-screen w-screen' para garantizar cobertura total
        <div className={`
      fixed inset-0 h-screen w-screen z-[9999] flex items-center justify-center
      transition-all duration-200 ease-in-out
      ${isOpen ? "opacity-100" : "opacity-0"}
    `}>

            {/* CAMBIO 2: Backdrop más oscuro (bg-uecg-dark/90) para resaltar el modal */}
            <div
                className="absolute inset-0 bg-uecg-dark/90 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* CAMBIO 3: Modal Container */}
            <div className={`
        relative bg-white w-full max-w-lg border-2 border-uecg-line shadow-2xl
        flex flex-col max-h-[90vh] // Evita que se salga de la pantalla en vertical
        transform transition-all duration-300 ease-out
        ${isOpen ? "translate-y-0 scale-100" : "translate-y-4 scale-95"}
      `}>

                {/* Header Fijo */}
                <div className="flex items-center justify-between p-6 border-b-2 border-uecg-line bg-gray-50 shrink-0">
                    <h3 className="text-xl font-black uppercase tracking-tighter text-uecg-blue">
                        {title}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-uecg-black hover:bg-red-600 hover:text-white transition-colors p-1 border border-transparent hover:border-red-600"
                    >
                        <X size={24} strokeWidth={2.5} />
                    </button>
                </div>

                {/* Body con Scroll si es necesario */}
                <div className="p-8 overflow-y-auto">
                    {children}
                </div>

            </div>
        </div>
    );
}