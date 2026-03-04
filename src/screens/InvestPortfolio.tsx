import React, { useMemo, useState } from 'react';
import { TrendingUp, TrendingDown, Activity, Info, PieChart as PieIcon } from 'lucide-react';
import { ResponsiveLine } from '@nivo/line';
import { ResponsiveBar } from '@nivo/bar';
import { ResponsivePie } from '@nivo/pie';
import { useGame } from '../context/GameContext';
import { getTheme } from '../utils/theme';
import { generateAssetSeries, generatePortfolioSeries } from '../utils/portfolioSimulation';
import { getAssetsForLevel, getInvestorLevelLabel, type MarketAsset } from '../data/marketAssets';
import { lineChartDefaults, lineChartTooltipClass } from '../utils/lineChartTheme';
import { TradeModal } from '../components/TradeModal';

const ALLOCATION_COLORS: Record<string, string> = {
  Stock: '#114076', // var(--finomik-blue-1)
  ETF: '#5574A7', // var(--finomik-blue-4)
  Bond: '#3C4C67', // var(--finomik-blue-2)
  Fund: '#8F9EB7', // var(--finomik-blue-5)
  Other: '#C8D0DD', // var(--finomik-blue-6)
};

// Colores específicos por sector basados en la paleta Finomik
const SECTOR_COLORS: Record<string, string> = {
  'Renta variable global': '#114076', // blue-1
  'Renta fija global': '#5574A7', // blue-4
  Tecnología: '#3E5374', // intermedio azul
  Consumo: '#8F9EB7', // blue-5
  Energía: '#B45309', // warning
  'Materias primas': '#0D7A4A', // success
  Salud: '#B91C1C', // error
  'Mercados emergentes': '#3C4C67', // blue-2
  Financiero: '#0B3064', // primary
  Industrial: '#C8D0DD', // blue-6
  Inmobiliario: '#0D7A4A', // success
  'Renta fija corporativa': '#5574A7', // blue-4
  Dividendos: '#114076', // blue-1
  Biotecnología: '#8F9EB7', // blue-5
  Otros: '#C8D0DD', // blue-6
};

// Paleta circular para el gráfico de "Por peso", usando solo colores Finomik
const WEIGHT_COLORS: string[] = [
  '#0B3064', // primary
  '#114076',
  '#3C4C67',
  '#3E5374',
  '#5574A7',
  '#8F9EB7',
  '#C8D0DD',
  '#0D7A4A',
  '#B45309',
  '#B91C1C',
];

interface PositionRow {
  symbol: string;
  quantity: number;
  averageCost: number;
  currentValue: number;
  gainLoss: number;
  returnPct: number;
  asset: MarketAsset | undefined;
}

