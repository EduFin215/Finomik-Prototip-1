import React from 'react';
import { useGame, Screen } from '../context/GameContext';
import { LayoutDashboard, Globe, TrendingUp, Newspaper, User } from 'lucide-react';
import { getTheme } from '../utils/theme';

export const Navigation = () => {
  const { currentScreen, setCurrentScreen, themeMode } = useGame();
  const theme = getTheme(themeMode);

  const navItems: { id: Screen; icon: React.ElementType; label: string }[] = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Inicio' },
    { id: 'world', icon: Globe, label: 'Aprender' },
    { id: 'invest', icon: TrendingUp, label: 'Invertir' },
    { id: 'news', icon: Newspaper, label: 'Diario' },
    { id: 'profile', icon: User, label: 'Perfil' },
  ];

  return (
    <div className={theme.navBar}>
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => setCurrentScreen(item.id)}
          className={`flex flex-col items-center gap-1 transition-colors duration-200 ${
            currentScreen === item.id
              ? 'text-finomik-primary'
              : 'text-[color:var(--finomik-blue-5)] hover:text-finomik-primary'
          }`}
        >
          <item.icon
            size={theme.iconSize}
            strokeWidth={currentScreen === item.id ? 2.5 : 2}
            className={currentScreen === item.id && themeMode === 'young' ? 'scale-110 transition-transform' : ''}
          />
          <span className="text-[10px] font-medium tracking-wide uppercase text-body">
            {item.label}
          </span>
        </button>
      ))}
    </div>
  );
};
