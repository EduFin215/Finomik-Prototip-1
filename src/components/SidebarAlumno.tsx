import React from 'react';
import { useGame, Screen } from '../context/GameContext';
import { LayoutDashboard, Globe, TrendingUp, Newspaper, User, Award } from 'lucide-react';

const navItems: { id: Screen; icon: React.ElementType; label: string }[] = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Inicio' },
  { id: 'world', icon: Globe, label: 'Aprender' },
  { id: 'invest', icon: TrendingUp, label: 'Invertir' },
  { id: 'news', icon: Newspaper, label: 'Diario' },
  { id: 'profile', icon: User, label: 'Perfil' },
  { id: 'certificate', icon: Award, label: 'Certificado' },
];

export const SidebarAlumno = () => {
  const { currentScreen, setCurrentScreen } = useGame();

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-finomik-primary text-white flex flex-col z-40 shadow-xl">
      <div className="p-5 border-b border-white/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
            <span className="font-bold text-lg text-white">F</span>
          </div>
          <div>
            <h1 className="font-bold text-lg text-white leading-tight">Finomik</h1>
            <p className="text-[10px] font-semibold text-white/80 uppercase tracking-wider">Alumno</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        {navItems.map((item) => {
          const isActive = currentScreen === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentScreen(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left font-semibold transition-colors mb-1 ${
                isActive
                  ? 'bg-white text-finomik-primary'
                  : 'text-white/90 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-sm">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};
