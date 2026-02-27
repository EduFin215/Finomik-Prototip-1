import React from 'react';
import { useGame } from '../context/GameContext';
import { useAuth } from '../context/AuthContext';
import { User, Settings, Award, Shield, Zap, Trophy, ToggleLeft, ToggleRight, LogOut } from 'lucide-react';
import { LEADERBOARD } from '../data/leaderboard';
import { getTheme } from '../utils/theme';
import { YOUNG_AVATARS } from '../data/youngAvatars';
import { AVATAR_BACKGROUNDS } from '../data/avatarBackgrounds';
import { YoungAvatarPicker } from '../components/YoungAvatarPicker';

export const Profile = () => {
  const {
    user,
    themeMode,
    toggleTheme,
    youngAvatarId,
    setYoungAvatarId,
    youngAvatarBackgroundId,
    setYoungAvatarBackgroundId,
  } = useGame();
  const { logout } = useAuth();
  const theme = getTheme(themeMode);

  const [isAvatarPickerOpen, setIsAvatarPickerOpen] = React.useState(false);

  // Sort leaderboard including current user state
  const sortedLeaderboard = LEADERBOARD.map(p => 
    p.isUser ? { ...p, xp: user.xp } : p
  ).sort((a, b) => b.xp - a.xp);

  const currentYoungAvatar =
    YOUNG_AVATARS.find(a => a.id === youngAvatarId) ?? YOUNG_AVATARS[0];
  const currentBackground =
    AVATAR_BACKGROUNDS.find(bg => bg.id === youngAvatarBackgroundId) ?? AVATAR_BACKGROUNDS[0];

  return (
    <div
      className={`min-h-screen ${theme.container} ${
        themeMode === 'adult' ? 'pt-20' : ''
      } pb-24 ${themeMode === 'young' ? 'bg-gradient-to-b from-finomik-blue-soft/60 to-white' : ''}`}
    >
      {/* Profile Header */}
      <div
        className={`${
          themeMode === 'young'
            ? 'bg-finomik-gradient-strong text-white pt-12 pb-24'
            : 'bg-white text-finomik-primary pt-8 pb-12 border-b border-[color:var(--finomik-blue-6)]'
        } px-6 relative overflow-hidden`}
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-12 -mt-12" />
        
        <div className="relative z-10 flex flex-col items-center">
          <div className={`w-24 h-24 bg-white p-1 shadow-xl rounded-full mb-4`}>
            {themeMode === 'young' ? (
              <div
                className={`w-full h-full rounded-full flex items-center justify-center text-5xl ${currentBackground.bgClass} ${
                  currentBackground.textClass ?? 'text-finomik-primary'
                }`}
              >
                <span>{currentYoungAvatar.emoji}</span>
              </div>
            ) : (
              <div className="w-full h-full bg-finomik-blue-soft rounded-full flex items-center justify-center">
                <User size={40} className="text-finomik-primary" />
              </div>
            )}
          </div>
          <h1 className="heading-1 text-3xl text-white tracking-tight">{user.name}</h1>
          <p className={themeMode === 'young' ? 'text-finomik-blue-6' : 'text-[color:var(--finomik-blue-5)]'}>
            Nivel {user.level} • Principiante
          </p>
        </div>
      </div>

      {/* Stats Overlay */}
      <div className={`px-6 ${themeMode === 'young' ? '-mt-12' : 'mt-6'} relative z-20`}>
        <div
          className={`${theme.card} ${
            themeMode === 'young'
              ? 'bg-white/85 border-[color:var(--finomik-blue-6)]/60 shadow-md backdrop-blur-sm'
              : ''
          } p-6 flex justify-between text-center`}
        >
          <div>
            <div className="text-xs text-[color:var(--finomik-blue-5)] uppercase tracking-wider font-semibold mb-1">
              Monedas
            </div>
            <div className="text-xl font-bold text-finomik-primary">{user.coins}</div>
          </div>
          <div className="w-px bg-[color:var(--finomik-blue-6)]" />
          <div>
            <div className="text-xs text-[color:var(--finomik-blue-5)] uppercase tracking-wider font-semibold mb-1">
              Racha
            </div>
            <div className="text-xl font-bold text-finomik-primary">
              {user.streak} {themeMode === 'young' ? '🔥' : ''}
            </div>
          </div>
          <div className="w-px bg-[color:var(--finomik-blue-6)]" />
          <div>
            <div className="text-xs text-[color:var(--finomik-blue-5)] uppercase tracking-wider font-semibold mb-1">
              Ranking
            </div>
            <div className="text-xl font-bold text-finomik-primary">
              #{sortedLeaderboard.findIndex(p => p.isUser) + 1}
            </div>
          </div>
        </div>
      </div>

      {/* Settings / Mode Toggle */}
      <div className="px-6 mt-8">
        <h3 className={`${theme.headingMedium} mb-4`}>Personalización</h3>
        <div className="space-y-3">
          <div
            className={`${theme.card} ${
              themeMode === 'young'
                ? 'bg-white/90 border-[color:var(--finomik-blue-6)]/70 shadow-sm'
                : ''
            } p-4 flex justify-between items-center`}
          >
            <div>
              <div className="font-bold text-sm text-finomik-primary">Modo Profesional</div>
              <div className="text-xs text-[color:var(--finomik-blue-5)]">Interfaz minimalista para adultos</div>
            </div>
            <button onClick={toggleTheme} className="text-finomik-primary transition-colors">
              {themeMode === 'adult' ? (
                <ToggleRight size={40} />
              ) : (
                <ToggleLeft size={40} className="text-[color:var(--finomik-blue-6)]" />
              )}
            </button>
          </div>

          {themeMode === 'young' && (
            <div className={`${theme.card} bg-white/95 border-[color:var(--finomik-blue-6)]/70 p-4`}>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="font-bold text-sm text-finomik-primary">Avatar joven</div>
                  <div className="text-xs text-[color:var(--finomik-blue-5)]">
                    Elige tu personaje y el color de fondo.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAvatarPickerOpen(prev => !prev)}
                  className="text-xs font-semibold text-finomik-primary underline"
                >
                  {isAvatarPickerOpen ? 'Ocultar' : 'Cambiar avatar'}
                </button>
              </div>

              {isAvatarPickerOpen && (
                <YoungAvatarPicker
                  selectedAvatarId={youngAvatarId}
                  onSelect={setYoungAvatarId}
                  themeMode={themeMode}
                  selectedBackgroundId={youngAvatarBackgroundId}
                  onSelectBackground={setYoungAvatarBackgroundId}
                />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Achievements */}
      <div className="px-6 mt-8">
        <h3 className={`${theme.headingMedium} mb-4 flex items-center gap-2`}>
          {themeMode === 'young' && <Award className="text-yellow-500" />} Logros
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div
            className={`${theme.card} ${
              themeMode === 'young' ? 'bg-finomik-blue-soft/60 border-none shadow-sm' : ''
            } p-4 opacity-100`}
          >
            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mb-3">
              <Zap size={20} className="text-yellow-600" />
            </div>
            <div className="font-bold text-sm text-finomik-primary">Primeros Pasos</div>
            <div className="text-xs text-[color:var(--finomik-blue-5)]">Completa 1 módulo</div>
          </div>
          <div
            className={`${theme.card} ${
              themeMode === 'young' ? 'bg-white/80 border-[color:var(--finomik-blue-6)]/60' : ''
            } p-4 opacity-50 grayscale`}
          >
            <div className="w-10 h-10 bg-finomik-blue-soft rounded-full flex items-center justify-center mb-3">
              <Shield size={20} className="text-finomik-primary" />
            </div>
            <div className="font-bold text-sm text-finomik-primary">Inversor Novato</div>
            <div className="text-xs text-[color:var(--finomik-blue-5)]">Compra tu primera acción</div>
          </div>
        </div>
      </div>

      {/* Leaderboard */}
      <div className="px-6 mt-8">
        <h3 className={`${theme.headingMedium} mb-4`}>Ranking Clase (Top 10)</h3>
        <div
          className={`${theme.card} ${
            themeMode === 'young'
              ? 'bg-white/95 border-[color:var(--finomik-blue-6)]/70 shadow-sm'
              : ''
          } overflow-hidden`}
        >
          {sortedLeaderboard.map((player, index) => (
            <div 
              key={player.id}
              className={`flex items-center gap-4 p-4 border-b border-[color:var(--finomik-blue-6)]/40 last:border-0 ${
                player.isUser ? 'bg-finomik-blue-soft/60' : 'bg-white'
              }`}
            >
              <div className="font-bold text-[color:var(--finomik-blue-5)] w-6 text-center">
                {index + 1}
              </div>
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold relative ${
                  themeMode === 'young'
                    ? player.isUser && currentYoungAvatar
                      ? `${currentBackground.bgClass} ${currentBackground.textClass ?? 'text-finomik-primary'} text-xl`
                      : player.avatar
                    : 'bg-finomik-blue-soft text-finomik-primary'
                }`}
              >
                {player.isUser && themeMode === 'young' ? currentYoungAvatar.emoji : player.name[0]}
                {index === 0 && themeMode === 'young' && (
                  <div className="absolute -top-1 -right-1 bg-yellow-400 rounded-full p-0.5 border-2 border-white">
                    <Trophy size={10} className="text-white" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-finomik-primary">{player.name}</span>
                  {index === 0 && themeMode === 'young' && (
                    <span className="text-[10px] font-bold bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">
                      DESTACADO
                    </span>
                  )}
                </div>
                <div className="text-xs text-[color:var(--finomik-blue-5)]">{player.xp} XP</div>
              </div>
              {index < 3 && themeMode === 'young' && <Award size={20} className={index === 0 ? 'text-yellow-400' : index === 1 ? 'text-slate-400' : 'text-orange-400'} />}
            </div>
          ))}
        </div>
      </div>

      {/* Cerrar sesión */}
      <div className="px-6 mt-8 pb-32">
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 py-3 text-sm text-[color:var(--finomik-blue-5)] hover:text-finomik-primary transition-colors"
        >
          <LogOut size={18} />
          Cerrar sesión
        </button>
      </div>
    </div>
  );
};
