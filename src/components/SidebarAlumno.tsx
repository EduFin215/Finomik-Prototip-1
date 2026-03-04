import React from 'react';
import { useGame, Screen } from '../context/GameContext';
import { LayoutDashboard, Globe, TrendingUp, Newspaper, Mail, User, Award } from 'lucide-react';
import { getMessagesForStudent } from '../data/mockNotifications';
import finomikLogo from '../assets/finomik-logo.png';

const MOCK_STUDENT_ID = '1';

const navItems: { id: Screen; icon: React.ElementType; label: string }[] = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Inicio' },
  { id: 'world', icon: Globe, label: 'Aprender' },
  { id: 'invest', icon: TrendingUp, label: 'Simulador de inversión' },
  { id: 'news', icon: Newspaper, label: 'Diario' },
  { id: 'inbox', icon: Mail, label: 'Buzón' },
  { id: 'profile', icon: User, label: 'Perfil' },
  { id: 'certificate', icon: Award, label: 'Certificado' },
];

export const SidebarAlumno = () => {
  const { currentScreen, setCurrentScreen } = useGame();
  const unreadCount = getMessagesForStudent(MOCK_STUDENT_ID).filter((m) => !m.read).length;

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-finomik-primary text-white flex flex-col z-40 shadow-xl">
      <div className="p-6 border-b border-white/20 flex justify-center">
        <img
          src={finomikLogo}
          alt="Finomik logo"
          className="h-12 w-auto object-contain"
        />
      </div>
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        {navItems.map((item) => {
          const isInvestGroup =
            item.id === 'invest' &&
            (currentScreen === 'invest' ||
              currentScreen === 'investPortfolio' ||
              currentScreen === 'investMarket');
          const isActive = currentScreen === item.id || isInvestGroup;
          const Icon = item.icon;
          const showBadge = item.id === 'inbox' && unreadCount > 0;
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
              <span className="relative">
                <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                {showBadge && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold leading-none px-1">
                    {unreadCount}
                  </span>
                )}
              </span>
              <span className="text-sm">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};
