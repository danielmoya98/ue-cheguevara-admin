import { studentRepository } from "../repositories/student.repository";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { enrollmentSchema, StudentProfileInput } from "../validations/student.schema";

export const studentService = {
    getStudents: async (query?: string, classroomId?: string) => {
        return await studentRepository.findAll(query, classroomId);
    },

    getStudentById: async (id: string) => {
        return await studentRepository.findById(id);
    },

    // Lógica compleja: Inscribir estudiante validando cupos
    enrollStudent: async (input: z.infer<typeof enrollmentSchema>) => {
        // 1. Validar que el aula existe y verificar capacidad
        const classroom = await prisma.classroom.findUnique({
            where: { id: input.classroomId },
            include: {
                _count: {
                    select: { enrollments: { where: { academicYear: input.academicYear, status: "ACTIVE" } } }
                }
            }
        });

        if (!classroom) throw new Error("Aula no encontrada");

        // Regla: No sobrepasar la capacidad del aula
        if (classroom._count.enrollments >= classroom.capacity) {
            throw new Error(`El aula ${classroom.name} está llena (Capacidad máxima: ${classroom.capacity}).`);
        }

        // 2. Realizar inscripción
        return await studentRepository.enrollStudent(input.studentId, input.classroomId, input.academicYear);
    },

    // Actualizar el perfil médico/personal
    updateProfile: async (studentId: string, input: StudentProfileInput) => {
        return await prisma.studentProfile.update({
            where: { id: studentId },
            data: input
        });
    },

    // 1. Obtener usuarios STUDENT que aún no tienen perfil creado
    getOrphanStudents: async () => {
        return await prisma.user.findMany({
            where: {
                role: "STUDENT",
                // CORRECCIÓN: Prisma lo detectó como plural/lista, así que usamos 'none: {}'
                // para buscar los que tienen la lista de perfiles vacía.
                studentProfiles: {
                    none: {}
                }
            },
            select: { id: true, name: true, email: true },
            orderBy: { name: 'asc' }
        });
    },

    // 2. Crear el perfil inicial del estudiante vinculándolo a un User existente
    createProfile: async (userId: string, input: StudentProfileInput) => {
        // Verificar que el usuario exista y sea estudiante
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user || user.role !== "STUDENT") {
            throw new Error("Usuario inválido o no tiene el rol de Estudiante");
        }

        // Verificar que el Carnet de Identidad no esté duplicado
        const existingCI = await prisma.studentProfile.findUnique({ where: { documentId: input.documentId } });
        if (existingCI) {
            throw new Error(`El documento ${input.documentId} ya está registrado a otro estudiante.`);
        }

        return await prisma.studentProfile.create({
            data: {
                userId: userId, // Enlazamos el perfil al User
                ...input
            }
        });
    }
};