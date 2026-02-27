import React, { useState } from 'react';
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
                <h1 className={theme.headingLarge}>Fondo de Ahorro</h1>
                <p className={theme.textSubtle}>
                  Tu cuenta remunerada dentro del simulador. Construye tu colchón de seguridad y
                  deja que trabaje al <span className="font-semibold">2,5% anual</span>.
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
            <div className="mt-2 rounded-2xl border border-dashed border-[color:var(--finomik-blue-6)] bg-finomik-blue-soft/40 p-6 flex flex-col items-center text-center gap-4">
              <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-sm mb-1">
                <Lock size={30} className="text-finomik-primary" />
              </div>
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-finomik-primary">
                  Fondo de Ahorro bloqueado
                </h2>
                <p className="text-sm text-[color:var(--finomik-blue-5)] max-w-md">
                  Este fondo se desbloquea cuando superes el tema de{' '}
                  <span className="font-semibold">Crédito y Deuda</span>. Hasta entonces, puedes
                  revisar la teoría y preparar tu estrategia de ahorro.
                </p>
              </div>
              <button
                onClick={handleUnlock}
                className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-finomik-primary px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:opacity-95 transition-opacity"
              >
                Desbloquear ahora
                <ArrowRight size={16} />
              </button>
              <p className="text-[11px] text-[color:var(--finomik-blue-5)] max-w-xs">
                En esta versión del simulador puedes desbloquearlo manualmente para explorar cómo
                funcionaría tu fondo de emergencia remunerado.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {/* Columna 1: saldo + rentabilidad */}
              <div className="space-y-4 lg:col-span-1">
                <div className="rounded-2xl border border-[color:var(--finomik-blue-6)] bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <div className="text-[11px] font-semibold uppercase tracking-wider text-[color:var(--finomik-blue-5)]">
                        Saldo en el fondo
                      </div>
                      <div className="mt-1 text-2xl font-bold text-finomik-primary">
                        {user.savingsFund.toLocaleString('es-ES', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}{' '}
                        €
                      </div>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-finomik-blue-soft flex items-center justify-center">
                      <PiggyBank size={20} className="text-finomik-primary" />
                    </div>
                  </div>
                  <p className="mt-3 text-xs text-[color:var(--finomik-blue-5)]">
                    Este dinero está reservado como{' '}
                    <span className="font-semibold">fondo de emergencia</span>. No compites con tu
                    día a día: está ahí para cuando algo se tuerza.
                  </p>
                </div>

                <div className="rounded-2xl border border-[color:var(--finomik-blue-6)] bg-finomik-blue-soft/40 p-4 flex items-start gap-3">
                  <Sparkles size={18} className="mt-0.5 text-finomik-primary" />
                  <div className="space-y-1">
                    <div className="text-xs font-semibold uppercase tracking-wider text-finomik-primary">
                      Rentabilidad del fondo
                    </div>
                    <div className="text-sm font-bold text-finomik-primary">
                      {annualRatePercent.toLocaleString('es-ES', {
                        minimumFractionDigits: 1,
                        maximumFractionDigits: 1,
                      })}
                      % anual
                      <span className="text-[11px] text-[color:var(--finomik-blue-5)] ml-1">
                        (≈{' '}
                        {monthlyRatePercent.toLocaleString('es-ES', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                        % al mes)
                      </span>
                    </div>
                    <p className="text-[11px] text-[color:var(--finomik-blue-5)]">
                      Cada mes se suma aproximadamente{' '}
                      <span className="font-semibold">
                        {estimatedMonthlyInterest.toLocaleString('es-ES', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}{' '}
                        €
                      </span>{' '}
                      a tu fondo solo por tenerlo reservado.
                    </p>
                  </div>
                </div>
              </div>

              {/* Columna 2: aportar dinero */}
              <div className="space-y-4 lg:col-span-1">
                <div className="rounded-2xl border border-[color:var(--finomik-blue-6)] bg-white p-5 h-full flex flex-col gap-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Info size={18} className="text-finomik-primary" />
                      <h2 className="text-sm font-semibold text-finomik-primary">
                        Aporta a tu fondo
                      </h2>
                    </div>
                    <span className="text-[11px] text-[color:var(--finomik-blue-5)]">
                      Saldo:{' '}
                      <span className="font-semibold text-finomik-primary">
                        {user.balance.toLocaleString('es-ES', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}{' '}
                        €
                      </span>
                    </span>
                  </div>

                  <p className="text-xs text-[color:var(--finomik-blue-5)]">
                    Elige cuánto de tu saldo quieres mover al fondo de ahorro. Piensa en un importe
                    que puedas mantener varios meses sin tocar.
                  </p>

                  <div className="mt-1 flex flex-col gap-2">
                    <label className="text-[11px] font-semibold text-[color:var(--finomik-blue-5)]">
                      Cantidad a añadir
                    </label>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-[color:var(--finomik-blue-5)]">€</span>
                      <input
                        type="number"
                        min="0"
                        step="10"
                        value={amountInput}
                        onChange={e => setAmountInput(e.target.value)}
                        className="flex-1 rounded-lg border border-[color:var(--finomik-blue-6)] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[color:var(--finomik-blue-6)]"
                        placeholder="Por ejemplo, 200"
                      />
                    </div>
                    {error && (
                      <p className="text-[11px] text-red-500 mt-1">
                        {error}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={handleAddToFund}
                    className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-finomik-primary px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:opacity-95 transition-opacity"
                  >
                    Mover dinero al fondo
                    <ArrowRight size={16} />
                  </button>

                  <p className="mt-1 text-[11px] text-[color:var(--finomik-blue-5)]">
                    En la vida real este movimiento podría ser una transferencia automática el día
                    que cobras la nómina. Aquí lo simulas con un solo clic.
                  </p>
                </div>
              </div>

              {/* Columna 3: contexto educativo */}
              <div className="space-y-4 lg:col-span-1">
                <div className="rounded-2xl border border-[color:var(--finomik-blue-6)] bg-white p-5 h-full flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <Info size={18} className="text-finomik-primary" />
                    <h2 className="text-sm font-semibold text-finomik-primary">
                      Crédito, deuda y colchón
                    </h2>
                  </div>
                  <p className="text-sm text-[color:var(--finomik-blue-5)]">
                    Antes de endeudarte, conviene construir un{' '}
                    <span className="font-semibold">colchón de seguridad</span>. Este fondo te
                    permite afrontar imprevistos sin recurrir a tarjetas o préstamos rápidos.
                  </p>
                  <p className="text-sm text-[color:var(--finomik-blue-5)]">
                    En los temas de <span className="font-semibold">Crédito y Deuda</span> verás
                    cuándo tiene sentido pedir financiación y cuándo es mejor apoyarte en tu fondo
                    de emergencia remunerado.
                  </p>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

