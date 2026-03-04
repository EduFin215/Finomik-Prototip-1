import React from 'react';
import { useGame } from '../context/GameContext';
import { getTheme } from '../utils/theme';
import { YOUNG_AVATARS, AvatarCategory } from '../data/youngAvatars';
import { AVATAR_BACKGROUNDS } from '../data/avatarBackgrounds';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  Coins,
  Sparkles,
  Star,
  Lock,
  Check,
  Crown,
} from 'lucide-react';

const CATEGORY_LABELS: Record<AvatarCategory, string> = {
  starter: 'Básicos',
  rare: 'Raros',
  pro: 'Pro',
  event: 'Eventos',
};

const RARITY_BADGE_CLASSES: Record<AvatarCategory, string> = {
  starter: 'bg-slate-100 text-slate-700',
  rare: 'bg-purple-100 text-purple-700',
  pro: 'bg-amber-100 text-amber-700',
  event: 'bg-emerald-100 text-emerald-700',
};

export const AvatarShop: React.FC = () => {
  const {
    user,
    themeMode,
    setCurrentScreen,
    youngAvatarId,
    setYoungAvatarId,
    youngAvatarBackgroundId,
    setYoungAvatarBackgroundId,
    buyItem,
    setUser,
  } = useGame();
  const theme = getTheme(themeMode);

  const unlockedIds = user.unlockedAvatarIds ?? [];
  const totalAvatars = YOUNG_AVATARS.length;
  const unlockedCount = unlockedIds.length;

  const [activeCategory, setActiveCategory] =
    React.useState<AvatarCategory>('starter');

  const currentAvatar =
    YOUNG_AVATARS.find(a => a.id === youngAvatarId) ?? YOUNG_AVATARS[0];
  const currentBackground =
    AVATAR_BACKGROUNDS.find(bg => bg.id === youngAvatarBackgroundId) ??
    AVATAR_BACKGROUNDS[0];

  const filteredAvatars = YOUNG_AVATARS.filter(
    avatar => avatar.category === activeCategory,
  );

  const meetsLevel = (minLevel?: number) =>
    !minLevel || user.level >= minLevel;

  const meetsProRequirement = (requiresPro?: boolean) =>
    !requiresPro || user.investorLevel >= 3;

  const isUnlocked = (id: string) => unlockedIds.includes(id);
  const isEquipped = (id: string) => youngAvatarId === id;

  const handleEquip = (avatarId: string) => {
    if (!isUnlocked(avatarId)) return;
    setYoungAvatarId(avatarId);
  };

  const handleBuy = (avatarId: string) => {
    const avatar = YOUNG_AVATARS.find(a => a.id === avatarId);
    if (!avatar) return;

    const price = avatar.priceCoins ?? 0;
    if (price <= 0) {
      // Gratis: simplemente desbloquear si no lo está y equipar
      if (!isUnlocked(avatar.id)) {
        setUser((prev: any) => ({
          ...prev,
          unlockedAvatarIds: [...(prev.unlockedAvatarIds ?? []), avatar.id],
        }));
      }
      setYoungAvatarId(avatar.id);
      return;
    }

    if (!meetsLevel(avatar.minLevel) || !meetsProRequirement(avatar.requiresPro)) {
      return;
    }

    const success = buyItem(price);
    if (!success) return;

    setUser((prev: any) => ({
      ...prev,
      unlockedAvatarIds: prev.unlockedAvatarIds?.includes(avatar.id)
        ? prev.unlockedAvatarIds
        : [...(prev.unlockedAvatarIds ?? []), avatar.id],
    }));
    setYoungAvatarId(avatar.id);
  };

  const collectionProgress =
    totalAvatars === 0 ? 0 : (unlockedCount / totalAvatars) * 100;

  return (
    <div
      className={`min-h-screen ${theme.container} ${
        themeMode === 'young'
          ? 'bg-gradient-to-b from-finomik-blue-soft/60 to-white'
          : ''
      } pb-24`}
    >
      <div className="px-6 pt-6 pb-4 flex items-center justify-between">
        <button
          onClick={() => setCurrentScreen('dashboard')}
          className="inline-flex items-center gap-2 rounded-full border border-[color:var(--finomik-blue-6)] bg-white px-4 py-2 text-xs font-semibold text-finomik-primary shadow-sm hover:bg-finomik-blue-soft/60 transition-colors"
        >
          <ArrowLeft size={16} />
          Volver
        </button>
        <div className="flex items-center gap-2 rounded-full bg-white/90 border border-[color:var(--finomik-blue-6)] px-3 py-1.5 text-xs font-semibold text-finomik-primary shadow-sm">
          <Coins size={14} className="text-yellow-500" />
          <span>{user.coins.toLocaleString('es-ES')}</span>
        </div>
      </div>

      <div className="px-6 space-y-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="heading-1 text-2xl text-finomik-primary flex items-center gap-2">
              <Sparkles size={22} className="text-finomik-primary" />
              Tienda de avatares
            </h1>
            <p className="text-xs text-[color:var(--finomik-blue-5)] mt-1 max-w-md">
              Elige cómo quieres verte dentro de Finomik. Desbloquea personajes
              especiales según tu nivel y tus monedas.
            </p>
          </div>
          <div className="hidden md:flex flex-col items-end text-right">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[color:var(--finomik-blue-5)]">
              Colección completada
            </span>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs font-semibold text-finomik-primary">
                {unlockedCount}/{totalAvatars}
              </span>
              <div className="w-32 h-1.5 rounded-full bg-[color:var(--finomik-blue-6)] overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${collectionProgress}%` }}
                  className="h-full rounded-full bg-finomik-primary"
                />
              </div>
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="relative overflow-hidden rounded-2xl bg-finomik-gradient-strong text-white p-5 md:p-6 shadow-lg"
        >
          <div className="absolute -right-10 -bottom-10 w-44 h-44 bg-white/10 rounded-full" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex items-center gap-4">
              <div
                className={`w-20 h-20 md:w-24 md:h-24 rounded-2xl flex items-center justify-center text-4xl md:text-5xl shadow-xl ${currentBackground.bgClass} ${currentBackground.textClass ?? ''}`}
              >
                {currentAvatar.emoji}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold uppercase tracking-wider text-white/70">
                    Avatar actual
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-400/90 text-emerald-950 px-2 py-0.5 text-[10px] font-bold">
                    <Check size={10} />
                    Equipado
                  </span>
                </div>
                <p className="text-sm font-semibold">{currentAvatar.name}</p>
                <p className="text-xs text-white/80 mt-1">
                  Nivel {user.level} • Racha {user.streak} días
                </p>
              </div>
            </div>

            <div className="flex-1 md:text-right space-y-2">
              <p className="text-xs md:text-sm text-white/85 max-w-md md:ml-auto">
                Desbloquea avatares raros y pro a medida que subes de nivel e
                inviertes mejor. Tu estilo también cuenta en tu viaje
                financiero.
              </p>
              <div className="flex md:justify-end gap-2 items-center">
                <div className="md:hidden flex flex-col items-start">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-white/80">
                    Colección
                  </span>
                  <span className="text-xs font-semibold">
                    {unlockedCount}/{totalAvatars} desbloqueados
                  </span>
                </div>
                <div className="hidden md:flex flex-col items-end">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-white/80">
                    Recomendación
                  </span>
                  <span className="text-xs">
                    Empieza por los raros que coincidan con tu nivel actual.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="flex items-center justify-between gap-2 mt-2">
          <div className="flex gap-2">
            {(Object.keys(CATEGORY_LABELS) as AvatarCategory[]).map(category => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                  activeCategory === category
                    ? 'bg-finomik-primary text-white border-finomik-primary shadow-sm'
                    : 'bg-white text-finomik-primary border-[color:var(--finomik-blue-6)] hover:bg-finomik-blue-soft/60'
                }`}
              >
                {CATEGORY_LABELS[category]}
              </button>
            ))}
          </div>
          <div className="hidden md:flex items-center gap-1 text-[10px] text-[color:var(--finomik-blue-5)]">
            <Star size={12} className="text-yellow-400" />
            <span>
              Algunos avatares se desbloquean solo con mayor nivel o mejor
              desempeño inversor.
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mt-2">
          {filteredAvatars.map(avatar => {
            const unlocked = isUnlocked(avatar.id);
            const equipped = isEquipped(avatar.id);
            const enoughLevel = meetsLevel(avatar.minLevel);
            const enoughPro = meetsProRequirement(avatar.requiresPro);
            const price = avatar.priceCoins ?? 0;
            const canAfford = user.coins >= price;

            const isBlockedByLevel = !enoughLevel;
            const isBlockedByPro = !enoughPro;
            const isBlockedByCoins = !unlocked && price > 0 && !canAfford;

            let actionLabel = 'Comprar';
            let actionDisabled = false;

            if (equipped) {
              actionLabel = 'Equipado';
              actionDisabled = true;
            } else if (unlocked) {
              actionLabel = 'Equipar';
            } else if (isBlockedByLevel || isBlockedByPro || isBlockedByCoins) {
              actionLabel = 'Bloqueado';
              actionDisabled = true;
            }

            return (
              <motion.div
                key={avatar.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                whileHover={{ y: -4, scale: 1.02 }}
                className={`relative flex flex-col gap-2 p-3 rounded-2xl border bg-white text-xs font-medium transition-all ${
                  equipped
                    ? 'border-finomik-primary shadow-[0_10px_25px_rgba(21,94,239,0.25)]'
                    : 'border-[color:var(--finomik-blue-6)] hover:shadow-md'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div
                    className={`w-14 h-14 rounded-full flex items-center justify-center text-3xl ${avatar.bgClass} ${
                      themeMode === 'adult'
                        ? 'text-finomik-primary'
                        : avatar.textClass
                    }`}
                  >
                    <span>{avatar.emoji}</span>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${RARITY_BADGE_CLASSES[avatar.category]}`}
                  >
                    {avatar.category === 'pro' && (
                      <Crown size={10} className="text-amber-500" />
                    )}
                    {CATEGORY_LABELS[avatar.category]}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="text-[11px] text-finomik-primary line-clamp-2">
                    {avatar.name}
                  </div>
                  <div className="flex flex-wrap items-center gap-1">
                    {price > 0 ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-finomik-blue-soft/60 text-[10px] font-semibold px-2 py-0.5">
                        <Coins size={10} className="text-yellow-500" />
                        {price}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-semibold px-2 py-0.5">
                        Incluido
                      </span>
                    )}
                    {avatar.minLevel && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 text-slate-700 text-[9px] px-2 py-0.5">
                        Nivel {avatar.minLevel}+
                      </span>
                    )}
                    {avatar.requiresPro && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 text-indigo-700 text-[9px] px-2 py-0.5">
                        Pro
                      </span>
                    )}
                  </div>
                  {(isBlockedByLevel || isBlockedByPro || isBlockedByCoins) && (
                    <div className="flex items-center gap-1 text-[9px] text-[color:var(--finomik-blue-5)] mt-0.5">
                      <Lock size={10} />
                      <span>
                        {!enoughLevel
                          ? `Sube al nivel ${avatar.minLevel} para desbloquearlo.`
                          : !enoughPro
                          ? 'Mejora tu nivel de inversor para acceder a este avatar pro.'
                          : 'Consigue más monedas para comprar este avatar.'}
                      </span>
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() =>
                    unlocked ? handleEquip(avatar.id) : handleBuy(avatar.id)
                  }
                  disabled={actionDisabled}
                  className={`mt-1 inline-flex items-center justify-center gap-1 rounded-full px-2.5 py-1.5 text-[11px] font-semibold transition-colors ${
                    actionDisabled
                      ? 'bg-[color:var(--finomik-blue-6)] text-[color:var(--finomik-blue-4)] cursor-default'
                      : unlocked
                      ? 'bg-finomik-blue-soft text-finomik-primary hover:bg-finomik-blue-soft/80'
                      : 'bg-finomik-primary text-white hover:bg-[color:var(--finomik-blue-1)]'
                  }`}
                >
                  {equipped && <Check size={11} />}
                  {actionLabel}
                </button>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-4">
          <h2 className="text-sm font-bold text-finomik-primary mb-2 flex items-center gap-2">
            Fondos de avatar
          </h2>
          <div className="flex flex-wrap gap-2">
            {AVATAR_BACKGROUNDS.map(bg => {
              const selected = bg.id === youngAvatarBackgroundId;
              return (
                <button
                  key={bg.id}
                  type="button"
                  onClick={() => setYoungAvatarBackgroundId(bg.id)}
                  className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all ${
                    selected
                      ? 'ring-2 ring-finomik-primary ring-offset-2 ring-offset-white'
                      : 'border-[color:var(--finomik-blue-6)] hover:border-finomik-primary/70'
                  } ${bg.bgClass}`}
                >
                  {selected && (
                    <span
                      className={`text-[11px] font-bold ${
                        bg.textClass ?? 'text-finomik-primary'
                      }`}
                    >
                      ✓
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

