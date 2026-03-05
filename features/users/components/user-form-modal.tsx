"use client";

import { useSearchParams, useRouter } from "next/navigation";
import Modal from "@/shared/components/modal";
import { createUserAction, updateUserAction } from "../actions/user-mutations.action";
import { useActionState, useEffect } from "react";
import { User } from "../validations/user.schema"; // Necesitamos importar el type

const initialState = { success: false, message: "" };

// AHORA EL COMPONENTE RECIBE LA LISTA DE USUARIOS
export default function UserFormModal({ users }: { users: User[] }) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const mode = searchParams.get("action");
    const userId = searchParams.get("id");
    const isOpen = mode === "create" || mode === "edit";

    // BUSCAMOS AL USUARIO SI ESTAMOS EN MODO EDICIÓN
    const currentUser = userId ? users.find((u) => u.id === userId) : null;

    const actionFn = mode === "create" ? createUserAction : updateUserAction;
    const [state, action, isPending] = useActionState(actionFn, initialState);

    const handleClose = () => router.push("/admin/users", { scroll: false });

    useEffect(() => {
        if (state.success) handleClose();
    }, [state.success]);

    // CLASES REUTILIZABLES PARA INPUTS (Swiss Style High Contrast)
    const labelClass = "text-xs font-black uppercase tracking-[0.15em] text-uecg-black mb-2 block";
    const inputClass = "w-full border-2 border-gray-300 bg-white p-3 font-bold text-uecg-black placeholder:text-gray-400 placeholder:font-normal outline-none focus:border-uecg-blue focus:ring-0 transition-colors text-sm";
    const selectWrapperClass = "relative border-2 border-gray-300 bg-white focus-within:border-uecg-blue transition-colors";

    return (
        <Modal
            title={mode === "create" ? "Nuevo Usuario" : "Editar Usuario"}
            isOpen={isOpen}
            onClose={handleClose}
        >
            {/* El atributo key es VITAL: obliga a React a recargar los defaultValue cuando cambia el usuario */}
            <form action={action} className="space-y-6" key={currentUser?.id || "new"}>
                {userId && <input type="hidden" name="id" value={userId} />}

                {/* Input Nombre */}
                <div>
                    <label className={labelClass}>Nombre Completo</label>
                    <input
                        name="name"
                        placeholder="EJ: JUAN PEREZ"
                        className={inputClass}
                        required
                        autoComplete="off"
                        defaultValue={currentUser?.name || ""} // PRE-CARGA
                    />
                </div>

                {/* Input Email */}
                <div>
                    <label className={labelClass}>Correo Electrónico</label>
                    <input
                        name="email"
                        type="email"
                        placeholder="usuario@uecg.edu.bo"
                        className={inputClass}
                        required
                        autoComplete="off"
                        defaultValue={currentUser?.email || ""} // PRE-CARGA
                    />
                </div>

                {/* Input Contraseña */}
                <div>
                    <label className={labelClass}>
                        {mode === "create" ? "Contraseña Temporal" : "Nueva Contraseña (Opcional)"}
                    </label>
                    <input
                        name="password"
                        type="text"
                        placeholder={mode === "create" ? "Mínimo 6 caracteres" : "Dejar en blanco para mantener actual"}
                        className={inputClass}
                        required={mode === "create"}
                    />
                </div>

                {/* Select Rol */}
                <div>
                    <label className={labelClass}>Rol Asignado</label>
                    <div className={selectWrapperClass}>
                        <select
                            name="role"
                            className="w-full p-3 font-bold text-uecg-black bg-transparent outline-none appearance-none cursor-pointer z-10 relative text-sm"
                            defaultValue={currentUser?.role || "STUDENT"} // PRE-CARGA
                        >
                            <option value="STUDENT">ESTUDIANTE</option>
                            <option value="TEACHER">DOCENTE</option>
                            <option value="ADMIN">ADMINISTRADOR</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-uecg-black font-black text-xs">▼</div>
                    </div>
                </div>

                {/* Botones Acciones */}
                <div className="flex gap-4 pt-6 border-t-2 border-uecg-line mt-8">
                    <button
                        type="button"
                        onClick={handleClose}
                        className="flex-1 py-4 border-2 border-gray-300 text-xs font-black uppercase tracking-widest text-gray-500 hover:border-uecg-black hover:text-uecg-black transition-all"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={isPending}
                        className="flex-1 py-4 bg-uecg-blue border-2 border-uecg-blue text-white text-xs font-black uppercase tracking-widest hover:bg-white hover:text-uecg-blue transition-all disabled:opacity-50"
                    >
                        {isPending ? "Guardando..." : "Guardar Usuario"}
                    </button>
                </div>
            </form>
        </Modal>
    );
}