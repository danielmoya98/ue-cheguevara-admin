"use client";

import { useState } from "react";
import Modal from "@/shared/components/modal";
import { Subject } from "../types/academic.types";

interface AcademicModalsProps {
    availableSubjects: Subject[];
    // Props para controlar qué modal se abre
    activeModal: "add-subject" | "assign-schedule" | null;
    onClose: () => void;
    // Contexto de la acción
    selectedDay?: string;
    selectedTime?: string;
}

export default function AcademicModals({ availableSubjects, activeModal, onClose, selectedDay, selectedTime }: AcademicModalsProps) {

    // --- CONTENIDO MODAL 1: AGREGAR MATERIA A LA MALLA ---
    const AddSubjectContent = () => (
        <div className="space-y-6">
            <p className="text-sm text-uecg-gray">
                Selecciona las materias que se impartirán en este grado.
            </p>
            <div className="grid grid-cols-2 gap-3 max-h-60 overflow-y-auto">
                {availableSubjects.map(sub => (
                    <label key={sub.id} className="flex items-center gap-3 p-3 border border-uecg-line hover:border-uecg-blue cursor-pointer">
                        <input type="checkbox" className="w-4 h-4 rounded-none accent-uecg-blue" />
                        <div className="flex flex-col">
                            <span className="text-xs font-bold uppercase">{sub.name}</span>
                            <span className="text-[10px] text-uecg-gray">{sub.weeklyHours} hrs/sem</span>
                        </div>
                    </label>
                ))}
            </div>
            <button className="w-full py-4 bg-uecg-blue text-white font-black uppercase text-xs tracking-widest">
                Actualizar Malla
            </button>
        </div>
    );

    // --- CONTENIDO MODAL 2: ASIGNAR HORARIO ---
    const AssignScheduleContent = () => (
        <div className="space-y-6">
            <div className="bg-gray-100 p-4 border-l-4 border-uecg-black">
                <span className="text-xs font-bold uppercase text-uecg-gray block">Horario Seleccionado</span>
                <span className="text-lg font-black text-uecg-black">{selectedDay} - {selectedTime}</span>
            </div>

            <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-uecg-blue">Materia</label>
                <select className="w-full p-3 border-2 border-gray-300 font-bold uppercase text-sm focus:border-uecg-blue outline-none">
                    <option value="">Seleccionar Materia...</option>
                    {availableSubjects.map(sub => (
                        <option key={sub.id} value={sub.id}>{sub.name} ({sub.weeklyHours}H)</option>
                    ))}
                </select>
            </div>

            {/* Aquí en el futuro iría el selector de Docente */}
            <div className="space-y-2 opacity-50">
                <label className="text-xs font-black uppercase tracking-widest text-uecg-gray">Docente (Próximamente)</label>
                <select disabled className="w-full p-3 border-2 border-gray-200 bg-gray-50 text-sm">
                    <option>Asignación Automática</option>
                </select>
            </div>

            <button className="w-full py-4 bg-uecg-blue text-white font-black uppercase text-xs tracking-widest">
                Confirmar Horario
            </button>
        </div>
    );

    return (
        <>
            <Modal
                title="Configurar Malla Curricular"
                isOpen={activeModal === "add-subject"}
                onClose={onClose}
            >
                <AddSubjectContent />
            </Modal>

            <Modal
                title="Asignar Clase"
                isOpen={activeModal === "assign-schedule"}
                onClose={onClose}
            >
                <AssignScheduleContent />
            </Modal>
        </>
    );
}