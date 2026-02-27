export type HealthRange = 'good' | 'average' | 'poor';
export type AlertSeverity = 'info' | 'attention' | 'critical';

export interface StudentStats {
  id: string;
  name: string;
  progress: {
    currentLesson: parseInt;
    totalLessons: parseInt;
    onTrack: boolean;
  };
  healthScore: number;
  healthRange: HealthRange;
  reputation: number;
  activeAlertsCount: number;
}

export interface Alert {
  id: string;
  studentId: string;
  studentName: string;
  severity: AlertSeverity;
  description: string;
  date: string;
}

export interface ClassMetrics {
  averageHealth: number;
  healthDistribution: {
    good: number;
    average: number;
    poor: number;
  };
  percentOnTrack: number;
  currentSession: string;
}

export interface LessonDecisionData {
  lessonId: string;
  lessonName: string;
  decisions: {
    optionName: string;
    studentCount: number;
  }[];
}

/** One data point for health over time (e.g. weekly) */
export interface HealthHistoryPoint {
  period: string; // e.g. "Sem 1", "Sem 2"
  health: number;
}

/** Completed module / lesson for a student */
export interface CompletedModule {
  id: string;
  name: string;
  completedAt: string; // e.g. "Hace 2 semanas"
  score?: number; // optional quiz/assessment score
}

/** Single attendance / connection event */
export interface AttendanceEntry {
  date: string; // e.g. "2025-02-20"
  label: string; // e.g. "Lun 20"
  connected: boolean;
  lessonsCompleted?: number;
}

/** Extended profile for individual student view */
export interface StudentProfile {
  studentId: string;
  healthHistory: HealthHistoryPoint[];
  completedModules: CompletedModule[];
  teacherNotes: string;
  attendance: AttendanceEntry[];
}

/** Changes applied by a teacher intervention (subset of student fields) */
export interface InterventionChanges {
  healthScore?: number;
  reputation?: number;
  onTrack?: boolean;
  currentLesson?: number;
}

/** Audit record for a single teacher intervention */
export interface InterventionRecord {
  id: string;
  studentId: string;
  studentName: string;
  timestamp: string; // ISO
  reason: string;
  changes: InterventionChanges;
  performedBy: string;
}

// === Mock Data ===

export const mockClassMetrics: ClassMetrics = {
  averageHealth: 68,
  healthDistribution: {
    good: 12,
    average: 15,
    poor: 3,
  },
  percentOnTrack: 85,
  currentSession: "Módulo 2, Lección 3",
};

export const mockStudents: StudentStats[] = [
  { id: '1', name: 'Ana García', progress: { currentLesson: 12, totalLessons: 24, onTrack: true }, healthScore: 85, healthRange: 'good', reputation: 450, activeAlertsCount: 0 },
  { id: '2', name: 'Carlos López', progress: { currentLesson: 10, totalLessons: 24, onTrack: false }, healthScore: 42, healthRange: 'poor', reputation: 120, activeAlertsCount: 2 },
  { id: '3', name: 'Elena Martínez', progress: { currentLesson: 12, totalLessons: 24, onTrack: true }, healthScore: 65, healthRange: 'average', reputation: 320, activeAlertsCount: 0 },
  { id: '4', name: 'David Ruíz', progress: { currentLesson: 11, totalLessons: 24, onTrack: true }, healthScore: 78, healthRange: 'good', reputation: 410, activeAlertsCount: 0 },
  { id: '5', name: 'Sofía Navarro', progress: { currentLesson: 12, totalLessons: 24, onTrack: true }, healthScore: 55, healthRange: 'average', reputation: 250, activeAlertsCount: 1 },
  { id: '6', name: 'Marcos Gil', progress: { currentLesson: 8, totalLessons: 24, onTrack: false }, healthScore: 30, healthRange: 'poor', reputation: 90, activeAlertsCount: 3 },
  { id: '7', name: 'Laura Gómez', progress: { currentLesson: 12, totalLessons: 24, onTrack: true }, healthScore: 92, healthRange: 'good', reputation: 500, activeAlertsCount: 0 },
  { id: '8', name: 'Jorge Díaz', progress: { currentLesson: 12, totalLessons: 24, onTrack: true }, healthScore: 60, healthRange: 'average', reputation: 300, activeAlertsCount: 0 },
];

