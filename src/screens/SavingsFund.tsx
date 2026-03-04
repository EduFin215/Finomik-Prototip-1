import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { PiggyBank, Lock, ArrowLeft, ArrowRight, Sparkles, Info } from 'lucide-react';
import { useGame, SAVINGS_INTEREST_RATE } from '../context/GameContext';
import { getTheme } from '../utils/theme';

export const SavingsFund = () => {
  const { user, setUser, setCurrentScreen, setSavingsFundUnlocked, themeMode } = useGame();
  const theme = getTheme(themeMode);

  const isUnlocked = user.savingsFundUnlocked;
  const annualRatePercent = SAVINGS_INTEREST_RATE * 100;
  const monthlyRate = SAVINGS_INTEREST_RATE / 12;
  const monthlyRatePercent = monthlyRate * 100;
  const estimatedMonthlyInterest =
    Math.round(user.savingsFund * monthlyRate * 100) / 100;

  const [amountInput, setAmountInput] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const parsedAmount = useMemo(() => {
    if (!amountInput) return 0;
    const raw = amountInput.replace(',', '.');
    const amount = Number(raw);
    return Number.isNaN(amount) || amount <= 0 ? 0 : amount;
  }, [amountInput]);

  const projectedFund = parsedAmount > 0 ? user.savingsFund + parsedAmount : user.savingsFund;
  const projectedMonthlyInterest =
    Math.round(projectedFund * monthlyRate * 100) / 100;

  const handleUnlock = () => {
    setSavingsFundUnlocked(true);
  };

  const handleAddToFund = () => {
    const raw = amountInput.replace(',', '.');
    const amount = Number(raw);
    if (Number.isNaN(amount) || amount <= 0) {
      setError('Introduce una cantidad positiva.');
      return;
    }
    if (amount > user.balance) {
      setError('No tienes saldo suficiente en tu cuenta corriente simulada.');
      return;
    }
    setUser(prev => ({
      ...prev,
      balance: prev.balance - amount,
      savingsFund: prev.savingsFund + amount,
    }));
    setAmountInput('');
    setError(null);
  };

  return (
    <div className={theme.contentPadding}>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={() => setCurrentScreen('dashboard')}
            className="inline-flex items-center gap-2 text-xs font-semibold text-finomik-primary hover:text-finomik-primary/80"
          >
            <ArrowLeft size={16} />
            <span>Volver al dashboard</span>
          </button>
          <div className="hidden sm:flex items-center gap-2 text-[11px] text-[color:var(--finomik-blue-5)]">
            <span>Saldo disponible:</span>
            <span className="font-semibold text-finomik-primary">
              {user.balance.toLocaleString('es-ES', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{' '}
              €
            </span>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${theme.card} p-6 md:p-8 space-y-6`}
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-finomik-blue-soft flex items-center justify-center">
                <PiggyBank size={26} className="text-finomik-primary" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className={theme.headingLarge}>Fondo de Ahorro</h1>
                  <span className="inline-flex items-center rounded-full bg-finomik-blue-soft px-2 py-0.5 text-[10px] font-semibold uppercase text-[color:var(--finomik-blue-5)]">
                    Cuenta remunerada
                  </span>
                </div>
                <p className={`${theme.textSubtle} text-sm mt-1`}>
                  Tu colchón para imprevistos, separado de tu día a día y con un{' '}
                  <span className="font-semibold">2,5% anual simulado</span>.
                </p>
              </div>
            </div>
            <div className="flex sm:hidden items-center gap-2 text-[11px] text-[color:var(--finomik-blue-5)]">
              <span>Saldo disponible:</span>
              <span className="font-semibold text-finomik-primary">
                {user.balance.toLocaleString('es-ES', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{' '}
                €
              </span>
            </div>
          </div>

          {!isUnlocked ? (
            <div className="mt-2 rounded-2xl border border-dashed border-[color:var(--finomik-blue-6)] bg-finomik-blue-soft/40 p-6 flex flex-col items-center text-center gap-3">
              <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-sm mb-1">
                <Lock size={30} className="text-finomik-primary" />
              </div>
              <h2 className="text-lg font-bold text-finomik-primary">
                Fondo de Ahorro bloqueado
              </h2>
              <p className="text-sm text-[color:var(--finomik-blue-5)] max-w-md">
                Se desbloquea al completar el tema de{' '}
                <span className="font-semibold">Crédito y Deuda</span>.
              </p>
              <button
                onClick={handleUnlock}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-finomik-primary px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:opacity-95 transition-opacity"
              >
                Desbloquear ahora
                <ArrowRight size={16} />
              </button>
              <p className="text-[11px] text-[color:var(--finomik-blue-5)] max-w-xs">
                Aquí solo verás números cuando el fondo esté activo.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Tarjeta 1: resumen del fondo */}
              <div className="rounded-2xl border border-[color:var(--finomik-blue-6)] bg-white p-5 md:p-6 shadow-sm flex flex-col gap-4 md:gap-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-[color:var(--finomik-blue-5)] mb-1">
                      Fondo de Ahorro
                    </div>
                    <div className="text-3xl md:text-4xl font-extrabold text-finomik-primary">
                      {user.savingsFund.toLocaleString('es-ES', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{' '}
                      €
                    </div>
                    <p className="mt-1 text-[11px] text-[color:var(--finomik-blue-5)]">
                      Disponible solo para imprevistos.
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="inline-flex items-baseline gap-1 rounded-full bg-finomik-blue-soft px-3 py-1 text-sm font-bold text-finomik-primary">
                      <span>
                        {annualRatePercent.toLocaleString('es-ES', {
                          minimumFractionDigits: 1,
                          maximumFractionDigits: 1,
                        })}
                        %
                      </span>
                      <span className="text-[10px] font-semibold text-[color:var(--finomik-blue-5)]">
                        TAE simulada
                      </span>
                    </div>
                    <div className="text-[11px] text-[color:var(--finomik-blue-5)] text-right">
                      Este mes:{" "}
                      <span className="font-semibold text-finomik-primary">
                        {estimatedMonthlyInterest.toLocaleString('es-ES', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}{' '}
                        €
                      </span>
                    </div>
                  </div>
                </div>
                {/* Barra de proporción fondo vs saldo total */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-[color:var(--finomik-blue-5)]">
                    <span>Proporción sobre tu saldo líquido</span>
                  </div>
                  <div className="h-2 rounded-full bg-finomik-blue-soft/50 overflow-hidden">
                    {(() => {
                      const totalLiquid = user.balance + user.savingsFund;
                      const ratio =
                        totalLiquid > 0 ? Math.min(1, Math.max(0, user.savingsFund / totalLiquid)) : 0;
                      return (
                        <div
                          className="h-full rounded-full bg-finomik-primary"
                          style={{ width: `${ratio * 100}%` }}
                        />
                      );
                    })()}
                  </div>
                  <div className="flex justify-between text-[10px] text-[color:var(--finomik-blue-5)]">
                    <span>En el fondo</span>
                    <span>
                      Fuera del fondo:{" "}
                      {(user.balance + user.savingsFund) > 0
                        ? `${Math.round(
                            ((user.balance) / (user.balance + user.savingsFund)) * 100
                          )}%`
                        : "0%"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Tarjeta 2: aportar dinero */}
              <div className="rounded-2xl border border-[color:var(--finomik-blue-6)] bg-white p-5 md:p-6 flex flex-col gap-4">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-sm font-semibold text-finomik-primary">
                    Añadir dinero
                  </h2>
                  <span className="text-[11px] text-[color:var(--finomik-blue-5)]">
                    Saldo disponible:{' '}
                    <span className="font-semibold text-finomik-primary">
                      {user.balance.toLocaleString('es-ES', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{' '}
                      €
                    </span>
                  </span>
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex items-baseline gap-2">
                    <span className="text-base text-[color:var(--finomik-blue-5)]">€</span>
                    <input
                      type="number"
                      min="0"
                      step="10"
                      value={amountInput}
                      onChange={e => setAmountInput(e.target.value)}
                      className="w-full border-b-2 border-[color:var(--finomik-blue-6)] pb-1 text-2xl font-semibold text-finomik-primary outline-none focus:border-finomik-primary"
                      placeholder="0"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {[25, 50, 75].map(pct => (
                      <button
                        key={pct}
                        type="button"
                        onClick={() =>
                          setAmountInput(
                            Math.max(
                              0,
                              Math.floor((user.balance * pct) / 100)
                            ).toString()
                          )
                        }
                        className="px-3 py-1.5 rounded-full bg-finomik-blue-soft text-[11px] font-semibold text-[color:var(--finomik-blue-5)] hover:bg-finomik-blue-soft/80"
                      >
                        {pct}%
                      </button>
                    ))}
                  </div>
                  {error && (
                    <p className="text-[11px] text-red-500 mt-1">
                      {error}
                    </p>
                  )}
                  {!error && parsedAmount > 0 && (
                    <p className="text-[11px] text-[color:var(--finomik-blue-5)]">
                      Tu fondo quedaría en{' '}
                      <span className="font-semibold text-finomik-primary">
                        {projectedFund.toLocaleString('es-ES', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}{' '}
                        €
                      </span>
                      .
                    </p>
                  )}
                </div>

                <button
                  onClick={handleAddToFund}
                  disabled={parsedAmount <= 0}
                  className={`mt-1 inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-opacity ${
                    parsedAmount <= 0
                      ? 'bg-slate-300 cursor-not-allowed'
                      : 'bg-finomik-primary hover:opacity-95'
                  }`}
                >
                  Mover al fondo
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

