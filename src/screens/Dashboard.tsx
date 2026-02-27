import React from 'react';
import { useGame } from '../context/GameContext';
import {
  Trophy,
  Flame,
  Coins,
  ArrowRight,
  Award,
  LineChart,
  Sparkles,
  Wallet,
  PiggyBank,
  Star,
  HeartPulse,
  AlertTriangle,
} from 'lucide-react';
import { motion } from 'motion/react';
import { ResponsiveBar } from '@nivo/bar';
import { LEADERBOARD } from '../data/leaderboard';
import { getTheme } from '../utils/theme';
import { learningPath } from '../data/content';

type IconType = React.ElementType;

interface KpiCardProps {
  icon: IconType;
  label: string;
  value: string;
  helper?: string;
  onClick?: () => void;
}

const KpiCard: React.FC<KpiCardProps> = ({ icon: Icon, label, value, helper, onClick }) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className="text-left"
  >
    <div className="bg-white border border-[color:var(--finomik-blue-6)] rounded-xl p-4 flex flex-col gap-2 h-full">
      <div className="flex items-center justify-between">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-[color:var(--finomik-blue-5)]">
          {label}
        </div>
        <div className="w-8 h-8 rounded-full bg-finomik-blue-soft flex items-center justify-center">
          <Icon size={16} className="text-finomik-primary" />
        </div>
      </div>
      <div className="text-2xl font-bold text-finomik-primary">{value}</div>
      {helper && (
        <div className="text-xs text-[color:var(--finomik-blue-5)] mt-1">{helper}</div>
      )}
    </div>
  </motion.button>
);

interface NextActionCardProps {
  title: string;
  description: string;
  ctaLabel: string;
  onClick: () => void;
}

const NextActionCard: React.FC<NextActionCardProps> = ({
  title,
  description,
  ctaLabel,
  onClick,
}) => (
  <motion.div
    whileHover={{ scale: 1.01 }}
    className="rounded-2xl p-5 md:p-6 flex flex-col gap-3 bg-[#DCE5F2] border border-[color:var(--finomik-blue-6)] shadow-sm"
  >
    <div className="flex items-center gap-2">
      <div className="w-9 h-9 rounded-full bg-white/70 flex items-center justify-center">
        <Sparkles size={18} className="text-finomik-primary" />
      </div>
      <div className="heading-2 text-sm text-finomik-primary font-semibold uppercase tracking-wider">
        Siguiente mejor paso
      </div>
    </div>
    <div className="heading-1 text-lg text-finomik-primary">{title}</div>
    <p className="text-xs md:text-sm text-[color:var(--finomik-blue-5)]">{description}</p>
    <button
      onClick={onClick}
      className="mt-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-finomik-primary text-white text-xs md:text-sm font-semibold shadow-md hover:opacity-95 transition-opacity"
    >
      {ctaLabel}
      <ArrowRight size={14} />
    </button>
  </motion.div>
);

