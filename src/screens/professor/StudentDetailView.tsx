import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ResponsiveLine } from '@nivo/line';
import { ArrowLeft, AlertCircle, HeartPulse, TrendingUp, BookOpen, CheckCircle, Calendar, Edit3 } from 'lucide-react';
import { mockStudents, mockAlerts, getStudentProfile } from '../../data/mockProfessorData';
import { AlertsPanel } from '../../components/professor/AlertsPanel';
import {
  lineChartDefaults,
  lineChartTooltipClass,
} from '../../utils/lineChartTheme';

interface StudentDetailViewProps {
  studentId: string | null;
  onBack: () => void;
  onNavigateToIntervention?: (studentId: string) => void;
}

export const StudentDetailView: React.FC<StudentDetailViewProps> = ({ studentId, onBack, onNavigateToIntervention }) => {
  const student = mockStudents.find((s) => s.id === studentId) ?? mockStudents[0];
  const studentAlerts = mockAlerts.filter((a) => a.studentId === student.id);
  const profile = getStudentProfile(student.id, student);
  const [teacherNotes, setTeacherNotes] = useState(profile.teacherNotes);
  useEffect(() => {
    setTeacherNotes(profile.teacherNotes);
  }, [profile.studentId, profile.teacherNotes]);

  const progressPercent = Math.round(
    (Number(student.progress.currentLesson) / Number(student.progress.totalLessons)) * 100
  );

  const healthLabel =
    student.healthScore >= 75 ? 'Buena' : student.healthScore >= 50 ? 'Media' : 'Crítica';

  const healthLineData = [
    {
      id: 'salud',
      data: profile.healthHistory.map((p) => ({ x: p.period, y: p.health })),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4 sm:space-y-6"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center bg-white p-3 sm:p-4 rounded-xl border border-[color:var(--finomik-blue-6)] shadow-sm">
        <div className="flex flex-wrap items-center gap-2 sm:gap-4 min-w-0">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-finomik-primary bg-finomik-blue-soft/40 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg hover:bg-finomik-blue-soft/60 transition-colors shrink-0"
          >
            <ArrowLeft size={16} />
            Volver a la clase
          </button>
          {onNavigateToIntervention && (
            <button
              type="button"
              onClick={() => onNavigateToIntervention(student.id)}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-finomik-primary bg-white border border-[color:var(--finomik-blue-6)] px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg hover:bg-finomik-blue-soft/40 transition-colors shrink-0"
            >
              <Edit3 size={16} />
              Ajuste excepcional
            </button>
          )}
          <div className="min-w-0 w-full sm:w-auto">
            <h2 className="heading-2 text-lg sm:text-xl text-finomik-primary truncate">Vista de Alumno</h2>
            <p className="text-xs sm:text-sm text-[color:var(--finomik-blue-5)] truncate">
              Perfil y evolución de <span className="font-semibold">{student.name}</span>.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex flex-col items-start sm:items-end">
            <span className="text-[10px] sm:text-[11px] uppercase font-semibold text-[color:var(--finomik-blue-5)]">
              Progreso programa
            </span>
            <span className="text-sm font-bold text-finomik-primary">
              {student.progress.currentLesson}/{student.progress.totalLessons} lecciones
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl sm:rounded-2xl border border-[color:var(--finomik-blue-6)] shadow-sm p-4 sm:p-5 flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wider text-[color:var(--finomik-blue-5)]">
                  Resumen del alumno
                </p>
                <h3 className="text-lg sm:text-xl font-bold text-finomik-primary mt-1 truncate">{student.name}</h3>
              </div>
              <div className="flex flex-wrap gap-2 sm:flex-col sm:items-end">
                <div className="inline-flex items-center gap-2 bg-finomik-blue-soft/40 px-3 py-1.5 rounded-full text-[11px] font-semibold text-finomik-primary">
                  <BookOpen size={14} />
                  {student.progress.onTrack ? 'Al día con la clase' : 'Con retraso'}
                </div>
                <div className="inline-flex items-center gap-2 bg-white border border-[color:var(--finomik-blue-6)] px-3 py-1.5 rounded-full text-[11px] font-semibold text-[color:var(--finomik-blue-5)]">
                  <AlertCircle size={14} className={studentAlerts.length ? 'text-finomik-error' : 'text-[color:var(--finomik-blue-5)]'} />
                  {studentAlerts.length ? `${studentAlerts.length} alertas activas` : 'Sin alertas activas'}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <div className="flex items-center justify-between bg-finomik-success-soft/60 rounded-2xl px-4 py-3 border border-finomik-success/20">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-finomik-success">
                    Salud financiera
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-finomik-primary">
                      {student.healthScore}
                    </span>
                    <span className="text-xs font-semibold text-[color:var(--finomik-blue-5)]">
                      /100 · {healthLabel}
                    </span>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center">
                  <HeartPulse size={20} className="text-finomik-success" />
                </div>
              </div>

              <div className="flex items-center justify-between bg-finomik-blue-soft/40 rounded-2xl px-4 py-3 border border-[color:var(--finomik-blue-6)]">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-[color:var(--finomik-blue-5)]">
                    Progreso del curso
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-finomik-primary">
                      {progressPercent}%
                    </span>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center">
                  <TrendingUp size={20} className="text-finomik-primary" />
                </div>
              </div>

              <div className="flex items-center justify-between bg-white rounded-2xl px-4 py-3 border border-[color:var(--finomik-blue-6)]">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-[color:var(--finomik-blue-5)]">
                    Reputación en clase
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-finomik-primary">
                      {student.reputation}
                    </span>
                    <span className="text-xs font-semibold text-[color:var(--finomik-blue-5)]">
                      puntos
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-[color:var(--finomik-blue-5)]">
                Evolución en la clase
              </p>
              <div className="w-full bg-[color:var(--finomik-blue-6)] h-2 rounded-full overflow-hidden">
                <div
                  className="bg-finomik-primary h-full rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="text-[11px] text-[color:var(--finomik-blue-5)]">
                Última lección completada: {student.progress.currentLesson} de{' '}
                {student.progress.totalLessons}. Este resumen es orientativo para identificar
                rápidamente su situación.
              </p>
            </div>

            {/* Health over time */}
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-[color:var(--finomik-blue-5)]">
                Salud financiera (evolución)
              </p>
              <div className="h-[180px] sm:h-[200px] w-full min-w-0">
                <ResponsiveLine
                  data={healthLineData}
                  margin={{ top: 8, right: 24, bottom: 36, left: 40 }}
                  xScale={{ type: 'point' }}
                  yScale={{ type: 'linear', min: 0, max: 100 }}
                  curve={lineChartDefaults.curve}
                  defs={lineChartDefaults.defs}
                  fill={lineChartDefaults.fill}
                  theme={lineChartDefaults.theme}
                  axisTop={null}
                  axisRight={null}
                  axisBottom={{
                    tickSize: 0,
                    tickPadding: 8,
                    tickRotation: -25,
                  }}
                  axisLeft={{
                    tickSize: 0,
                    tickPadding: 8,
                    tickValues: [0, 25, 50, 75, 100],
                    format: (v) => `${v}%`,
                  }}
                  enableGridX={lineChartDefaults.enableGridX}
                  enableGridY={lineChartDefaults.enableGridY}
                  colors={lineChartDefaults.colors}
                  lineWidth={lineChartDefaults.lineWidth}
                  pointSize={lineChartDefaults.pointSize}
                  pointColor={lineChartDefaults.pointColor}
                  pointBorderWidth={lineChartDefaults.pointBorderWidth}
                  pointBorderColor={lineChartDefaults.pointBorderColor}
                  enableArea={lineChartDefaults.enableArea}
                  areaOpacity={lineChartDefaults.areaOpacity}
                  isInteractive={lineChartDefaults.isInteractive}
                  useMesh={lineChartDefaults.useMesh}
                  tooltip={({ point }) => (
                    <span className={lineChartTooltipClass}>
                      {point.data.x}: {Number(point.data.y)}%
                    </span>
                  )}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            <div className="bg-white rounded-2xl border border-[color:var(--finomik-blue-6)] shadow-sm p-5">
              <h3 className="font-bold text-finomik-primary text-lg mb-3 flex items-center gap-2">
                <CheckCircle size={18} className="text-finomik-success" />
                Módulos completados
              </h3>
              {profile.completedModules.length > 0 ? (
                <ul className="space-y-2 max-h-[220px] overflow-y-auto">
                  {profile.completedModules.map((m) => (
                    <li
                      key={m.id}
                      className="flex items-center justify-between gap-2 text-sm py-2 border-b border-[color:var(--finomik-blue-6)] last:border-0"
                    >
                      <span className="font-medium text-finomik-primary truncate">{m.name}</span>
                      <span className="text-[color:var(--finomik-blue-5)] text-xs shrink-0">
                        {m.completedAt}
                        {m.score != null && ` · ${m.score}%`}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-[color:var(--finomik-blue-5)]">Aún no ha completado módulos.</p>
              )}
            </div>
            <div className="bg-white rounded-2xl border border-[color:var(--finomik-blue-6)] shadow-sm p-5">
              <h3 className="font-bold text-finomik-primary text-lg mb-3">Notas del profesor</h3>
              <textarea
                value={teacherNotes}
                onChange={(e) => setTeacherNotes(e.target.value)}
                placeholder="Añade observaciones sobre este alumno..."
                className="w-full min-h-[120px] p-3 rounded-xl border border-[color:var(--finomik-blue-6)] text-sm text-finomik-primary placeholder:text-[color:var(--finomik-blue-5)] focus:outline-none focus:ring-2 focus:ring-[color:var(--finomik-blue-6)] resize-y"
              />
              <p className="text-[11px] text-[color:var(--finomik-blue-5)] mt-2">
                Las notas son solo para tu uso (en una app real se guardarían en el servidor).
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[color:var(--finomik-blue-6)] shadow-sm p-5">
            <h3 className="font-bold text-finomik-primary text-lg mb-3 flex items-center gap-2">
              <Calendar size={18} className="text-finomik-primary" />
              Asistencia / conexión (últimos 14 días)
            </h3>
            <div className="flex flex-wrap gap-2">
              {profile.attendance.map((entry) => (
                <div
                  key={entry.date}
                  className="flex flex-col items-center gap-0.5"
                  title={entry.connected ? `Conectado · ${entry.lessonsCompleted ?? 0} lecciones` : 'Sin conexión'}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium ${
                      entry.connected
                        ? 'bg-finomik-success/20 text-finomik-success border border-finomik-success/40'
                        : 'bg-[color:var(--finomik-blue-6)]/50 text-[color:var(--finomik-blue-5)] border border-[color:var(--finomik-blue-6)]'
                    }`}
                  >
                    {entry.connected ? '✓' : '—'}
                  </div>
                  <span className="text-[10px] text-[color:var(--finomik-blue-5)]">{entry.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[color:var(--finomik-blue-6)] shadow-sm p-5">
            <h3 className="font-bold text-finomik-primary text-lg mb-2">Comportamiento reciente</h3>
            <p className="text-sm text-[color:var(--finomik-blue-5)] mb-3">
              Este bloque puede conectarse en el futuro con eventos reales del juego (decisiones,
              tests, conexiones, etc.). Por ahora se muestran ejemplos estáticos.
            </p>
            <ul className="space-y-2 text-sm text-[color:var(--finomik-blue-2)]">
              <li>· Ha completado recientemente varias lecciones sin errores significativos.</li>
              <li>· Utiliza el simulador de inversión de forma recurrente.</li>
              <li>· Mantiene una racha estable de conexiones semanales.</li>
            </ul>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-4 min-w-0">
          <AlertsPanel alerts={studentAlerts} />
        </div>
      </div>
    </motion.div>
  );
};

