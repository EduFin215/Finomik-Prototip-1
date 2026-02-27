import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Home, Users, AlertCircle, Edit3, LogOut, X } from 'lucide-react';

export type ProfessorView = 'dashboard' | 'cohort' | 'alerts' | 'student' | 'intervention';

const navItems: { id: ProfessorView; icon: React.ElementType; label: string }[] = [
  { id: 'dashboard', icon: Home, label: 'Inicio' },
  { id: 'cohort', icon: Users, label: 'Mi Clase' },
  { id: 'alerts', icon: AlertCircle, label: 'Alertas' },
  { id: 'intervention', icon: Edit3, label: 'Intervención' },
];

interface SidebarProfesorProps {
  currentView: ProfessorView;
  onNavigate: (view: ProfessorView) => void;
  /** En móvil: si está abierto. En desktop se ignora. */
  isOpen?: boolean;
  /** En móvil: cerrar el sidebar (p. ej. al hacer clic en overlay o en un ítem). */
  onClose?: () => void;
}

export const SidebarProfesor = ({ currentView, onNavigate, isOpen = false, onClose }: SidebarProfesorProps) => {
  const { logout } = useAuth();

  const handleNav = (view: ProfessorView) => {
    onNavigate(view);
    onClose?.();
  };

  return (
    <>
      {/* Overlay en móvil cuando el sidebar está abierto */}
      <div
        role="button"
        tabIndex={0}
        aria-label="Cerrar menú"
        onClick={onClose}
        onKeyDown={(e) => e.key === 'Enter' && onClose?.()}
        className={`fixed inset-0 bg-black/50 z-30 transition-opacity md:hidden md:pointer-events-none ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      <aside
        className={`
          fixed left-0 top-0 bottom-0 w-64 max-w-[85vw] bg-finomik-primary text-white flex flex-col z-40 shadow-xl
          transition-transform duration-300 ease-out
          -translate-x-full md:translate-x-0
          ${isOpen ? 'translate-x-0' : ''}
        `}
      >
        <div className="p-4 sm:p-5 border-b border-white/20 flex items-center justify-between gap-2">
          <button
            onClick={() => handleNav('dashboard')}
            className="flex items-center gap-3 w-full text-left rounded-xl hover:bg-white/10 transition-colors -m-2 p-2 min-w-0"
          >
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <span className="font-bold text-lg text-white">F</span>
            </div>
            <div className="min-w-0">
              <h1 className="font-bold text-base sm:text-lg text-white leading-tight truncate">Finomik</h1>
              <p className="text-[10px] font-semibold text-white/80 uppercase tracking-wider">Profesor</p>
            </div>
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar menú"
            className="md:hidden p-2 rounded-lg hover:bg-white/10 text-white shrink-0"
          >
            <X size={22} />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          {navItems.map((item) => {
            const isActive = currentView === item.id || (currentView === 'student' && item.id === 'cohort');
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`w-full flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl text-left font-semibold transition-colors mb-1 text-sm ${
                  isActive
                    ? 'bg-white text-finomik-primary'
                    : 'text-white/90 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} className="shrink-0" />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>
        <div className="p-3 border-t border-white/20">
          <button
            onClick={() => {
              logout();
              onClose?.();
            }}
            className="w-full flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl text-left font-semibold text-white/90 hover:bg-white/10 hover:text-white transition-colors text-sm"
          >
            <LogOut size={20} />
            <span>Salir</span>
          </button>
        </div>
      </aside>
    </>
  );
};
