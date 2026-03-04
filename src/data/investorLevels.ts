import type { InvestorLevel, UserState } from '../context/GameContext';
import { ALL_MARKET_ASSETS } from './marketAssets';

export type InvestorRequirementType = 'operations' | 'diversification' | 'onboarding';

export interface InvestorLevelRequirement {
  id: string;
  type: InvestorRequirementType;
  label: string;
  helpText: string;
  /**
   * Umbral numérico genérico:
   * - operations: número mínimo de operaciones realizadas.
   * - diversification: 1 = baja, 2 = media, 3 = alta.
   */
  threshold?: number;
}

export interface InvestorLevelUnlocks {
  availableAssets: number;
  maxInvestiblePct: number;
  maxOperationsPerLesson: number;
}

export interface InvestorLevelConfig {
  id: InvestorLevel;
  label: string;
  tagline: string;
  description: string;
  unlocks: InvestorLevelUnlocks;
  requirements: InvestorLevelRequirement[];
}

// Derivamos el número real de activos por nivel desde ALL_MARKET_ASSETS para mantenerlo en sincronía.
const assetsPerLevel: Record<InvestorLevel, number> = {
  1: ALL_MARKET_ASSETS.filter(a => a.minLevel <= 1).length as number,
  2: ALL_MARKET_ASSETS.filter(a => a.minLevel <= 2).length as number,
  3: ALL_MARKET_ASSETS.filter(a => a.minLevel <= 3).length as number,
  4: ALL_MARKET_ASSETS.filter(a => a.minLevel <= 4).length as number,
};

export const INVESTOR_LEVELS: InvestorLevelConfig[] = [
  {
    id: 1,
    label: 'Inversor Inicial',
    tagline: 'Aprendes a moverte con pocos activos y riesgos controlados.',
    description:
      'Empiezas practicando con una selección reducida de activos para centrarte en las bases: cómo funciona una orden, cómo se ve la evolución de una cartera y qué significa diversificar poco a poco.',
    unlocks: {
      availableAssets: assetsPerLevel[1],
      maxInvestiblePct: 30,
      maxOperationsPerLesson: 2,
    },
    requirements: [
      {
        id: 'onboarding',
        type: 'onboarding',
        label: 'Completar la clase de inversión y el mini test',
        helpText:
          'Antes de abrir el simulador necesitas haber pasado por la clase guiada y el test final.',
      },
    ],
  },
  {
    id: 2,
    label: 'Inversor Diversificado',
    tagline: 'Empiezas a repartir tu cartera entre más ideas.',
    description:
      'Añades activos de más regiones y sectores para practicar qué significa tener una cartera diversificada y no depender de un solo movimiento del mercado.',
    unlocks: {
      availableAssets: assetsPerLevel[2],
      maxInvestiblePct: 35,
      maxOperationsPerLesson: 3,
    },
    requirements: [
      {
        id: 'ops-basic',
        type: 'operations',
        threshold: 3,
        label: 'Realizar al menos 3 operaciones en el simulador',
        helpText:
          'Compra y/o vende varios activos para familiarizarte con cómo cambian tus posiciones.',
      },
      {
        id: 'diversification-basic',
        type: 'diversification',
        threshold: 2,
        label: 'Alcanzar una diversificación media en tu cartera',
        helpText:
          'Construye una cartera con varios activos diferentes para que el peso no se concentre en uno solo.',
      },
    ],
  },
  {
    id: 3,
    label: 'Inversor Estratégico',
    tagline: 'Tomas decisiones pensando en el conjunto de tu cartera.',
    description:
      'Refuerzas la idea de tener objetivos, horizonte temporal y una mezcla de activos que tenga sentido para ti, no solo los que más se mueven.',
    unlocks: {
      availableAssets: assetsPerLevel[3],
      maxInvestiblePct: 40,
      maxOperationsPerLesson: 4,
    },
    requirements: [
      {
        id: 'ops-intermediate',
        type: 'operations',
        threshold: 6,
        label: 'Realizar al menos 6 operaciones en total',
        helpText:
          'Practica diferentes momentos de compra y, si te encaja, alguna venta de rebalanceo.',
      },
      {
        id: 'diversification-strong',
        type: 'diversification',
        threshold: 3,
        label: 'Alcanzar una diversificación alta en tu cartera',
        helpText:
          'Reparte tu cartera entre más posiciones para que ningún activo tenga un peso excesivo.',
      },
    ],
  },
  {
    id: 4,
    label: 'Inversor Avanzado',
    tagline: 'Tu foco está en mantener un plan coherente en el tiempo.',
    description:
      'Has practicado suficientes decisiones como para centrarte en mantener la calma y revisar tu cartera con criterio cuando el mercado se mueve.',
    unlocks: {
      availableAssets: assetsPerLevel[4],
      maxInvestiblePct: 50,
      maxOperationsPerLesson: 5,
    },
    requirements: [
      {
        id: 'ops-expert',
        type: 'operations',
        threshold: 10,
        label: 'Acumular al menos 10 operaciones en el simulador',
        helpText:
          'Has vivido varias compras y ventas en distintos momentos del ciclo simulado.',
      },
      {
        id: 'diversification-maintain',
        type: 'diversification',
        threshold: 3,
        label: 'Mantener una cartera diversificada en el tiempo',
        helpText:
          'No solo llegas a diversificación alta, sino que mantienes esa estructura mientras sigues operando.',
      },
    ],
  },
];

export function getLevelConfig(level: InvestorLevel): InvestorLevelConfig | undefined {
  return INVESTOR_LEVELS.find(l => l.id === level);
}

export function getNextLevelConfig(level: InvestorLevel): InvestorLevelConfig | undefined {
  const ordered = INVESTOR_LEVELS.sort((a, b) => a.id - b.id);
  const idx = ordered.findIndex(l => l.id === level);
  if (idx === -1 || idx === ordered.length - 1) return undefined;
  return ordered[idx + 1];
}

export function getAllLevels(): InvestorLevelConfig[] {
  return INVESTOR_LEVELS.slice().sort((a, b) => a.id - b.id);
}

export function getRequirementCompletion(
  requirement: InvestorLevelRequirement,
  user: UserState,
  diversificationScore: number,
): boolean {
  const totalOperations = user.portfolio.history.length;

  switch (requirement.type) {
    case 'operations':
      return totalOperations >= (requirement.threshold ?? 0);
    case 'diversification':
      return diversificationScore >= (requirement.threshold ?? 0);
    case 'onboarding':
      return Boolean(user.hasCompletedInvestClass && user.hasPassedToolsFinalTest);
    default:
      return false;
  }
}

