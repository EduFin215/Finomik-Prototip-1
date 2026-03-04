import React, { useMemo, useState } from 'react';
import { X as CloseIcon } from 'lucide-react';
import { ResponsiveLine } from '@nivo/line';
import { useGame } from '../context/GameContext';
import { type MarketAsset } from '../data/marketAssets';
import { lineChartDefaults, lineChartTooltipClass } from '../utils/lineChartTheme';

type TradeMode = 'buy' | 'sell';
type TradeStep = 1 | 2;

interface TradeModalProps {
  mode: TradeMode;
  symbol: string;
  asset: MarketAsset;
  series: { name: string; value: number }[];
  latestPrice: number;
  onClose: () => void;
}

export const TradeModal: React.FC<TradeModalProps> = ({
  mode,
  symbol,
  asset,
  series,
  latestPrice,
  onClose,
}) => {
  const { user, buyAsset, sellAsset } = useGame();
  const [step, setStep] = useState<TradeStep>(1);
  const [draft, setDraft] = useState<{
    modeInput: 'amount' | 'units';
    amount?: string;
    units?: string;
  }>({
    modeInput: mode === 'buy' ? 'amount' : 'units',
    amount: '',
    units: '',
  });

  const price = latestPrice || asset.basePrice || 0;
  const holding = user.portfolio.holdings[symbol];
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
    mode === 'buy' &&
    draft.modeInput === 'amount' &&
    costOrRevenue > user.portfolio.cash;
  const insufficientHoldings =
    mode === 'sell' && units > 0 && (!holding || units > holding.quantity);

  const handleConfirm = () => {
    if (units <= 0 || price <= 0) return;
    if (mode === 'buy') {
      if (insufficientCash) return;
      buyAsset(symbol, price, units);
    } else {
      if (insufficientHoldings) return;
      sellAsset(symbol, price, units);
    }
    onClose();
  };

  const assetTypeLabel =
    asset.type === 'Stock'
      ? 'acción (renta variable)'
      : asset.type === 'ETF'
      ? 'ETF'
      : asset.type === 'Bond'
      ? 'bono (renta fija)'
      : 'fondo';
  const volatilityLabel =
    asset.volatility > 0.03
      ? 'alta'
      : asset.volatility > 0.02
      ? 'media'
      : 'baja';

  const chartData = useMemo(
    () => [
      {
        id: 'precio',
        data: series.map(d => ({ x: d.name, y: d.value })),
      },
    ],
    [series]
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-auto my-8 p-6 md:p-8 space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xs uppercase font-semibold text-[color:var(--finomik-blue-5)] tracking-wider">
              {modeLabel} · {symbol}
            </div>
            <h2 className="mt-1 text-2xl font-bold text-finomik-primary">
              {asset.name}
            </h2>
          </div>
          <button
            onClick={onClose}
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
                Entiende este activo antes de {mode === 'buy' ? 'comprar' : 'vender'}
              </span>
            </div>
            <div className="h-40 w-full rounded-xl overflow-hidden bg-slate-50/50 border border-slate-100">
              <ResponsiveLine
                data={chartData}
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
              <h3 className="text-base font-bold text-finomik-primary">
                Qué es este activo
              </h3>
              <ul className="text-base text-[color:var(--finomik-blue-2)] space-y-2 leading-relaxed">
                <li>
                  <strong>{asset.name}</strong> es un {assetTypeLabel} del sector{' '}
                  {asset.sector} ({asset.region}).
                </li>
                <li>
                  Volatilidad {volatilityLabel}: el precio puede subir o bajar más que en
                  activos más estables.
                </li>
                <li>
                  La operación se ejecuta al precio simulado actual dentro de Finomik.
                </li>
              </ul>
            </div>
            <div className="flex flex-wrap justify-end gap-3 pt-2">
              <button
                onClick={onClose}
                className="px-5 py-3 rounded-xl border-2 border-[color:var(--finomik-blue-6)] text-base font-semibold text-[color:var(--finomik-blue-5)] hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button
                onClick={() => setStep(2)}
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
                  type="button"
                  onClick={() =>
                    setDraft({ modeInput: 'amount', amount: '', units: '' })
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
                  type="button"
                  onClick={() =>
                    setDraft({ modeInput: 'units', amount: '', units: '' })
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
                  value={
                    draft.modeInput === 'amount'
                      ? draft.amount ?? ''
                      : draft.units ?? ''
                  }
                  onChange={e => {
                    const value = e.target.value.replace(',', '.');
                    if (!/^\d*\.?\d*$/.test(value)) return;
                    if (draft.modeInput === 'amount') {
                      setDraft(prev => ({ ...prev, amount: value }));
                    } else {
                      setDraft(prev => ({ ...prev, units: value }));
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
                      type="button"
                      onClick={() => {
                        const value = (user.portfolio.cash * pct) / 100;
                        setDraft(prev => ({ ...prev, amount: value.toFixed(0) }));
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
                      type="button"
                      onClick={() => {
                        const u = (holding.quantity * pct) / 100;
                        setDraft(prev => ({ ...prev, units: u.toFixed(3) }));
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
                {' · '}Efectivo: €
                {user.portfolio.cash.toLocaleString('es-ES')}
              </div>
              <div>
                {draft.modeInput === 'amount'
                  ? `~${units.toFixed(3)} unidades · ${
                      mode === 'buy' ? 'Coste' : 'Importe'
                    } estimado: € ${costOrRevenue.toFixed(2)}`
                  : `${units.toFixed(3)} unidades · ${
                      mode === 'buy' ? 'Coste' : 'Importe'
                    } estimado: € ${costOrRevenue.toFixed(2)}`}
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
                type="button"
                onClick={() => setStep(1)}
                className="px-5 py-3 rounded-xl border-2 border-[color:var(--finomik-blue-6)] text-base font-semibold text-[color:var(--finomik-blue-5)] hover:bg-slate-50"
              >
                Atrás
              </button>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-3 rounded-xl border-2 border-[color:var(--finomik-blue-6)] text-base font-semibold text-[color:var(--finomik-blue-5)] hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="button"
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

