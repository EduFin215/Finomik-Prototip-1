import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu } from 'lucide-react';
import { SidebarProfesor, type ProfessorView } from '../components/SidebarProfesor';
import { ProfessorDashboard } from './professor/ProfessorDashboard';
import { CohortView } from './professor/CohortView';
import { AlertsView } from './professor/AlertsView';
import { StudentDetailView } from './professor/StudentDetailView';
import { InterventionView } from './professor/InterventionView';

export const ProfessorArea: React.FC = () => {
  const [currentView, setCurrentView] = useState<ProfessorView>('dashboard');
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [preselectedStudentIdForIntervention, setPreselectedStudentIdForIntervention] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavigate = (view: ProfessorView) => {
    if (view === 'intervention') setPreselectedStudentIdForIntervention(null);
    setCurrentView(view);
  };

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <ProfessorDashboard onNavigate={handleNavigate} />;
      case 'cohort':
        return (
          <CohortView
            onSelectStudent={(studentId) => {
              setSelectedStudentId(studentId);
              handleNavigate('student');
            }}
          />
        );
      case 'alerts':
        return <AlertsView />;
      case 'student':
        return (
          <StudentDetailView
            studentId={selectedStudentId}
            onBack={() => handleNavigate('cohort')}
            onNavigateToIntervention={(studentId) => {
              setPreselectedStudentIdForIntervention(studentId);
              handleNavigate('intervention');
            }}
          />
        );
      case 'intervention':
        return (
          <InterventionView
            preselectedStudentId={preselectedStudentIdForIntervention}
            onClearPreselection={() => setPreselectedStudentIdForIntervention(null)}
          />
        );
      default:
        return <ProfessorDashboard onNavigate={setCurrentView} />;
    }
  };

  const getPageTitle = () => {
    switch (currentView) {
      case 'dashboard': return 'Dashboard Principal';
      case 'cohort': return 'Vista de Clase';
      case 'alerts': return 'Centro de Alertas';
      case 'student': return 'Vista de Alumno';
      case 'intervention': return 'Intervención docente';
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-finomik-primary selection:bg-finomik-blue-soft">
      <SidebarProfesor
        currentView={currentView}
        onNavigate={handleNavigate}
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
      <div className="flex-1 flex flex-col min-w-0 w-full md:ml-64">
        {/* Barra superior móvil: hamburger + título + clase */}
        <header className="md:hidden sticky top-0 z-20 flex items-center gap-3 px-4 py-3 bg-white border-b border-[color:var(--finomik-blue-6)] shadow-sm">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Abrir menú"
            className="p-2 rounded-lg bg-finomik-blue-soft/50 text-finomik-primary hover:bg-finomik-blue-soft"
          >
            <Menu size={24} />
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="text-base font-bold text-finomik-primary truncate">{getPageTitle()}</h1>
            <p className="text-xs text-[color:var(--finomik-blue-5)]">Clase: 4º ESO A</p>
          </div>
        </header>

        <main className="flex-1 p-3 sm:p-4 md:p-6 lg:p-8 min-w-0">
          <div className="max-w-[1400px] mx-auto">
            <div className="mb-4 md:mb-6 hidden md:block">
              <h2 className="text-xl font-bold text-finomik-primary">{getPageTitle()}</h2>
              <p className="text-sm text-[color:var(--finomik-blue-5)]">Clase: 4º ESO A</p>
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentView}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
};