let alertIdCounter = 1;

/**
 * Genera alertas a partir de reglas aplicadas a los datos de alumnos y métricas de clase.
 * - Salud < 25 → crítica "Salud Financiera crítica"
 * - Inactividad: 2+ lecciones por debajo del ritmo esperado → atención "Inactividad prolongada"
 * - Ritmo de clase < 50% → atención "Ritmo de clase bajo" (una por clase)
 */
export function computeAlertsFromRules(
  students: StudentStats[],
  classMetrics: ClassMetrics
): Alert[] {
  const alerts: Alert[] = [];
  const totalLessons = students[0] ? Number(students[0].progress.totalLessons) : 24;
  const expectedMinLesson = Math.floor(totalLessons * 0.45);

  for (const s of students) {
    const currentLesson = Number(s.progress.currentLesson);

    if (s.healthScore < 25) {
      alerts.push({
        id: `alert-${alertIdCounter++}`,
        studentId: s.id,
        studentName: s.name,
        severity: 'critical',
        description: 'Salud Financiera crítica.',
        date: 'Hoy',
      });
    }

    if (!s.progress.onTrack && currentLesson < expectedMinLesson) {
      alerts.push({
        id: `alert-${alertIdCounter++}`,
        studentId: s.id,
        studentName: s.name,
        severity: 'attention',
        description: 'Inactividad prolongada: lleva 2 o más lecciones sin completar respecto al ritmo esperado.',
        date: 'Ayer',
      });
    }
  }

  if (classMetrics.percentOnTrack < 50) {
    alerts.push({
      id: `alert-${alertIdCounter++}`,
      studentId: '',
      studentName: 'Clase',
      severity: 'attention',
      description: 'Ritmo de clase bajo: menos del 50% de la clase va al ritmo esperado del programa.',
      date: 'Hoy',
    });
  }

  return alerts;
}

export const mockAlerts: Alert[] = computeAlertsFromRules(mockStudents, mockClassMetrics);

export const mockLessonDecisions: LessonDecisionData[] = [
  {
    lessonId: 'l1',
    lessonName: 'Módulo 1, Lección 5: Primer Sueldo',
    decisions: [
      { optionName: 'Ahorrar 20%', studentCount: 18 },
      { optionName: 'Gastar en caprichos', studentCount: 8 },
      { optionName: 'Invertir todo', studentCount: 4 },
    ]
  },
  {
    lessonId: 'l2',
    lessonName: 'Módulo 2, Lección 2: Fondo Energencia',
    decisions: [
      { optionName: 'Fondo de 3 meses', studentCount: 15 },
      { optionName: 'Fondo de 1 mes', studentCount: 10 },
      { optionName: 'No hacer fondo', studentCount: 5 },
    ]
  }
];

// === Student profiles (individual view) ===

const MODULE_NAMES = [
  'Módulo 1: Ahorro',
  'Módulo 1: Presupuesto',
  'Módulo 1: Inversión básica',
  'Módulo 2: Fondo de emergencia',
  'Módulo 2: Deudas',
  'Módulo 2: Seguros',
  'Módulo 3: Impuestos',
  'Módulo 3: Planificación',
];

/** Generates health history for the last 8 periods (e.g. weeks). Ends at current health. */
function healthHistoryFor(studentHealth: number, studentId: string): HealthHistoryPoint[] {
  const periods = ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5', 'Sem 6', 'Sem 7', 'Sem 8'];
  const seed = studentId.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return periods.map((period, i) => {
    const variation = ((seed + i * 7) % 21) - 10;
    const value = Math.min(100, Math.max(0, studentHealth + variation - (8 - i) * 2));
    return { period, health: Math.round(value) };
  });
}

