import "dotenv/config";
import { prisma } from "../lib/db";
import bcrypt from "bcryptjs";


async function main() {
    console.log("🌱 Seeding database...");

    const hashedPassword = await bcrypt.hash("admin123", 10);

    const admin = await prisma.user.upsert({
        where: { email: "admin@uecg.edu.bo" },
        update: {},
        create: {
            email: "admin@uecg.edu.bo",
            name: "Director Sistema",
            passwordHash: hashedPassword,
            role: "ADMIN",
            status: "ACTIVE",
        },
    });

    console.log("✅ Admin creado o verificado:", admin.email);
}

main()
    .catch((e) => {
        console.error("❌ Error en seed:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });