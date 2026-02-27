import React, { useState } from 'react';
import { Play, ChevronRight, ChevronLeft, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useGame } from '../context/GameContext';
import { getTheme } from '../utils/theme';
import { TypewriterHighlight } from '../components/TypewriterHighlight';
import { investOnboardingContent } from '../data/content';

export const InvestOnboarding = () => {
  const { themeMode, completeInvestOnboarding, setCurrentScreen } = useGame();
  const theme = getTheme(themeMode);
  const sections = investOnboardingContent.content.sections;
  const totalPages = sections.length;
  const [pageIndex, setPageIndex] = useState(0);
  const currentSection = sections[pageIndex];
  const isFirstPage = pageIndex === 0;
  const isLastPage = pageIndex === totalPages - 1;

  const goToSimulator = () => {
    completeInvestOnboarding();
    setCurrentScreen('invest');
  };

  return (
    <div className={theme.contentPadding}>
      <div className={`max-w-3xl mx-auto ${theme.card} overflow-hidden min-h-[500px] flex flex-col`}>
        {/* Header: título general + indicador de página */}
        <div className="p-6 md:p-10 pb-0">
          <h1 className={theme.headingLarge}>{investOnboardingContent.title}</h1>
          {investOnboardingContent.description && pageIndex === 0 && (
            <p className={`mt-2 ${theme.textSubtle}`}>{investOnboardingContent.description}</p>
          )}
          {totalPages > 1 && (
            <div className="mt-4 text-xs font-bold uppercase tracking-wider text-slate-400">
              Página {pageIndex + 1} de {totalPages}
            </div>
          )}
        </div>

        {/* Contenido: una sección por página con formatos distintos */}
        <div className="flex-1 p-6 md:p-10 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={pageIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full flex flex-col"
            >
              {/* Página 0: vídeo + highlight + texto (estilo mixed de Aprender) */}
              {pageIndex === 0 && (
                <div className="space-y-6">
                  <div
                    className={`w-full aspect-video bg-slate-900 ${themeMode === 'young' ? 'rounded-2xl' : 'rounded-lg'} flex items-center justify-center relative overflow-hidden group shadow-lg`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/60 to-transparent" />
                    <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform cursor-pointer">
                      <Play size={40} className="text-white ml-2" fill="white" />
                    </div>
                  </div>
                  <div className="prose prose-lg prose-slate max-w-none space-y-3">
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
                  className={`flex-1 p-6 ${themeMode === 'young' ? 'rounded-2xl' : 'rounded-lg'} border-l-4 border-finomik-primary bg-finomik-blue-soft/30 border border-[color:var(--finomik-blue-6)]`}
                >
                  <h3 className={theme.headingLarge}>{currentSection.title}</h3>
                  <p className="mt-4 text-slate-600 leading-relaxed whitespace-pre-line">
                    {currentSection.body}
                  </p>
                </div>
              )}

              {/* Última página: tarjeta + CTA */}
              {isLastPage && pageIndex > 0 && (
                <div className="space-y-6">
                  <div
                    className={`p-6 ${themeMode === 'young' ? 'rounded-2xl' : 'rounded-lg'} bg-slate-50 border border-slate-100 flex gap-4`}
                  >
                    <div className={`flex-shrink-0 w-12 h-12 ${themeMode === 'young' ? 'rounded-xl' : 'rounded-lg'} bg-finomik-blue-soft flex items-center justify-center`}>
                      <TrendingUp className="w-6 h-6 text-finomik-primary" />
                    </div>
                    <div>
                      <h3 className={theme.headingMedium}>{currentSection.title}</h3>
                      <p className="mt-2 text-slate-600 leading-relaxed whitespace-pre-line text-sm">
                        {currentSection.body}
                      </p>
                    </div>
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>

        {/* Barra inferior: Anterior / Siguiente o Ir al simulador + Saltar */}
        <div className="p-4 md:p-6 border-t border-slate-100 bg-slate-50 flex justify-between items-center gap-4">
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
                className={theme.buttonPrimary}
              >
                Ir al simulador
              </button>
              <button
                type="button"
                onClick={goToSimulator}
                className={`text-sm font-medium text-[color:var(--finomik-blue-5)] hover:text-finomik-primary underline underline-offset-2 ${themeMode === 'young' ? 'py-3' : 'py-2.5'}`}
              >
                Saltar e ir al simulador
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setPageIndex((i) => i + 1)}
              className={`px-6 py-3 flex items-center gap-2 font-semibold text-white ${themeMode === 'young' ? 'bg-blue-600 rounded-xl shadow-lg' : 'bg-slate-700 rounded-lg'} hover:opacity-90 transition-all`}
            >
              Siguiente <ChevronRight size={20} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