/** Completed modules for a student (based on currentLesson). */
function completedModulesFor(currentLesson: number, studentId: string): CompletedModule[] {
  const names = MODULE_NAMES.slice(0, Math.min(currentLesson, MODULE_NAMES.length));
  const seed = studentId.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return names.map((name, i) => ({
    id: `m-${i + 1}`,
    name,
    completedAt: i === names.length - 1 ? 'Hace 1 semana' : `Hace ${names.length - i} semanas`,
    score: 70 + (seed + i) % 25,
  }));
}

/** Last 14 days attendance. */
function attendanceFor(studentId: string, onTrack: boolean): AttendanceEntry[] {
  const entries: AttendanceEntry[] = [];
  const seed = studentId.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const label = d.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric' }).replace('.', '');
    const connected = onTrack ? (seed + i) % 5 !== 0 : (seed + i) % 3 !== 0;
    entries.push({
      date: d.toISOString().slice(0, 10),
      label,
      connected,
      lessonsCompleted: connected ? 1 + ((seed + i) % 3) : 0,
    });
  }
  return entries;
}

const DEFAULT_NOTES: Record<string, string> = {
  '1': 'Muy participativa. Buen dominio del simulador.',
  '2': 'Reforzar tipos de interés. Ha pedido material extra.',
  '6': 'Seguimiento cercano: bajo engagement y salud financiera.',
};

export function getStudentProfile(studentId: string, student: StudentStats): StudentProfile {
  return {
    studentId,
    healthHistory: healthHistoryFor(student.healthScore, studentId),
    completedModules: completedModulesFor(Number(student.progress.currentLesson), studentId),
    teacherNotes: DEFAULT_NOTES[studentId] ?? '',
    attendance: attendanceFor(studentId, student.progress.onTrack),
  };
}

// === Intervención docente (auditoría) ===

export const mockInterventions: InterventionRecord[] = [
  {
    id: 'int-1',
    studentId: '2',
    studentName: 'Carlos López',
    timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
    reason: 'Ajuste tras revisión de recuperación: alumno completó trabajo pendiente.',
    changes: { healthScore: 42, reputation: 120 },
    performedBy: 'Profesor',
  },
];

function healthRangeFromScore(score: number): HealthRange {
  if (score >= 75) return 'good';
  if (score >= 50) return 'average';
  return 'poor';
}

let interventionIdCounter = 2;

/** Apply an intervention: update student in mockStudents and append to mockInterventions. Returns the new record. */
export function applyIntervention(
  studentId: string,
  reason: string,
  changes: InterventionChanges,
  performedBy: string
): InterventionRecord {
  const student = mockStudents.find((s) => s.id === studentId);
  if (!student) throw new Error(`Student ${studentId} not found`);

  const studentName = student.name;

  if (changes.healthScore !== undefined) {
    student.healthScore = Math.min(100, Math.max(0, changes.healthScore));
    student.healthRange = healthRangeFromScore(student.healthScore);
  }
  if (changes.reputation !== undefined) {
    student.reputation = Math.max(0, changes.reputation);
  }
  if (changes.onTrack !== undefined) {
    student.progress.onTrack = changes.onTrack;
  }
  if (changes.currentLesson !== undefined) {
    const total = Number(student.progress.totalLessons);
    student.progress.currentLesson = Math.min(total, Math.max(0, changes.currentLesson)) as unknown as StudentStats['progress']['currentLesson'];
  }

  const record: InterventionRecord = {
    id: `int-${interventionIdCounter++}`,
    studentId,
    studentName,
    timestamp: new Date().toISOString(),
    reason,
    changes: { ...changes },
    performedBy,
  };
  mockInterventions.unshift(record);
  return record;
}
