import React from 'react';
import { motion } from 'motion/react';
import { Check, Lock, Star, Play, BookOpen, TrendingUp, Shield, Globe, Landmark, Target, Award } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { getTheme } from '../utils/theme';

interface Chapter {
  id: number;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  status: 'completed' | 'available' | 'locked';
}

const chapters: Chapter[] = [
  {
    id: 1,
    title: "Fundamentos Financieros",
    subtitle: "Aprende las bases del dinero y el ahorro",
    icon: <BookOpen size={24} />,
    status: 'available'
  },
  {
    id: 2,
    title: "Presupuesto y Ahorro Mensual",
    subtitle: "Organiza tu sueldo sin dejar de vivir",
    icon: <TrendingUp size={24} />,
    status: 'available'
  },
  {
    id: 3,
    title: "Gestión de Riesgos",
    subtitle: "Protege tu patrimonio ante la incertidumbre",
    icon: <Shield size={24} />,
    status: 'locked'
  },
  {
    id: 4,
    title: "Economía Global",
    subtitle: "Entiende cómo funciona el mundo",
    icon: <Globe size={24} />,
    status: 'locked'
  },
  {
    id: 5,
    title: "Banca y Crédito",
    subtitle: "Domina el sistema financiero",
    icon: <Landmark size={24} />,
    status: 'locked'
  },
  {
    id: 6,
    title: "Libertad Financiera",
    subtitle: "Alcanza tus objetivos a largo plazo",
    icon: <Target size={24} />,
    status: 'locked'
  }
];

interface ChapterPathProps {
  onChapterSelect: (chapterId: number) => void;
}

export const ChapterPath = ({ onChapterSelect }: ChapterPathProps) => {
  const { themeMode, user, setCurrentScreen } = useGame();
  const theme = getTheme(themeMode);
  const certificateUnlocked = user.certificate !== null || user.completedModules.length >= 8;

  return (
    <div className={`w-full h-full overflow-y-auto ${theme.container} p-8 flex flex-col items-center`}>
      <div className="max-w-4xl w-full mx-auto space-y-12 relative">
        
        {/* Header */}
        <div className="text-center mb-16 space-y-2">
          <h1 className={`${theme.headingLarge} text-4xl`}>Tu Camino Financiero</h1>
          <p className={`${theme.textSubtle} text-lg`}>Completa cada capítulo para desbloquear el siguiente nivel.</p>
        </div>

        {/* The Path Line - SVG Curve */}
        <div className="absolute left-1/2 top-32 bottom-0 w-1 -translate-x-1/2 hidden md:block pointer-events-none z-0">
           <svg className="h-full w-48 -ml-24 overflow-visible" preserveAspectRatio="none">
             <path 
               d="M 96,0 C 96,100 0,150 0,250 C 0,350 192,400 192,500 C 192,600 0,650 0,750 C 0,850 192,900 192,1000 C 192,1100 96,1150 96,1250"
               fill="none" 
               stroke={themeMode === 'young' ? '#e2e8f0' : '#cbd5e1'} 
               strokeWidth="4" 
               strokeDasharray="12 12"
             />
           </svg>
        </div>

        {/* Chapters List */}
        <div className="relative z-10 space-y-24 md:space-y-0">
          {chapters.map((chapter, index) => {
            const isLeft = index % 2 === 0;
            const isLocked = chapter.status === 'locked';
            const isCompleted = chapter.status === 'completed';
            
            return (
              <motion.div 
                key={chapter.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex flex-col md:flex-row items-center w-full ${isLeft ? 'md:flex-row-reverse' : ''} md:h-64`}
              >
                {/* Text Side */}
                <div className={`flex-1 text-center ${isLeft ? 'md:text-left md:pl-12' : 'md:text-right md:pr-12'} mb-4 md:mb-0`}>
                  <h3 className={`text-2xl font-bold ${isLocked ? 'text-slate-400' : 'text-slate-800'}`}>{chapter.title}</h3>
                  <p className={`${isLocked ? 'text-slate-300' : 'text-slate-500'} font-medium`}>{chapter.subtitle}</p>
                </div>

                {/* Node Center */}
                <div className="relative shrink-0 mx-8">
                  <button
                    onClick={() => !isLocked && onChapterSelect(chapter.id)}
                    disabled={isLocked}
                    className={`w-24 h-24 rounded-full flex items-center justify-center border-4 transition-all duration-300 relative z-20
                      ${isLocked 
                        ? 'bg-slate-100 border-slate-200 text-slate-300 cursor-not-allowed' 
                        : isCompleted
                          ? 'bg-blue-600 border-blue-200 text-white shadow-lg shadow-blue-200 scale-105'
                          : 'bg-white border-blue-600 text-blue-600 hover:bg-blue-50 hover:scale-110 shadow-xl cursor-pointer'
                      }
                    `}
                  >
                    {isLocked ? <Lock size={32} /> : isCompleted ? <Check size={32} strokeWidth={3} /> : chapter.icon}
                    
                    {/* Status Badge */}
                    {!isLocked && !isCompleted && (
                      <div className="absolute -bottom-2 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                        Actual
                      </div>
                    )}
                  </button>
                </div>

                {/* Empty Side for Balance */}
                <div className="flex-1 hidden md:block" />
              </motion.div>
            );
          })}
        </div>

        {/* Certificate Section */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative z-10 mt-24 w-full max-w-2xl mx-auto"
        >
          <div className={`w-full ${themeMode === 'young' ? 'bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200' : 'bg-white border-slate-200'} border-2 rounded-3xl p-8 text-center shadow-xl relative overflow-hidden group`}>
            {/* Decorative background elements */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-400 opacity-50" />
            <div className="absolute -right-10 -top-10 w-32 h-32 bg-yellow-100 rounded-full blur-3xl opacity-50 group-hover:opacity-70 transition-opacity" />
            <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-amber-100 rounded-full blur-3xl opacity-50 group-hover:opacity-70 transition-opacity" />
            
            <div className="relative z-10 flex flex-col items-center gap-6">
              <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center shadow-lg shadow-yellow-200 text-white mb-2 transform group-hover:scale-110 transition-transform duration-500">
                <Award size={48} strokeWidth={1.5} />
              </div>
              
              <div className="space-y-3">
                <h3 className={`text-2xl font-bold ${themeMode === 'young' ? 'text-slate-800' : 'text-slate-900'}`}>Certificado Finomik</h3>
                <p className="text-slate-600 max-w-md mx-auto leading-relaxed">
                  {certificateUnlocked
                    ? 'Has desbloqueado tu certificación. Visualiza tu certificado oficial.'
                    : 'Completa al menos 8 lecciones para desbloquear tu certificación oficial y demostrar tus conocimientos financieros.'}
                </p>
              </div>

              <div className="pt-4">
                {certificateUnlocked ? (
                  <button
                    onClick={() => setCurrentScreen('certificate')}
                    className="px-8 py-3 bg-finomik-primary text-white font-bold rounded-xl flex items-center gap-2 border border-finomik-primary hover:opacity-95 transition-opacity"
                  >
                    <Award size={16} />
                    <span>Ver certificado</span>
                  </button>
                ) : (
                  <button
                    disabled
                    className="px-8 py-3 bg-slate-100 text-slate-400 font-bold rounded-xl flex items-center gap-2 cursor-not-allowed border border-slate-200"
                  >
                    <Lock size={16} />
                    <span>Bloqueado</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bottom Spacer */}
        <div className="h-24" />
      </div>
    </div>
  );
};