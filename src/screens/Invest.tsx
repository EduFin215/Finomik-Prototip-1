import React, { useMemo, useState } from 'react';
import { useGame } from '../context/GameContext';
import {
  TrendingUp,
  TrendingDown,
  PieChart as PieIcon,
  Activity,
  AlertTriangle,
  Info,
  X as CloseIcon,
} from 'lucide-react';
import { ResponsiveLine } from '@nivo/line';
import { ResponsiveBar } from '@nivo/bar';
import { ResponsivePie } from '@nivo/pie';
import { getTheme } from '../utils/theme';
import { generateAssetSeries, generatePortfolioSeries } from '../utils/portfolioSimulation';
import { getAssetsForLevel, getInvestorLevelLabel, type MarketAsset } from '../data/marketAssets';
import { lineChartDefaults, lineChartTooltipClass } from '../utils/lineChartTheme';

const ALLOCATION_COLORS: Record<string, string> = {
  Stock: '#2563eb',
  ETF: '#7c3aed',
  Bond: '#0f766e',
  Fund: '#f97316',
  Other: '#4b5563',
};

type TradeMode = 'buy' | 'sell';
type TradeStep = 1 | 2;

interface TradeModalState {
  mode: TradeMode;
  step: TradeStep;
  symbol: string;
  draft: {
    modeInput: 'amount' | 'units';
    amount?: string;
    units?: string;
  };
}

