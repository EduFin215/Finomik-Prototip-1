import { mockStudents } from './mockProfessorData';

export interface NotificationMessage {
  id: string;
  from: string;
  fromId: string; // 'profesor' or student id
  to: string;     // student id, 'all' (broadcast), or 'profesor'
  subject: string;
  body: string;
  date: string;
  read: boolean;
}

let nextId = 9;

const mockMessages: NotificationMessage[] = [
  {
    id: '1',
    from: 'Profesor García',
    fromId: 'profesor',
    to: 'all',
    subject: 'Bienvenidos al segundo trimestre',
    body: 'Espero que hayáis descansado bien durante las vacaciones. Este trimestre trabajaremos con el simulador de inversión y el fondo de ahorro. ¡Ánimo a todos!',
    date: '2026-03-03T09:00:00Z',
    read: false,
  },
  {
    id: '2',
    from: 'Profesor García',
    fromId: 'profesor',
    to: '2',
    subject: 'Revisión de tu progreso',
    body: 'Carlos, he visto que llevas unas lecciones de retraso. ¿Necesitas ayuda con algún tema? Podemos quedar en tutoría el jueves.',
    date: '2026-03-02T14:30:00Z',
    read: false,
  },
  {
    id: '3',
    from: 'Profesor García',
    fromId: 'profesor',
    to: '6',
    subject: 'Plan de recuperación',
    body: 'Marcos, te he preparado un plan de recuperación para que puedas ponerte al día con el resto de la clase. Revisa los módulos 1 y 2 esta semana.',
    date: '2026-03-01T11:00:00Z',
    read: true,
  },
  {
    id: '4',
    from: 'Profesor García',
    fromId: 'profesor',
    to: 'all',
    subject: 'Recordatorio: entrega del ejercicio práctico',
    body: 'Os recuerdo que el viernes es la fecha límite para entregar el ejercicio práctico del módulo 3. Aseguraos de completar todas las decisiones del simulador.',
    date: '2026-02-28T08:15:00Z',
    read: true,
  },
  {
    id: '5',
    from: 'Profesor García',
    fromId: 'profesor',
    to: '5',
    subject: 'Excelente trabajo en el último módulo',
    body: 'Sofía, quería felicitarte por tu rendimiento en el módulo de ahorro. Has demostrado una gran comprensión de los conceptos. ¡Sigue así!',
    date: '2026-02-27T16:45:00Z',
    read: true,
  },
  // Student -> Professor messages
  {
    id: '6',
    from: 'Ana García',
    fromId: '1',
    to: 'profesor',
    subject: 'Duda sobre el módulo 3',
    body: 'Hola profesor, tengo una duda sobre la lección de presupuestos del módulo 3. ¿El ejercicio práctico incluye también el apartado de gastos variables? Gracias.',
    date: '2026-03-03T10:15:00Z',
    read: true,
  },
  {
    id: '7',
    from: 'Carlos López',
    fromId: '2',
    to: 'profesor',
    subject: 'Re: Revisión de tu progreso',
    body: 'Gracias por escribirme, profesor. Sí, he tenido problemas con el tema de inversiones. Me vendría bien quedar el jueves en tutoría.',
    date: '2026-03-02T16:00:00Z',
    read: false,
  },
  {
    id: '8',
    from: 'Laura Gómez',
    fromId: '7',
    to: 'profesor',
    subject: 'Pregunta sobre el certificado',
    body: 'Buenos días, profesor. ¿Cuándo podré ver mi certificado si completo todos los módulos antes de final de mes? ¿Hay algún plazo específico?',
    date: '2026-03-01T09:30:00Z',
    read: false,
  },
];

const byDateDesc = (a: NotificationMessage, b: NotificationMessage) =>
  new Date(b.date).getTime() - new Date(a.date).getTime();

/** Messages received by a student (from professor, individual or broadcast). */
export function getMessagesForStudent(studentId: string): NotificationMessage[] {
  return mockMessages
    .filter((m) => m.fromId === 'profesor' && (m.to === studentId || m.to === 'all'))
    .sort(byDateDesc);
}

/** Messages sent by a student. */
export function getSentByStudent(studentId: string): NotificationMessage[] {
  return mockMessages.filter((m) => m.fromId === studentId).sort(byDateDesc);
}

/** Messages sent by the professor (to students or broadcast). */
export function getSentByProfessor(): NotificationMessage[] {
  return mockMessages.filter((m) => m.fromId === 'profesor').sort(byDateDesc);
}

/** Messages received by the professor (from students). */
export function getMessagesForProfessor(): NotificationMessage[] {
  return mockMessages.filter((m) => m.to === 'profesor').sort(byDateDesc);
}

export function sendMessage(msg: Omit<NotificationMessage, 'id'>): NotificationMessage {
  const newMsg: NotificationMessage = { ...msg, id: String(nextId++) };
  mockMessages.unshift(newMsg);
  return newMsg;
}

export function getRecipientName(to: string): string {
  if (to === 'all') return 'Toda la clase';
  if (to === 'profesor') return 'Profesor García';
  const student = mockStudents.find((s) => s.id === to);
  return student?.name ?? 'Alumno desconocido';
}
