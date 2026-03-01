"use client";

import Image from "next/image";

interface UserAvatarProps {
    name: string;
    imageUrl?: string | null;
}

export default function UserAvatar({ name, imageUrl }: UserAvatarProps) {
    // Lógica para obtener iniciales (Ej: "Juan Perez" -> "JP")
    const initials = name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();

    return (
        <div className="h-10 w-10 shrink-0 relative">
            {imageUrl ? (
                // CASO 1: TIENE FOTO
                <Image
                    src={imageUrl}
                    alt={name}
                    fill
                    className="object-cover border-2 border-uecg-blue p-[1px]"
                />
            ) : (
                // CASO 2: NO TIENE FOTO (Iniciales)
                <div className="h-full w-full bg-uecg-blue flex items-center justify-center border-2 border-uecg-blue">
          <span className="text-white font-black text-xs tracking-wider">
            {initials}
          </span>
                </div>
            )}
        </div>
    );
}