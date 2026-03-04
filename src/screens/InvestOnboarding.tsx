import React, { useState } from 'react';
import { Play, ChevronRight, ChevronLeft, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useGame } from '../context/GameContext';
import { getTheme } from '../utils/theme';
import { TypewriterHighlight } from '../components/TypewriterHighlight';
import { investOnboardingContent } from '../data/content';

export const InvestOnboarding = () => {
  const { themeMode, completeInvestOnboarding, setCurrentScreen, user, setUser } = useGame();
  const theme = getTheme(themeMode);
  const sections = investOnboardingContent.content.sections;
  const totalPages = sections.length;
  const [pageIndex, setPageIndex] = useState(0);
  const currentSection = sections[pageIndex];
  const isFirstPage = pageIndex === 0;
  const isLastPage = pageIndex === totalPages - 1;

  // Estado de la Clase 2 + test final (solo se muestra en la última página de texto)
  type QuizStep = 0 | 1 | 2;
  const [quizStep, setQuizStep] = useState<QuizStep>(0);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const goToSimulator = () => {
    if (!quizCompleted) {
      // No permitir saltar el test final
      setQuizFeedback('Primero completa el mini test para desbloquear el simulador.');
      return;
    }

    // Marca la clase de inversión y el test final como completados en el estado global
    setUser(prev => ({
      ...prev,
      hasCompletedInvestClass: true,
      hasPassedToolsFinalTest: true,
    }));

    completeInvestOnboarding();
    setCurrentScreen('invest');
  };

  const handleQuizAnswer = (step: QuizStep, isCorrect: boolean) => {
    if (!isCorrect) {
      setQuizFeedback('Respuesta incorrecta. Revisa la explicación y vuelve a intentarlo.');
      return;
    }

    // Respuesta correcta
    if (step < 2) {
      setQuizFeedback('¡Correcto! Avanza al siguiente reto.');
      setTimeout(() => {
        setQuizFeedback(null);
        setQuizStep((prev) => (prev + 1) as QuizStep);
      }, 800);
    } else {
      // Último paso: test final superado
      setQuizFeedback('¡Has superado el test final! Ya puedes abrir el simulador.');
      setQuizCompleted(true);
    }
  };

  return (
    <div className="h-[100dvh] overflow-hidden flex flex-col bg-slate-50">
      <div className="max-w-3xl mx-auto w-full flex flex-col flex-1 min-h-0 p-3">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-2 shrink-0">
          <h1 className={theme.headingLarge}>{investOnboardingContent.title}</h1>
          {totalPages > 1 && (
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Página {pageIndex + 1} de {totalPages}
            </div>
          )}
        </div>

        <div className={`${theme.card} flex-1 min-h-0 flex flex-col overflow-hidden`}>
          {/* Card header */}
          <div className="p-4 md:p-6 pb-0 shrink-0">
            {investOnboardingContent.description && pageIndex === 0 && (
              <p className={theme.textSubtle}>{investOnboardingContent.description}</p>
            )}
          </div>

          {/* Content area — no scroll, centered vertically */}
          <div className="flex-1 min-h-0 overflow-hidden p-4 md:p-6 flex flex-col justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={pageIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {/* Página 0: vídeo + highlight + texto */}
                {pageIndex === 0 && (
                  <div className="space-y-4">
                    <div
                      className={`w-full h-44 bg-slate-900 ${themeMode === 'young' ? 'rounded-2xl' : 'rounded-lg'} flex items-center justify-center relative overflow-hidden group shadow-lg`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/60 to-transparent" />
                      <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform cursor-pointer">
                        <Play size={28} className="text-white ml-1" fill="white" />
                      </div>
                    </div>
                    <div className="max-w-none space-y-2">
                      {currentSection.highlightText && (
                        <div className="mb-2">
                          <TypewriterHighlight text={currentSection.highlightText} />
                        </div>
                      )}
                      <h3 className={theme.headingLarge}>{currentSection.title}</h3>
                      <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                        {currentSection.body}
                      </p>
                    </div>
                  </div>
                )}

                {/* Páginas intermedias: tarjeta con borde de acento */}
                {pageIndex > 0 && !isLastPage && (
                  <div
                    className={`p-4 ${themeMode === 'young' ? 'rounded-2xl' : 'rounded-lg'} border-l-4 border-finomik-primary bg-finomik-blue-soft/30 border border-[color:var(--finomik-blue-6)]`}
                  >
                    <h3 className={theme.headingLarge}>{currentSection.title}</h3>
                    <p className="mt-4 text-slate-600 leading-relaxed whitespace-pre-line">
                      {currentSection.body}
                    </p>
                  </div>
                )}

                {/* Última página: tarjeta + Clase 2 (quiz + test final) */}
                {isLastPage && pageIndex > 0 && (
                  <div className="space-y-4">
                    <div
                      className={`p-4 md:p-6 ${themeMode === 'young' ? 'rounded-2xl' : 'rounded-lg'} bg-slate-50 border border-slate-100 flex gap-3`}
                    >
                      <div className={`flex-shrink-0 w-10 h-10 ${themeMode === 'young' ? 'rounded-xl' : 'rounded-lg'} bg-finomik-blue-soft flex items-center justify-center`}>
                        <TrendingUp className="w-5 h-5 text-finomik-primary" />
                      </div>
                      <div>
                        <h3 className={theme.headingMedium}>{currentSection.title}</h3>
                        <p className="mt-2 text-slate-600 leading-relaxed whitespace-pre-line text-sm">
                          {currentSection.body}
                        </p>
                      </div>
                    </div>

                    <div className={`p-4 md:p-6 ${themeMode === 'young' ? 'rounded-2xl' : 'rounded-lg'} bg-white border border-[color:var(--finomik-blue-6)] space-y-4`}>
                      <div className="text-xs font-bold uppercase tracking-wider text-[color:var(--finomik-blue-5)]">
                        Clase 2 · Antes de usar el simulador
                      </div>
                      <p className="text-sm text-[color:var(--finomik-blue-5)]">
                        Responde a estos mini retos para asegurarte de que tienes claros el orden recomendado,
                        el papel del fondo de emergencia y la relación entre riesgo y rentabilidad.
                      </p>

                      {quizFeedback && (
                        <div className={`text-sm font-semibold px-3 py-2 rounded-md ${
                          quizCompleted ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                        }`}>
                          {quizFeedback}
                        </div>
                      )}

                      {quizStep === 0 && (
                        <div className="space-y-4">
                          <h4 className="font-semibold text-base text-finomik-primary">
                            1. Ordena el camino recomendado
                          </h4>
                          <p className="text-sm text-[color:var(--finomik-blue-5)]">
                            ¿Qué orden tiene más sentido para construir tu vida financiera?
                          </p>
                          <div className="grid gap-2">
                            <button
                              type="button"
                              onClick={() => handleQuizAnswer(0, false)}
                              className="w-full text-left px-4 py-3 rounded-xl border border-slate-200 bg-white hover:border-red-400 hover:bg-red-50 text-sm font-medium"
                            >
                              Empezar a invertir fuerte desde el primer mes → Construir fondo de emergencia → Pensar en deudas
                            </button>
                            <button
                              type="button"
                              onClick={() => handleQuizAnswer(0, true)}
                              className="w-full text-left px-4 py-3 rounded-xl border border-slate-200 bg-white hover:border-emerald-500 hover:bg-emerald-50 text-sm font-medium"
                            >
                              Pagar deudas caras y estabilizar tu mes a mes → Construir fondo de emergencia → Empezar a invertir a largo plazo
                            </button>
                            <button
                              type="button"
                              onClick={() => handleQuizAnswer(0, false)}
                              className="w-full text-left px-4 py-3 rounded-xl border border-slate-200 bg-white hover:border-red-400 hover:bg-red-50 text-sm font-medium"
                            >
                              Invertir en lo que más sube en redes → Si sale mal, ya pediré un préstamo para seguir
                            </button>
                          </div>
                        </div>
                      )}

                      {quizStep === 1 && (
                        <div className="space-y-4">
                          <h4 className="font-semibold text-base text-finomik-primary">
                            2. Riesgo y horizonte temporal
                          </h4>
                          <p className="text-sm text-[color:var(--finomik-blue-5)]">
                            Quieres ahorrar para un viaje dentro de 6 meses. ¿Qué opción encaja mejor?
                          </p>
                          <div className="grid gap-2">
                            <button
                              type="button"
                              onClick={() => handleQuizAnswer(1, true)}
                              className="w-full text-left px-4 py-3 rounded-xl border border-slate-200 bg-white hover:border-emerald-500 hover:bg-emerald-50 text-sm font-medium"
                            >
                              Guardarlo en una cuenta remunerada o depósito muy líquido, aunque la rentabilidad sea moderada.
                            </button>
                            <button
                              type="button"
                              onClick={() => handleQuizAnswer(1, false)}
                              className="w-full text-left px-4 py-3 rounded-xl border border-slate-200 bg-white hover:border-red-400 hover:bg-red-50 text-sm font-medium"
                            >
                              Invertirlo todo en activos muy volátiles esperando doblar el dinero en pocos meses.
                            </button>
                            <button
                              type="button"
                              onClick={() => handleQuizAnswer(1, false)}
                              className="w-full text-left px-4 py-3 rounded-xl border border-slate-200 bg-white hover:border-red-400 hover:bg-red-50 text-sm font-medium"
                            >
                              Mezclarlo con tu fondo de jubilación a 30 años, sin separar objetivos.
                            </button>
                          </div>
                        </div>
                      )}

                      {quizStep === 2 && (
                        <div className="space-y-4">
                          <h4 className="font-semibold text-base text-finomik-primary">
                            3. Test final de acceso
                          </h4>
                          <p className="text-sm text-[color:var(--finomik-blue-5)]">
                            ¿Cuál de estas frases resume mejor lo que vas a practicar en el simulador de inversión?
                          </p>
                          <div className="grid gap-2">
                            <button
                              type="button"
                              onClick={() => handleQuizAnswer(2, false)}
                              className="w-full text-left px-4 py-3 rounded-xl border border-slate-200 bg-white hover:border-red-400 hover:bg-red-50 text-sm font-medium"
                            >
                              Cómo sustituir por completo tu fondo de emergencia por inversiones de máximo riesgo.
                            </button>
                            <button
                              type="button"
                              onClick={() => handleQuizAnswer(2, true)}
                              className="w-full text-left px-4 py-3 rounded-xl border border-slate-200 bg-white hover:border-emerald-500 hover:bg-emerald-50 text-sm font-medium"
                            >
                              Cómo construir y gestionar una cartera voluntaria diversificada a largo plazo, una vez cubierto tu fondo de emergencia.
                            </button>
                            <button
                              type="button"
                              onClick={() => handleQuizAnswer(2, false)}
                              className="w-full text-left px-4 py-3 rounded-xl border border-slate-200 bg-white hover:border-red-400 hover:bg-red-50 text-sm font-medium"
                            >
                              Cómo endeudarte al máximo para multiplicar cualquier movimiento del mercado.
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

              </motion.div>
            </AnimatePresence>
          </div>

          {/* Bottom bar */}
          <div className="p-3 border-t border-slate-100 bg-slate-50 flex justify-between items-center gap-3 shrink-0">
            {!isFirstPage ? (
              <button
                type="button"
                onClick={() => setPageIndex((i) => i - 1)}
                className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1"
              >
                <ChevronLeft size={18} /> Anterior
              </button>
            ) : (
              <div />
            )}
            <div className="flex-1" />
            {isLastPage ? (
              <div className="flex flex-col sm:flex-row gap-2 items-end sm:items-center">
                <button
                  type="button"
                  onClick={goToSimulator}
                  disabled={!quizCompleted}
                  className={`px-6 py-3 font-bold rounded-xl shadow-lg transition-all flex items-center gap-2 ${!quizCompleted ? 'bg-slate-300 text-white cursor-not-allowed' : 'bg-finomik-primary text-white hover:opacity-90'}`}
                >
                  Ir al simulador
                </button>
                {!quizCompleted && (
                  <span className="text-[11px] text-[color:var(--finomik-blue-5)]">
                    Completa el mini test para desbloquear el simulador.
                  </span>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setPageIndex((i) => i + 1)}
                className="px-6 py-3 flex items-center gap-2 font-bold text-white bg-finomik-primary rounded-xl shadow-lg hover:opacity-90 transition-all"
              >
                Siguiente <ChevronRight size={20} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