export const Invest = () => {
  const { user, buyAsset, sellAsset, themeMode } = useGame();
  const theme = getTheme(themeMode);

  const ASSETS = useMemo(() => getAssetsForLevel(user.investorLevel), [user.investorLevel]);
  const investorLevelLabel = getInvestorLevelLabel(user.investorLevel);

  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);
  const [modalState, setModalState] = useState<TradeModalState | null>(null);
  const [section, setSection] = useState<'summary' | 'allocation' | 'activity'>('summary');

  const effectiveSelectedSymbol = selectedSymbol ?? ASSETS[0]?.symbol ?? null;

  const assetsBySymbol = useMemo(
    () =>
      ASSETS.reduce<Record<string, MarketAsset>>((acc, asset) => {
        acc[asset.symbol] = asset;
        return acc;
      }, {}),
    [ASSETS]
  );

  const assetSeriesBySymbol = useMemo(() => {
    const result: Record<string, { name: string; value: number }[]> = {};
    ASSETS.forEach(asset => {
      result[asset.symbol] = generateAssetSeries(asset.symbol, asset.basePrice, 60);
    });
    return result;
  }, [ASSETS]);

  const latestPriceBySymbol = useMemo(() => {
    const map: Record<string, number> = {};
    Object.entries(assetSeriesBySymbol).forEach(([symbol, series]) => {
      if (series.length === 0) return;
      map[symbol] = series[series.length - 1].value;
    });
    return map;
  }, [assetSeriesBySymbol]);

  const portfolioHoldings = Object.entries(
    user.portfolio.holdings
  ) as [string, { quantity: number; averageCost: number }][];
  const portfolioHistory = user.portfolio.history || [];

  const portfolioSeries = useMemo(
    () =>
      generatePortfolioSeries(
        user.portfolio.holdings,
        Object.entries(latestPriceBySymbol).map(([symbol, price]) => ({ symbol, price })),
        portfolioHistory,
        60
      ),
    [user.portfolio.holdings, latestPriceBySymbol, portfolioHistory]
  );

  const portfolioMetrics = useMemo(() => {
    if (portfolioHoldings.length === 0) {
      return {
        totalCurrentInvested: 0,
        totalCostBasis: 0,
        unrealizedPL: 0,
        unrealizedPLPct: 0,
        allocationByType: [] as { type: string; value: number; percent: number }[],
        topWeights: [] as { symbol: string; weight: number; value: number }[],
        bestAsset: null as null | { symbol: string; gainLoss: number },
        worstAsset: null as null | { symbol: string; gainLoss: number },
        diversification: 'Sin invertir',
        risk: 'Bajo',
      };
    }

    let totalCurrentInvested = 0;
    let totalCostBasis = 0;
    const allocationMap = new Map<string, number>();
    const perAssetValue: { symbol: string; value: number; gainLoss: number }[] = [];

    portfolioHoldings.forEach(([symbol, data]) => {
      const price = latestPriceBySymbol[symbol];
      if (!price || data.quantity <= 0) return;
      const currentValue = price * data.quantity;
      const costBasis = data.averageCost * data.quantity;
      const gainLoss = currentValue - costBasis;

      totalCurrentInvested += currentValue;
      totalCostBasis += costBasis;

      const asset = assetsBySymbol[symbol];
      const typeKey = asset?.type ?? 'Other';
      allocationMap.set(typeKey, (allocationMap.get(typeKey) || 0) + currentValue);

      perAssetValue.push({ symbol, value: currentValue, gainLoss });
    });

    const allocationByType: { type: string; value: number; percent: number }[] = [];
    const totalForPercent = Array.from(allocationMap.values()).reduce((acc, v) => acc + v, 0);
    allocationMap.forEach((value, type) => {
      allocationByType.push({
        type,
        value,
        percent: totalForPercent > 0 ? (value / totalForPercent) * 100 : 0,
      });
    });

    const unrealizedPL = totalCurrentInvested - totalCostBasis;
    const unrealizedPLPct = totalCostBasis > 0 ? (unrealizedPL / totalCostBasis) * 100 : 0;

    const sortedByValue = perAssetValue
      .slice()
      .sort((a, b) => b.value - a.value)
      .map(a => ({
        symbol: a.symbol,
        value: a.value,
        weight: totalCurrentInvested > 0 ? (a.value / totalCurrentInvested) * 100 : 0,
      }));

    const bestAsset =
      perAssetValue.length > 0
        ? perAssetValue.reduce(
            (best, current) => (best === null || current.gainLoss > best.gainLoss ? current : best),
            null as { symbol: string; gainLoss: number } | null
          )
        : null;
    const worstAsset =
      perAssetValue.length > 0
        ? perAssetValue.reduce(
            (worst, current) => (worst === null || current.gainLoss < worst.gainLoss ? current : worst),
            null as { symbol: string; gainLoss: number } | null
          )
        : null;

    const numPositions = perAssetValue.length;
    const maxWeight = sortedByValue[0]?.weight ?? 0;
    let diversification: string;
    if (numPositions === 0) {
      diversification = 'Sin invertir';
    } else if (numPositions <= 2 || maxWeight > 60) {
      diversification = 'Baja';
    } else if (numPositions <= 4 || maxWeight > 40) {
      diversification = 'Media';
    } else {
      diversification = 'Alta';
    }

    const risk =
      allocationMap.get('Stock') && totalCurrentInvested > 0
        ? allocationMap.get('Stock')! / totalCurrentInvested > 0.7
          ? 'Alto'
          : allocationMap.get('Stock')! / totalCurrentInvested > 0.4
          ? 'Moderado'
          : 'Bajo'
        : 'Bajo';

    return {
      totalCurrentInvested,
      totalCostBasis,
      unrealizedPL,
      unrealizedPLPct,
      allocationByType,
      topWeights: sortedByValue.slice(0, 5),
      bestAsset,
      worstAsset,
      diversification,
      risk,
    };
  }, [portfolioHoldings, latestPriceBySymbol, assetsBySymbol]);

  const totalInvestedValue = portfolioMetrics.totalCurrentInvested;
  const totalValue = user.portfolio.cash + totalInvestedValue;

  const contributionChartData = useMemo(() => {
    if (portfolioHoldings.length === 0) return [];
    return portfolioHoldings
      .map(([symbol, data]) => {
        const price = latestPriceBySymbol[symbol];
        if (!price || data.quantity <= 0) return null;
        const currentValue = price * data.quantity;
        const costBasis = data.averageCost * data.quantity;
        const gainLoss = currentValue - costBasis;
        return { name: symbol, gainLoss };
      })
      .filter((d): d is { name: string; gainLoss: number } => d !== null);
  }, [portfolioHoldings, latestPriceBySymbol]);

  const insightsList = useMemo(() => {
    const insights: string[] = [];
    if (portfolioHoldings.length === 0) return insights;

    const numPositions = portfolioMetrics.topWeights.length;
    const top3Weight = portfolioMetrics.topWeights
      .slice(0, 3)
      .reduce((acc, item) => acc + item.weight, 0);

    if (portfolioMetrics.diversification === 'Baja') {
      insights.push(
        'Tu cartera está muy concentrada en pocas posiciones. Esto significa que unos pocos activos explican casi todo tu resultado, aumentando el riesgo de que un solo movimiento afecte a todo el conjunto.'
      );
    } else if (portfolioMetrics.diversification === 'Media') {
      insights.push(
        'Tu diversificación es razonable, pero aún se apoya bastante en algunos activos clave. Podrías reducir el peso de tus mayores posiciones si quieres repartir mejor el riesgo.'
      );
    } else if (portfolioMetrics.diversification === 'Alta') {
      insights.push(
        'Tu cartera está bien diversificada en número de posiciones. Aun así, revisa periódicamente si el mix entre tipos de activo encaja con tu perfil de riesgo.'
      );
    }

    if (top3Weight > 0) {
      insights.push(
        `Tus 3 mayores posiciones concentran aproximadamente el ${top3Weight.toFixed(
          1
        )}% de la cartera. Cuando unas pocas posiciones pesan tanto, conviene entender muy bien en qué estás invertido.`
      );
    }

    if (portfolioMetrics.bestAsset && portfolioMetrics.bestAsset.gainLoss > 0) {
      insights.push(
        `Gran parte de tus plusvalías vienen de ${portfolioMetrics.bestAsset.symbol}. Si este activo pesa mucho en tu cartera, su comportamiento futuro tendrá un impacto muy relevante en tu resultado total.`
      );
    }

    if (portfolioMetrics.worstAsset && portfolioMetrics.worstAsset.gainLoss < 0) {
      insights.push(
        `El peor comportamiento viene de ${portfolioMetrics.worstAsset.symbol}. Puede ser normal en el corto plazo, pero revisa si sigue encajando con tu tolerancia al riesgo y tu horizonte temporal.`
      );
    }

    if (portfolioMetrics.totalCostBasis > 0) {
      const plPct = portfolioMetrics.unrealizedPLPct;
      if (plPct > 5) {
        insights.push(
          'En conjunto, tu cartera acumula una rentabilidad positiva sobre el capital aportado. Recuerda que las rentabilidades pasadas no garantizan resultados futuros, pero vas en buena dirección en este periodo simulado.'
        );
      } else if (plPct < -5) {
        insights.push(
          'Tu cartera acumula pérdidas relevantes en este periodo simulado. Este entorno es ideal para practicar cómo reaccionarías ante caídas sin poner en riesgo dinero real.'
        );
      }
    }

    if (numPositions < 5) {
      insights.push(
        `Tienes ${numPositions} posiciones en cartera. Para una diversificación básica suelen recomendarse al menos entre 5 y 10 activos diferentes, repartiendo el riesgo entre sectores y regiones.`
      );
    }

    return insights.slice(0, 5);
  }, [portfolioHoldings, portfolioMetrics]);

  const selectedAsset =
    (effectiveSelectedSymbol && assetsBySymbol[effectiveSelectedSymbol]) || ASSETS[0] || null;

  const selectedPosition =
    effectiveSelectedSymbol && portfolioHoldings.find(([symbol]) => symbol === effectiveSelectedSymbol)
      ? (() => {
          const [, data] =
            portfolioHoldings.find(([symbol]) => symbol === effectiveSelectedSymbol) ||
            (['', { quantity: 0, averageCost: 0 }] as [
              string,
              { quantity: number; averageCost: number },
            ]);
          const price = latestPriceBySymbol[effectiveSelectedSymbol!] || 0;
          const currentValue = price * data.quantity;
          const costBasis = data.averageCost * data.quantity;
          const gainLoss = currentValue - costBasis;
          const returnPct = costBasis > 0 ? (gainLoss / costBasis) * 100 : 0;
          return {
            symbol: effectiveSelectedSymbol!,
            quantity: data.quantity,
            averageCost: data.averageCost,
            currentValue,
            gainLoss,
            returnPct,
          };
        })()
      : null;

  const recentHistory = useMemo(() => {
    if (!portfolioHistory.length) return [];
    return [...portfolioHistory]
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 5);
  }, [portfolioHistory]);

  const openTradeModal = (symbol: string, initialMode: TradeMode = 'buy') => {
    setModalState({
      mode: initialMode,
      step: 1,
      symbol,
      draft: {
        modeInput: initialMode === 'buy' ? 'amount' : 'units',
        amount: '',
        units: '',
      },
    });
  };

  const closeModal = () => setModalState(null);

  const advanceStep = (step: TradeStep) =>
    setModalState(prev => (prev ? { ...prev, step } : prev));

  const updateDraft = (draft: TradeModalState['draft']) =>
    setModalState(prev => (prev ? { ...prev, draft: { ...prev.draft, ...draft } } : prev));

  const setModalMode = (newMode: TradeMode) =>
    setModalState(prev => (prev ? { ...prev, mode: newMode } : prev));

  const MarketCarousel: React.FC = () => (
    <section className={`${theme.card} p-5`}>
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className={theme.headingMedium}>Mercado simulado</h3>
          <p className="text-[11px] text-[color:var(--finomik-blue-5)]">
            Explora los activos disponibles y selecciona uno para ver más detalles.
          </p>
        </div>
      </div>
      <div className="-mx-2 overflow-x-auto">
        <div className="flex gap-3 px-2 pb-1 min-w-max">
          {ASSETS.map(asset => {
            const isSelected = effectiveSelectedSymbol === asset.symbol;
            const price = latestPriceBySymbol[asset.symbol] || asset.basePrice;
            return (
              <button
                key={asset.symbol}
                onClick={() => setSelectedSymbol(asset.symbol)}
                className={`flex-none w-56 rounded-2xl border px-4 py-3 text-left transition-colors ${
                  isSelected
                    ? 'border-finomik-primary bg-finomik-blue-soft'
                    : 'border-[color:var(--finomik-blue-6)] bg-white hover:border-finomik-primary/50'
                }`}
              >
                <div className="flex items-baseline justify-between gap-2">
                  <div>
                    <div className="text-xs font-semibold text-finomik-primary">
                      {asset.symbol}
                    </div>
                    <div className="text-[11px] text-[color:var(--finomik-blue-5)] truncate max-w-[140px]">
                      {asset.name}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] uppercase text-[color:var(--finomik-blue-5)]">
                      Precio
                    </div>
                    <div className="text-sm font-semibold text-finomik-primary">
                      € {price.toFixed(2)}
                    </div>
                  </div>
                </div>
                <div className="mt-2 flex items-center justify-between text-[10px] text-[color:var(--finomik-blue-5)]">
                  <span>
                    {asset.type} · {asset.region}
                  </span>
                  <span className="text-[color:var(--finomik-blue-4)] font-semibold">
                    Ver detalle
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );

  const renderTradeModal = () => {
    if (!modalState) return null;
    const asset = assetsBySymbol[modalState.symbol];
    const series = assetSeriesBySymbol[modalState.symbol] || [];
    const price = latestPriceBySymbol[modalState.symbol] || asset?.basePrice || 0;
    const holding = user.portfolio.holdings[modalState.symbol];
    const { mode, step, draft } = modalState;
    const modeLabel = mode === 'buy' ? 'Compra' : 'Venta';

    const amount = parseFloat(draft.amount || '0') || 0;
    const units =
      draft.modeInput === 'units'
        ? parseFloat(draft.units || '0') || 0
        : price > 0
        ? amount / price
        : 0;
    const costOrRevenue = units * price;

    const insufficientCash =
      mode === 'buy' && draft.modeInput === 'amount' && costOrRevenue > user.portfolio.cash;
    const insufficientHoldings =
      mode === 'sell' &&
      units > 0 &&
      (!holding || units > holding.quantity);

    const handleConfirm = () => {
      if (units <= 0 || price <= 0) return;
      if (mode === 'buy') {
        if (insufficientCash) return;
        buyAsset(modalState.symbol, price, units);
      } else {
        if (insufficientHoldings) return;
        sellAsset(modalState.symbol, price, units);
      }
      closeModal();
    };

    const assetTypeLabel =
      asset.type === 'Stock' ? 'acción (renta variable)' : asset.type === 'ETF' ? 'ETF' : asset.type === 'Bond' ? 'bono (renta fija)' : 'fondo';
    const volatilityLabel =
      asset.volatility > 0.03 ? 'alta' : asset.volatility > 0.02 ? 'media' : 'baja';

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-auto my-8 p-6 md:p-8 space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-xs uppercase font-semibold text-[color:var(--finomik-blue-5)] tracking-wider">
                {modeLabel} · {asset.symbol}
              </div>
              <h2 className="mt-1 text-2xl font-bold text-finomik-primary">{asset.name}</h2>
            </div>
            <button
              onClick={closeModal}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              aria-label="Cerrar"
            >
              <CloseIcon size={24} />
            </button>
          </div>

          {step === 1 && (
            <>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <span className="text-base text-[color:var(--finomik-blue-5)] font-medium">
                  Elige cómo quieres operar este activo
                </span>
                <div className="flex bg-finomik-blue-soft rounded-xl p-1 gap-1">
                  <button
                    onClick={() => setModalMode('buy')}
                    className={`px-5 py-2.5 rounded-lg font-semibold text-base transition-colors ${
                      mode === 'buy'
                        ? 'bg-white text-finomik-primary shadow-sm'
                        : 'text-[color:var(--finomik-blue-5)] hover:text-finomik-primary'
                    }`}
                  >
                    Comprar
                  </button>
                  <button
                    onClick={() => setModalMode('sell')}
                    className={`px-5 py-2.5 rounded-lg font-semibold text-base transition-colors ${
                      mode === 'sell'
                        ? 'bg-white text-finomik-primary shadow-sm'
                        : 'text-[color:var(--finomik-blue-5)] hover:text-finomik-primary'
                    }`}
                  >
                    Vender
                  </button>
                </div>
              </div>
              <div className="h-40 w-full rounded-xl overflow-hidden bg-slate-50/50 border border-slate-100">
                <ResponsiveLine
                  data={[{ id: 'precio', data: series.map(d => ({ x: d.name, y: d.value })) }]}
                  margin={{ top: 8, right: 24, bottom: 36, left: 40 }}
                  xScale={{ type: 'point' }}
                  yScale={{ type: 'linear', min: 'auto', max: 'auto' }}
                  curve={lineChartDefaults.curve}
                  defs={lineChartDefaults.defs}
                  fill={lineChartDefaults.fill}
                  theme={lineChartDefaults.theme}
                  axisTop={null}
                  axisRight={null}
                  axisBottom={{ tickSize: 0, tickPadding: 8, tickRotation: -25 }}
                  axisLeft={{ tickSize: 0, tickPadding: 8, tickValues: 5 }}
                  enableArea={lineChartDefaults.enableArea}
                  areaOpacity={lineChartDefaults.areaOpacity}
                  lineWidth={lineChartDefaults.lineWidth}
                  colors={lineChartDefaults.colors}
                  pointSize={lineChartDefaults.pointSize}
                  pointColor={lineChartDefaults.pointColor}
                  pointBorderWidth={lineChartDefaults.pointBorderWidth}
                  pointBorderColor={lineChartDefaults.pointBorderColor}
                  enableGridX={lineChartDefaults.enableGridX}
                  enableGridY={lineChartDefaults.enableGridY}
                  isInteractive={lineChartDefaults.isInteractive}
                  useMesh={lineChartDefaults.useMesh}
                  tooltip={({ point }) => (
                    <span className={lineChartTooltipClass}>
                      € {Number(point.data.y).toFixed(2)}
                    </span>
                  )}
                />
              </div>
              <div className="rounded-xl bg-finomik-blue-soft/40 border border-[color:var(--finomik-blue-6)] p-5 space-y-3">
                <h3 className="text-base font-bold text-finomik-primary">Qué es este activo</h3>
                <ul className="text-base text-[color:var(--finomik-blue-2)] space-y-2 leading-relaxed">
                  <li>
                    <strong>{asset.name}</strong> es un {assetTypeLabel} del sector {asset.sector} ({asset.region}).
                  </li>
                  <li>
                    Volatilidad {volatilityLabel}: el precio puede subir o bajar más que en activos más estables.
                  </li>
                  <li>
                    {mode === 'buy' ? 'Si compras,' : 'Si vendes,'} la operación se ejecuta al precio actual del simulador.
                  </li>
                </ul>
              </div>
              <div className="flex flex-wrap justify-end gap-3 pt-2">
                <button
                  onClick={closeModal}
                  className="px-5 py-3 rounded-xl border-2 border-[color:var(--finomik-blue-6)] text-base font-semibold text-[color:var(--finomik-blue-5)] hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => advanceStep(2)}
                  className="px-6 py-3 rounded-xl bg-finomik-primary text-white text-base font-semibold hover:opacity-95 shadow-lg"
                >
                  Continuar a {mode === 'buy' ? 'compra' : 'venta'}
                </button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <span className="text-base font-medium text-[color:var(--finomik-blue-5)]">
                  Configura tu {mode === 'buy' ? 'compra' : 'venta'}
                </span>
                <div className="flex bg-finomik-blue-soft rounded-xl p-1 gap-1">
                  <button
                    onClick={() =>
                      updateDraft({ modeInput: 'amount', amount: '', units: '' })
                    }
                    className={`px-4 py-2.5 rounded-lg font-semibold text-base ${
                      draft.modeInput === 'amount'
                        ? 'bg-white text-finomik-primary shadow-sm'
                        : 'text-[color:var(--finomik-blue-5)]'
                    }`}
                  >
                    Importe (€)
                  </button>
                  <button
                    onClick={() =>
                      updateDraft({ modeInput: 'units', amount: '', units: '' })
                    }
                    className={`px-4 py-2.5 rounded-lg font-semibold text-base ${
                      draft.modeInput === 'units'
                        ? 'bg-white text-finomik-primary shadow-sm'
                        : 'text-[color:var(--finomik-blue-5)]'
                    }`}
                  >
                    Unidades
                  </button>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="flex-1">
                  <input
                    value={draft.modeInput === 'amount' ? (draft.amount ?? '') : (draft.units ?? '')}
                    onChange={e => {
                      const value = e.target.value.replace(',', '.');
                      if (!/^\d*\.?\d*$/.test(value)) return;
                      if (draft.modeInput === 'amount') {
                        updateDraft({ amount: value });
                      } else {
                        updateDraft({ units: value });
                      }
                    }}
                    className="w-full border-2 border-[color:var(--finomik-blue-6)] rounded-xl px-4 py-3 text-lg font-semibold text-finomik-primary focus:outline-none focus:ring-2 focus:ring-finomik-primary/40 focus:border-finomik-primary"
                    inputMode="decimal"
                    placeholder={
                      draft.modeInput === 'amount' ? 'Cantidad en €' : 'Nº unidades'
                    }
                  />
                </div>
                {draft.modeInput === 'amount' && mode === 'buy' && (
                  <div className="flex gap-2 flex-wrap">
                    {[25, 50, 100].map(pct => (
                      <button
                        key={pct}
                        onClick={() => {
                          const amount = (user.portfolio.cash * pct) / 100;
                          updateDraft({ amount: amount.toFixed(0) });
                        }}
                        className="px-4 py-2.5 rounded-xl bg-finomik-blue-soft text-[color:var(--finomik-blue-5)] font-semibold text-base hover:bg-finomik-blue-soft/80"
                      >
                        {pct}%
                      </button>
                    ))}
                  </div>
                )}
                {draft.modeInput === 'units' && mode === 'sell' && holding && (
                  <div className="flex gap-2 flex-wrap">
                    {[25, 50, 100].map(pct => (
                      <button
                        key={pct}
                        onClick={() => {
                          const u = (holding.quantity * pct) / 100;
                          updateDraft({ units: u.toFixed(3) });
                        }}
                        className="px-4 py-2.5 rounded-xl bg-finomik-blue-soft text-[color:var(--finomik-blue-5)] font-semibold text-base hover:bg-finomik-blue-soft/80"
                      >
                        {pct}%
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="text-base text-[color:var(--finomik-blue-5)] space-y-2">
                <div>
                  Precio actual:{' '}
                  <span className="font-bold text-finomik-primary text-lg">
                    € {price.toFixed(2)}
                  </span>
                  {' · '}Efectivo: € {user.portfolio.cash.toLocaleString('es-ES')}
                </div>
                <div>
                  {draft.modeInput === 'amount'
                    ? `~${units.toFixed(3)} unidades · ${mode === 'buy' ? 'Coste' : 'Importe'} estimado: € ${costOrRevenue.toFixed(2)}`
                    : `${units.toFixed(3)} unidades · ${mode === 'buy' ? 'Coste' : 'Importe'} estimado: € ${costOrRevenue.toFixed(2)}`}
                </div>
                {mode === 'buy' && insufficientCash && amount > 0 && (
                  <div className="text-red-600 font-semibold">
                    No tienes suficiente saldo para esta operación.
                  </div>
                )}
                {mode === 'sell' && insufficientHoldings && units > 0 && (
                  <div className="text-red-600 font-semibold">
                    Estás intentando vender más unidades de las que tienes.
                  </div>
                )}
                {mode === 'sell' && holding && (
                  <div>
                    Tienes{' '}
                    <span className="font-semibold">
                      {holding.quantity.toFixed(3)} unidades
                    </span>{' '}
                    de este activo.
                  </div>
                )}
              </div>
              <div className="flex flex-wrap justify-between items-center gap-3 pt-2">
                <button
                  onClick={() => advanceStep(1)}
                  className="px-5 py-3 rounded-xl border-2 border-[color:var(--finomik-blue-6)] text-base font-semibold text-[color:var(--finomik-blue-5)] hover:bg-slate-50"
                >
                  Atrás
                </button>
                <div className="flex gap-3">
                  <button
                    onClick={closeModal}
                    className="px-5 py-3 rounded-xl border-2 border-[color:var(--finomik-blue-6)] text-base font-semibold text-[color:var(--finomik-blue-5)] hover:bg-slate-50"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleConfirm}
                    disabled={
                      units <= 0 ||
                      price <= 0 ||
                      (mode === 'buy' && insufficientCash) ||
                      (mode === 'sell' && insufficientHoldings)
                    }
                    className={`px-6 py-3 rounded-xl font-semibold text-base ${
                      units <= 0 ||
                      price <= 0 ||
                      (mode === 'buy' && insufficientCash) ||
                      (mode === 'sell' && insufficientHoldings)
                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        : mode === 'buy'
                        ? 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-lg'
                        : 'bg-red-500 text-white hover:bg-red-600 shadow-lg'
                    }`}
                  >
                    Confirmar {mode === 'buy' ? 'compra' : 'venta'}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={theme.contentPadding}>
      {/* Nivel de Inversor */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-finomik-blue-soft border border-[color:var(--finomik-blue-6)]">
          <span className="text-xs font-semibold uppercase text-[color:var(--finomik-blue-5)]">Nivel de Inversor</span>
          <span className="font-bold text-finomik-primary">
            Nivel {user.investorLevel} — {investorLevelLabel}
          </span>
        </div>
        <p className="text-xs text-[color:var(--finomik-blue-5)]">
          {ASSETS.length} activos disponibles. Desbloquea más al subir de nivel.
        </p>
      </div>

      {/* Sub-navegación de secciones */}
      <div className="mb-4 flex gap-2 text-xs">
        <button
          onClick={() => setSection('summary')}
          className={`px-3 py-1.5 rounded-full font-semibold ${
            section === 'summary'
              ? 'bg-finomik-primary text-white'
              : 'bg-finomik-blue-soft text-[color:var(--finomik-blue-5)]'
          }`}
        >
          Resumen
        </button>
        <button
          onClick={() => setSection('allocation')}
          className={`px-3 py-1.5 rounded-full font-semibold ${
            section === 'allocation'
              ? 'bg-finomik-primary text-white'
              : 'bg-finomik-blue-soft text-[color:var(--finomik-blue-5)]'
          }`}
        >
          Composición
        </button>
        <button
          onClick={() => setSection('activity')}
          className={`px-3 py-1.5 rounded-full font-semibold ${
            section === 'activity'
              ? 'bg-finomik-primary text-white'
              : 'bg-finomik-blue-soft text-[color:var(--finomik-blue-5)]'
          }`}
        >
          Actividad
        </button>
      </div>

      {/* Pantalla 1 – Resumen */}
      {section === 'summary' && (
        <section className="min-h-[calc(100vh-96px)] flex flex-col gap-6">
          <div className={`${theme.card} p-5`}>
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              <div>
                <p className={theme.textSubtle}>Evolución de tu cartera en los últimos días</p>
                <div className="mt-1 flex items-baseline gap-3">
                  <span className="text-2xl md:text-3xl font-extrabold text-finomik-primary">
                    € {totalValue.toLocaleString('es-ES', { maximumFractionDigits: 0 })}
                  </span>
                  {portfolioHoldings.length > 0 && (
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                        portfolioMetrics.unrealizedPL >= 0
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {portfolioMetrics.unrealizedPL >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                      {portfolioMetrics.unrealizedPL >= 0 ? '+' : ''}
                      {portfolioMetrics.unrealizedPLPct.toFixed(2)}%
                    </span>
                  )}
                </div>
                <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                  <div>
                    <div className="text-[color:var(--finomik-blue-5)]">Valor invertido</div>
                    <div className="font-semibold text-finomik-primary">
                      € {totalInvestedValue.toLocaleString('es-ES', { maximumFractionDigits: 0 })}
                    </div>
                  </div>
                  <div>
                    <div className="text-[color:var(--finomik-blue-5)]">Plusvalía no realizada</div>
                    <div
                      className={`font-semibold ${
                        portfolioMetrics.unrealizedPL >= 0 ? 'text-emerald-600' : 'text-red-500'
                      }`}
                    >
                      {portfolioMetrics.unrealizedPL >= 0 ? '+' : ''}
                      {portfolioMetrics.unrealizedPL.toLocaleString('es-ES', {
                        maximumFractionDigits: 0,
                      })}{' '}
                      €
                    </div>
                  </div>
                  <div>
                    <div className="text-[color:var(--finomik-blue-5)]">Efectivo disponible</div>
                    <div className="font-semibold text-finomik-primary">
                      € {user.portfolio.cash.toLocaleString('es-ES', { maximumFractionDigits: 0 })}
                    </div>
                  </div>
                  <div>
                    <div className="text-[color:var(--finomik-blue-5)]">Posiciones</div>
                    <div className="font-semibold text-finomik-primary">
                      {portfolioHoldings.length}
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full lg:w-1/2 h-40 md:h-52 min-h-[200px]">
                <ResponsiveLine
                  data={[{ id: 'cartera', data: portfolioSeries.map(d => ({ x: d.name, y: d.value })) }]}
                  margin={{ top: 8, right: 24, bottom: 36, left: 40 }}
                  xScale={{ type: 'point' }}
                  yScale={{ type: 'linear', min: 'auto', max: 'auto' }}
                  curve={lineChartDefaults.curve}
                  defs={lineChartDefaults.defs}
                  fill={lineChartDefaults.fill}
                  theme={lineChartDefaults.theme}
                  axisTop={null}
                  axisRight={null}
                  axisBottom={{ tickSize: 0, tickPadding: 8, tickRotation: -25 }}
                  axisLeft={{ tickSize: 0, tickPadding: 8, tickValues: 5 }}
                  enableArea={lineChartDefaults.enableArea}
                  areaOpacity={lineChartDefaults.areaOpacity}
                  lineWidth={lineChartDefaults.lineWidth}
                  colors={lineChartDefaults.colors}
                  pointSize={lineChartDefaults.pointSize}
                  pointColor={lineChartDefaults.pointColor}
                  pointBorderWidth={lineChartDefaults.pointBorderWidth}
                  pointBorderColor={lineChartDefaults.pointBorderColor}
                  enableGridX={lineChartDefaults.enableGridX}
                  enableGridY={lineChartDefaults.enableGridY}
                  isInteractive={lineChartDefaults.isInteractive}
                  useMesh={lineChartDefaults.useMesh}
                  tooltip={({ point }) => (
                    <span className={lineChartTooltipClass}>
                      € {Number(point.data.y).toLocaleString('es-ES', { maximumFractionDigits: 0 })}
                    </span>
                  )}
                />
              </div>
            </div>
          </div>

          {/* Panel lateral reubicado al final */}
          <div className="mt-6 space-y-6">
            <section className={`${theme.card} p-5`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Activity size={18} className="text-finomik-primary" />
                  <h3 className={theme.headingMedium}>Detalle de activo</h3>
                </div>
              </div>
              {!selectedAsset ? (
                <p className={theme.textSubtle}>Selecciona un activo para ver más detalles.</p>
              ) : (
                <>
                  <div className="flex items-center justify-between gap-3 mb-3 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-finomik-blue-soft flex items-center justify-center text-[10px] font-bold text-finomik-primary">
                        {selectedAsset.symbol[0]}
                      </div>
                      <div>
                        <div className="font-semibold text-finomik-primary">
                          {selectedAsset.symbol}
                        </div>
                        <div className="text-[color:var(--finomik-blue-5)]">
                          {selectedAsset.name}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[color:var(--finomik-blue-5)] text-[11px]">
                        Precio simulado
                      </div>
                      <div className="font-semibold text-finomik-primary">
                        €{' '}
                        {(
                          latestPriceBySymbol[selectedAsset.symbol] || selectedAsset.basePrice
                        ).toFixed(2)}
                      </div>
                    </div>
                  </div>
                  <div className="h-36 sm:h-40 mb-3 w-full min-h-[140px]">
                    <ResponsiveLine
                      data={[{ id: 'precio', data: (assetSeriesBySymbol[selectedAsset.symbol] || []).map(d => ({ x: d.name, y: d.value })) }]}
                      margin={{ top: 8, right: 24, bottom: 36, left: 40 }}
                      xScale={{ type: 'point' }}
                      yScale={{ type: 'linear', min: 'auto', max: 'auto' }}
                      curve={lineChartDefaults.curve}
                      defs={lineChartDefaults.defs}
                      fill={lineChartDefaults.fill}
                      theme={lineChartDefaults.theme}
                      axisTop={null}
                      axisRight={null}
                      axisBottom={{ tickSize: 0, tickPadding: 8, tickRotation: -25 }}
                      axisLeft={{ tickSize: 0, tickPadding: 8, tickValues: 5 }}
                      enableArea={lineChartDefaults.enableArea}
                      areaOpacity={lineChartDefaults.areaOpacity}
                      lineWidth={lineChartDefaults.lineWidth}
                      colors={lineChartDefaults.colors}
                      pointSize={lineChartDefaults.pointSize}
                      pointColor={lineChartDefaults.pointColor}
                      pointBorderWidth={lineChartDefaults.pointBorderWidth}
                      pointBorderColor={lineChartDefaults.pointBorderColor}
                      enableGridX={lineChartDefaults.enableGridX}
                      enableGridY={lineChartDefaults.enableGridY}
                      isInteractive={lineChartDefaults.isInteractive}
                      useMesh={lineChartDefaults.useMesh}
                      tooltip={({ point }) => (
                        <span className={lineChartTooltipClass}>
                          € {Number(point.data.y).toFixed(2)}
                        </span>
                      )}
                    />
                  </div>
                  <div className="text-[11px] text-[color:var(--finomik-blue-5)] space-y-1">
                    <div>
                      Tipo: <span className="font-semibold">{selectedAsset.type}</span> · Sector:{' '}
                      <span className="font-semibold">{selectedAsset.sector}</span> · Región:{' '}
                      <span className="font-semibold">{selectedAsset.region}</span>
                    </div>
                    {selectedPosition ? (
                      <div>
                        Tienes{' '}
                        <span className="font-semibold">
                          {selectedPosition.quantity.toFixed(3)} unidades
                        </span>{' '}
                        con un precio medio de{' '}
                        <span className="font-semibold">
                          € {selectedPosition.averageCost.toFixed(2)}
                        </span>
                        .
                      </div>
                    ) : (
                      <div>
                        Aún no tienes este activo en cartera. Puedes usar el simulador para entender
                        cómo afectaría a tu portfolio.
                      </div>
                    )}
                  </div>
                  <div className="mt-3 flex gap-2 text-xs">
                    <button
                      onClick={() => openTradeModal(selectedAsset.symbol)}
                      className="flex-1 px-3 py-2 rounded-full bg-finomik-primary text-white font-semibold"
                    >
                      Operar
                    </button>
                  </div>
                </>
              )}
            </section>

            <MarketCarousel />
          </div>
        </section>
      )}

      {/* Pantalla 2 – Composición */}
      {section === 'allocation' && (
        <section className="min-h-[calc(100vh-96px)] flex flex-col gap-6">
          <div className={`${theme.card} p-5`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <PieIcon size={18} className="text-finomik-primary" />
                <h3 className={theme.headingMedium}>Dónde estás invertido</h3>
              </div>
            </div>
            {portfolioHoldings.length === 0 ? (
              <p className={theme.textSubtle}>
                Aún no tienes posiciones en tu cartera. Cuando empieces a invertir aquí verás la
                distribución por tipos de activo.
              </p>
            ) : (
              <div className="grid md:grid-cols-[minmax(0,1.1fr)_minmax(0,1.2fr)] gap-4">
                <div className="flex flex-col items-center justify-center">
                  <div className="w-48 h-48 md:w-56 md:h-56">
                    <ResponsivePie
                      data={portfolioMetrics.allocationByType.map(entry => ({
                        id: entry.type,
                        value: entry.value,
                        label: entry.type,
                        color: ALLOCATION_COLORS[entry.type] || ALLOCATION_COLORS.Other,
                        percent: entry.percent,
                      }))}
                      margin={{ top: 8, right: 8, bottom: 8, left: 8 }}
                      innerRadius={0.55}
                      padAngle={1}
                      cornerRadius={4}
                      colors={{ datum: 'data.color' }}
                      borderWidth={0}
                      enableArcLabels={false}
                      enableArcLinkLabels={false}
                      isInteractive
                      tooltip={({ datum }) => (
                        <span className="bg-white px-2 py-1 rounded shadow text-xs">
                          {datum.id}: € {datum.value.toLocaleString('es-ES')} ({(datum.data as { percent?: number }).percent?.toFixed(1)}%)
                        </span>
                      )}
                    />
                  </div>
                  <p className="mt-2 text-[11px] text-[color:var(--finomik-blue-5)]">
                    Vista rápida de tu cartera por tipo de activo.
                  </p>
                </div>
                <div className="space-y-3 text-xs">
                  {portfolioMetrics.allocationByType.map(entry => (
                    <div key={entry.type} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{
                              backgroundColor:
                                ALLOCATION_COLORS[entry.type] || ALLOCATION_COLORS.Other,
                            }}
                          />
                          <span className="font-semibold text-finomik-primary">
                            {entry.type}
                          </span>
                        </div>
                        <span className="text-[color:var(--finomik-blue-5)]">
                          {entry.percent.toFixed(1)}% · €
                          {entry.value.toLocaleString('es-ES', {
                            maximumFractionDigits: 0,
                          })}
                        </span>
                      </div>
                      <div className="h-1.5 rounded-full bg-finomik-blue-soft overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${entry.percent}%`,
                            backgroundColor:
                              ALLOCATION_COLORS[entry.type] || ALLOCATION_COLORS.Other,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                  {portfolioMetrics.topWeights.length > 0 && (
                    <div className="mt-4">
                      <p className="text-[11px] font-semibold text-[color:var(--finomik-blue-5)] mb-1">
                        Top posiciones por peso
                      </p>
                      {portfolioMetrics.topWeights.map(item => (
                        <div
                          key={item.symbol}
                          className="flex items-center justify-between text-xs mb-1"
                        >
                          <span className="font-semibold text-finomik-primary">
                            {item.symbol}
                          </span>
                          <span className="text-[color:var(--finomik-blue-5)]">
                            {item.weight.toFixed(1)}%
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Panel lateral al final */}
          <div className="mt-6 space-y-6">
            <section className={`${theme.card} p-5`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Activity size={18} className="text-finomik-primary" />
                  <h3 className={theme.headingMedium}>Detalle de activo</h3>
                </div>
              </div>
              {!selectedAsset ? (
                <p className={theme.textSubtle}>Selecciona un activo para ver más detalles.</p>
              ) : (
                <>
                  <div className="flex items-center justify-between gap-3 mb-3 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-finomik-blue-soft flex items-center justify-center text-[10px] font-bold text-finomik-primary">
                        {selectedAsset.symbol[0]}
                      </div>
                      <div>
                        <div className="font-semibold text-finomik-primary">
                          {selectedAsset.symbol}
                        </div>
                        <div className="text-[color:var(--finomik-blue-5)]">
                          {selectedAsset.name}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[color:var(--finomik-blue-5)] text-[11px]">
                        Precio simulado
                      </div>
                      <div className="font-semibold text-finomik-primary">
                        €{' '}
                        {(
                          latestPriceBySymbol[selectedAsset.symbol] || selectedAsset.basePrice
                        ).toFixed(2)}
                      </div>
                    </div>
                  </div>
                  <div className="h-36 sm:h-40 mb-3 w-full min-h-[140px]">
                    <ResponsiveLine
                      data={[{ id: 'precio', data: (assetSeriesBySymbol[selectedAsset.symbol] || []).map(d => ({ x: d.name, y: d.value })) }]}
                      margin={{ top: 8, right: 24, bottom: 36, left: 40 }}
                      xScale={{ type: 'point' }}
                      yScale={{ type: 'linear', min: 'auto', max: 'auto' }}
                      curve={lineChartDefaults.curve}
                      defs={lineChartDefaults.defs}
                      fill={lineChartDefaults.fill}
                      theme={lineChartDefaults.theme}
                      axisTop={null}
                      axisRight={null}
                      axisBottom={{ tickSize: 0, tickPadding: 8, tickRotation: -25 }}
                      axisLeft={{ tickSize: 0, tickPadding: 8, tickValues: 5 }}
                      enableArea={lineChartDefaults.enableArea}
                      areaOpacity={lineChartDefaults.areaOpacity}
                      lineWidth={lineChartDefaults.lineWidth}
                      colors={lineChartDefaults.colors}
                      pointSize={lineChartDefaults.pointSize}
                      pointColor={lineChartDefaults.pointColor}
                      pointBorderWidth={lineChartDefaults.pointBorderWidth}
                      pointBorderColor={lineChartDefaults.pointBorderColor}
                      enableGridX={lineChartDefaults.enableGridX}
                      enableGridY={lineChartDefaults.enableGridY}
                      isInteractive={lineChartDefaults.isInteractive}
                      useMesh={lineChartDefaults.useMesh}
                      tooltip={({ point }) => (
                        <span className={lineChartTooltipClass}>
                          € {Number(point.data.y).toFixed(2)}
                        </span>
                      )}
                    />
                  </div>
                  <div className="text-[11px] text-[color:var(--finomik-blue-5)] space-y-1">
                    <div>
                      Tipo: <span className="font-semibold">{selectedAsset.type}</span> · Sector:{' '}
                      <span className="font-semibold">{selectedAsset.sector}</span> · Región:{' '}
                      <span className="font-semibold">{selectedAsset.region}</span>
                    </div>
                    {selectedPosition ? (
                      <div>
                        Tienes{' '}
                        <span className="font-semibold">
                          {selectedPosition.quantity.toFixed(3)} unidades
                        </span>{' '}
                        con un precio medio de{' '}
                        <span className="font-semibold">
                          € {selectedPosition.averageCost.toFixed(2)}
                        </span>
                        .
                      </div>
                    ) : (
                      <div>
                        Aún no tienes este activo en cartera. Puedes usar el simulador para entender
                        cómo afectaría a tu portfolio.
                      </div>
                    )}
                  </div>
                  <div className="mt-3 flex gap-2 text-xs">
                    <button
                      onClick={() => openTradeModal(selectedAsset.symbol)}
                      className="flex-1 px-3 py-2 rounded-full bg-finomik-primary text-white font-semibold"
                    >
                      Operar
                    </button>
                  </div>
                </>
              )}
            </section>

            <MarketCarousel />
          </div>
        </section>
      )}

      {/* Pantalla 3 – Actividad */}
      {section === 'activity' && (
        <section className="min-h-[calc(100vh-96px)] flex flex-col gap-6">
          <div className={`${theme.card} p-5`}>
            <div className="flex items-center gap-2 mb-3">
              <Activity size={18} className="text-finomik-primary" />
              <h3 className={theme.headingMedium}>Qué está pasando</h3>
            </div>
            {contributionChartData.length === 0 ? (
              <p className={theme.textSubtle}>
                Aún no hay movimientos suficientes para mostrar contribución por activo.
              </p>
            ) : (
              <div className="h-56 md:h-64 w-full">
                <ResponsiveBar
                  data={contributionChartData}
                  keys={['gainLoss']}
                  indexBy="name"
                  margin={{ top: 8, right: 8, bottom: 28, left: 8 }}
                  padding={0.3}
                  valueScale={{ type: 'linear' }}
                  indexScale={{ type: 'band', round: true }}
                  colors={['#2563eb']}
                  borderRadius={6}
                  axisTop={null}
                  axisRight={null}
                  axisBottom={{ tickSize: 0, tickPadding: 8 }}
                  axisLeft={null}
                  enableGridY={false}
                  enableLabel={false}
                  isInteractive
                  tooltip={({ indexValue, value }) => (
                    <span className="bg-white px-2 py-1 rounded shadow text-xs text-finomik-primary">
                      {indexValue}: € {Number(value).toLocaleString('es-ES', { maximumFractionDigits: 0 })}
                    </span>
                  )}
                />
              </div>
            )}
          </div>

          <div className={`${theme.card} p-6`}>
            <h3 className={`${theme.headingMedium} mb-4`}>Insights rápidos</h3>
            {insightsList.length === 0 ? (
              <p className={theme.textSubtle}>
                Aquí verás un resumen de los puntos clave de tu cartera en cuanto empieces a
                invertir.
              </p>
            ) : (
              <div className="space-y-4 text-sm">
                {insightsList.map((insight, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-4 rounded-2xl bg-finomik-primary text-white px-6 py-4"
                  >
                    <div className="mt-0.5">
                      <Info size={18} className="text-finomik-blue-soft" />
                    </div>
                    <p className="leading-snug font-semibold">{insight}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className={`${theme.card} p-5`}>
            <h3 className={`${theme.headingMedium} mb-3`}>Últimos movimientos</h3>
            {recentHistory.length === 0 ? (
              <p className={theme.textSubtle}>
                Aún no has realizado operaciones en el simulador de inversión.
              </p>
            ) : (
              <div className="space-y-2 text-xs">
                {recentHistory.map((entry, index) => {
                  const asset = assetsBySymbol[entry.symbol];
                  const date = new Date(entry.timestamp);
                  return (
                    <div
                      key={`${entry.timestamp}-${index}`}
                      className="flex items-center justify-between border-b border-[color:var(--finomik-blue-6)] pb-2 last:border-b-0 last:pb-0"
                    >
                      <div>
                        <div className="font-semibold text-finomik-primary">
                          {entry.type === 'buy' ? 'Compra' : 'Venta'} · {entry.symbol}
                        </div>
                        <div className="text-[color:var(--finomik-blue-5)]">
                          {(asset && asset.name) || 'Activo'} · {entry.quantity} uds a €
                          {entry.price.toFixed(2)}
                        </div>
                      </div>
                      <div className="text-right text-[11px] text-[color:var(--finomik-blue-5)]">
                        {date.toLocaleDateString()} ·{' '}
                        {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="mt-6 space-y-6">
            <section className={`${theme.card} p-5`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Activity size={18} className="text-finomik-primary" />
                  <h3 className={theme.headingMedium}>Detalle de activo</h3>
                </div>
              </div>
              {!selectedAsset ? (
                <p className={theme.textSubtle}>Selecciona un activo para ver más detalles.</p>
              ) : (
                <>
                  <div className="flex items-center justify-between gap-3 mb-3 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-finomik-blue-soft flex items-center justify-center text-[10px] font-bold text-finomik-primary">
                        {selectedAsset.symbol[0]}
                      </div>
                      <div>
                        <div className="font-semibold text-finomik-primary">
                          {selectedAsset.symbol}
                        </div>
                        <div className="text-[color:var(--finomik-blue-5)]">
                          {selectedAsset.name}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[color:var(--finomik-blue-5)] text-[11px]">
                        Precio simulado
                      </div>
                      <div className="font-semibold text-finomik-primary">
                        €{' '}
                        {(
                          latestPriceBySymbol[selectedAsset.symbol] || selectedAsset.basePrice
                        ).toFixed(2)}
                      </div>
                    </div>
                  </div>
                  <div className="h-36 sm:h-40 mb-3 w-full min-h-[140px]">
                    <ResponsiveLine
                      data={[{ id: 'precio', data: (assetSeriesBySymbol[selectedAsset.symbol] || []).map(d => ({ x: d.name, y: d.value })) }]}
                      margin={{ top: 8, right: 24, bottom: 36, left: 40 }}
                      xScale={{ type: 'point' }}
                      yScale={{ type: 'linear', min: 'auto', max: 'auto' }}
                      curve={lineChartDefaults.curve}
                      defs={lineChartDefaults.defs}
                      fill={lineChartDefaults.fill}
                      theme={lineChartDefaults.theme}
                      axisTop={null}
                      axisRight={null}
                      axisBottom={{ tickSize: 0, tickPadding: 8, tickRotation: -25 }}
                      axisLeft={{ tickSize: 0, tickPadding: 8, tickValues: 5 }}
                      enableArea={lineChartDefaults.enableArea}
                      areaOpacity={lineChartDefaults.areaOpacity}
                      lineWidth={lineChartDefaults.lineWidth}
                      colors={lineChartDefaults.colors}
                      pointSize={lineChartDefaults.pointSize}
                      pointColor={lineChartDefaults.pointColor}
                      pointBorderWidth={lineChartDefaults.pointBorderWidth}
                      pointBorderColor={lineChartDefaults.pointBorderColor}
                      enableGridX={lineChartDefaults.enableGridX}
                      enableGridY={lineChartDefaults.enableGridY}
                      isInteractive={lineChartDefaults.isInteractive}
                      useMesh={lineChartDefaults.useMesh}
                      tooltip={({ point }) => (
                        <span className={lineChartTooltipClass}>
                          € {Number(point.data.y).toFixed(2)}
                        </span>
                      )}
                    />
                  </div>
                  <div className="text-[11px] text-[color:var(--finomik-blue-5)] space-y-1">
                    <div>
                      Tipo: <span className="font-semibold">{selectedAsset.type}</span> · Sector:{' '}
                      <span className="font-semibold">{selectedAsset.sector}</span> · Región:{' '}
                      <span className="font-semibold">{selectedAsset.region}</span>
                    </div>
                    {selectedPosition ? (
                      <div>
                        Tienes{' '}
                        <span className="font-semibold">
                          {selectedPosition.quantity.toFixed(3)} unidades
                        </span>{' '}
                        con un precio medio de{' '}
                        <span className="font-semibold">
                          € {selectedPosition.averageCost.toFixed(2)}
                        </span>
                        .
                      </div>
                    ) : (
                      <div>
                        Aún no tienes este activo en cartera. Puedes usar el simulador para entender
                        cómo afectaría a tu portfolio.
                      </div>
                    )}
                  </div>
                  <div className="mt-3 flex gap-2 text-xs">
                    <button
                      onClick={() => openTradeModal(selectedAsset.symbol)}
                      className="flex-1 px-3 py-2 rounded-full bg-finomik-primary text-white font-semibold"
                    >
                      Operar
                    </button>
                  </div>
                </>
              )}
            </section>

            <MarketCarousel />
          </div>
        </section>
      )}

      {renderTradeModal()}
    </div>
  );
};