export const InvestPortfolio = () => {
  const { user, themeMode, currentScreen, setCurrentScreen } = useGame();
  const theme = getTheme(themeMode);
  const [tradeState, setTradeState] = useState<{ symbol: string } | null>(null);
  const [allocChart, setAllocChart] = useState<'type' | 'sector' | 'weight'>('type');

  const ASSETS = useMemo(
    () => getAssetsForLevel(user.investorLevel),
    [user.investorLevel]
  );
  const investorLevelLabel = getInvestorLevelLabel(user.investorLevel);

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
      result[asset.symbol] = generateAssetSeries(
        asset.symbol,
        asset.basePrice,
        60
      );
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
        Object.entries(latestPriceBySymbol).map(([symbol, price]) => ({
          symbol,
          price,
        })),
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
        topWeights: [] as { symbol: string; weight: number; value: number }[],
        bestAsset: null as null | { symbol: string; gainLoss: number },
        worstAsset: null as null | { symbol: string; gainLoss: number },
        diversification: 'Sin invertir',
        risk: 'Bajo',
      };
    }

    let totalCurrentInvested = 0;
    let totalCostBasis = 0;
    const perAssetValue: {
      symbol: string;
      value: number;
      gainLoss: number;
    }[] = [];

    portfolioHoldings.forEach(([symbol, data]) => {
      const price = latestPriceBySymbol[symbol];
      if (!price || data.quantity <= 0) return;
      const currentValue = price * data.quantity;
      const costBasis = data.averageCost * data.quantity;
      const gainLoss = currentValue - costBasis;

      totalCurrentInvested += currentValue;
      totalCostBasis += costBasis;

      perAssetValue.push({ symbol, value: currentValue, gainLoss });
    });

    const unrealizedPL = totalCurrentInvested - totalCostBasis;
    const unrealizedPLPct =
      totalCostBasis > 0 ? (unrealizedPL / totalCostBasis) * 100 : 0;

    const sortedByValue = perAssetValue
      .slice()
      .sort((a, b) => b.value - a.value)
      .map(a => ({
        symbol: a.symbol,
        value: a.value,
        weight:
          totalCurrentInvested > 0 ? (a.value / totalCurrentInvested) * 100 : 0,
      }));

    const bestAsset =
      perAssetValue.length > 0
        ? perAssetValue.reduce(
            (best, current) =>
              best === null || current.gainLoss > best.gainLoss
                ? current
                : best,
            null as { symbol: string; gainLoss: number } | null
          )
        : null;
    const worstAsset =
      perAssetValue.length > 0
        ? perAssetValue.reduce(
            (worst, current) =>
              worst === null || current.gainLoss < worst.gainLoss
                ? current
                : worst,
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

    const allocationMap = new Map<string, number>();
    perAssetValue.forEach(({ symbol, value }) => {
      const asset = assetsBySymbol[symbol];
      const typeKey = asset?.type ?? 'Other';
      allocationMap.set(typeKey, (allocationMap.get(typeKey) || 0) + value);
    });
    const stockWeight =
      allocationMap.get('Stock') && totalCurrentInvested > 0
        ? (allocationMap.get('Stock')! / totalCurrentInvested) * 100
        : 0;

    const risk =
      stockWeight > 70
        ? 'Alto'
        : stockWeight > 40
        ? 'Moderado'
        : 'Bajo';

    return {
      totalCurrentInvested,
      totalCostBasis,
      unrealizedPL,
      unrealizedPLPct,
      topWeights: sortedByValue.slice(0, 5),
      bestAsset,
      worstAsset,
      diversification,
      risk,
    };
  }, [portfolioHoldings, latestPriceBySymbol, assetsBySymbol]);

  const totalInvestedValue = portfolioMetrics.totalCurrentInvested;
  const totalValue = user.portfolio.cash + totalInvestedValue;

  const positions: PositionRow[] = useMemo(() => {
    if (portfolioHoldings.length === 0) return [];
    return portfolioHoldings
      .map(([symbol, data]) => {
        const price = latestPriceBySymbol[symbol];
        if (!price || data.quantity <= 0) return null;
        const currentValue = price * data.quantity;
        const costBasis = data.averageCost * data.quantity;
        const gainLoss = currentValue - costBasis;
        const returnPct = costBasis > 0 ? (gainLoss / costBasis) * 100 : 0;
        return {
          symbol,
          quantity: data.quantity,
          averageCost: data.averageCost,
          currentValue,
          gainLoss,
          returnPct,
          asset: assetsBySymbol[symbol],
        } as PositionRow;
      })
      .filter((p): p is PositionRow => p !== null)
      .sort((a, b) => b.currentValue - a.currentValue);
  }, [portfolioHoldings, latestPriceBySymbol, assetsBySymbol]);

  const allocationByType = useMemo(() => {
    if (!positions.length) return [] as { type: string; value: number; percent: number }[];
    const map = new Map<string, number>();
    positions.forEach(p => {
      const typeKey = p.asset?.type ?? 'Other';
      map.set(typeKey, (map.get(typeKey) || 0) + p.currentValue);
    });
    const total = Array.from(map.values()).reduce((acc, v) => acc + v, 0);
    return Array.from(map.entries()).map(([type, value]) => ({
      type,
      value,
      percent: total > 0 ? (value / total) * 100 : 0,
    }));
  }, [positions]);

  const allocationBySector = useMemo(() => {
    if (!positions.length) return [] as { sector: string; value: number; percent: number }[];
    const map = new Map<string, number>();
    positions.forEach(p => {
      const key = p.asset?.sector ?? 'Otros';
      map.set(key, (map.get(key) || 0) + p.currentValue);
    });
    const total = Array.from(map.values()).reduce((acc, v) => acc + v, 0);
    return Array.from(map.entries()).map(([sector, value]) => ({
      sector,
      value,
      percent: total > 0 ? (value / total) * 100 : 0,
    }));
  }, [positions]);

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
      .filter(
        (d): d is { name: string; gainLoss: number } => d !== null
      );
  }, [portfolioHoldings, latestPriceBySymbol]);

  const weightChartData = useMemo(() => {
    if (!positions.length || portfolioMetrics.totalCurrentInvested <= 0) {
      return [] as { symbol: string; weight: number }[];
    }
    return positions.map(p => ({
      symbol: p.symbol,
      weight: Number(
        ((p.currentValue / portfolioMetrics.totalCurrentInvested) * 100).toFixed(1)
      ),
    }));
  }, [positions, portfolioMetrics.totalCurrentInvested]);

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

    if (
      portfolioMetrics.worstAsset &&
      portfolioMetrics.worstAsset.gainLoss < 0
    ) {
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

    // Insight extra: peso de renta variable
    insights.push(
      `Tu nivel de riesgo actual se clasifica como ${portfolioMetrics.risk.toLowerCase()}. Revisa si se ajusta a cómo te sientes con las subidas y bajadas del mercado.`
    );

    return insights.slice(0, 6);
  }, [portfolioHoldings, portfolioMetrics]);

  const recentHistory = useMemo(() => {
    if (!portfolioHistory.length) return [];
    return [...portfolioHistory]
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 5);
  }, [portfolioHistory]);

  return (
    <div className={theme.contentPadding}>
      {/* Nivel de Inversor + tabs Portfolio/Mercado */}
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => setCurrentScreen('investorLevel')}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-finomik-blue-soft border border-[color:var(--finomik-blue-6)] hover:bg-finomik-blue-soft/80 transition-colors cursor-pointer"
          title="Ver detalles de tu nivel de inversor"
        >
          <span className="text-xs font-semibold uppercase text-[color:var(--finomik-blue-5)]">
            Nivel de Inversor
          </span>
          <span className="font-bold text-finomik-primary">
            Nivel {user.investorLevel} — {investorLevelLabel}
          </span>
        </button>
        <p className="text-xs text-[color:var(--finomik-blue-5)]">
          {ASSETS.length} activos disponibles. Desbloquea más al subir de nivel.
        </p>
      </div>

      <div className="mb-4 flex gap-2 text-xs">
        <button
          type="button"
          onClick={() => setCurrentScreen('investPortfolio')}
          className={`px-3 py-1.5 rounded-full font-semibold ${
            currentScreen === 'invest' || currentScreen === 'investPortfolio'
              ? 'bg-finomik-primary text-white'
              : 'bg-finomik-blue-soft text-[color:var(--finomik-blue-5)]'
          }`}
        >
          Portfolio
        </button>
        <button
          type="button"
          onClick={() => setCurrentScreen('investMarket')}
          className={`px-3 py-1.5 rounded-full font-semibold ${
            currentScreen === 'investMarket'
              ? 'bg-finomik-primary text-white'
              : 'bg-finomik-blue-soft text-[color:var(--finomik-blue-5)]'
          }`}
        >
          Mercado
        </button>
      </div>

      <section className="min-h-[calc(100vh-96px)] flex flex-col gap-6">
        {/* Resumen principal */}
        <div className={`${theme.card} p-5`}>
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            <div>
              <p className={theme.textSubtle}>
                Evolución de tu cartera en los últimos días
              </p>
              <div className="mt-1 flex items-baseline gap-3">
                <span className="text-2xl md:text-3xl font-extrabold text-finomik-primary">
                  €{' '}
                  {totalValue.toLocaleString('es-ES', {
                    maximumFractionDigits: 0,
                  })}
                </span>
                {portfolioHoldings.length > 0 && (
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                      portfolioMetrics.unrealizedPL >= 0
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {portfolioMetrics.unrealizedPL >= 0 ? (
                      <TrendingUp size={12} />
                    ) : (
                      <TrendingDown size={12} />
                    )}
                    {portfolioMetrics.unrealizedPL >= 0 ? '+' : ''}
                    {portfolioMetrics.unrealizedPLPct.toFixed(2)}%
                  </span>
                )}
              </div>
              <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div>
                  <div className="text-[color:var(--finomik-blue-5)]">
                    Valor invertido
                  </div>
                  <div className="font-semibold text-finomik-primary">
                    €{' '}
                    {totalInvestedValue.toLocaleString('es-ES', {
                      maximumFractionDigits: 0,
                    })}
                  </div>
                </div>
                <div>
                  <div className="text-[color:var(--finomik-blue-5)]">
                    Plusvalía no realizada
                  </div>
                  <div
                    className={`font-semibold ${
                      portfolioMetrics.unrealizedPL >= 0
                        ? 'text-emerald-600'
                        : 'text-red-500'
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
                  <div className="text-[color:var(--finomik-blue-5)]">
                    Efectivo disponible
                  </div>
                  <div className="font-semibold text-finomik-primary">
                    €{' '}
                    {user.portfolio.cash.toLocaleString('es-ES', {
                      maximumFractionDigits: 0,
                    })}
                  </div>
                </div>
                <div>
                  <div className="text-[color:var(--finomik-blue-5)]">
                    Posiciones
                  </div>
                  <div className="font-semibold text-finomik-primary">
                    {portfolioHoldings.length}
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full lg:w-1/2 h-40 md:h-52 min-h-[200px]">
              <ResponsiveLine
                data={[
                  {
                    id: 'cartera',
                    data: portfolioSeries.map(d => ({
                      x: d.name,
                      y: d.value,
                    })),
                  },
                ]}
                margin={{ top: 8, right: 24, bottom: 36, left: 40 }}
                xScale={{ type: 'point' }}
                yScale={{ type: 'linear', min: 'auto', max: 'auto' }}
                curve={lineChartDefaults.curve}
                defs={lineChartDefaults.defs}
                fill={lineChartDefaults.fill}
                theme={lineChartDefaults.theme}
                axisTop={null}
                axisRight={null}
                axisBottom={{
                  tickSize: 0,
                  tickPadding: 8,
                  tickRotation: -25,
                  format: () => '',
                }}
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
                    €{' '}
                    {Number(point.data.y).toLocaleString('es-ES', {
                      maximumFractionDigits: 0,
                    })}
                  </span>
                )}
              />
            </div>
          </div>
        </div>

        {/* Composición de la cartera */}
        <div className={`${theme.card} p-5`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <PieIcon size={18} className="text-finomik-primary" />
              <div>
                <h3 className={theme.headingMedium}>Composición de tu cartera</h3>
                <p className="text-[11px] text-[color:var(--finomik-blue-5)]">
                  Explora tu cartera por tipo, sector y peso.
                </p>
              </div>
            </div>
            <div className="inline-flex items-center gap-2 bg-white border border-[color:var(--finomik-blue-6)] rounded-2xl px-2 py-1 shadow-sm">
              <span className="hidden sm:inline text-[10px] font-semibold tracking-wide uppercase text-[color:var(--finomik-blue-5)]">
                Vista
              </span>
              {[
                { key: 'type' as const, label: 'Por tipo' },
                { key: 'sector' as const, label: 'Por sector' },
                { key: 'weight' as const, label: 'Por peso' },
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setAllocChart(tab.key)}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold transition-colors ${
                    allocChart === tab.key
                      ? 'bg-[#0B3064] text-white shadow'
                      : 'text-[color:var(--finomik-blue-5)] hover:text-finomik-primary'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
          {positions.length === 0 ? (
            <p className={theme.textSubtle}>
              Aún no tienes posiciones en cartera. Cuando empieces a invertir verás aquí cómo se reparte
              tu dinero.
            </p>
          ) : (
            <>
              {allocChart === 'type' && (
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-44 h-44 md:w-52 md:h-52">
                      <ResponsivePie
                        data={allocationByType.map(entry => ({
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
                            {datum.id}: € {datum.value.toLocaleString('es-ES')} (
                            {(datum.data as { percent?: number }).percent?.toFixed(1)}%)
                          </span>
                        )}
                      />
                    </div>
                    <p className="mt-2 text-[11px] text-[color:var(--finomik-blue-5)]">
                      Distribución por tipo de activo.
                    </p>
                  </div>
                  <div className="space-y-3 text-xs">
                    {allocationByType.map(entry => (
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
                            {entry.value.toLocaleString('es-ES', { maximumFractionDigits: 0 })}
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
                  </div>
                </div>
              )}

              {allocChart === 'sector' && (
                <div className="space-y-4">
                  {allocationBySector.length === 0 ? (
                    <p className={theme.textSubtle}>
                      No hay suficientes datos de sectores para mostrar esta vista todavía.
                    </p>
                  ) : (
                    <>
                      <div className="h-60 md:h-72 w-full">
                        <ResponsiveBar
                          data={allocationBySector.map(entry => ({
                            sector: entry.sector,
                            percent: Number(entry.percent.toFixed(1)),
                          }))}
                          keys={['percent']}
                          indexBy="sector"
                          layout="horizontal"
                          margin={{ top: 8, right: 32, bottom: 32, left: 130 }}
                          padding={0.3}
                          valueScale={{ type: 'linear' }}
                          indexScale={{ type: 'band', round: true }}
                          colors={({ data }) =>
                            SECTOR_COLORS[(data as { sector: string }).sector] ||
                            SECTOR_COLORS.Otros
                          }
                          borderRadius={6}
                          axisTop={null}
                          axisRight={null}
                          axisBottom={{
                            tickSize: 0,
                            tickPadding: 8,
                            format: v => `${v}%`,
                          }}
                          axisLeft={{
                            tickSize: 0,
                            tickPadding: 8,
                          }}
                          enableGridX
                          enableGridY={false}
                          enableLabel
                          label={d => `${d.value}%`}
                          labelSkipWidth={24}
                          labelTextColor="#ffffff"
                          isInteractive
                          tooltip={({ indexValue, value }) => (
                            <span className="bg-white px-2 py-1 rounded shadow text-xs text-finomik-primary">
                              {indexValue}: {Number(value).toFixed(1)}% de tu cartera
                            </span>
                          )}
                        />
                      </div>
                      <p className="text-[11px] text-[color:var(--finomik-blue-5)]">
                        Distribución de tu cartera por sector (cada barra representa el peso de un
                        sector distinto).
                      </p>
                    </>
                  )}
                </div>
              )}

              {allocChart === 'weight' && (
                <div className="space-y-3">
                  <p className="text-[11px] text-[color:var(--finomik-blue-5)]">
                    Aquí ves qué posiciones pesan más en tu cartera. Si pocas posiciones pesan mucho, tu cartera depende más de esos activos.
                  </p>
                  {weightChartData.length === 0 ? (
                    <p className={theme.textSubtle}>
                      Aún no hay suficientes posiciones para analizar el peso de cada una.
                    </p>
                  ) : (
                    <>
                      <div className="flex items-center justify-between text-[11px] mb-2">
                        <span className="font-semibold text-finomik-primary">
                          Nivel de peso máximo
                        </span>
                        <span className="text-[color:var(--finomik-blue-5)]">
                          {portfolioMetrics.diversification === 'Alta'
                            ? 'Peso muy repartido'
                            : portfolioMetrics.diversification === 'Media'
                            ? 'Peso intermedio'
                            : 'Peso muy concentrado'}
                        </span>
                      </div>
                      <div className="grid gap-4 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1.2fr)] items-center">
                        <div className="flex flex-col items-center justify-center">
                          <div className="w-44 h-44 md:w-52 md:h-52">
                            <ResponsivePie
                              data={weightChartData.map((item, index) => ({
                                id: item.symbol,
                                value: item.weight,
                                label: item.symbol,
                                color: WEIGHT_COLORS[index % WEIGHT_COLORS.length],
                              }))}
                              margin={{ top: 8, right: 8, bottom: 8, left: 8 }}
                              innerRadius={0.35}
                              padAngle={1}
                              cornerRadius={3}
                              colors={{ datum: 'data.color' }}
                              borderWidth={0}
                              enableArcLabels={false}
                              enableArcLinkLabels={false}
                              isInteractive
                              tooltip={({ datum }) => (
                                <span className="bg-white px-2 py-1 rounded shadow text-xs">
                                  {datum.id}: {datum.value.toFixed(1)}% de la cartera
                                </span>
                              )}
                            />
                          </div>
                          <p className="mt-2 text-[11px] text-[color:var(--finomik-blue-5)]">
                            Peso de cada posición sobre el total de la cartera.
                          </p>
                        </div>
                        <div className="space-y-2 text-xs">
                          {weightChartData.map((item, index) => (
                            <div
                              key={item.symbol}
                              className="rounded-xl border border-[color:var(--finomik-blue-6)] bg-finomik-blue-soft/20 px-3 py-2"
                            >
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                  <span
                                    className="w-2.5 h-2.5 rounded-full"
                                    style={{
                                      backgroundColor:
                                        WEIGHT_COLORS[index % WEIGHT_COLORS.length],
                                    }}
                                  />
                                  <span className="font-semibold text-finomik-primary">
                                    {item.symbol}
                                  </span>
                                </div>
                                <span className="text-[color:var(--finomik-blue-5)] text-[11px]">
                                  {item.weight.toFixed(1)}% de la cartera
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Tus posiciones */}
        <div className={`${theme.card} p-5`}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className={theme.headingMedium}>Tus posiciones</h3>
              <p className="text-[11px] text-[color:var(--finomik-blue-5)]">
                Dónde está invertido tu dinero hoy.
              </p>
            </div>
          </div>
          {positions.length === 0 ? (
            <div className="text-xs text-[color:var(--finomik-blue-5)]">
              <p>
                Aún no tienes activos en cartera. Empieza comprando desde la pestaña{' '}
                <button
                  type="button"
                  onClick={() => setCurrentScreen('investMarket')}
                  className="font-semibold text-finomik-primary underline underline-offset-2"
                >
                  Mercado
                </button>
                .
              </p>
            </div>
          ) : (
            <>
              {/* Tabla en escritorio */}
              <div className="hidden md:block overflow-x-auto -mx-2">
                <table className="min-w-full text-xs text-[color:var(--finomik-blue-5)]">
                  <thead>
                    <tr className="border-b border-[color:var(--finomik-blue-6)] text-[10px] uppercase tracking-wide">
                      <th className="px-2 py-2 text-left">Ticker</th>
                      <th className="px-2 py-2 text-left">Activo</th>
                      <th className="px-2 py-2 text-right">Unidades</th>
                      <th className="px-2 py-2 text-right">Precio medio</th>
                      <th className="px-2 py-2 text-right">Precio actual</th>
                      <th className="px-2 py-2 text-right">Valor actual</th>
                      <th className="px-2 py-2 text-right">Plusvalía</th>
                      <th className="px-2 py-2 text-right">Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {positions.map(position => {
                      const price =
                        latestPriceBySymbol[position.symbol] ??
                        position.averageCost;
                      const gainColor =
                        position.gainLoss > 0
                          ? 'text-emerald-600'
                          : position.gainLoss < 0
                          ? 'text-red-500'
                          : 'text-[color:var(--finomik-blue-5)]';
                      return (
                        <tr
                          key={position.symbol}
                          className="border-b border-[color:var(--finomik-blue-6)] last:border-b-0"
                        >
                          <td className="px-2 py-2 font-semibold text-finomik-primary">
                            {position.symbol}
                          </td>
                          <td className="px-2 py-2">
                            {position.asset?.name ?? 'Activo'}
                          </td>
                          <td className="px-2 py-2 text-right">
                            {position.quantity.toFixed(2)}
                          </td>
                          <td className="px-2 py-2 text-right">
                            € {position.averageCost.toFixed(2)}
                          </td>
                          <td className="px-2 py-2 text-right">
                            € {price.toFixed(2)}
                          </td>
                          <td className="px-2 py-2 text-right">
                            €
                            {position.currentValue.toLocaleString('es-ES', {
                              maximumFractionDigits: 0,
                            })}
                          </td>
                          <td className={`px-2 py-2 text-right ${gainColor}`}>
                            {position.gainLoss >= 0 ? '+' : ''}
                            {position.returnPct.toFixed(1)}%
                          </td>
                          <td className="px-2 py-2 text-right">
                            <button
                              type="button"
                              onClick={() => setTradeState({ symbol: position.symbol })}
                              className="px-3 py-1.5 rounded-full border border-red-200 text-[11px] font-semibold text-red-600 hover:bg-red-50"
                            >
                              Vender
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Tarjetas en móvil */}
              <div className="md:hidden space-y-3">
                {positions.map(position => {
                  const price =
                    latestPriceBySymbol[position.symbol] ??
                    position.averageCost;
                  const gainColor =
                    position.gainLoss > 0
                      ? 'text-emerald-600'
                      : position.gainLoss < 0
                      ? 'text-red-500'
                      : 'text-[color:var(--finomik-blue-5)]';
                  return (
                    <div
                      key={position.symbol}
                      className="rounded-2xl border border-[color:var(--finomik-blue-6)] p-3 bg-white flex flex-col gap-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-xs font-semibold text-finomik-primary">
                            {position.symbol}
                          </div>
                          <div className="text-[11px] text-[color:var(--finomik-blue-5)]">
                            {position.asset?.name ?? 'Activo'}
                          </div>
                        </div>
                        <div className="text-right text-[11px]">
                          <div className="text-[color:var(--finomik-blue-5)]">
                            Valor actual
                          </div>
                          <div className="font-semibold text-finomik-primary">
                            €
                            {position.currentValue.toLocaleString('es-ES', {
                              maximumFractionDigits: 0,
                            })}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-[color:var(--finomik-blue-5)]">
                        <div>
                          {position.quantity.toFixed(2)} uds · PM €{' '}
                          {position.averageCost.toFixed(2)}
                        </div>
                        <div className={gainColor}>
                          {position.gainLoss >= 0 ? '+' : ''}
                          {position.returnPct.toFixed(1)}%
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setTradeState({ symbol: position.symbol })}
                        className="mt-1 self-end px-3 py-1.5 rounded-full border border-red-200 text-[11px] font-semibold text-red-600 hover:bg-red-50"
                      >
                        Vender
                      </button>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Insights rápidos */}
        <div className={`${theme.card} p-6`}>
          <h3 className={`${theme.headingMedium} mb-4`}>Insights rápidos</h3>
          {insightsList.length === 0 ? (
            <p className={theme.textSubtle}>
              Aquí verás un resumen de los puntos clave de tu cartera en cuanto
              empieces a invertir.
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

        {/* Últimos movimientos */}
        <div className={`${theme.card} p-5`}>
          <h3 className={`${theme.headingMedium} mb-3`}>
            Últimos movimientos
          </h3>
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
                        {entry.type === 'buy' ? 'Compra' : 'Venta'} ·{' '}
                        {entry.symbol}
                      </div>
                      <div className="text-[color:var(--finomik-blue-5)]">
                        {(asset && asset.name) || 'Activo'} · {entry.quantity}{' '}
                        uds a €{entry.price.toFixed(2)}
                      </div>
                    </div>
                    <div className="text-right text-[11px] text-[color:var(--finomik-blue-5)]">
                      {date.toLocaleDateString()} ·{' '}
                      {date.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {tradeState && assetsBySymbol[tradeState.symbol] && (
          <TradeModal
            mode="sell"
            symbol={tradeState.symbol}
            asset={assetsBySymbol[tradeState.symbol]}
            series={assetSeriesBySymbol[tradeState.symbol] || []}
            latestPrice={
              latestPriceBySymbol[tradeState.symbol] ||
              assetsBySymbol[tradeState.symbol].basePrice
            }
            onClose={() => setTradeState(null)}
          />
        )}
      </section>
    </div>
  );
};

