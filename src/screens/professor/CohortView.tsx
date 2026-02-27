import React, { useState } from 'react';
import { motion } from 'motion/react';
import { CohortSummary } from '../../components/professor/CohortSummary';
import { AlertsPanel } from '../../components/professor/AlertsPanel';
import { StudentList } from '../../components/professor/StudentList';
import { LessonComparisonChart } from '../../components/professor/LessonComparisonChart';
import { mockClassMetrics, mockAlerts, mockStudents, mockLessonDecisions } from '../../data/mockProfessorData';
import { FileClock, Users, AlertCircle, Download } from 'lucide-react';

type ViewState = 'normal' | 'empty' | 'not_activated' | 'finished';

interface CohortViewProps {
  onSelectStudent?: (studentId: string) => void;
}

export const CohortView: React.FC<CohortViewProps> = ({ onSelectStudent }) => {
  const [viewState, setViewState] = useState<ViewState>('normal');

  const renderContent = () => {
    switch (viewState) {
      case 'not_activated':
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-2xl border border-dashed border-[color:var(--finomik-blue-6)] shadow-sm">
            <div className="w-16 h-16 bg-finomik-warning-soft rounded-full flex items-center justify-center mb-4 text-finomik-warning">
              <FileClock size={32} />
            </div>
            <h3 className="text-xl font-bold text-finomik-primary mb-2">Programa No Activado</h3>
            <p className="text-[color:var(--finomik-blue-5)] max-w-md">El programa formativo para esta clase aún no ha comenzado. Configura las fechas de inicio para activar el panel.</p>
            <button className="mt-6 bg-finomik-primary text-white px-6 py-2.5 rounded-xl font-medium hover:opacity-90 transition-opacity shadow-sm">
              Configurar Programa
            </button>
          </motion.div>
        );

      case 'empty':
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center p-12 text-center bg-finomik-blue-soft/30 rounded-2xl border border-dashed border-[color:var(--finomik-blue-6)] shadow-sm">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 text-finomik-primary shadow-sm">
              <Users size={32} />
            </div>
            <h3 className="text-xl font-bold text-finomik-primary mb-2">No hay alumnos matriculados</h3>
            <p className="text-[color:var(--finomik-blue-5)] max-w-md">Para ver estadísticas y analizar las decisiones, primero necesitas añadir alumnos a tu clase.</p>
            <button className="mt-6 bg-finomik-primary text-white px-6 py-2.5 rounded-xl font-medium hover:opacity-90 transition-opacity shadow-sm">
              Importar Alumnos
            </button>
          </motion.div>
        );

      case 'finished':
      case 'normal':
        return (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 sm:space-y-6">
            {viewState === 'finished' && (
              <div className="bg-finomik-success-soft border border-finomik-success/20 text-finomik-success px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl flex items-center gap-2 sm:gap-3 text-sm sm:text-base">
                <AlertCircle size={18} className="shrink-0" />
                <span><strong className="font-semibold">Programa Finalizado.</strong> Estás viendo los datos en modo histórico.</span>
              </div>
            )}

            {/* 1. Resumen de la clase (métricas en una sola fila) */}
            <CohortSummary metrics={mockClassMetrics} />

            {/* 2. Contenido principal: lista de alumnos + alertas en paralelo */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
              <div className="lg:col-span-2">
                <StudentList
                  students={mockStudents}
                  onSelectStudent={(student) => onSelectStudent?.(student.id)}
                />
              </div>
              <div className="lg:col-span-1">
                <AlertsPanel alerts={mockAlerts} />
              </div>
            </div>

            {/* 3. Gráfico de decisiones de la clase (ancho completo debajo) */}
            <LessonComparisonChart data={mockLessonDecisions} />
          </motion.div>
        );
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* State Controllers for Dev/Demo purposes */}
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center bg-white p-3 sm:p-4 rounded-xl border border-[color:var(--finomik-blue-6)] shadow-sm">
        <div className="min-w-0">
          <h2 className="heading-2 text-lg sm:text-xl text-finomik-primary">Vista de Clase</h2>
          <p className="text-xs sm:text-sm text-[color:var(--finomik-blue-5)]">Métricas y progreso general de la clase.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
            <select
              value={viewState}
              onChange={(e) => setViewState(e.target.value as ViewState)}
              className="w-full sm:w-auto text-sm border border-[color:var(--finomik-blue-6)] rounded-lg bg-white text-finomik-primary px-3 py-2 outline-none focus:ring-2 focus:ring-[color:var(--finomik-blue-6)]"
            >
              <option value="normal">Estado: Normal</option>
              <option value="empty">Estado: Sin Alumnos</option>
              <option value="not_activated">Estado: No Activado</option>
              <option value="finished">Estado: Finalizado</option>
            </select>
            <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-finomik-primary text-white text-sm font-medium px-4 py-2.5 rounded-xl hover:opacity-90 transition-opacity shadow-sm">
              <Download size={16} />
              <span>Exportar Informe</span>
            </button>
        </div>
      </div>
      
      {renderContent()}
    </div>
  );
};
