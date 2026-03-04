import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { getTheme } from '../utils/theme';
import {
  ArrowLeft,
  Sparkles,
  Star,
  HeartPulse,
  Flame,
  Target,
  Lightbulb,
  ChevronRight,
  User,
  Smile,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { YOUNG_AVATARS } from '../data/youngAvatars';
import { AVATAR_BACKGROUNDS } from '../data/avatarBackgrounds';

const getBehaviorProfile = (params: {
  reputation: number;
  financialHealth: number;
  savingsFund: number;
  balance: number;
  progress: number;
  streak: number;
}) => {
  const { reputation, financialHealth, savingsFund, balance, progress, streak } = params;

  let archetype = 'Explorador en construcción';
  let archetypeIcon: 'sparkles' | 'brain' | 'shield' | 'trending' = 'sparkles';
  let description =
    'Estás empezando a construir tu perfil financiero dentro de Finomik. Cada decisión que tomas te ayuda a entender mejor cómo funciona tu dinero.';
  const traits: string[] = [];
  const recommendations: string[] = [];

  if (reputation >= 70 && financialHealth >= 70) {
    archetype = 'Decisor consciente';
    archetypeIcon = 'brain';
    description =
      'Tomas decisiones generalmente alineadas con buenos hábitos financieros. Tu combinación de reputación y salud financiera indica que sueles pensar antes de actuar.';
    traits.push(
      'Tiendes a mantener un equilibrio sano entre ingresos, gastos y ahorro.',
      'Eres consistente al completar módulos y aplicar lo aprendido.'
    );
    recommendations.push(
      'Empieza a asumir retos un poco más avanzados en inversión, siempre midiendo el riesgo.',
      'Refuerza tu base revisando de vez en cuando módulos ya completados.'
    );
  } else if (savingsFund > 0 && savingsFund > balance * 0.2) {
    archetype = 'Constructor de colchón';
    archetypeIcon = 'shield';
    description =
      'Das bastante importancia a tener un fondo de seguridad. Eso te permite tomar decisiones con menos presión a corto plazo.';
    traits.push(
      'Has priorizado dedicar parte de tu dinero al fondo de ahorro.',
      'Valoras la estabilidad antes que el crecimiento rápido.'
    );
    recommendations.push(
      'Mantén el colchón que ya tienes y decide qué parte puedes empezar a invertir.',
      'Observa cómo el interés del fondo de ahorro va aumentando tu margen de maniobra.'
    );
  } else if (progress >= 50) {
    archetype = 'Aprendiz constante';
    archetypeIcon = 'trending';
    description =
      'Has avanzado una parte importante del camino de aprendizaje. Tu progreso indica curiosidad y constancia.';
    traits.push(
      'Te mantienes activo en la plataforma y completas capítulos con regularidad.',
      'Tienes ya una base que te permite conectar conceptos entre ahorro, gasto e inversión.'
    );
    recommendations.push(
      'El siguiente paso es trasladar lo aprendido a decisiones más complejas en el simulador.',
      'Reflexiona después de cada módulo: ¿qué cambiarías en tu vida real con lo que acabas de ver?'
    );
  }

  if (streak >= 5) {
    traits.push('Has encadenado varios días seguidos dentro de la plataforma.');
    recommendations.push('Aprovecha esa racha para consolidar un pequeño hábito semanal de revisión.');
  }

  return { archetype, archetypeIcon, description, traits, recommendations };
};

const ArchetypeIcon = ({ name }: { name: 'sparkles' | 'brain' | 'shield' | 'trending' }) => {
  const size = 28;
  switch (name) {
    case 'brain':
      return <Target size={size} />;
    case 'shield':
      return <HeartPulse size={size} />;
    case 'trending':
      return <Sparkles size={size} />;
    default:
      return <User size={size} />;
  }
};

export const UserPersona = () => {
  const { user, setCurrentScreen, themeMode } = useGame();
  const theme = getTheme(themeMode);
  const [hoveredTrait, setHoveredTrait] = useState<number | null>(null);
  const [hoveredRec, setHoveredRec] = useState<number | null>(null);

  const profile = getBehaviorProfile({
    reputation: user.reputation,
    financialHealth: user.financialHealth,
    savingsFund: user.savingsFund,
    balance: user.balance,
    progress: user.progress,
    streak: user.streak,
  });

  const miniStats = [
    { label: 'Reputación', value: user.reputation, max: 100, icon: Star },
    { label: 'Salud financiera', value: user.financialHealth, max: 100, icon: HeartPulse },
    { label: 'Racha', value: user.streak, suffix: 'días', icon: Flame },
  ];

  const displayTraits = profile.traits.length > 0 ? profile.traits : [
    'Aún no tenemos suficiente información para definir un patrón claro. Sigue avanzando en el camino de aprendizaje y volviendo a esta pantalla.',
  ];
  const displayRecs = profile.recommendations.length > 0 ? profile.recommendations : [
    'Completa algunos módulos más y realiza acciones en el simulador para recibir recomendaciones más ajustadas a tu estilo.',
  ];

  const currentAvatar = YOUNG_AVATARS.find((a) => a.id === user.youngAvatarId) ?? YOUNG_AVATARS[0];
  const currentBackground = AVATAR_BACKGROUNDS.find((b) => b.id === user.youngAvatarBackgroundId) ?? AVATAR_BACKGROUNDS[0];
  const unlockedIds = user.unlockedAvatarIds ?? [];
  const unlockedCount = unlockedIds.length;
  const totalAvatars = YOUNG_AVATARS.length;

  return (
    <div className={theme.contentPadding}>
      <motion.button
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => setCurrentScreen('dashboard')}
        className="mb-4 inline-flex items-center gap-2 rounded-full border border-[color:var(--finomik-blue-6)] bg-white px-4 py-2 text-sm font-semibold text-finomik-primary shadow-sm transition-all hover:border-[color:var(--finomik-blue-5)] hover:bg-finomik-blue-soft/50 hover:shadow"
      >
        <ArrowLeft size={16} />
        Volver al inicio
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="flex items-center gap-3 mb-4"
      >
        <div className="w-11 h-11 rounded-2xl bg-finomik-gradient-strong flex items-center justify-center shadow-md">
          <Sparkles size={22} className="text-white" />
        </div>
        <div>
          <h1 className={theme.headingLarge}>Tu perfil en Finomik</h1>
          <p className={theme.textSubtle}>
            Cómo te estás comportando como usuario dentro del simulador.
          </p>
        </div>
      </motion.div>

      {/* Hero: archetype card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.35 }}
        className="bg-finomik-gradient-strong text-white p-5 md:p-6 rounded-2xl relative overflow-hidden shadow-lg mb-4"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-8 mb-[-1.5rem]" />
        <div className="relative z-10">
          <p className="text-xs font-semibold uppercase tracking-wider text-white/80 mb-2">
            Según tus decisiones, eres
          </p>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
              <ArchetypeIcon name={profile.archetypeIcon} />
            </div>
            <h2 className="heading-1 text-xl md:text-2xl text-white">{profile.archetype}</h2>
          </div>
          <p className="mt-3 text-sm text-white/90 leading-relaxed max-w-2xl">
            {profile.description}
          </p>
        </div>
      </motion.div>

      {/* Avatar section */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12, duration: 0.35 }}
        className={`${theme.card} p-4 md:p-5 rounded-xl mb-4 overflow-hidden`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-4 flex-1">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className={`w-20 h-20 rounded-2xl flex items-center justify-center text-4xl shadow-md ${currentBackground.bgClass} ${currentBackground.textClass ?? ''}`}
            >
              {currentAvatar.emoji}
            </motion.div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Smile size={18} className="text-finomik-primary" />
                <h3 className={theme.headingSmall}>Tu avatar</h3>
              </div>
              <p className="text-sm font-semibold text-finomik-primary">{currentAvatar.name}</p>
              <p className="text-xs text-[color:var(--finomik-blue-5)] mt-0.5">
                {unlockedCount} de {totalAvatars} avatares desbloqueados
              </p>
              <div className="mt-2 h-1.5 w-32 rounded-full bg-[color:var(--finomik-blue-6)] overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(unlockedCount / totalAvatars) * 100}%` }}
                  transition={{ delay: 0.35, duration: 0.5 }}
                  className="h-full rounded-full bg-finomik-primary"
                />
              </div>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setCurrentScreen('avatarShop')}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-finomik-primary text-white px-4 py-2.5 text-sm font-semibold shadow-sm hover:opacity-95 transition-opacity shrink-0"
          >
            Cambiar avatar
            <ChevronRight size={16} />
          </motion.button>
        </div>
      </motion.div>

      {/* Mini stats */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.35 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4"
      >
        {miniStats.map((stat, i) => {
          const Icon = stat.icon;
          const pct = stat.max ? (stat.value / stat.max) * 100 : 0;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + i * 0.05 }}
              whileHover={{ scale: 1.02, y: -2 }}
              className={`${theme.card} p-4 flex items-center gap-3 rounded-xl border transition-shadow hover:shadow-md`}
            >
              <div className="w-10 h-10 rounded-xl bg-finomik-blue-soft flex items-center justify-center flex-shrink-0">
                <Icon size={20} className="text-finomik-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[color:var(--finomik-blue-5)]">
                  {stat.label}
                </p>
                <p className="text-lg font-bold text-finomik-primary">
                  {stat.value}
                  {stat.suffix ? ` ${stat.suffix}` : `/${stat.max}`}
                </p>
                {stat.max && (
                  <div className="mt-1.5 h-1.5 w-full rounded-full bg-[color:var(--finomik-blue-6)] overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ delay: 0.4 + i * 0.05, duration: 0.5 }}
                      className="h-full rounded-full bg-finomik-primary"
                    />
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Traits + Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.25, duration: 0.35 }}
          className={`${theme.card} p-4 md:p-5 rounded-xl overflow-hidden`}
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-finomik-blue-soft flex items-center justify-center">
              <Target size={16} className="text-finomik-primary" />
            </div>
            <h3 className={theme.headingSmall}>Cómo te estás comportando</h3>
          </div>
          <ul className="space-y-2">
            <AnimatePresence>
              {displayTraits.map((trait, i) => (
                <motion.li
                  key={trait}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.06 }}
                  onMouseEnter={() => setHoveredTrait(i)}
                  onMouseLeave={() => setHoveredTrait(null)}
                  className={`flex items-start gap-2 rounded-lg px-3 py-2.5 text-sm text-[color:var(--finomik-blue-2)] transition-colors ${
                    hoveredTrait === i ? 'bg-finomik-blue-soft/60' : 'bg-[color:var(--finomik-blue-6)]/30'
                  }`}
                >
                  <ChevronRight
                    size={16}
                    className={`flex-shrink-0 mt-0.5 text-finomik-primary transition-transform ${
                      hoveredTrait === i ? 'translate-x-0 opacity-100' : 'opacity-50'
                    }`}
                  />
                  <span>{trait}</span>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.25, duration: 0.35 }}
          className={`${theme.card} p-4 md:p-5 rounded-xl overflow-hidden`}
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-finomik-blue-soft flex items-center justify-center">
              <Lightbulb size={16} className="text-finomik-primary" />
            </div>
            <h3 className={theme.headingSmall}>Recomendaciones para tu siguiente etapa</h3>
          </div>
          <ul className="space-y-2">
            <AnimatePresence>
              {displayRecs.map((rec, i) => (
                <motion.li
                  key={rec}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 + i * 0.06 }}
                  onMouseEnter={() => setHoveredRec(i)}
                  onMouseLeave={() => setHoveredRec(null)}
                  className={`flex items-start gap-2 rounded-lg px-3 py-2.5 text-sm text-[color:var(--finomik-blue-2)] transition-colors ${
                    hoveredRec === i ? 'bg-finomik-blue-soft/60' : 'bg-[color:var(--finomik-blue-6)]/30'
                  }`}
                >
                  <Lightbulb
                    size={16}
                    className={`flex-shrink-0 mt-0.5 text-finomik-primary transition-transform ${
                      hoveredRec === i ? 'opacity-100' : 'opacity-50'
                    }`}
                  />
                  <span>{rec}</span>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-4 flex flex-wrap gap-2"
      >
        <button
          onClick={() => setCurrentScreen('world')}
          className="inline-flex items-center gap-2 rounded-full border border-[color:var(--finomik-blue-6)] bg-white px-4 py-2 text-xs font-semibold text-finomik-primary transition-all hover:bg-finomik-blue-soft hover:border-[color:var(--finomik-blue-5)]"
        >
          Ir al mapa de aprendizaje
          <ChevronRight size={14} />
        </button>
        <button
          onClick={() => setCurrentScreen('invest')}
          className="inline-flex items-center gap-2 rounded-full border border-[color:var(--finomik-blue-6)] bg-white px-4 py-2 text-xs font-semibold text-finomik-primary transition-all hover:bg-finomik-blue-soft hover:border-[color:var(--finomik-blue-5)]"
        >
          Abrir simulador de inversión
          <ChevronRight size={14} />
        </button>
      </motion.div>
    </div>
  );
};

