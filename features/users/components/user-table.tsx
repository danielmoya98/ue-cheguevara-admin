"use client";

import Link from "next/link";
import { User } from "../validations/user.schema";
import { UserStatusBadge } from "./user-status-badge";
import { Edit, Trash2 } from "lucide-react";
import UserAvatar from "./user-avatar";

interface UserTableProps {
    users: User[];
}

export default function UserTable({ users }: UserTableProps) {
    return (
        <div className="w-full overflow-x-auto border border-uecg-line bg-white">
            <table className="w-full text-left border-collapse">
                <thead>
                <tr className="bg-gray-50 border-b border-uecg-line">
                    <th className="p-4 text-xs font-black uppercase tracking-[0.15em] text-uecg-blue w-20">ID</th>
                    {/* Esta columna contendrá Foto + Nombre + Email */}
                    <th className="p-4 text-xs font-black uppercase tracking-[0.15em] text-uecg-blue">Usuario</th>
                    <th className="p-4 text-xs font-black uppercase tracking-[0.15em] text-uecg-blue">Rol</th>
                    <th className="p-4 text-xs font-black uppercase tracking-[0.15em] text-uecg-blue">Estado</th>
                    <th className="p-4 text-xs font-black uppercase tracking-[0.15em] text-uecg-blue text-right">Acciones</th>
                </tr>
                </thead>

                <tbody className="divide-y divide-uecg-line">
                {users.map((user) => (
                    <tr key={user.id} className="hover:bg-blue-50/30 transition-colors group">

                        {/* 1. Celda ID */}
                        <td className="p-4 font-mono text-xs text-uecg-gray">#{user.id}</td>

                        {/* 2. Celda USUARIO (Aquí movemos el avatar) */}
                        <td className="p-4">
                            <div className="flex items-center gap-4"> {/* Flex para alinear foto y texto */}

                                {/* AQUI VA EL AVATAR CORRECTAMENTE UBICADO */}
                                <UserAvatar name={user.name} imageUrl={user.imageUrl} />

                                <div className="flex flex-col">
                                    <span className="font-bold text-uecg-black uppercase text-sm">{user.name}</span>
                                    <span className="text-xs text-uecg-gray font-mono">{user.email}</span>
                                </div>
                            </div>
                        </td>

                        {/* 3. Celda ROL */}
                        <td className="p-4">
                            <span className="bg-uecg-blue text-white px-2 py-1 text-[10px] font-bold uppercase tracking-wide">
                                {user.role}
                            </span>
                        </td>

                        {/* 4. Celda ESTADO */}
                        <td className="p-4">
                            <UserStatusBadge status={user.status} />
                        </td>

                        {/* 5. Celda ACCIONES */}
                        <td className="p-4 text-right">
                            <div className="flex justify-end gap-3">
                                <Link
                                    href={`/admin/users?action=edit&id=${user.id}`}
                                    scroll={false}
                                    className="flex items-center gap-2 bg-uecg-blue text-white px-3 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-uecg-dark transition-colors border border-uecg-blue"
                                >
                                    <Edit size={14} strokeWidth={2.5} />
                                    <span className="hidden xl:inline">Editar</span>
                                </Link>

                                <Link
                                    href={`/admin/users?action=delete&id=${user.id}`}
                                    scroll={false}
                                    className="flex items-center gap-2 bg-red-50 text-red-600 border border-red-600 px-3 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-red-600 hover:text-white transition-colors"
                                >
                                    <Trash2 size={14} strokeWidth={2.5} />
                                    <span className="hidden xl:inline">Borrar</span>
                                </Link>
                            </div>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}