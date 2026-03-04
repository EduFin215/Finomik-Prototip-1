import React, { useState } from 'react';
import { Play, ChevronRight, ChevronLeft } from 'lucide-react';
import { motion } from 'motion/react';
import { useGame } from '../context/GameContext';
import { getTheme } from '../utils/theme';

type Step = 0 | 1 | 2 | 3 | 4;

export const SavingsClass = () => {
  const { themeMode, setCurrentScreen, setUser } = useGame();
  const theme = getTheme(themeMode);

  const [step, setStep] = useState<Step>(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);

  const goBack = () => {
    setCurrentScreen('dashboard');
  };

  const handleAnswer = (expectedStep: Step, isCorrect: boolean) => {
    if (step !== expectedStep) return;
    if (!isCorrect) {
      setFeedback('Respuesta incorrecta. Vuelve a pensar qué protege mejor tu colchón.');
      return;
    }

    if (step < 4) {
      setFeedback('¡Correcto!');
      setTimeout(() => {
        setFeedback(null);
        setStep((prev) => (prev + 1) as Step);
      }, 700);
    } else {
      // Último paso: marcar la clase como completada
      setFeedback('¡Has superado la clase! Ya puedes usar el Fondo de Ahorro con criterio.');
      setCompleted(true);
      setUser(prev => ({
        ...prev,
        hasCompletedSavingsClass: true,
      }));
      // No navegamos automáticamente para que la persona vea el mensaje; puede volver con el botón de atrás.
    }
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-4">
            <div
              className={`w-full h-44 bg-slate-900 ${themeMode === 'young' ? 'rounded-2xl' : 'rounded-lg'} flex items-center justify-center relative overflow-hidden group shadow-lg`}
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/60 to-transparent" />
              <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform cursor-pointer">
                <Play size={28} className="text-white ml-1" fill="white" />
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Clase 1 · Antes de abrir tu Fondo de Ahorro
              </p>
              <h2 className={theme.headingLarge}>Tu escudo financiero</h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Antes de pensar en invertir, necesitas un pequeño escudo que te proteja de imprevistos:
                tu fondo de emergencia en una cuenta muy líquida y de bajo riesgo.
              </p>
            </div>
          </div>
        );
      case 1:
        return (
          <div className="space-y-4">
            <h2 className={theme.headingMedium}>¿De dónde sale el dinero en una emergencia?</h2>
            <p className={theme.textSubtle}>
              Mañana se estropea la caldera y necesitas 600 €. ¿Cuál es la mejor fuente para pagar ese
              imprevisto?
            </p>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => handleAnswer(1, false)}
                className="w-full text-left px-4 py-3 rounded-xl border border-slate-200 bg-white hover:border-red-400 hover:bg-red-50 text-sm font-medium"
              >
                De tu tarjeta de crédito al máximo, ya lo irás pagando.
              </button>
              <button
                type="button"
                onClick={() => handleAnswer(1, true)}
                className="w-full text-left px-4 py-3 rounded-xl border border-slate-200 bg-white hover:border-emerald-500 hover:bg-emerald-50 text-sm font-medium"
              >
                De tu fondo de emergencia en una cuenta remunerada.
              </button>
              <button
                type="button"
                onClick={() => handleAnswer(1, false)}
                className="w-full text-left px-4 py-3 rounded-xl border border-slate-200 bg-white hover:border-red-400 hover:bg-red-50 text-sm font-medium"
              >
                Vendiendo a toda prisa tus inversiones de largo plazo.
              </button>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <h2 className={theme.headingMedium}>¿Invertir o proteger el colchón?</h2>
            <p className={theme.textSubtle}>
              Tienes 2.000 € como colchón por si algo se tuerce. Estás pensando en invertirlo todo en activos muy
              volátiles para que “trabaje más”.
            </p>
            <p className="text-sm font-semibold text-slate-700">
              Afirmación: “Es buena idea invertir todo tu fondo de emergencia en activos muy volátiles para que
              crezca más rápido”.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => handleAnswer(2, false)}
                className="flex-1 py-3 rounded-xl border border-red-200 bg-white hover:bg-red-50 font-semibold text-red-700 text-sm"
              >
                Verdadero
              </button>
              <button
                type="button"
                onClick={() => handleAnswer(2, true)}
                className="flex-1 py-3 rounded-xl border border-emerald-200 bg-white hover:bg-emerald-50 font-semibold text-emerald-700 text-sm"
              >
                Falso
              </button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <h2 className={theme.headingMedium}>Cómo repartir tu sueldo</h2>
            <p className={theme.textSubtle}>
              Te quedan 300 € libres este mes después de pagar tus gastos fijos. Todavía no tienes fondo de
              emergencia.
            </p>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => handleAnswer(3, false)}
                className="w-full text-left px-4 py-3 rounded-xl border border-slate-200 bg-white hover:border-red-400 hover:bg-red-50 text-sm font-medium"
              >
                Lo gasto todo en ocio este mes. Ya ahorraré cuando gane más.
              </button>
              <button
                type="button"
                onClick={() => handleAnswer(3, true)}
                className="w-full text-left px-4 py-3 rounded-xl border border-slate-200 bg-white hover:border-emerald-500 hover:bg-emerald-50 text-sm font-medium"
              >
                Guardo al menos la mitad (150 €) para empezar mi fondo de emergencia y el resto lo destino a ocio.
              </button>
              <button
                type="button"
                onClick={() => handleAnswer(3, false)}
                className="w-full text-left px-4 py-3 rounded-xl border border-slate-200 bg-white hover:border-red-400 hover:bg-red-50 text-sm font-medium"
              >
                Los dejo en la cuenta corriente sin ningún plan. Si sobra a final de año ya veré qué hago.
              </button>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-4">
            <h2 className={theme.headingMedium}>Test final: ¿para qué sirve tu Fondo de Ahorro?</h2>
            <p className={theme.textSubtle}>
              Elige la frase que mejor describe el objetivo de tu Fondo de Ahorro / fondo de emergencia.
            </p>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => handleAnswer(4, false)}
                className="w-full text-left px-4 py-3 rounded-xl border border-slate-200 bg-white hover:border-red-400 hover:bg-red-50 text-sm font-medium"
              >
                Para intentar batir al mercado con la máxima rentabilidad posible.
              </button>
              <button
                type="button"
                onClick={() => handleAnswer(4, true)}
                className="w-full text-left px-4 py-3 rounded-xl border border-slate-200 bg-white hover:border-emerald-500 hover:bg-emerald-50 text-sm font-medium"
              >
                Para tener un colchón líquido y de bajo riesgo ante imprevistos.
              </button>
              <button
                type="button"
                onClick={() => handleAnswer(4, false)}
                className="w-full text-left px-4 py-3 rounded-xl border border-slate-200 bg-white hover:border-red-400 hover:bg-red-50 text-sm font-medium"
              >
                Para guardar el dinero que sabes que no vas a necesitar nunca.
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-[100dvh] overflow-hidden flex flex-col bg-slate-50">
      <div className="max-w-3xl mx-auto w-full flex flex-col flex-1 min-h-0 p-3">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-2 shrink-0">
          <button
            onClick={goBack}
            className="inline-flex items-center gap-2 text-xs font-semibold text-finomik-primary hover:text-finomik-primary/80"
          >
            <ChevronLeft size={16} />
            <span>Volver al dashboard</span>
          </button>
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Paso {step + 1} de 5
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${theme.card} flex-1 min-h-0 flex flex-col overflow-hidden`}
        >
          {/* Card header */}
          <div className="p-4 md:p-6 pb-0 shrink-0">
            <p className="text-xs font-semibold uppercase tracking-wider text-[color:var(--finomik-blue-5)]">
              Clase previa · Fondo de Ahorro
            </p>
            <h1 className={`${theme.headingLarge} mt-0.5`}>Antes de abrir tu Fondo de Ahorro</h1>
            <p className={theme.textSubtle}>
              En pocos minutos verás por qué tu colchón de seguridad va antes que cualquier inversión.
            </p>
          </div>

          {/* Content area — no scroll, centered vertically */}
          <div className="flex-1 min-h-0 overflow-hidden p-4 md:p-6 flex flex-col justify-center">
            {feedback && (
              <div
                className={`text-sm font-semibold px-3 py-2 rounded-md mb-4 ${
                  completed ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'
                }`}
              >
                {feedback}
              </div>
            )}

            {renderStep()}
          </div>

          {/* Bottom bar */}
          <div className="p-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between shrink-0">
            <button
              type="button"
              disabled={step === 0}
              onClick={() => setStep((prev) => Math.max(0, (prev - 1) as Step))}
              className={`px-4 py-2 text-sm font-semibold rounded-lg flex items-center gap-1 ${
                step === 0
                  ? 'text-slate-300 cursor-not-allowed'
                  : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'
              }`}
            >
              <ChevronLeft size={16} />
              Anterior
            </button>
            <button
              type="button"
              disabled={step === 4}
              onClick={() => setStep((prev) => Math.min(4, (prev + 1) as Step))}
              className={`px-6 py-3 font-bold rounded-xl flex items-center gap-2 shadow-lg transition-all ${
                step === 4
                  ? 'bg-slate-300 text-white cursor-not-allowed'
                  : 'bg-finomik-primary text-white hover:opacity-90'
              }`}
            >
              Siguiente
              <ChevronRight size={18} />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

