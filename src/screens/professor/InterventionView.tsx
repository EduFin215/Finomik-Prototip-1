import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { mockStudents, mockInterventions, applyIntervention, type InterventionChanges } from '../../data/mockProfessorData';
import { HeartPulse, TrendingUp, BookOpen } from 'lucide-react';

const PERFORMED_BY = 'Profesor';

interface InterventionViewProps {
  preselectedStudentId: string | null;
  onClearPreselection: () => void;
}

export const InterventionView: React.FC<InterventionViewProps> = ({
  preselectedStudentId,
  onClearPreselection,
}) => {
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(preselectedStudentId);
  const [reason, setReason] = useState('');
  const [newHealthScore, setNewHealthScore] = useState<string>('');
  const [newReputation, setNewReputation] = useState<string>('');
  const [newOnTrack, setNewOnTrack] = useState<boolean | null>(null);
  const [newCurrentLesson, setNewCurrentLesson] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (preselectedStudentId) {
      setSelectedStudentId(preselectedStudentId);
      onClearPreselection();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only run when preselection changes
  }, [preselectedStudentId]);

  useEffect(() => {
    if (!selectedStudentId) return;
    const student = mockStudents.find((s) => s.id === selectedStudentId);
    if (!student) return;
    setNewHealthScore(String(student.healthScore));
    setNewReputation(String(student.reputation));
    setNewOnTrack(null);
    setNewCurrentLesson(String(student.progress.currentLesson));
  }, [selectedStudentId]);

  const student = selectedStudentId
    ? (mockStudents.find((s) => s.id === selectedStudentId) ?? null)
    : null;

  const handleApply = () => {
    setErrorMessage(null);
    setSuccessMessage(null);
    if (!student) return;
    if (!reason.trim()) {
      setErrorMessage('El motivo de la intervención es obligatorio.');
      return;
    }

    const changes: InterventionChanges = {};
    const health = parseInt(newHealthScore, 10);
    if (!Number.isNaN(health) && health !== student.healthScore) {
      changes.healthScore = Math.min(100, Math.max(0, health));
    }
    const rep = parseInt(newReputation, 10);
    if (!Number.isNaN(rep) && rep !== student.reputation) {
      changes.reputation = Math.max(0, rep);
    }
    if (newOnTrack !== null && newOnTrack !== student.progress.onTrack) {
      changes.onTrack = newOnTrack;
    }
    const lesson = parseInt(newCurrentLesson, 10);
    const total = Number(student.progress.totalLessons);
    if (!Number.isNaN(lesson) && lesson !== Number(student.progress.currentLesson)) {
      changes.currentLesson = Math.min(total, Math.max(0, lesson));
    }

    if (Object.keys(changes).length === 0) {
      setErrorMessage('Indica al menos un cambio respecto a los valores actuales.');
      return;
    }

    try {
      applyIntervention(student.id, reason.trim(), changes, PERFORMED_BY);
      setSuccessMessage('Intervención aplicada y registrada correctamente.');
      setReason('');
      setNewHealthScore(String(student.healthScore));
      setNewReputation(String(student.reputation));
      setNewOnTrack(null);
      setNewCurrentLesson(String(student.progress.currentLesson));
    } catch (e) {
      setErrorMessage(e instanceof Error ? e.message : 'Error al aplicar la intervención.');
    }
  };

  const interventionsToShow = selectedStudentId
    ? mockInterventions.filter((i) => i.studentId === selectedStudentId)
    : mockInterventions;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4 sm:space-y-6"
    >
      <div className="bg-white p-3 sm:p-4 rounded-xl border border-[color:var(--finomik-blue-6)] shadow-sm">
        <h2 className="heading-2 text-lg sm:text-xl text-finomik-primary">Intervención docente</h2>
        <p className="text-xs sm:text-sm text-[color:var(--finomik-blue-5)] mt-1">
          Permite modificar el perfil financiero de un alumno de forma excepcional. Todas las intervenciones quedan registradas para auditoría y transparencia.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2 space-y-4 min-w-0">
          <div className="bg-white rounded-xl sm:rounded-2xl border border-[color:var(--finomik-blue-6)] shadow-sm p-4 sm:p-5">
            <label className="block text-sm font-semibold text-finomik-primary mb-2">Seleccionar alumno</label>
            <select
              value={selectedStudentId ?? ''}
              onChange={(e) => setSelectedStudentId(e.target.value || null)}
              className="w-full border border-[color:var(--finomik-blue-6)] rounded-lg bg-white text-finomik-primary px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[color:var(--finomik-blue-6)]"
            >
              <option value="">— Elegir alumno —</option>
              {mockStudents.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {student && (
            <>
              <div className="bg-white rounded-2xl border border-[color:var(--finomik-blue-6)] shadow-sm p-5">
                <h3 className="font-bold text-finomik-primary text-lg mb-3">Datos actuales del alumno</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-finomik-blue-soft/30 border border-[color:var(--finomik-blue-6)]">
                    <HeartPulse size={18} className="text-finomik-success" />
                    <div>
                      <p className="text-[10px] uppercase font-semibold text-[color:var(--finomik-blue-5)]">Salud</p>
                      <p className="text-sm font-bold text-finomik-primary">{student.healthScore}/100</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-finomik-blue-soft/30 border border-[color:var(--finomik-blue-6)]">
                    <TrendingUp size={18} className="text-finomik-primary" />
                    <div>
                      <p className="text-[10px] uppercase font-semibold text-[color:var(--finomik-blue-5)]">Reputación</p>
                      <p className="text-sm font-bold text-finomik-primary">{student.reputation}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-finomik-blue-soft/30 border border-[color:var(--finomik-blue-6)]">
                    <BookOpen size={18} className="text-[color:var(--finomik-blue-4)]" />
                    <div>
                      <p className="text-[10px] uppercase font-semibold text-[color:var(--finomik-blue-5)]">Lección</p>
                      <p className="text-sm font-bold text-finomik-primary">{student.progress.currentLesson}/{student.progress.totalLessons}</p>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-finomik-blue-soft/30 border border-[color:var(--finomik-blue-6)]">
                    <p className="text-[10px] uppercase font-semibold text-[color:var(--finomik-blue-5)]">Al día</p>
                    <p className="text-sm font-bold text-finomik-primary">{student.progress.onTrack ? 'Sí' : 'No'}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl sm:rounded-2xl border border-[color:var(--finomik-blue-6)] shadow-sm p-4 sm:p-5 space-y-4">
                <h3 className="font-bold text-finomik-primary text-lg">Ajuste excepcional</h3>

                <div>
                  <label className="block text-sm font-semibold text-finomik-primary mb-1">Motivo de la intervención (obligatorio)</label>
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Ej.: Ajuste tras revisión de recuperación..."
                    className="w-full min-h-[80px] p-3 rounded-xl border border-[color:var(--finomik-blue-6)] text-sm text-finomik-primary placeholder:text-[color:var(--finomik-blue-5)] focus:outline-none focus:ring-2 focus:ring-[color:var(--finomik-blue-6)] resize-y"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-finomik-primary mb-1">Salud financiera (0–100)</label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={newHealthScore}
                      onChange={(e) => setNewHealthScore(e.target.value)}
                      className="w-full border border-[color:var(--finomik-blue-6)] rounded-lg px-3 py-2 text-sm text-finomik-primary focus:outline-none focus:ring-2 focus:ring-[color:var(--finomik-blue-6)]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-finomik-primary mb-1">Reputación</label>
                    <input
                      type="number"
                      min={0}
                      value={newReputation}
                      onChange={(e) => setNewReputation(e.target.value)}
                      className="w-full border border-[color:var(--finomik-blue-6)] rounded-lg px-3 py-2 text-sm text-finomik-primary focus:outline-none focus:ring-2 focus:ring-[color:var(--finomik-blue-6)]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-finomik-primary mb-1">Lección actual (0–{student.progress.totalLessons})</label>
                    <input
                      type="number"
                      min={0}
                      max={Number(student.progress.totalLessons)}
                      value={newCurrentLesson}
                      onChange={(e) => setNewCurrentLesson(e.target.value)}
                      className="w-full border border-[color:var(--finomik-blue-6)] rounded-lg px-3 py-2 text-sm text-finomik-primary focus:outline-none focus:ring-2 focus:ring-[color:var(--finomik-blue-6)]"
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 pt-4 sm:pt-6">
                    <span className="text-xs sm:text-sm font-semibold text-finomik-primary">Marcar como al día con el programa</span>
                    <div className="flex flex-wrap items-center gap-3">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="onTrack"
                        checked={newOnTrack === true}
                        onChange={() => setNewOnTrack(true)}
                        className="text-finomik-primary"
                      />
                      <span className="text-sm">Sí</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="onTrack"
                        checked={newOnTrack === false}
                        onChange={() => setNewOnTrack(false)}
                        className="text-finomik-primary"
                      />
                      <span className="text-sm">No</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setNewOnTrack(null)}
                      className="text-xs text-[color:var(--finomik-blue-5)] underline"
                    >
                      Sin cambiar
                    </button>
                    </div>
                  </div>
                </div>

                {errorMessage && (
                  <div className="p-3 rounded-xl bg-finomik-error-soft border border-finomik-error/20 text-finomik-error text-sm">
                    {errorMessage}
                  </div>
                )}
                {successMessage && (
                  <div className="p-3 rounded-xl bg-finomik-success-soft border border-finomik-success/20 text-finomik-success text-sm">
                    {successMessage}
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleApply}
                  className="w-full sm:w-auto bg-finomik-primary text-white text-sm font-semibold px-6 py-2.5 rounded-xl hover:opacity-90 transition-opacity shadow-sm"
                >
                  Aplicar intervención
                </button>
              </div>
            </>
          )}
        </div>

        <div className="lg:col-span-1 min-w-0">
          <div className="bg-white rounded-xl sm:rounded-2xl border border-[color:var(--finomik-blue-6)] shadow-sm p-4 sm:p-5 lg:sticky lg:top-24">
            <h3 className="font-bold text-finomik-primary text-lg mb-3">Registro de intervenciones</h3>
            <p className="text-xs text-[color:var(--finomik-blue-5)] mb-4">
              Últimas intervenciones{selectedStudentId ? ' de este alumno' : ''}. Todas quedan auditadas.
            </p>
            {interventionsToShow.length === 0 ? (
              <p className="text-sm text-[color:var(--finomik-blue-5)]">Aún no hay intervenciones registradas.</p>
            ) : (
              <ul className="space-y-3 max-h-[400px] overflow-y-auto">
                {interventionsToShow.map((rec) => (
                  <li
                    key={rec.id}
                    className="p-3 rounded-xl border border-[color:var(--finomik-blue-6)] bg-finomik-blue-soft/20 text-sm"
                  >
                    <p className="font-semibold text-finomik-primary">{rec.studentName}</p>
                    <p className="text-[color:var(--finomik-blue-5)] text-xs mt-1">
                      {new Date(rec.timestamp).toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' })}
                    </p>
                    <p className="text-[color:var(--finomik-blue-2)] mt-2 line-clamp-2">{rec.reason}</p>
                    <p className="text-xs text-finomik-primary mt-1">
                      {Object.entries(rec.changes)
                        .map(([k, v]) => {
                          if (k === 'onTrack') return `Al día: ${v ? 'Sí' : 'No'}`;
                          return `${k}: ${v}`;
                        })
                        .join(' · ')}
                    </p>
                    <p className="text-[10px] text-[color:var(--finomik-blue-5)] mt-1">Por {rec.performedBy}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
