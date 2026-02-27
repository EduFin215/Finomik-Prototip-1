import type { PortfolioHistoryEntry } from '../context/GameContext';

export interface SimulatedPoint {
  name: string;
  value: number;
}

// Deterministic pseudo-random generator based on a string seed
const createSeededRandom = (seed: string) => {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return () => {
    h ^= h << 13;
    h ^= h >>> 17;
    h ^= h << 5;
    return (h >>> 0) / 0xffffffff;
  };
};

export const generateAssetSeries = (
  symbol: string,
  basePrice: number,
  points: number = 30
): SimulatedPoint[] => {
  const rand = createSeededRandom(symbol);

  // Define a simple drift/vol profile per asset
  const baseDrift = (rand() - 0.5) * 0.04; // between -2% and +2% over the period
  const volatility = 0.01 + rand() * 0.04; // 1% to 5% daily-ish

  const result: SimulatedPoint[] = [];
  let price = basePrice;

  for (let i = points - 1; i >= 0; i--) {
    const noise = (rand() - 0.5) * 2 * volatility;
    const driftComponent = baseDrift / points;
    const change = driftComponent + noise;
    price = Math.max(0.2 * basePrice, price * (1 + change));
    result.unshift({
      name: `D${i + 1}`,
      value: Number(price.toFixed(2)),
    });
  }

  return result;
};

export const generatePortfolioSeries = (
  holdings: Record<string, { quantity: number; averageCost: number }>,
  assets: { symbol: string; price: number }[],
  history: PortfolioHistoryEntry[] = [],
  points: number = 30
): SimulatedPoint[] => {
  const symbols = Object.keys(holdings);
  if (symbols.length === 0) {
    // Flat zero series when there is nothing invertido
    return Array.from({ length: points }).map((_, idx) => ({
      name: `D${idx + 1}`,
      value: 0,
    }));
  }

  // Generate a series per asset and weight by current quantity
  const perAssetSeries: Record<string, SimulatedPoint[]> = {};
  symbols.forEach(symbol => {
    const asset = assets.find(a => a.symbol === symbol);
    if (!asset) return;
    perAssetSeries[symbol] = generateAssetSeries(symbol, asset.price, points);
  });

  const result: SimulatedPoint[] = [];
  for (let i = 0; i < points; i++) {
    let total = 0;
    symbols.forEach(symbol => {
      const series = perAssetSeries[symbol];
      const h = holdings[symbol];
      if (!series || !h) return;
      const point = series[i];
      total += point.value * h.quantity;
    });
    result.push({
      name: `D${i + 1}`,
      value: Number(total.toFixed(2)),
    });
  }

  return result;
};

