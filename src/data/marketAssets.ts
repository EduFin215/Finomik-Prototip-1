/**
 * 15 activos del mercado Finomik (Doc3), desbloqueados por Nivel de Inversor.
 * Nivel 1: 6 activos. Nivel 2: 10. Nivel 3: 13. Nivel 4: 15.
 */

export type AssetType = 'Stock' | 'ETF' | 'Bond' | 'Fund';

export interface MarketAsset {
  symbol: string;
  name: string;
  type: AssetType;
  sector: string;
  region: string;
  basePrice: number;
  volatility: number;
  drift: number;
  /** Nivel mínimo de inversor para desbloquear (1-4) */
  minLevel: 1 | 2 | 3 | 4;
}

export type InvestorLevel = 1 | 2 | 3 | 4;

export const ALL_MARKET_ASSETS: MarketAsset[] = [
  // Nivel 1 — 6 activos base
  {
    symbol: 'VWRL',
    name: 'Vanguard FTSE All-World',
    type: 'ETF',
    sector: 'Renta variable global',
    region: 'Global',
    basePrice: 100,
    volatility: 0.015,
    drift: 0.007,
    minLevel: 1,
  },
  {
    symbol: 'AGGG',
    name: 'iShares Core Global Aggregate Bond',
    type: 'ETF',
    sector: 'Renta fija global',
    region: 'Global',
    basePrice: 95,
    volatility: 0.008,
    drift: 0.003,
    minLevel: 1,
  },
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    type: 'Stock',
    sector: 'Tecnología',
    region: 'EE.UU.',
    basePrice: 180,
    volatility: 0.03,
    drift: 0.01,
    minLevel: 1,
  },
  {
    symbol: 'NESN',
    name: 'Nestlé',
    type: 'Stock',
    sector: 'Consumo',
    region: 'Europa',
    basePrice: 95,
    volatility: 0.02,
    drift: 0.006,
    minLevel: 1,
  },
  {
    symbol: 'TTE',
    name: 'TotalEnergies',
    type: 'Stock',
    sector: 'Energía',
    region: 'Europa',
    basePrice: 65,
    volatility: 0.028,
    drift: 0.008,
    minLevel: 1,
  },
  {
    symbol: 'GLD',
    name: 'SPDR Gold Shares',
    type: 'ETF',
    sector: 'Materias primas',
    region: 'Global',
    basePrice: 180,
    volatility: 0.02,
    drift: 0.002,
    minLevel: 1,
  },
  // Nivel 2 — +4
  {
    symbol: 'HEAL',
    name: 'iShares Healthcare Innovation',
    type: 'ETF',
    sector: 'Salud',
    region: 'Global',
    basePrice: 85,
    volatility: 0.022,
    drift: 0.007,
    minLevel: 2,
  },
  {
    symbol: 'VFEM',
    name: 'Vanguard FTSE Emerging Markets',
    type: 'ETF',
    sector: 'Mercados emergentes',
    region: 'Global',
    basePrice: 45,
    volatility: 0.035,
    drift: 0.005,
    minLevel: 2,
  },
  {
    symbol: 'JPM',
    name: 'JPMorgan Chase',
    type: 'Stock',
    sector: 'Financiero',
    region: 'EE.UU.',
    basePrice: 195,
    volatility: 0.028,
    drift: 0.01,
    minLevel: 2,
  },
  {
    symbol: 'SIE',
    name: 'Siemens',
    type: 'Stock',
    sector: 'Industrial',
    region: 'Europa',
    basePrice: 175,
    volatility: 0.022,
    drift: 0.006,
    minLevel: 2,
  },
  // Nivel 3 — +3
  {
    symbol: 'EPRA',
    name: 'Amundi FTSE EPRA NAREIT',
    type: 'ETF',
    sector: 'Inmobiliario',
    region: 'Global',
    basePrice: 28,
    volatility: 0.025,
    drift: 0.004,
    minLevel: 3,
  },
  {
    symbol: 'BHP',
    name: 'BHP Group',
    type: 'Stock',
    sector: 'Materias primas',
    region: 'Global',
    basePrice: 55,
    volatility: 0.035,
    drift: 0.006,
    minLevel: 3,
  },
  {
    symbol: 'IEAC',
    name: 'iShares Euro Corp Bond',
    type: 'ETF',
    sector: 'Renta fija corporativa',
    region: 'Europa',
    basePrice: 98,
    volatility: 0.012,
    drift: 0.003,
    minLevel: 3,
  },
  // Nivel 4 — +2
  {
    symbol: 'VHYL',
    name: 'Vanguard FTSE All-World High Dividend',
    type: 'ETF',
    sector: 'Dividendos',
    region: 'Global',
    basePrice: 52,
    volatility: 0.02,
    drift: 0.006,
    minLevel: 4,
  },
  {
    symbol: 'MRNA',
    name: 'Moderna',
    type: 'Stock',
    sector: 'Biotecnología',
    region: 'EE.UU.',
    basePrice: 95,
    volatility: 0.045,
    drift: 0.008,
    minLevel: 4,
  },
];

const LEVEL_LABELS: Record<InvestorLevel, string> = {
  1: 'Inversor Inicial',
  2: 'Inversor Diversificado',
  3: 'Inversor Estratégico',
  4: 'Inversor Avanzado',
};

/**
 * Devuelve los activos disponibles para el nivel de inversor dado.
 * Nivel 1: 6, Nivel 2: 10, Nivel 3: 13, Nivel 4: 15.
 */
export function getAssetsForLevel(level: InvestorLevel): MarketAsset[] {
  return ALL_MARKET_ASSETS.filter(a => a.minLevel <= level);
}

export function getInvestorLevelLabel(level: InvestorLevel): string {
  return LEVEL_LABELS[level];
}
