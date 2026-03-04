import React, { useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, Circle, Lock, Sparkles } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { getTheme } from '../utils/theme';
import {
  getAllLevels,
  getLevelConfig,
  getNextLevelConfig,
  getRequirementCompletion,
  type InvestorLevelConfig,
  type InvestorLevelRequirement,
} from '../data/investorLevels';

export const InvestorLevelScreen: React.FC = () => {
  const { user, setCurrentScreen, setInvestorLevel, themeMode } = useGame();
  const theme = getTheme(themeMode);

  const [hasJustLevelledUp, setHasJustLevelledUp] = useState(false);
  const [showRequirementsDetails, setShowRequirementsDetails] = useState(false);
  const [showUnlocksDetails, setShowUnlocksDetails] = useState(false);
  const [showLevelsDetails, setShowLevelsDetails] = useState(false);

  const currentLevelConfig = getLevelConfig(user.investorLevel);
  const nextLevelConfig = getNextLevelConfig(user.investorLevel);
  const allLevels = getAllLevels();

  const portfolioStats = useMemo(() => {
    const holdingsEntries = Object.entries(user.portfolio.holdings) as [
      string,
      { quantity: number; averageCost: number },
    ][];
    const positionsCount = holdingsEntries.length;
    const operationsCount = user.portfolio.history.length;

    let diversificationLabel: 'Sin invertir' | 'Baja' | 'Media' | 'Alta';
    let diversificationScore: number;
    if (positionsCount === 0) {
      diversificationLabel = 'Sin invertir';
      diversificationScore = 0;
    } else if (positionsCount <= 2) {
      diversificationLabel = 'Baja';
      diversificationScore = 1;
    } else if (positionsCount <= 4) {
      diversificationLabel = 'Media';
      diversificationScore = 2;
    } else {
      diversificationLabel = 'Alta';
      diversificationScore = 3;
    }

    return {
      positionsCount,
      operationsCount,
      diversificationLabel,
      diversificationScore,
    };
  }, [user.portfolio.holdings, user.portfolio.history.length]);

  const requirementProgress = useMemo(() => {
    if (!nextLevelConfig) {
      return {
        completedCount: 0,
        totalCount: 0,
        progressPct: 100,
        items: [] as { requirement: InvestorLevelRequirement; completed: boolean }[],
      };
    }

    const items = nextLevelConfig.requirements.map(req => ({
      requirement: req,
      completed: getRequirementCompletion(
        req,
        user,
        portfolioStats.diversificationScore,
      ),
    }));
    const completedCount = items.filter(i => i.completed).length;
    const totalCount = items.length;
    const progressPct = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

    return { completedCount, totalCount, progressPct, items };
  }, [nextLevelConfig, portfolioStats.diversificationScore, user]);

  const canLevelUp =
    Boolean(nextLevelConfig) &&
    requirementProgress.totalCount > 0 &&
    requirementProgress.completedCount === requirementProgress.totalCount;

  const handleLevelUp = () => {
    if (!nextLevelConfig || !canLevelUp) return;
    setInvestorLevel(nextLevelConfig.id);
    setHasJustLevelledUp(true);
  };

  const currentUnlocks = currentLevelConfig?.unlocks;
  const nextUnlocks = nextLevelConfig?.unlocks;

  return (
    <div className={theme.contentPadding}>
      <div className="max-w-5xl mx-auto space-y-3">
        {/* Header + back button */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCurrentScreen('investPortfolio')}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[color:var(--finomik-blue-6)] text-xs font-semibold text-[color:var(--finomik-blue-5)] hover:bg-finomik-blue-soft/60"
            >
              <ArrowLeft size={14} />
              Volver al simulador
            </button>
            <div className="hidden md:block text-[11px] text-[color:var(--finomik-blue-5)]">
              Tus decisiones aquí solo afectan al simulador, no a dinero real.
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowLevelsDetails(v => !v)}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-finomik-blue-soft text-[11px] font-semibold text-finomik-primary border border-[color:var(--finomik-blue-6)] hover:bg-finomik-blue-soft/80"
          >
            <Sparkles size={14} />
            {showLevelsDetails ? 'Ocultar mapa de niveles' : 'Ver mapa de niveles'}
          </button>
        </div>
        {/* Tarjeta principal de nivel + progreso */}
        <MainLevelCard
          theme={theme}
          currentLevelConfig={currentLevelConfig}
          nextLevelConfig={nextLevelConfig}
          requirementProgress={requirementProgress}
          canLevelUp={canLevelUp}
          onLevelUp={handleLevelUp}
          hasJustLevelledUp={hasJustLevelledUp}
        />

        {/* Bloque de retos y desbloqueos (apilados) */}
        <section className={`${theme.card} p-4 md:p-5`}>
          <div className="flex flex-col gap-3">
            <RequirementsCard
              theme={theme}
              requirementProgress={requirementProgress}
              portfolioStats={portfolioStats}
            />
            <UnlocksCard
              theme={theme}
              currentUnlocks={currentUnlocks}
              nextUnlocks={nextUnlocks}
            />
          </div>
        </section>

        {/* Modal de mapa de niveles accesible desde el botón del header */}
        {showLevelsDetails && (
          <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4">
            <div
              className="absolute inset-0"
              onClick={() => setShowLevelsDetails(false)}
              aria-hidden="true"
            />
            <div className="relative z-50 max-w-5xl w-full max-h-[80vh]">
              <div className={`${theme.card} p-4 md:p-5 flex flex-col gap-3`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className={theme.headingMedium}>Mapa de niveles</h2>
                    <p className="text-[11px] md:text-xs text-[color:var(--finomik-blue-5)]">
                      Cada nivel del simulador y lo que desbloqueas en cada uno.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowLevelsDetails(false)}
                    className="text-[11px] font-semibold text-finomik-primary underline-offset-2 hover:underline"
                  >
                    Cerrar
                  </button>
                </div>
                <div className="mt-1 flex-1 min-h-0">
                  <LevelsMapCard
                    theme={theme}
                    allLevels={allLevels}
                    currentLevel={user.investorLevel}
                    nextLevelConfig={nextLevelConfig}
                    progressPct={requirementProgress.progressPct}
                    showDetails
                    onToggleDetails={() => setShowLevelsDetails(false)}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

type RequirementProgressState = {
  completedCount: number;
  totalCount: number;
  progressPct: number;
  items: { requirement: InvestorLevelRequirement; completed: boolean }[];
};

type PortfolioStats = {
  positionsCount: number;
  operationsCount: number;
  diversificationLabel: 'Sin invertir' | 'Baja' | 'Media' | 'Alta';
  diversificationScore: number;
};

interface MainLevelCardProps {
  theme: any;
  currentLevelConfig?: InvestorLevelConfig;
  nextLevelConfig?: InvestorLevelConfig;
  requirementProgress: RequirementProgressState;
  canLevelUp: boolean;
  onLevelUp: () => void;
  hasJustLevelledUp: boolean;
}

const MainLevelCard: React.FC<MainLevelCardProps> = ({
  theme,
  currentLevelConfig,
  nextLevelConfig,
  requirementProgress,
  canLevelUp,
  onLevelUp,
  hasJustLevelledUp,
}) => {
  const hasNextLevel = Boolean(nextLevelConfig);

  return (
    <section className="rounded-2xl bg-finomik-gradient-strong text-white p-4 md:p-5 shadow-md">
      <div className="flex flex-col gap-3">
        <div className="space-y-2">
          <div className="text-[10px] font-semibold uppercase tracking-wide opacity-80">
            Nivel de inversor
          </div>
          {currentLevelConfig && (
            <>
              <h1 className="text-xl md:text-2xl font-extrabold">
                Nivel {currentLevelConfig.id} — {currentLevelConfig.label}
              </h1>
              <p className="text-xs md:text-sm text-white/85 max-w-xl">
                {currentLevelConfig.tagline}
              </p>
            </>
          )}
          {hasNextLevel && nextLevelConfig && (
            <p className="text-[10px] md:text-xs text-white/80">
              Estás avanzando hacia el{' '}
              <span className="font-semibold">
                Nivel {nextLevelConfig.id} — {nextLevelConfig.label}
              </span>
              .
            </p>
          )}
          {!hasNextLevel && (
            <p className="text-[10px] md:text-xs text-white/80">
              Has alcanzado el último nivel disponible. Puedes seguir practicando en el simulador
              para consolidar tus decisiones.
            </p>
          )}
        </div>

        <div className="bg-white/10 rounded-2xl p-3 flex flex-col gap-2.5">
          {hasNextLevel && nextLevelConfig ? (
            <>
              <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide">
                <span>Progreso al siguiente nivel</span>
                <span>{requirementProgress.progressPct}%</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-white/20 overflow-hidden">
                <div
                  className="h-full rounded-full bg-white transition-all duration-500"
                  style={{ width: `${requirementProgress.progressPct}%` }}
                />
              </div>
              <div className="text-[11px] text-white/85">
                Has completado{' '}
                <span className="font-semibold">
                  {requirementProgress.completedCount} de {requirementProgress.totalCount}
                </span>{' '}
                retos necesarios para subir de nivel.
              </div>
              <button
                type="button"
                onClick={onLevelUp}
                disabled={!canLevelUp}
                className={`mt-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold shadow-md ${
                  canLevelUp
                    ? 'bg-white text-finomik-primary hover:opacity-95'
                    : 'bg-white/20 text-white/60 cursor-not-allowed'
                }`}
              >
                Subir al Nivel {nextLevelConfig.id}
                {canLevelUp && <ArrowRight size={14} />}
              </button>
              {hasJustLevelledUp && (
                <div className="mt-1 inline-flex items-center gap-2 text-[11px] text-emerald-100">
                  <Sparkles size={14} />
                  <span>¡Has subido de nivel! Ya tienes nuevos activos disponibles.</span>
                </div>
              )}
            </>
          ) : (
            <div className="space-y-2 text-sm">
              <div className="text-xs font-semibold uppercase tracking-wide">
                Nivel máximo alcanzado
              </div>
              <p className="text-[11px] text-white/85">
                Sigue practicando en el simulador: la clave ahora es mantener una cartera que
                encaje contigo a largo plazo.
              </p>
            </div>
          )}
        </div>

      </div>
    </section>
  );
};

interface RequirementsCardProps {
  theme: any;
  requirementProgress: RequirementProgressState;
  portfolioStats: PortfolioStats;
}

const RequirementsCard: React.FC<RequirementsCardProps> = ({
  theme,
  requirementProgress,
  portfolioStats,
}) => {
  return (
    <div className="rounded-xl border border-[color:var(--finomik-blue-6)] bg-finomik-blue-soft/30 p-4 md:p-5 flex flex-col gap-3 text-xs md:text-sm">
      <div>
        <h3 className={theme.headingMedium}>Retos para subir de nivel</h3>
        <p className="text-[11px] md:text-xs text-[color:var(--finomik-blue-5)]">
          {requirementProgress.totalCount > 0
            ? `Has completado ${requirementProgress.completedCount} de ${requirementProgress.totalCount} retos.`
            : 'Este nivel no tiene retos adicionales.'}
        </p>
      </div>

      <div className="mt-1 text-[10px] md:text-[11px] text-[color:var(--finomik-blue-5)]">
        Operaciones: <span className="font-semibold">{portfolioStats.operationsCount}</span> ·
        Activos: <span className="font-semibold">{portfolioStats.positionsCount}</span> ·
        Diversificación:{' '}
        <span className="font-semibold">
          {portfolioStats.diversificationLabel.toLowerCase()}
        </span>
      </div>

      <div className="mt-2 rounded-lg border border-[color:var(--finomik-blue-6)] bg-white p-3 max-h-44 overflow-auto space-y-2">
        {requirementProgress.items.map(({ requirement, completed }) => (
          <div key={requirement.id} className="flex items-start gap-3 text-[11px] md:text-xs">
            <div className="mt-0.5">
              {completed ? (
                <CheckCircle2 size={18} className="text-emerald-500" />
              ) : (
                <Circle size={18} className="text-[color:var(--finomik-blue-5)]" />
              )}
            </div>
            <div className="flex-1">
              <div
                className={`font-semibold ${
                  completed ? 'text-emerald-700' : 'text-finomik-primary'
                }`}
              >
                {requirement.label}
              </div>
              <p className="text-[10px] md:text-[11px] text-[color:var(--finomik-blue-6)]">
                {requirement.helpText}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

interface UnlocksCardProps {
  theme: any;
  currentUnlocks?: InvestorLevelConfig['unlocks'];
  nextUnlocks?: InvestorLevelConfig['unlocks'];
}

const UnlocksCard: React.FC<UnlocksCardProps> = ({
  theme,
  currentUnlocks,
  nextUnlocks,
}) => {
  return (
    <div className="rounded-xl border border-[color:var(--finomik-blue-6)] bg-white p-4 md:p-5 flex flex-col gap-3 text-xs md:text-sm">
      <div>
        <h3 className={theme.headingMedium}>Lo que desbloqueas</h3>
        <p className="text-[11px] md:text-xs text-[color:var(--finomik-blue-5)]">
          Diferencias entre tu nivel actual y el siguiente en activos, límites y operaciones.
        </p>
      </div>

      <div className="mt-2 flex items-stretch gap-3 text-[11px] md:text-xs">
        {/* Columna nivel actual */}
        <div className="flex-1 rounded-lg border border-[color:var(--finomik-blue-6)] bg-finomik-blue-soft/10 p-3 flex flex-col gap-1.5">
          <div className="text-[10px] font-semibold uppercase tracking-wide text-[color:var(--finomik-blue-6)]">
            Nivel actual
          </div>
          {currentUnlocks ? (
            <ul className="space-y-0.5 text-[color:var(--finomik-blue-7)]">
              <li>
                <span className="font-semibold">{currentUnlocks.availableAssets}</span> activos
                disponibles.
              </li>
              <li>
                Hasta{' '}
                <span className="font-semibold">
                  {currentUnlocks.maxInvestiblePct}%
                </span>{' '}
                del saldo por lección.
              </li>
              <li>
                <span className="font-semibold">
                  {currentUnlocks.maxOperationsPerLesson}
                </span>{' '}
                operaciones por lección.
              </li>
            </ul>
          ) : (
            <p className="text-[color:var(--finomik-blue-6)]">Sin datos.</p>
          )}
        </div>

        {/* Flecha central */}
        <div className="flex items-center justify-center px-1">
          <ArrowRight size={18} className="text-[color:var(--finomik-blue-6)]" />
        </div>

        {/* Columna siguiente nivel (bloqueada visualmente pero con contenido visible) */}
        <div className="flex-1 relative rounded-lg border border-[color:var(--finomik-blue-6)] bg-finomik-blue-soft/10 p-3 flex flex-col gap-1.5">
          <div className="flex items-center justify-between gap-1">
            <div className="text-[10px] font-semibold uppercase tracking-wide text-[color:var(--finomik-blue-6)]">
              Siguiente nivel
            </div>
            <div className="inline-flex items-center gap-1 text-[10px] text-[color:var(--finomik-blue-6)]">
              <Lock size={12} />
              <span>Bloqueado</span>
            </div>
          </div>
          <div className="opacity-80">
            {nextUnlocks ? (
              <ul className="space-y-0.5 text-[color:var(--finomik-blue-7)]">
                <li>
                  <span className="font-semibold">{nextUnlocks.availableAssets}</span> activos
                  disponibles.
                </li>
                <li>
                  Hasta{' '}
                  <span className="font-semibold">
                    {nextUnlocks.maxInvestiblePct}%
                  </span>{' '}
                  del saldo por lección.
                </li>
                <li>
                  <span className="font-semibold">
                    {nextUnlocks.maxOperationsPerLesson}
                  </span>{' '}
                  operaciones por lección.
                </li>
              </ul>
            ) : (
              <p className="text-[color:var(--finomik-blue-6)]">
                Ya estás en el último nivel de este módulo.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

interface LevelsMapCardProps {
  theme: any;
  allLevels: InvestorLevelConfig[];
  currentLevel: number;
  nextLevelConfig?: InvestorLevelConfig;
  progressPct: number;
  showDetails: boolean;
  onToggleDetails: () => void;
}

const LevelsMapCard: React.FC<LevelsMapCardProps> = ({
  theme,
  allLevels,
  currentLevel,
  nextLevelConfig,
  progressPct,
  showDetails,
  onToggleDetails,
}) => {
  const totalLevels = allLevels.length;

  return (
    <div className="rounded-xl border border-[color:var(--finomik-blue-6)] bg-white p-3 md:p-4 text-xs md:text-sm">
      <div className="mb-2 text-[11px] md:text-xs text-[color:var(--finomik-blue-5)]">
        Estás en el nivel {currentLevel} de {totalLevels}. Desplázate horizontalmente para ver todos
        los niveles y lo que desbloqueas en cada uno.
      </div>

      <div className="relative">
        {/* Línea horizontal de fondo */}
        <div className="absolute left-6 right-6 top-5 h-0.5 bg-finomik-blue-soft" />
        <div className="relative overflow-x-auto pb-4">
          <div className="flex items-stretch gap-4 md:gap-6 min-w-max pr-2">
            {allLevels.map(level => {
              const isCompleted = level.id < currentLevel;
              const isCurrent = level.id === currentLevel;
              const isFuture = level.id > currentLevel;

              const circleClasses = isCurrent
                ? 'bg-finomik-primary text-white border-finomik-primary'
                : isCompleted
                  ? 'bg-emerald-500 text-white border-emerald-500'
                  : 'bg-white text-finomik-primary border-[color:var(--finomik-blue-6)]';

              return (
                <div key={level.id} className="flex flex-col items-center gap-2 min-w-[180px]">
                  <div className="flex flex-col items-center gap-1">
                    <div
                      className={`w-9 h-9 rounded-full border-2 flex items-center justify-center text-[11px] font-bold ${circleClasses}`}
                    >
                      {level.id}
                    </div>
                    <div className="text-[11px] font-semibold text-finomik-primary text-center">
                      {level.label}
                    </div>
                    <div className="text-[10px] text-[color:var(--finomik-blue-5)]">
                      {isCurrent && 'Nivel actual'}
                      {isCompleted && !isCurrent && 'Completado'}
                      {isFuture && !isCurrent && !isCompleted && 'Bloqueado'}
                    </div>
                  </div>
                  <div className="w-full rounded-lg border border-[color:var(--finomik-blue-6)] bg-finomik-blue-soft/10 p-2 text-[10px] md:text-[11px]">
                    <div className="font-semibold mb-1 text-[color:var(--finomik-blue-7)]">
                      Lo que desbloqueas
                    </div>
                    <ul className="space-y-0.5 text-[color:var(--finomik-blue-7)]">
                      <li>
                        <span className="font-semibold">{level.unlocks.availableAssets}</span>{' '}
                        activos disponibles.
                      </li>
                      <li>
                        Hasta{' '}
                        <span className="font-semibold">
                          {level.unlocks.maxInvestiblePct}%
                        </span>{' '}
                        del saldo por lección.
                      </li>
                      <li>
                        <span className="font-semibold">
                          {level.unlocks.maxOperationsPerLesson}
                        </span>{' '}
                        operaciones por lección.
                      </li>
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {nextLevelConfig && (
          <div className="mt-1 text-[10px] md:text-[11px] text-[color:var(--finomik-blue-6)]">
            Progreso actual: {progressPct}% hacia el nivel {nextLevelConfig.id}.
          </div>
        )}
      </div>
    </div>
  );
};