export const Dashboard = () => {
  const { user, setCurrentScreen, themeMode, isRestrictedByZeroBalance } = useGame();
  const theme = getTheme(themeMode);

  const sortedLeaderboard = LEADERBOARD.map(p =>
    p.isUser ? { ...p, xp: user.xp } : p
  ).sort((a, b) => b.xp - a.xp);

  const nextNode = learningPath.find(node => !user.completedModules.includes(node.id));

  const holdingsEntries = Object.entries(user.portfolio.holdings) as [
    string,
    { quantity: number; averageCost: number }
  ][];
  const holdingsCount = holdingsEntries.length;
  const totalInvested = holdingsEntries.reduce(
    (acc, [, data]) => acc + data.quantity * data.averageCost,
    0
  );
  const totalPortfolioValue = totalInvested + user.portfolio.cash;

  const diversification =
    holdingsCount === 0 ? 'Sin invertir' : holdingsCount >= 3 ? 'Buena' : 'Concentrada';

  const progressChartData = [
    { name: 'Ahorro', progress: 85 },
    { name: 'Presupuesto', progress: 60 },
    { name: 'Inversión', progress: 40 },
    { name: 'Deudas', progress: 100 },
    { name: 'Impuestos', progress: 25 },
    { name: 'Seguros', progress: 0 },
  ];

  const lastCompletedId = user.completedModules[user.completedModules.length - 1];
  const lastCompletedNode = learningPath.find(n => n.id === lastCompletedId);

  return (
    <div className={theme.contentPadding}>
      {/* Hero */}
      <div className="space-y-4">
        <div>
          <h1 className={theme.headingLarge}>Tu aprendizaje financiero</h1>
          <p className={theme.textSubtle}>
            {themeMode === 'young'
              ? 'Organizamos tu aventura financiera paso a paso.'
              : 'Visualiza tu progreso y los siguientes pasos clave.'}
          </p>
        </div>

        <motion.div
          whileHover={theme.animation.whileHover}
          className="bg-finomik-gradient-strong text-white p-5 md:p-6 rounded-2xl relative overflow-hidden shadow-md"
        >
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-12 -mt-16" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full -ml-10 mb-[-2rem]" />
          <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center">
                  <Trophy size={18} className="text-white" />
                </div>
                <div className="text-xs font-medium uppercase tracking-wider opacity-80">
                  Nivel {user.level}
                </div>
              </div>
              <div>
                <div className="text-sm opacity-80 mb-1">Tu experiencia total</div>
                <div className="text-3xl md:text-4xl font-extrabold">{user.xp} XP</div>
                <div className="mt-3 w-full bg-white/15 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-white h-full rounded-full"
                    style={{ width: `${user.xp % 100}%` }}
                  />
                </div>
                <div className="mt-2 text-[11px] md:text-xs opacity-80">
                  Te faltan{' '}
                  <span className="font-semibold">{100 - (user.xp % 100)} XP</span> para el siguiente
                  nivel.
                </div>
              </div>
            </div>

            <div className="space-y-3 md:w-64">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-medium uppercase tracking-wider opacity-80">
                  Progreso del curso
                </span>
                <span className="text-sm font-semibold">{user.progress}%</span>
              </div>
              <div className="w-full bg-white/15 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-white h-full rounded-full"
                  style={{ width: `${user.progress}%` }}
                />
              </div>
              <div className="flex items-center justify-between gap-2 mt-3">
                <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full text-xs">
                  <Coins size={14} className="text-yellow-200" />
                  <span className="font-semibold">{user.coins} monedas</span>
                </div>
                <div className="hidden md:flex items-center gap-1 text-[11px] opacity-80">
                  <Flame size={14} className="text-orange-300" />
                  <span>{user.streak} días de racha</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {isRestrictedByZeroBalance && (
        <div className="mt-6 flex items-center gap-3 p-4 rounded-xl bg-finomik-warning-soft border border-finomik-warning/30">
          <AlertTriangle size={24} className="text-finomik-warning flex-shrink-0" />
          <p className="text-sm font-medium text-finomik-primary">
            Solo decisiones de supervivencia hasta recuperar saldo. El flujo neto mensual te permitirá recuperarte.
          </p>
        </div>
      )}

      {/* KPIs: perfil financiero */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          icon={Wallet}
          label="Saldo disponible"
          value={`${user.balance.toLocaleString('es-ES')} €`}
          helper="Dinero líquido en tu perfil simulado."
          onClick={() => setCurrentScreen('world')}
        />
        <KpiCard
          icon={PiggyBank}
          label="Fondo de Ahorro"
          value={`${user.savingsFund.toLocaleString('es-ES')} €`}
          helper="Reserva consciente; genera 2,5% anual."
          onClick={() => setCurrentScreen('savingsFund')}
        />
        <KpiCard
          icon={Star}
          label="Reputación financiera"
          value={`${user.reputation}/100`}
          helper="Refleja patrones de comportamiento."
        />
        <KpiCard
          icon={HeartPulse}
          label="Salud Financiera"
          value={`${user.financialHealth}/100`}
          helper="Índice compuesto del perfil."
        />
      </div>

      {/* Central section: next step + path + chart */}
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Izquierda: siguiente paso + resumen camino */}
        <div className="space-y-4">
          <NextActionCard
            title={
              nextNode
                ? `Continúa con: ${nextNode.title}`
                : 'Has completado el camino principal'
            }
            description={
              nextNode
                ? 'Termina este capítulo para desbloquear más contenido y recompensas.'
                : 'Puedes seguir reforzando conceptos, invirtiendo en el simulador o explorando noticias.'
            }
            ctaLabel={nextNode ? 'Ir al mapa de aprendizaje' : 'Ver mapa'}
            onClick={() => setCurrentScreen('world')}
          />

          <div className={`${theme.card} p-5 flex flex-col gap-4`}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className={theme.headingMedium}>Resumen del camino</h3>
                <p className={theme.textSubtle}>Introducción a las Finanzas</p>
              </div>
              <button
                onClick={() => setCurrentScreen('world')}
                className="text-xs font-semibold text-finomik-primary inline-flex items-center gap-1"
              >
                Ver mapa
                <ArrowRight size={12} />
              </button>
            </div>
            <div>
              <div className={`w-full bg-[color:var(--finomik-blue-6)] ${theme.progressBar} overflow-hidden`}>
                <div
                  className="bg-finomik-primary h-full rounded-full transition-all duration-500"
                  style={{ width: `${user.progress}%` }}
                />
              </div>
              <div className="mt-2 text-[11px] md:text-xs text-[color:var(--finomik-blue-5)]">
                Has completado{' '}
                <span className="font-semibold">{user.completedModules.length}</span> módulos de{' '}
                {learningPath.length}. Cada paso te acerca a la libertad financiera.
              </div>
            </div>
          </div>

          {/* Tu posición en clase — debajo de Resumen del camino para rellenar espacio y no tapar inversión */}
          <div className={`${theme.card} p-5`}>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className={theme.headingMedium}>Tu posición en clase</h3>
                <p className={theme.textSubtle}>Comparado con tu grupo</p>
              </div>
            </div>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 rounded-full bg-finomik-blue-soft flex items-center justify-center">
                <Trophy size={20} className="text-finomik-primary" />
              </div>
              <div>
                <div className="text-sm font-semibold text-finomik-primary">
                  #{sortedLeaderboard.findIndex(p => p.isUser) + 1} en el ranking
                </div>
                <div className="text-[11px] text-[color:var(--finomik-blue-5)]">
                  Sigue sumando XP para subir posiciones.
                </div>
              </div>
            </div>
            <div className="space-y-2">
              {sortedLeaderboard.slice(0, 3).map((player, index) => (
                <div
                  key={player.id}
                  className={`flex items-center justify-between text-xs py-1.5 px-2 rounded ${
                    player.isUser ? 'bg-finomik-blue-soft/80' : ''
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-4 text-center font-semibold text-[color:var(--finomik-blue-5)]">
                      {index + 1}
                    </span>
                    <span className="font-semibold text-finomik-primary">{player.name}</span>
                  </div>
                  <span className="text-[color:var(--finomik-blue-5)]">{player.xp} XP</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => setCurrentScreen('profile')}
              className="mt-3 w-full text-center text-[11px] font-semibold text-finomik-primary hover:bg-finomik-blue-soft/60 rounded-full py-2 transition-colors"
            >
              Ver ranking completo
            </button>
          </div>
        </div>

        {/* Derecha: gráfico + inversión */}
        <div className="space-y-4">
          <div className={`${theme.card} p-5 h-full flex flex-col gap-4`}>
            <div className="flex items-start justify-between gap-3 flex-shrink-0">
              <div>
                <h3 className={theme.headingMedium}>Progreso por bloque</h3>
                <p className={theme.textSubtle}>Cómo avanzas por cada tema</p>
              </div>
            </div>
            <div className="flex-1 min-h-[200px] w-full min-w-0">
              <ResponsiveBar
                data={progressChartData}
                keys={['progress']}
                indexBy="name"
                layout="vertical"
                margin={{ top: 8, right: 24, bottom: 48, left: 48 }}
                padding={0.3}
                valueScale={{ type: 'linear', min: 0, max: 100 }}
                indexScale={{ type: 'band', round: true }}
                colors={['#5574A7']}
                borderRadius={10}
                axisTop={null}
                axisRight={null}
                axisBottom={{ tickSize: 0, tickPadding: 8 }}
                axisLeft={{ tickSize: 0, tickPadding: 8, tickValues: 5, format: v => `${v}%` }}
                enableGridX={false}
                enableGridY={false}
                enableLabel={false}
                isInteractive
                tooltip={({ indexValue, value }) => (
                  <span className="bg-white px-2 py-1 rounded shadow text-xs">
                    {indexValue}: {value}%
                  </span>
                )}
              />
            </div>
          </div>

        </div>
      </div>

      {/* Fila inferior: inversión | recompensas | actividad — inversión primero para que no quede tapada */}
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-4">
        <div className="lg:col-span-1 order-1 lg:order-1">
          <div className={`${theme.card} p-5 flex flex-col gap-3 h-full`}>
            <div className="flex items-center justify-between mb-1">
              <div>
                <h3 className={theme.headingMedium}>Resumen de inversión</h3>
                <p className={theme.textSubtle}>Simulador de cartera Finomik</p>
              </div>
            </div>
            <div className="flex items-baseline justify-between gap-3">
              <div>
                <div className="text-[11px] text-[color:var(--finomik-blue-5)] uppercase font-semibold">
                  Valor total
                </div>
                <div className="text-xl font-bold text-finomik-primary">
                  € {totalPortfolioValue.toLocaleString('es-ES', { maximumFractionDigits: 0 })}
                </div>
              </div>
              <div className="text-right text-[11px] text-[color:var(--finomik-blue-5)]">
                <div>Efectivo: € {user.portfolio.cash.toLocaleString('es-ES')}</div>
                <div>Activos: {holdingsCount}</div>
              </div>
            </div>
            <div className="mt-1 flex items-center gap-2 text-[11px] text-[color:var(--finomik-blue-5)]">
              <LineChart size={14} className="text-finomik-primary" />
              <span>Diversificación {diversification.toLowerCase()} en tu cartera virtual.</span>
            </div>
            <button
              onClick={() => setCurrentScreen('invest')}
              className="mt-2 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-full text-[11px] font-semibold text-finomik-primary bg-finomik-blue-soft hover:bg-finomik-blue-soft/80 transition-colors"
            >
              Abrir simulador de inversión
              <ArrowRight size={12} />
            </button>
          </div>
        </div>
        <div className="lg:col-span-2 order-2 lg:order-2">
          <div className={`${theme.card} p-5 h-full flex flex-col gap-4`}>
            <div className="flex justify-between items-center mb-1">
              <div>
                <h3 className={theme.headingMedium}>Fondo de Ahorro</h3>
                <p className={theme.textSubtle}>
                  Tu cuenta remunerada dentro del simulador. Genera un 2,5% anual sobre tu colchón.
                </p>
              </div>
            </div>
            <div className="flex items-baseline justify-between gap-3">
              <div>
                <div className="text-[11px] text-[color:var(--finomik-blue-5)] uppercase font-semibold">
                  Saldo en el fondo
                </div>
                <div className="text-xl font-bold text-finomik-primary">
                  €{' '}
                  {user.savingsFund.toLocaleString('es-ES', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
              </div>
              <div className="w-10 h-10 rounded-full bg-finomik-blue-soft flex items-center justify-center">
                <PiggyBank size={20} className="text-finomik-primary" />
              </div>
            </div>
            <p className="text-[11px] text-[color:var(--finomik-blue-5)]">
              Este dinero está reservado como fondo de emergencia. Más adelante verás cómo se
              relaciona con tus decisiones de crédito y deuda.
            </p>
            <button
              onClick={() => setCurrentScreen('savingsFund')}
              className="mt-auto inline-flex items-center justify-center gap-2 px-3 py-2 rounded-full text-[11px] font-semibold text-finomik-primary bg-finomik-blue-soft hover:bg-finomik-blue-soft/80 transition-colors"
            >
              Abrir Fondo de Ahorro
              <ArrowRight size={12} />
            </button>
          </div>
        </div>

        <div className="space-y-4 order-3 lg:order-3 lg:col-span-1">
          <div className={`${theme.card} p-4 text-[11px] space-y-2`}>
            <div className="flex items-center gap-2">
              <Sparkles size={14} className="text-finomik-primary" />
              <span className="font-semibold text-finomik-primary">Actividad reciente</span>
            </div>
            {lastCompletedNode ? (
              <p className="text-[color:var(--finomik-blue-5)]">
                Último módulo completado:{' '}
                <span className="font-semibold text-finomik-primary">
                  {lastCompletedNode.title}
                </span>
              </p>
            ) : (
              <p className="text-[color:var(--finomik-blue-5)]">
                Aún no has completado ningún módulo. Empieza con el primer capítulo del mapa.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
