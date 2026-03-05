export type AcademicLevel = "primaria" | "secundaria";
export type ShiftType = "morning" | "afternoon" | "night" | "full_day";

export type Subject = {
    id: string;
    name: string; // "Matemáticas"
    code: string; // "MAT"
    color: string; // Para el horario visual (Ej: #EF4444 para rojas)
    weeklyHours: number; // Carga horaria (Ej: 4 periodos/semana)
};

export type Grade = {
    id: string;
    name: string; // "Primero", "Sexto"
    numericOrder: number; // 1, 2... 6
    level: AcademicLevel;
};

// La configuración de un curso específico en un turno específico
export type AcademicOffering = {
    id: string;
    gradeId: string;
    shift: ShiftType;
    parallel: string; // "A", "Unico"
    subjects: Subject[]; // Malla curricular
};

export type ScheduleSlot = {
    id: string;
    day: "LUN" | "MAR" | "MIE" | "JUE" | "VIE";
    startTime: string; // "08:00"
    endTime: string;   // "08:45"
    subjectId?: string; // Si es null, es hora libre
};