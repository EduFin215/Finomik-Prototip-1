import React, { useMemo, useState } from 'react';
import {
  Activity,
  Search,
  Info,
} from 'lucide-react';
import { ResponsiveLine } from '@nivo/line';
import { useGame } from '../context/GameContext';
import { getTheme } from '../utils/theme';
import {
  generateAssetSeries,
} from '../utils/portfolioSimulation';
import {
  getAssetsForLevel,
  type MarketAsset,
} from '../data/marketAssets';
import {
  lineChartDefaults,
  lineChartTooltipClass,
} from '../utils/lineChartTheme';
import { TradeModal } from '../components/TradeModal';

export const InvestMarket = () => {
  const { user, buyAsset, sellAsset, themeMode, currentScreen, setCurrentScreen } = useGame();
  const theme = getTheme(themeMode);

  const ASSETS = useMemo(
    () => getAssetsForLevel(user.investorLevel),
    [user.investorLevel]
  );

  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(
    ASSETS[0]?.symbol ?? null
  );
  const [tradeSymbol, setTradeSymbol] = useState<string | null>(null);
  const [search, setSearch] = useState('');

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

  const effectiveSelectedSymbol =
    selectedSymbol ?? ASSETS[0]?.symbol ?? null;

  const filteredAssets = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return ASSETS;
    return ASSETS.filter(
      a =>
        a.symbol.toLowerCase().includes(term) ||
        a.name.toLowerCase().includes(term) ||
        a.sector.toLowerCase().includes(term) ||
        a.region.toLowerCase().includes(term)
    );
  }, [ASSETS, search]);

  const selectedAsset =
    (effectiveSelectedSymbol && assetsBySymbol[effectiveSelectedSymbol]) ||
    ASSETS[0] ||
    null;

  const selectedAssetTypeLabel =
    selectedAsset?.type === 'Stock'
      ? 'acción (renta variable)'
      : selectedAsset?.type === 'ETF'
      ? 'ETF'
      : selectedAsset?.type === 'Bond'
      ? 'bono (renta fija)'
      : selectedAsset
      ? 'fondo'
      : '';

  const selectedAssetVolatilityLabel =
    selectedAsset && selectedAsset.volatility > 0.03
      ? 'alta'
      : selectedAsset && selectedAsset.volatility > 0.02
      ? 'media'
      : selectedAsset
      ? 'baja'
      : '';

  const selectedPosition =
    effectiveSelectedSymbol &&
    user.portfolio.holdings[effectiveSelectedSymbol]
      ? (() => {
          const data =
            user.portfolio.holdings[effectiveSelectedSymbol] || {
              quantity: 0,
              averageCost: 0,
            };
          const price = latestPriceBySymbol[effectiveSelectedSymbol] || 0;
          const currentValue = price * data.quantity;
          const costBasis = data.averageCost * data.quantity;
          const gainLoss = currentValue - costBasis;
          const returnPct = costBasis > 0 ? (gainLoss / costBasis) * 100 : 0;
          return {
            symbol: effectiveSelectedSymbol,
            quantity: data.quantity,
            averageCost: data.averageCost,
            currentValue,
            gainLoss,
            returnPct,
          };
        })()
      : null;

  const MarketList: React.FC = () => (
    <section className={`${theme.card} p-4`}>
      <div className="flex items-center justify-between mb-3 gap-3">
        <div>
          <h3 className={theme.headingMedium}>Mercado simulado</h3>
          <p className="text-[11px] text-[color:var(--finomik-blue-5)]">
            Explora los activos disponibles y selecciona uno para operar.
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-[11px] text-[color:var(--finomik-blue-5)]">
          <span>
            Efectivo:{' '}
            <strong className="text-finomik-primary">
              €
              {user.portfolio.cash.toLocaleString('es-ES', {
                maximumFractionDigits: 0,
              })}
            </strong>
          </span>
        </div>
      </div>
      <div className="mb-3 relative">
        <Search
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--finomik-blue-5)]"
        />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar por nombre, ticker, sector o región"
          className="w-full pl-8 pr-3 py-2 rounded-xl border border-[color:var(--finomik-blue-6)] text-xs focus:outline-none focus:ring-2 focus:ring-finomik-primary/30 focus:border-finomik-primary"
        />
      </div>
      <div className="sm:-mx-2">
        <div className="flex flex-col gap-2 px-0 sm:px-2 pb-1">
          {filteredAssets.map(asset => {
            const isSelected = effectiveSelectedSymbol === asset.symbol;
            const price =
              latestPriceBySymbol[asset.symbol] || asset.basePrice;
            const holding = user.portfolio.holdings[asset.symbol];
            return (
              <button
                key={asset.symbol}
                onClick={() => setSelectedSymbol(asset.symbol)}
                className={`w-full rounded-2xl border px-4 py-3 text-left transition-colors ${
                  isSelected
                    ? 'border-finomik-primary bg-finomik-blue-soft'
                    : 'border-[color:var(--finomik-blue-6)] bg-white hover:border-finomik-primary/50'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-finomik-primary">
                      {asset.symbol}
                    </div>
                    <div className="text-[11px] text-[color:var(--finomik-blue-5)] truncate max-w-[180px]">
                      {asset.name}
                    </div>
                    <div className="mt-1 text-[10px] text-[color:var(--finomik-blue-5)]">
                      {asset.type} · {asset.region}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] uppercase text-[color:var(--finomik-blue-5)]">
                      Precio
                    </div>
                    <div className="text-sm font-semibold text-finomik-primary">
                      € {price.toFixed(2)}
                    </div>
                    {holding && holding.quantity > 0 && (
                      <div className="mt-1 text-[10px] text-[color:var(--finomik-blue-5)]">
                        En cartera:{' '}
                        <span className="font-semibold">
                          {holding.quantity.toFixed(2)} uds
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
          {filteredAssets.length === 0 && (
            <p className="text-[11px] text-[color:var(--finomik-blue-5)] px-1 py-2">
              No hay activos que coincidan con tu búsqueda.
            </p>
          )}
        </div>
      </div>
    </section>
  );

  const currentTradeAsset =
    tradeSymbol && assetsBySymbol[tradeSymbol]
      ? assetsBySymbol[tradeSymbol]
      : null;

  return (
    <div className={theme.contentPadding}>
      <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2 text-xs">
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
        <div className="flex flex-wrap items-center gap-3 text-[11px] text-[color:var(--finomik-blue-5)]">
          <button
            type="button"
            onClick={() => setCurrentScreen('investorLevel')}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-finomik-blue-soft border border-[color:var(--finomik-blue-6)] text-[10px] font-semibold text-finomik-primary hover:bg-finomik-blue-soft/80 transition-colors cursor-pointer"
            title="Ver detalles de tu nivel de inversor"
          >
            <span>Nivel {user.investorLevel}</span>
          </button>
          <span>
            Efectivo:{' '}
            <strong className="text-finomik-primary">
              €
              {user.portfolio.cash.toLocaleString('es-ES', {
                maximumFractionDigits: 0,
              })}
            </strong>
          </span>
          <span>
            Posiciones:{' '}
            <strong className="text-finomik-primary">
              {Object.keys(user.portfolio.holdings).length}
            </strong>
          </span>
        </div>
      </div>

      <section className="min-h-[calc(100vh-96px)] grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.2fr)]">
        <MarketList />

        <section className={`${theme.card} p-5 flex flex-col`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Activity size={18} className="text-finomik-primary" />
              <h3 className={theme.headingMedium}>Detalle de activo</h3>
            </div>
          </div>
          {!selectedAsset ? (
            <p className={theme.textSubtle}>
              Selecciona un activo en la lista para ver más detalles.
            </p>
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
                      latestPriceBySymbol[selectedAsset.symbol] ||
                      selectedAsset.basePrice
                    ).toFixed(2)}
                  </div>
                </div>
              </div>
              <div className="h-40 mb-3 w-full min-h-[160px]">
                <ResponsiveLine
                  data={[
                    {
                      id: 'precio',
                      data: (assetSeriesBySymbol[selectedAsset.symbol] ||
                        []).map(d => ({ x: d.name, y: d.value })),
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
              <div className="mb-3 rounded-2xl bg-finomik-blue-soft/40 border border-[color:var(--finomik-blue-6)] p-4 md:p-5 text-[11px] text-[color:var(--finomik-blue-2)]">
                <div className="flex items-start gap-2 mb-2">
                  <div className="mt-0.5 hidden sm:flex w-6 h-6 rounded-full bg-finomik-blue-soft items-center justify-center">
                    <Info size={14} className="text-finomik-primary" />
                  </div>
                  <div>
                    <div className="text-[10px] font-semibold uppercase tracking-wide text-[color:var(--finomik-blue-5)]">
                      Ficha rápida del activo
                    </div>
                    <div className="text-xs font-bold text-finomik-primary">
                      {selectedAsset.name}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                  <div className="space-y-1.5">
                    <p>
                      Es un{' '}
                      <span className="font-semibold">
                        {selectedAssetTypeLabel}
                      </span>{' '}
                      del sector{' '}
                      <span className="font-semibold">
                        {selectedAsset.sector}
                      </span>{' '}
                      en{' '}
                      <span className="font-semibold">
                        {selectedAsset.region}
                      </span>
                      .
                    </p>
                    <p>
                      Su volatilidad es{' '}
                      <span className="font-semibold">
                        {selectedAssetVolatilityLabel}
                      </span>
                      , lo que significa que su precio puede moverse más que el
                      de activos más estables.
                    </p>
                  </div>
                  <div className="space-y-1.5 md:border-l md:border-[color:var(--finomik-blue-6)] md:pl-4">
                    <p>
                      Aquí compras y vendes en un{' '}
                      <span className="font-semibold">simulador</span>, sin
                      dinero real. Las operaciones se ejecutan al precio
                      simulado actual.
                    </p>
                    <p className="text-[10px] text-[color:var(--finomik-blue-5)]">
                      Úsalo para practicar cómo te sentirías con subidas y
                      bajadas reales antes de invertir fuera de Finomik.
                    </p>
                  </div>
                </div>
              </div>
              <div className="text-[11px] text-[color:var(--finomik-blue-5)] space-y-1 mb-3">
                <div>
                  Tipo:{' '}
                  <span className="font-semibold">{selectedAsset.type}</span> ·
                  Sector:{' '}
                  <span className="font-semibold">
                    {selectedAsset.sector}
                  </span>{' '}
                  · Región:{' '}
                  <span className="font-semibold">
                    {selectedAsset.region}
                  </span>
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
                    .{' '}
                    {selectedPosition.currentValue > 0 && (
                      <>
                        Valor actual estimado:{' '}
                        <span className="font-semibold">
                          €
                          {selectedPosition.currentValue.toLocaleString(
                            'es-ES',
                            { maximumFractionDigits: 0 }
                          )}
                        </span>{' '}
                        (
                        {selectedPosition.returnPct >= 0 ? '+' : ''}
                        {selectedPosition.returnPct.toFixed(1)}%)
                      </>
                    )}
                  </div>
                ) : (
                  <div>
                    Aún no tienes este activo en cartera. Puedes usar el
                    simulador para entender cómo afectaría a tu portfolio.
                  </div>
                )}
              </div>
              <div className="mt-auto flex gap-2 text-xs">
                <button
                  onClick={() => setTradeSymbol(selectedAsset.symbol)}
                  className="flex-1 px-3 py-2 rounded-full bg-emerald-500 text-white font-semibold hover:bg-emerald-600"
                >
                  Comprar
                </button>
              </div>
            </>
          )}
        </section>
      </section>

      {currentTradeAsset && tradeSymbol && (
        <TradeModal
          mode="buy"
          symbol={tradeSymbol}
          asset={currentTradeAsset}
          series={assetSeriesBySymbol[tradeSymbol] || []}
          latestPrice={latestPriceBySymbol[tradeSymbol] || currentTradeAsset.basePrice}
          onClose={() => setTradeSymbol(null)}
        />
      )}
    </div>
  );
};

