"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, AlertCircle, Check, Megaphone } from "lucide-react";
import { getNotificationsAction, markAsReadAction } from "../actions/notification.action";

interface NotificationItem {
    id: string;
    title: string;
    content: string;
    isImportant: boolean;
    createdAt: Date;
    isRead: boolean;
}

export default function NotificationBell() {
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);

    // Ref para cerrar el dropdown si se hace clic afuera
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Cargar notificaciones al montar el componente
    useEffect(() => {
        const fetchNotifications = async () => {
            const res = await getNotificationsAction();
            if (res.success) {
                setNotifications(res.data);
                setUnreadCount(res.unreadCount);
            }
        };
        fetchNotifications();

        // Cerrar al hacer clic fuera del componente
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleMarkAsRead = async (id: string, isRead: boolean) => {
        if (isRead) return; // Si ya está leído, no hacemos nada

        // Actualización optimista en la UI (para que sea instantáneo)
        setNotifications(current =>
            current.map(n => n.id === id ? { ...n, isRead: true } : n)
        );
        setUnreadCount(prev => Math.max(0, prev - 1));

        // Llamada al servidor en segundo plano
        await markAsReadAction(id);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* El Icono de la Campanita */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-uecg-gray hover:text-uecg-black hover:bg-gray-100 transition-colors rounded-full"
            >
                <Bell size={24} strokeWidth={2} />

                {/* Globo Rojo de No Leídos */}
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-[10px] font-black text-white bg-red-500 rounded-full border-2 border-white">
                        {unreadCount}
                    </span>
                )}
            </button>

            {/* El Menú Desplegable (Dropdown) */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 md:w-96 bg-white border-2 border-uecg-black shadow-lg z-50">
                    <div className="bg-uecg-black text-white px-4 py-3 flex justify-between items-center">
                        <span className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                            <Megaphone size={14} /> Comunicados
                        </span>
                        <span className="text-[10px] font-bold text-gray-400 uppercase">
                            {unreadCount} Nuevos
                        </span>
                    </div>

                    <div className="max-h-96 overflow-y-auto divide-y divide-gray-100">
                        {notifications.length === 0 ? (
                            <div className="p-6 text-center text-xs font-bold text-gray-400 uppercase tracking-widest">
                                Bandeja vacía
                            </div>
                        ) : (
                            notifications.map(notification => (
                                <div
                                    key={notification.id}
                                    onClick={() => handleMarkAsRead(notification.id, notification.isRead)}
                                    className={`p-4 cursor-pointer transition-colors ${!notification.isRead ? 'bg-blue-50/50 hover:bg-blue-50' : 'bg-white hover:bg-gray-50'}`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="mt-1">
                                            {notification.isImportant ? (
                                                <AlertCircle size={16} className="text-red-500" strokeWidth={2.5} />
                                            ) : notification.isRead ? (
                                                <Check size={16} className="text-gray-300" strokeWidth={3} />
                                            ) : (
                                                <div className="w-2 h-2 rounded-full bg-uecg-blue mt-1.5 ml-1" />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className={`text-xs uppercase tracking-tight mb-1 ${!notification.isRead ? 'font-black text-uecg-black' : 'font-bold text-gray-600'}`}>
                                                {notification.title}
                                            </h4>
                                            <p className="text-[11px] text-gray-500 leading-snug line-clamp-2">
                                                {notification.content}
                                            </p>
                                            <span className="block mt-2 text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                                                {new Date(notification.createdAt).toLocaleDateString('es-BO', { day: 'numeric', month: 'short' })}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}