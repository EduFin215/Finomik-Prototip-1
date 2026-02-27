import React from 'react';
import { useGame, type SessionSummary } from '../context/GameContext';
import { motion } from 'motion/react';
import { getTheme } from '../utils/theme';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  PiggyBank,
  Star,
  HeartPulse,
  ArrowRight,
  Calendar,
  Info,
} from 'lucide-react';

export const SessionSummaryScreen = () => {
  const { user, dismissSessionSummary, setCurrentScreen, themeMode } = useGame();
  const theme = getTheme(themeMode);
  const summary: SessionSummary | null = user.lastSessionSummary;

  const handleContinuar = () => {
    dismissSessionSummary();
    setCurrentScreen('world');
  };

  if (!summary) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <p className="text-[color:var(--finomik-blue-5)]">No hay resumen de sesión.</p>
        <button
          onClick={() => setCurrentScreen('world')}
          className="ml-4 px-4 py-2 bg-finomik-primary text-white rounded-xl font-semibold"
        >
          Volver al mapa
        </button>
      </div>
    );
  }

  const netFlow = summary.income - summary.expenses;
  return (
    <div className="min-h-screen bg-gradient-to-b from-finomik-blue-soft/40 to-white">
      <div className="max-w-2xl mx-auto px-4 py-8 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-finomik-primary/10 text-finomik-primary mb-2">
              <Calendar size={28} />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-finomik-primary">
              Fin del mes simulado
            </h1>
            <p className="text-[color:var(--finomik-blue-5)] text-sm md:text-base">
              Has completado un tema entero. Así se ha actualizado tu perfil financiero.
            </p>
          </div>

          {/* Ingresos */}
          <section className={`${theme.card} p-6 border border-[color:var(--finomik-blue-6)]`}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-finomik-success/15 flex items-center justify-center">
                <TrendingUp size={20} className="text-finomik-success" />
              </div>
              <div>
                <h2 className="font-bold text-finomik-primary text-lg">Ingresos</h2>
                <p className="text-xs text-[color:var(--finomik-blue-5)]">
                  Tu sueldo simulado del mes (equivalente al salario medio de referencia).
                </p>
              </div>
            </div>
            <div className="flex justify-between items-baseline pt-2 border-t border-slate-100">
              <span className="text-sm text-slate-600">Ingreso mensual fijo</span>
              <span className="text-xl font-bold text-finomik-success">
                +{summary.income.toLocaleString('es-ES')} €
              </span>
            </div>
          </section>

          {/* Gastos */}
          <section className={`${theme.card} p-6 border border-[color:var(--finomik-blue-6)]`}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                <TrendingDown size={20} className="text-red-600" />
              </div>
              <div>
                <h2 className="font-bold text-finomik-primary text-lg">Gastos fijos</h2>
                <p className="text-xs text-[color:var(--finomik-blue-5)]">
                  Alquiler, alimentación, transporte, suministros… Se restan automáticamente cada mes.
                </p>
              </div>
            </div>
            <div className="flex justify-between items-baseline pt-2 border-t border-slate-100">
              <span className="text-sm text-slate-600">Gastos fijos del mes</span>
              <span className="text-xl font-bold text-red-600">
                −{summary.expenses.toLocaleString('es-ES')} €
              </span>
            </div>
          </section>

          {/* Resultado del mes */}
          <section className={`${theme.card} p-6 border-2 border-finomik-primary/20 bg-finomik-blue-soft/30`}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-finomik-primary/20 flex items-center justify-center">
                <Wallet size={20} className="text-finomik-primary" />
              </div>
              <div>
                <h2 className="font-bold text-finomik-primary text-lg">Saldo disponible</h2>
                <p className="text-xs text-[color:var(--finomik-blue-5)]">
                  Dinero líquido que tienes después de ingresos y gastos. Es tu margen para ahorrar o invertir.
                </p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Saldo al inicio del mes</span>
                <span className="font-semibold">{summary.balanceBefore.toLocaleString('es-ES')} €</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Flujo del mes (+{summary.income} −{summary.expenses})</span>
                <span className={`font-semibold ${netFlow >= 0 ? 'text-finomik-success' : 'text-red-600'}`}>
                  {netFlow >= 0 ? '+' : ''}{netFlow} €
                </span>
              </div>
              <div className="flex justify-between items-baseline pt-3 border-t-2 border-finomik-primary/20">
                <span className="font-semibold text-finomik-primary">Saldo al cierre del mes</span>
                <span className="text-2xl font-bold text-finomik-primary">
                  {summary.balanceAfter.toLocaleString('es-ES')} €
                </span>
              </div>
            </div>
          </section>

          {/* Fondo de ahorro */}
          <section className={`${theme.card} p-6 border border-[color:var(--finomik-blue-6)]`}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                <PiggyBank size={20} className="text-amber-700" />
              </div>
              <div>
                <h2 className="font-bold text-finomik-primary text-lg">Fondo de ahorro</h2>
                <p className="text-xs text-[color:var(--finomik-blue-5)]">
                  Tu reserva genera un interés mensual del 0,2% (cuenta remunerada simulado).
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-baseline">
                <span className="text-sm text-slate-600">Saldo del fondo</span>
                <span className="font-bold text-finomik-primary">
                  {summary.savingsFund.toLocaleString('es-ES')} €
                </span>
              </div>
              {summary.savingsInterest > 0 && (
                <div className="flex justify-between text-sm text-slate-500">
                  <span>Interés 0,2% este mes</span>
                  <span className="text-finomik-success">+{summary.savingsInterest.toFixed(2)} €</span>
                </div>
              )}
            </div>
          </section>

          {/* Reputación y Salud */}
          <section className={`${theme.card} p-6 border border-[color:var(--finomik-blue-6)]`}>
            <div className="flex items-center gap-2 mb-4">
              <Info size={18} className="text-[color:var(--finomik-blue-5)]" />
              <h2 className="font-bold text-finomik-primary text-lg">Indicadores de tu perfil</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100">
                <Star size={24} className="text-amber-500" />
                <div>
                  <p className="text-xs font-semibold uppercase text-[color:var(--finomik-blue-5)]">
                    Reputación financiera
                  </p>
                  <p className="text-lg font-bold text-finomik-primary">
                    {summary.reputationAfter}/100
                  </p>
                  <p className="text-[10px] text-slate-500">
                    Refleja patrones de comportamiento (ahorro, decisiones, diversificación).
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100">
                <HeartPulse size={24} className="text-finomik-success" />
                <div>
                  <p className="text-xs font-semibold uppercase text-[color:var(--finomik-blue-5)]">
                    Salud financiera
                  </p>
                  <p className="text-lg font-bold text-finomik-primary">
                    {summary.healthAfter}/100
                  </p>
                  <p className="text-[10px] text-slate-500">
                    Índice compuesto: ahorro, liquidez y reputación.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Continuar */}
          <div className="pt-4">
            <button
              onClick={handleContinuar}
              className="w-full py-4 rounded-2xl bg-finomik-primary text-white font-bold text-lg shadow-lg shadow-finomik-primary/25 hover:opacity-95 transition-opacity flex items-center justify-center gap-2"
            >
              Continuar al siguiente tema
              <ArrowRight size={22} />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
