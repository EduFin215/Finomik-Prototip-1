import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { getLearningPathForChapter, LearningNode, MinigameType } from '../data/content';
import { 
  Lock, Check, Play, Star, ArrowLeft, HelpCircle, Trophy, ArrowRight,
  Video, ListChecks, CheckCircle2, PenTool, Briefcase, ArrowDownUp, Puzzle, Zap, Timer, CircleDashed,
  Menu, X, ChevronRight, BookOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getTheme } from '../utils/theme';
import { StudyNotes } from '../components/StudyNotes';
import { TypewriterHighlight } from '../components/TypewriterHighlight';
import { ChapterPath } from '../components/ChapterPath';

// Icon mapping for minigames
const MinigameIcon = ({ type, className, style }: { type: MinigameType; className?: string; style?: React.CSSProperties }) => {
  switch (type) {
    case 'mcq': return <ListChecks className={className} style={style} />;
    case 'true_false': return <CheckCircle2 className={className} style={style} />;
    case 'fill_blank': return <PenTool className={className} style={style} />;
    case 'case': return <Briefcase className={className} style={style} />;
    case 'order': return <ArrowDownUp className={className} style={style} />;
    case 'match': return <Puzzle className={className} style={style} />;
    case 'speed': return <Zap className={className} style={style} />;
    case 'pasapalabra': return <CircleDashed className={className} style={style} />;
    default: return <Star className={className} style={style} />;
  }
};

const hexToRgba = (hex: string, alpha: number): string => {
  const cleaned = hex.replace('#', '');
  const r = parseInt(cleaned.slice(0, 2), 16);
  const g = parseInt(cleaned.slice(2, 4), 16);
  const b = parseInt(cleaned.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
};

const getOnPrimaryForHex = (hex: string): string => {
  const cleaned = hex.replace('#', '');
  if (cleaned.length !== 6) return '#FFFFFF';
  const r = parseInt(cleaned.slice(0, 2), 16) / 255;
  const g = parseInt(cleaned.slice(2, 4), 16) / 255;
  const b = parseInt(cleaned.slice(4, 6), 16) / 255;
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luminance > 0.7 ? '#114076' : '#FFFFFF';
};

const chapterThemeById: Record<number, { primary: string; primaryLight: string; onPrimary: string; border: string }> = {
  1: {
    primary: '#114076',
    primaryLight: '#3C4C67',
    onPrimary: getOnPrimaryForHex('#114076'),
    border: '#114076',
  },
  2: {
    primary: '#3C4C67',
    primaryLight: '#3E5374',
    onPrimary: getOnPrimaryForHex('#3C4C67'),
    border: '#3C4C67',
  },
  3: {
    primary: '#3E5374',
    primaryLight: '#5574A7',
    onPrimary: getOnPrimaryForHex('#3E5374'),
    border: '#3E5374',
  },
  4: {
    primary: '#5574A7',
    primaryLight: '#8F9EB7',
    onPrimary: getOnPrimaryForHex('#5574A7'),
    border: '#5574A7',
  },
  5: {
    primary: '#8F9EB7',
    primaryLight: '#C8D0DD',
    onPrimary: getOnPrimaryForHex('#8F9EB7'),
    border: '#8F9EB7',
  },
  6: {
    primary: '#C8D0DD',
    primaryLight: '#FFFFFF',
    onPrimary: getOnPrimaryForHex('#C8D0DD'),
    border: '#C8D0DD',
  },
};

export const WorldMap = () => {
  const { user, setUser, completeLesson, completeLessonWithMonthlyCycle, setCurrentScreen, themeMode, navigationMode, toggleNavigationMode, autoCompleteChapter } = useGame();
  const theme = getTheme(themeMode);
  
  // Layout State
  const [showPath, setShowPath] = useState(true); // Default to showing the path
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeChapterId, setActiveChapterId] = useState<number>(1);

  const learningPath = getLearningPathForChapter(activeChapterId);
  const chapterTheme = chapterThemeById[activeChapterId] ?? chapterThemeById[1];

  // Content State
  const [minigameState, setMinigameState] = useState<any>({});
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isStepCompleted, setIsStepCompleted] = useState(false);

  // Pasapalabra Specific State
  const [pasapalabraIndex, setPasapalabraIndex] = useState(0);
  const [pasapalabraInput, setPasapalabraInput] = useState("");
  const [pasapalabraStatus, setPasapalabraStatus] = useState<('pending' | 'correct' | 'incorrect')[]>([]);

  // Case (dashboard) step-by-step: índice del paso actual en datos presentados poco a poco
  const [caseStepIndex, setCaseStepIndex] = useState(0);

  // Lecciones de texto: una "página" por sección, contenido mostrado poco a poco
  const [lessonTextPageIndex, setLessonTextPageIndex] = useState(0);

  // Initialize current index based on progress and active chapter
  useEffect(() => {
    // Find the first uncompleted node dentro del capítulo activo
    const firstUncompleted = learningPath.findIndex(node => !user.completedModules.includes(node.id));
    if (firstUncompleted !== -1) {
      setCurrentIndex(firstUncompleted);
    } else if (learningPath.length > 0) {
      // Si todo el capítulo está completado, empezamos desde el inicio para repaso
      setCurrentIndex(0);
    }
  }, [activeChapterId, user.completedModules, learningPath.length]);

  // Reset state when changing index
  useEffect(() => {
    setFeedback(null);
    setIsStepCompleted(false);
    setMinigameState({});
    setCaseStepIndex(0);
    setLessonTextPageIndex(0);

    const currentNode = learningPath[currentIndex];
    if (currentNode && currentNode.minigameType === 'pasapalabra') {
      setPasapalabraIndex(0);
      setPasapalabraInput("");
      setPasapalabraStatus(new Array(currentNode.data.questions.length).fill('pending'));
    }

    // If already completed, mark as step completed so they can just click continue
    if (currentNode && user.completedModules.includes(currentNode.id)) {
      setIsStepCompleted(true);
    }
  }, [currentIndex, user.completedModules]);

  const currentNode = learningPath[currentIndex];

  const handleNext = () => {
    if (currentIndex < learningPath.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // Fin del capítulo actual: volver al mapa de capítulos
      setShowPath(true);
      setIsSidebarOpen(false);
    }
  };

  const handleStepComplete = () => {
    if (currentNode && !user.completedModules.includes(currentNode.id)) {
      const isLastNodeOfChapter = currentIndex === learningPath.length - 1;
      if (isLastNodeOfChapter) {
        completeLessonWithMonthlyCycle(currentNode.id, currentNode.type === 'minigame');
        setCurrentScreen('sessionSummary');
      } else {
        completeLesson(currentNode.id, currentNode.type === 'minigame');
      }

      // Marca la clase previa a Fondo de Ahorro como completada cuando se supera su mini test final
      if (currentNode.id === 'c2_savings_class_final_quiz') {
        setUser(prev => ({
          ...prev,
          hasCompletedSavingsClass: true,
        }));
      }
    }
    setIsStepCompleted(true);
  };

  // --- Minigame Logic Handlers ---

  const handleMCQ = (index: number) => {
    if (index === currentNode?.data.correctIndex) {
      setFeedback("¡Correcto!");
      setTimeout(handleStepComplete, 1000);
    } else {
      setFeedback("Incorrecto, intenta de nuevo.");
    }
  };

  const handleTrueFalse = (value: boolean) => {
    if (value === currentNode?.data.isTrue) {
      setFeedback("¡Correcto!");
      setTimeout(handleStepComplete, 1000);
    } else {
      setFeedback("Incorrecto.");
    }
  };

  const handleFillBlank = (word: string) => {
    if (word === currentNode?.data.correct) {
      setFeedback("¡Correcto!");
      setTimeout(handleStepComplete, 1000);
    } else {
      setFeedback("Esa no es la palabra correcta.");
    }
  };

  const handleCase = (isCorrect: boolean, feedbackText: string) => {
    setFeedback(feedbackText);
    if (isCorrect) {
      setTimeout(handleStepComplete, 1500);
    }
  };

  const handleOrder = (items: string[]) => {
    const isCorrect = JSON.stringify(items) === JSON.stringify(currentNode?.data.correctOrder);
    if (isCorrect) {
      setFeedback("¡Orden Correcto!");
      setTimeout(handleStepComplete, 1000);
    } else {
      setFeedback("Orden incorrecto.");
    }
  };

  const [orderSequence, setOrderSequence] = useState<string[]>([]);
  const handleOrderItemClick = (id: string) => {
    const newSeq = [...orderSequence, id];
    setOrderSequence(newSeq);
    if (newSeq.length === currentNode?.data.items.length) {
      handleOrder(newSeq);
    }
  };

  const handleMatch = (pairIndex: number) => {
    setFeedback("¡Conexión establecida!");
    setTimeout(handleStepComplete, 1000);
  };

  const handleSpeed = (isCorrect: boolean) => {
    if (isCorrect) {
      setFeedback("¡A tiempo!");
      setTimeout(handleStepComplete, 1000);
    } else {
      setFeedback("Fallaste.");
    }
  };

  const handlePasapalabraSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!currentNode || currentNode.minigameType !== 'pasapalabra') return;

    const currentQ = currentNode.data.questions[pasapalabraIndex];
    const normalize = (str: string) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
    
    const isCorrect = normalize(pasapalabraInput) === normalize(currentQ.answer);
    
    const newStatus = [...pasapalabraStatus];
    newStatus[pasapalabraIndex] = isCorrect ? 'correct' : 'incorrect';
    setPasapalabraStatus(newStatus);
    
    setFeedback(isCorrect ? "¡Correcto!" : `Incorrecto. Era: ${currentQ.answer}`);
    
    setTimeout(() => {
      setFeedback(null);
      setPasapalabraInput("");
      
      if (pasapalabraIndex < currentNode.data.questions.length - 1) {
        setPasapalabraIndex(i => i + 1);
      } else {
        handleStepComplete();
      }
    }, 2000);
  };

  if (showPath) {
    return (
      <ChapterPath 
        onChapterSelect={(id) => {
          setActiveChapterId(id);
          setShowPath(false);
        }} 
      />
    );
  }

  if (!currentNode) return <div className="p-8 text-center">Cargando...</div>;

  const heightClass = themeMode === 'young' ? 'h-[calc(100vh-64px)]' : 'h-[calc(100vh-80px)]';

  return (
    <div
      className={`flex ${heightClass} overflow-hidden`}
      style={{ backgroundColor: hexToRgba(chapterTheme.primary, 0.06), transition: 'background-color 0.5s ease' }}
    >
      {/* Sidebar Overlay for Mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <motion.div 
        initial={false}
        animate={{ width: isSidebarOpen ? 280 : 0, opacity: isSidebarOpen ? 1 : 0 }}
        className={`fixed md:relative z-50 h-full bg-white border-r border-slate-200 overflow-hidden flex flex-col shadow-xl md:shadow-none
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0 md:w-0 md:opacity-0'}`}
      >
        <div className={`p-4 border-b border-slate-100 flex justify-between items-center ${themeMode === 'young' ? 'bg-slate-50' : 'bg-white'}`}>
          <h3 className={theme.headingMedium}>Tu Progreso</h3>
          <button onClick={() => setIsSidebarOpen(false)} className="p-1 hover:bg-slate-200 rounded-full">
            <X size={20} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <button 
            onClick={() => setShowPath(true)}
            className="w-full p-3 mb-4 text-left flex items-center gap-3 text-slate-500 hover:text-blue-600 hover:bg-slate-50 rounded-lg transition-colors font-medium border border-transparent hover:border-slate-200"
          >
            <ArrowLeft size={18} />
            Volver al Mapa
          </button>

          {/* Developer Tools Section */}
          <div className="mb-6 p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
            <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">Modo Profesor</h4>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-600">Navegación Libre</span>
              <button 
                onClick={toggleNavigationMode}
                className={`w-12 h-6 rounded-full transition-colors relative ${navigationMode === 'free' ? 'bg-blue-600' : 'bg-slate-300'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${navigationMode === 'free' ? 'left-7' : 'left-1'}`} />
              </button>
            </div>

            <button
              onClick={() => {
                if (confirm('¿Estás seguro? Esto marcará todo el capítulo como completado.')) {
                  autoCompleteChapter(learningPath.map(n => n.id));
                }
              }}
              className="w-full py-2 px-3 bg-blue-100 text-blue-700 text-xs font-bold rounded hover:bg-blue-200 transition-colors flex items-center justify-center gap-2"
            >
              <CheckCircle2 size={14} />
              Auto Completar Todo
            </button>
          </div>

          {learningPath.map((node, index) => {
            const isCompleted = user.completedModules.includes(node.id);
            const isCurrent = index === currentIndex;
            // In free mode, nothing is locked. In sequential mode, check completion.
            const isLocked = navigationMode === 'sequential' && !isCompleted && !isCurrent && index > 0 && !user.completedModules.includes(learningPath[index-1].id);

            return (
              <button
                key={node.id}
                disabled={isLocked}
                onClick={() => {
                  if (!isLocked) {
                    setCurrentIndex(index);
                    setIsSidebarOpen(false); // Close on mobile selection
                  }
                }}
                className={`w-full p-3 ${themeMode === 'young' ? 'rounded-xl' : 'rounded-md'} border text-left flex items-center gap-3 transition-all
                  ${isCurrent 
                    ? 'ring-1 font-semibold'
                    : isCompleted 
                      ? 'bg-white border-slate-200 hover:bg-slate-50' 
                      : isLocked 
                        ? 'bg-slate-50 border-slate-100 opacity-60' 
                        : 'bg-white border-slate-200 hover:bg-slate-50 opacity-80'}`}
                style={isCurrent ? { backgroundColor: hexToRgba(chapterTheme.primary, 0.10), borderColor: chapterTheme.primary, boxShadow: `0 0 0 1px ${chapterTheme.primary}` } : undefined}
              >
                <div
                  className={`w-8 h-8 ${theme.iconContainer} flex items-center justify-center shrink-0
                  ${isCompleted ? 'bg-green-500 text-white' : isLocked ? 'bg-slate-200 text-slate-400' : !isCurrent ? 'bg-white border-2 border-slate-200 text-slate-400' : ''}`}
                  style={isCurrent ? { backgroundColor: chapterTheme.primary, color: chapterTheme.onPrimary } : undefined}
                >
                  {isCompleted ? <Check size={14} /> : isLocked ? <Lock size={14} /> : node.type === 'lesson' ? <Video size={14} /> : <MinigameIcon type={node.minigameType!} className="w-4 h-4" />}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    {node.type === 'lesson' ? 'Lección' : 'Reto'}
                  </div>
                  <div
                    className="text-sm font-bold truncate"
                    style={{ color: isCurrent ? chapterTheme.primary : '#334155' }}
                  >
                    {node.title}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full relative">
        {/* Top Bar */}
        <div
          className="h-16 border-b flex items-center px-4 justify-between shrink-0 transition-colors duration-500"
          style={{ backgroundColor: chapterTheme.primary, borderBottomColor: hexToRgba(chapterTheme.onPrimary, 0.15) }}
        >
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg transition-colors"
              style={{ color: chapterTheme.onPrimary }}
            >
              <Menu size={24} />
            </button>
            <div className="flex flex-col">
              <span
                className="text-[10px] font-bold uppercase tracking-wider"
                style={{ color: hexToRgba(chapterTheme.onPrimary, 0.7) }}
              >
                {currentNode.type === 'lesson' ? 'Lección Actual' : 'Reto Actual'}
              </span>
              <h2 className="text-base font-bold" style={{ color: chapterTheme.onPrimary }}>{currentNode.title}</h2>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsNotesOpen(true)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-sm transition-colors mr-2"
              style={{ backgroundColor: hexToRgba(chapterTheme.onPrimary, 0.15), color: chapterTheme.onPrimary }}
            >
              <BookOpen size={18} />
              <span className="hidden sm:inline">Ver Apuntes</span>
            </button>

            <div className="hidden md:flex flex-col items-end mr-2">
              <span className="text-xs" style={{ color: hexToRgba(chapterTheme.onPrimary, 0.7) }}>Progreso</span>
              <span className="text-sm font-bold" style={{ color: chapterTheme.onPrimary }}>
                {learningPath.length > 0 ? Math.round((currentIndex / learningPath.length) * 100) : 0}%
              </span>
            </div>
            <div className={`w-24 ${theme.progressBar} overflow-hidden`} style={{ backgroundColor: hexToRgba(chapterTheme.onPrimary, 0.2) }}>
              <div 
                className="h-full transition-all duration-500"
                style={{ 
                  width: `${learningPath.length > 0 ? (currentIndex / learningPath.length) * 100 : 0}%`,
                  backgroundColor: chapterTheme.onPrimary,
                }}
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-h-0 overflow-hidden p-3 md:p-4 bg-slate-50">
          <div className={`max-w-3xl mx-auto ${theme.card} overflow-hidden h-full flex flex-col`}>
            
            {/* Content Body — no scroll, centered vertically */}
            <div className="flex-1 min-h-0 overflow-hidden p-4 md:p-6 flex flex-col justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentNode.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="h-full flex flex-col"
                >
                  {/* --- LESSON RENDER --- */}
                  {currentNode.type === 'lesson' && (() => {
                    const isChapter2 = currentNode.id.startsWith('c2_');
                    const layout = (currentNode as any).layout ?? 'mixed';
                    const sections = currentNode.content?.sections ?? [];
                    const totalPages = sections.length;
                    const currentPage = Math.min(lessonTextPageIndex, totalPages - 1);
                    const section = sections[currentPage];
                    const hasMultiplePages = totalPages > 1;
                    const isLastPage = currentPage === totalPages - 1;

                    // Layout por defecto o para capítulos distintos de 2: vídeo + texto (una sección por página)
                    if (!isChapter2 || layout === 'mixed') {
                      return (
                        <div className="space-y-4">
                          <div className={`w-full h-44 bg-slate-900 ${themeMode === 'young' ? 'rounded-2xl' : 'rounded-lg'} flex items-center justify-center relative overflow-hidden group shadow-lg`}>
                            <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/60 to-transparent" />
                            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform cursor-pointer">
                              <Play size={28} className="text-white ml-1" fill="white" />
                            </div>
                          </div>

                          {section && (
                            <div className="max-w-none space-y-2">
                              {hasMultiplePages && (
                                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                  Página {currentPage + 1} de {totalPages}
                                </div>
                              )}
                              {currentPage === 0 && section.highlightText && (
                                <div className="mb-2">
                                  <TypewriterHighlight text={section.highlightText} />
                                </div>
                              )}
                              <h3 className={theme.headingLarge}>{section.title}</h3>
                              <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                                {section.body}
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    }

                    // Capítulo 2: solo texto corto e interactivo (una sección por página)
                    if (layout === 'text_only') {
                      return (
                        <div className="space-y-4">
                          {section && (
                            <div className="flex flex-col items-start gap-4">
                              {hasMultiplePages && (
                                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                  Página {currentPage + 1} de {totalPages}
                                </div>
                              )}
                              {currentPage === 0 && section.highlightText && (
                                <TypewriterHighlight text={section.highlightText} />
                              )}
                              <h3 className={theme.headingLarge}>{section.title}</h3>
                              <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                                {section.body}
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    }

                    // Capítulo 2: solo vídeo + descripción corta
                    if (layout === 'video_only') {
                      return (
                        <div className="space-y-4">
                          <div className={`w-full h-44 bg-slate-900 ${themeMode === 'young' ? 'rounded-2xl' : 'rounded-lg'} flex items-center justify-center relative overflow-hidden group shadow-lg`}>
                            <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/60 to-transparent" />
                            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform cursor-pointer">
                              <Play size={28} className="text-white ml-1" fill="white" />
                            </div>
                          </div>
                          <div className="text-center space-y-2">
                            <h3 className={theme.headingLarge}>{currentNode.title}</h3>
                            {currentNode.description && (
                              <p className="text-sm text-slate-600 max-w-xl mx-auto">
                                {currentNode.description}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    }

                    return null;
                  })()}

                  {/* --- MINIGAME RENDER --- */}
                  {currentNode.type === 'minigame' && (
                    <div className="space-y-4 flex-1 flex flex-col justify-center">
                      <div className="text-center mb-3">
                        <div
                          className={`w-14 h-14 ${themeMode === 'young' ? 'rounded-full border-4 border-white' : 'rounded-lg'} flex items-center justify-center mx-auto mb-3 shadow-sm`}
                          style={themeMode === 'young'
                            ? { backgroundColor: chapterTheme.primary, borderColor: '#ffffff' }
                            : { backgroundColor: '#e5e7eb', borderColor: chapterTheme.border }}
                        >
                          <MinigameIcon 
                            type={currentNode.minigameType!} 
                            className="w-7 h-7" 
                            style={{ color: themeMode === 'young' ? chapterTheme.onPrimary : chapterTheme.primary }}
                          />
                        </div>
                        <h3 className={theme.headingLarge}>{currentNode.title}</h3>
                        <p className={theme.textSubtle}>{currentNode.description}</p>
                      </div>

                      {/* Feedback Banner */}
                      {feedback && (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className={`p-4 ${themeMode === 'young' ? 'rounded-xl' : 'rounded-md'} text-center font-bold mb-4 ${feedback.includes('Correcto') || feedback.includes('tiempo') || feedback.includes('Conexión') || feedback.includes('Orden') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                        >
                          {feedback}
                        </motion.div>
                      )}

                      {/* Game UI */}
                      <div
                        className={`${themeMode === 'young' ? 'rounded-2xl border' : 'border-t'} p-4 md:p-6 transition-colors duration-500`}
                        style={
                          (currentNode.minigameType === 'case' || currentNode.minigameType === 'pasapalabra')
                            ? { backgroundColor: hexToRgba(chapterTheme.primary, 0.10), borderColor: hexToRgba(chapterTheme.primary, 0.18) }
                            : themeMode === 'young'
                              ? { backgroundColor: '#f8fafc', borderColor: '#f1f5f9' }
                              : { backgroundColor: '#ffffff', borderColor: '#f1f5f9' }
                        }
                      >
                        {/* MCQ */}
                        {currentNode.minigameType === 'mcq' && (
                          <div className="space-y-4">
                            <h4 className="font-semibold text-base text-center mb-4">{currentNode.data.question}</h4>
                            <div className="grid gap-2">
                              {currentNode.data.options.map((opt: string, idx: number) => (
                                <button 
                                  key={idx} 
                                  onClick={() => handleMCQ(idx)} 
                                  disabled={isStepCompleted}
                                  className="w-full text-left px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm font-medium transition-all"
                                >
                                  {opt}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* True/False */}
                        {currentNode.minigameType === 'true_false' && (
                          <div className="space-y-4 text-center">
                            <h4 className="font-semibold text-base">{currentNode.data.question}</h4>
                            <div className="flex gap-3 max-w-md mx-auto">
                              <button onClick={() => handleTrueFalse(true)} disabled={isStepCompleted} className="flex-1 py-3 rounded-xl border border-emerald-200 bg-white hover:bg-emerald-50 font-semibold text-emerald-700 text-sm">Verdadero</button>
                              <button onClick={() => handleTrueFalse(false)} disabled={isStepCompleted} className="flex-1 py-3 rounded-xl border border-red-200 bg-white hover:bg-red-50 font-semibold text-red-700 text-sm">Falso</button>
                            </div>
                          </div>
                        )}

                        {/* Fill Blank */}
                        {currentNode.minigameType === 'fill_blank' && (
                          <div className="space-y-4">
                            <div className={`text-xl font-medium text-center leading-relaxed p-6 bg-white ${themeMode === 'young' ? 'rounded-xl' : 'rounded-md'} border shadow-sm`}
                                 style={{ borderColor: chapterTheme.primary }}>
                              {currentNode.data.parts[0]}
                              <span
                                className="inline-block w-32 mx-2 font-bold text-center px-2 rounded-t"
                                style={{
                                  borderBottomWidth: 2,
                                  borderBottomStyle: 'solid',
                                  borderBottomColor: chapterTheme.primary,
                                  color: chapterTheme.primary,
                                  backgroundColor: '#f1f5f9',
                                }}
                              >
                                ?
                              </span>
                              {currentNode.data.parts[1]}
                            </div>
                            <div className="flex flex-wrap justify-center gap-3">
                              {currentNode.data.options.map((opt: string) => (
                                <button 
                                  key={opt} 
                                  onClick={() => handleFillBlank(opt)} 
                                  disabled={isStepCompleted} 
                                  className={`px-6 py-3 ${themeMode === 'young' ? 'rounded-xl' : 'rounded-md'} bg-white border text-slate-700 font-bold shadow-sm transition-all`}
                                  style={!isStepCompleted ? { borderColor: chapterTheme.primary } : undefined}
                                >
                                  {opt}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Case: con steps = presentación paso a paso + dashboard; sin steps = bloque scenario clásico */}
                        {currentNode.minigameType === 'case' && (() => {
                          const steps = currentNode.data.steps as { title: string; body: string }[] | undefined;
                          const summary = currentNode.data.summary as {
                            income: number;
                            fixedLabel: string;
                            fixedTotal: number;
                            items?: { label: string; value: number }[];
                            marginLabel: string;
                            goalAmount: number;
                            goalMonths: number;
                            goalLabel: string;
                          } | undefined;
                          const options = currentNode.data.options as { text: string; feedback: string; correct: boolean }[];

                          if (steps && summary) {
                            const margin = summary.income - summary.fixedTotal;
                            const showingSteps = caseStepIndex < steps.length;

                            return (
                              <div className="space-y-6">
                                {showingSteps ? (
                                  <>
                                    <div 
                                      className={`bg-white p-6 ${themeMode === 'young' ? 'rounded-xl' : 'rounded-md'} border-l-4 shadow-sm`}
                                      style={{ borderLeftColor: chapterTheme.primary }}
                                    >
                                      <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                                        Paso {caseStepIndex + 1} de {steps.length}
                                      </div>
                                      <h4 className="text-lg font-bold text-slate-800 mb-2">{steps[caseStepIndex].title}</h4>
                                      <p className="text-slate-600 leading-relaxed">{steps[caseStepIndex].body}</p>
                                    </div>
                                    <div className="flex justify-end">
                                      <button
                                        type="button"
                                        onClick={() => setCaseStepIndex((i) => i + 1)}
                                        className="px-6 py-3 rounded-xl shadow-lg font-bold text-white bg-finomik-primary hover:opacity-90 transition-all"
                                      >
                                        {caseStepIndex < steps.length - 1 ? 'Siguiente' : 'Ver resumen y decidir'}
                                      </button>
                                    </div>
                                  </>
                                ) : (
                                  <>
                                    <div className="mb-4">
                                      <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3">Resumen del mes</h4>
                                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        <div className={`${themeMode === 'young' ? 'rounded-xl' : 'rounded-lg'} bg-white border border-slate-200 p-4 shadow-sm`}>
                                          <div className="text-[10px] font-bold uppercase text-slate-400">Ingresos</div>
                                          <div className="text-xl font-extrabold text-slate-800">{summary.income} €</div>
                                        </div>
                                        <div className={`${themeMode === 'young' ? 'rounded-xl' : 'rounded-lg'} bg-white border border-slate-200 p-4 shadow-sm`}>
                                          <div className="text-[10px] font-bold uppercase text-slate-400">{summary.fixedLabel}</div>
                                          <div className="text-xl font-extrabold text-slate-800">{summary.fixedTotal} €</div>
                                          {summary.items && summary.items.length > 0 && (
                                            <ul className="mt-1 text-xs text-slate-500 space-y-0.5">
                                              {summary.items.map((item: { label: string; value: number }, i: number) => (
                                                <li key={i}>{item.label}: {item.value} €</li>
                                              ))}
                                            </ul>
                                          )}
                                        </div>
                                        <div className={`${themeMode === 'young' ? 'rounded-xl' : 'rounded-lg'} p-4 shadow-sm`}
                                             style={{ backgroundColor: '#f1f5f9', border: `1px solid ${chapterTheme.primary}` }}>
                                          <div className="text-[10px] font-bold uppercase" style={{ color: chapterTheme.primary }}>{summary.marginLabel}</div>
                                          <div className="text-xl font-extrabold" style={{ color: chapterTheme.primary }}>{margin} €</div>
                                        </div>
                                        <div className={`${themeMode === 'young' ? 'rounded-xl' : 'rounded-lg'} bg-amber-50 border border-amber-100 p-4 shadow-sm`}>
                                          <div className="text-[10px] font-bold uppercase text-amber-700">{summary.goalLabel}</div>
                                          <div className="text-lg font-extrabold text-amber-900">{summary.goalAmount} €</div>
                                          <div className="text-xs text-amber-700">en {summary.goalMonths} meses</div>
                                        </div>
                                      </div>
                                    </div>
                                    <div>
                                      <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-2">¿Qué haces con tu margen este mes?</h4>
                                      <div className="space-y-3">
                                        {options.map((opt: any, idx: number) => (
                                          <button
                                            key={idx}
                                            onClick={() => handleCase(opt.correct, opt.feedback)}
                                            disabled={isStepCompleted}
                                            className={`w-full p-5 text-left ${themeMode === 'young' ? 'rounded-xl' : 'rounded-md'} bg-white border border-slate-200 transition-all font-medium shadow-sm`}
                                            style={!isStepCompleted ? { borderColor: chapterTheme.primary } : undefined}
                                          >
                                            {opt.text}
                                          </button>
                                        ))}
                                      </div>
                                    </div>
                                  </>
                                )}
                              </div>
                            );
                          }

                          return (
                            <div className="space-y-6">
                              <div
                                className={`bg-white p-6 ${themeMode === 'young' ? 'rounded-xl' : 'rounded-md'} text-slate-700 italic border-l-4 shadow-sm text-lg`}
                                style={{ borderLeftColor: chapterTheme.primary }}
                              >
                                "{currentNode.data.scenario}"
                              </div>
                              <div className="space-y-3">
                                {options.map((opt: any, idx: number) => (
                                  <button
                                    key={idx}
                                    onClick={() => handleCase(opt.correct, opt.feedback)}
                                    disabled={isStepCompleted}
                                    className={`w-full p-5 text-left ${themeMode === 'young' ? 'rounded-xl' : 'rounded-md'} bg-white border transition-all font-medium shadow-sm`}
                                    style={!isStepCompleted ? { borderColor: chapterTheme.primary } : { borderColor: '#e2e8f0' }}
                                  >
                                    {opt.text}
                                  </button>
                                ))}
                              </div>
                            </div>
                          );
                        })()}

                        {/* Order */}
                        {currentNode.minigameType === 'order' && (
                          <div className="space-y-6 max-w-md mx-auto">
                            <p className="text-sm text-slate-500 text-center font-medium uppercase tracking-wider">Toca en orden correcto</p>
                            <div className="space-y-3">
                              {currentNode.data.items.map((item: any) => {
                                 const isSelected = orderSequence.includes(item.id);
                                 return (
                                  <button 
                                    key={item.id} 
                                    onClick={() => handleOrderItemClick(item.id)}
                                    disabled={isSelected || isStepCompleted}
                                    className={`w-full p-4 ${themeMode === 'young' ? 'rounded-xl border-2' : 'rounded-md border'} font-bold flex justify-between items-center transition-all shadow-sm
                                      ${isSelected ? 'text-white scale-95' : 'bg-white text-slate-700'}`}
                                    style={isSelected
                                      ? { backgroundColor: chapterTheme.primary, borderColor: chapterTheme.primary, color: chapterTheme.onPrimary }
                                      : { borderColor: chapterTheme.primary }
                                    }
                                  >
                                    {item.text}
                                    {isSelected && <span className="text-xs bg-white/20 px-2 py-0.5 rounded font-bold">{orderSequence.indexOf(item.id) + 1}</span>}
                                  </button>
                                 );
                              })}
                            </div>
                            <button
                              onClick={() => setOrderSequence([])} 
                              disabled={isStepCompleted} 
                              className="text-sm font-medium w-full text-center py-2"
                              style={{ color: chapterTheme.primary }}
                            >
                              Reiniciar Orden
                            </button>
                          </div>
                        )}

                        {/* Match */}
                        {currentNode.minigameType === 'match' && (
                          <div className="space-y-6 text-center">
                            <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">Conecta las ideas</p>
                            <div className="grid grid-cols-2 gap-6">
                              <div className="space-y-3">
                                {currentNode.data.pairs.map((p: any, i: number) => (
                                  <div
                                    key={i}
                                    className={`p-4 ${themeMode === 'young' ? 'rounded-xl' : 'rounded-md'} text-sm font-bold h-20 flex items-center justify-center border shadow-sm`}
                                    style={{ backgroundColor: hexToRgba(chapterTheme.primary, 0.10), borderColor: hexToRgba(chapterTheme.primary, 0.2), color: chapterTheme.primary }}
                                  >{p.left}</div>
                                ))}
                              </div>
                              <div className="space-y-3">
                                {currentNode.data.pairs.map((p: any, i: number) => (
                                  <button
                                    key={i}
                                    onClick={() => handleMatch(i)}
                                    disabled={isStepCompleted}
                                    className={`w-full p-4 bg-white border-2 border-dashed ${themeMode === 'young' ? 'rounded-xl' : 'rounded-md'} text-sm text-slate-600 h-20 flex items-center justify-center transition-all font-medium`}
                                    style={{ borderColor: hexToRgba(chapterTheme.primary, 0.35) }}
                                  >
                                    {p.right}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Speed */}
                        {currentNode.minigameType === 'speed' && (
                          <div className="text-center space-y-8">
                            <div className="flex justify-center">
                              <div className={`w-16 h-16 bg-red-50 ${themeMode === 'young' ? 'rounded-full' : 'rounded-lg'} flex items-center justify-center animate-pulse`}>
                                <Timer className="text-red-500" size={32} />
                              </div>
                            </div>
                            <h4 className="font-bold text-2xl">{currentNode.data.question}</h4>
                            <div className="grid grid-cols-2 gap-4">
                              {currentNode.data.options.map((opt: any, idx: number) => (
                                <button
                                  key={idx}
                                  onClick={() => handleSpeed(opt.correct)}
                                  disabled={isStepCompleted}
                                  className={`py-8 bg-white border-b-4 ${themeMode === 'young' ? 'rounded-2xl' : 'rounded-lg'} font-bold text-xl transition-all active:translate-y-1 active:border-b-0`}
                                  style={{ borderBottomColor: chapterTheme.primary }}
                                >
                                  {opt.text}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Pasapalabra */}
                        {currentNode.minigameType === 'pasapalabra' && (
                          <div className="space-y-8">
                            <div className="flex flex-wrap justify-center gap-2 mb-8">
                              {currentNode.data.questions.map((q: any, i: number) => {
                                let baseClasses = 'w-8 h-8 md:w-10 md:h-10 rounded-full border-2 flex items-center justify-center font-bold text-xs md:text-sm transition-all';
                                let style: React.CSSProperties = { backgroundColor: '#ffffff', color: '#64748b', borderColor: '#e2e8f0' };
                                if (i === pasapalabraIndex) {
                                  style = {
                                    backgroundColor: chapterTheme.primary,
                                    color: chapterTheme.onPrimary,
                                    borderColor: chapterTheme.primary,
                                    boxShadow: '0 0 0 4px rgba(15,23,42,0.12)',
                                    transform: 'scale(1.1)',
                                  };
                                } else if (pasapalabraStatus[i] === 'correct') {
                                  style = { backgroundColor: '#22c55e', color: '#ffffff', borderColor: '#22c55e' };
                                } else if (pasapalabraStatus[i] === 'incorrect') {
                                  style = { backgroundColor: '#ef4444', color: '#ffffff', borderColor: '#ef4444' };
                                }
                                
                                return (
                                  <div key={q.letter} className={baseClasses} style={style}>
                                    {q.letter}
                                  </div>
                                );
                              })}
                            </div>

                            <div className="text-center space-y-6 max-w-md mx-auto">
                              <div className="text-6xl font-black mb-2 opacity-20 select-none" style={{ color: chapterTheme.primary }}>
                                {currentNode.data.questions[pasapalabraIndex].letter}
                              </div>
                              <h4 className="font-bold text-xl text-[#0f172a] min-h-[60px] flex items-center justify-center">
                                {currentNode.data.questions[pasapalabraIndex].question}
                              </h4>
                              
                              <form onSubmit={handlePasapalabraSubmit} className="space-y-4">
                                <input 
                                  type="text" 
                                  value={pasapalabraInput}
                                  onChange={(e) => setPasapalabraInput(e.target.value)}
                                  placeholder="Respuesta..."
                                  disabled={isStepCompleted}
                                  className={`w-full p-4 text-center text-xl font-bold border-2 ${themeMode === 'young' ? 'rounded-xl' : 'rounded-md'} focus:outline-none uppercase tracking-widest bg-white shadow-sm`}
                                  style={{ borderColor: chapterTheme.primary }}
                                  autoFocus
                                />
                                <button 
                                  type="submit"
                                  disabled={!pasapalabraInput || isStepCompleted}
                                  className="w-full py-4 font-bold rounded-xl shadow-lg bg-finomik-primary text-white hover:opacity-90 transition-all disabled:opacity-50 disabled:shadow-none"
                                >
                                  ENVIAR
                                </button>
                              </form>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Bottom Action Bar */}
            <div className="p-3 border-t border-slate-100 bg-slate-50 flex justify-between items-center shrink-0">
              {isStepCompleted ? (
                <div className="w-full flex justify-end">
                    <button
                      onClick={handleNext}
                      className="px-6 py-3 rounded-xl shadow-lg font-bold text-white bg-finomik-primary hover:opacity-90 transition-all flex items-center gap-2"
                    >
                    Continuar <ChevronRight size={20} />
                  </button>
                </div>
              ) : currentNode.type === 'lesson' ? (
                (() => {
                  const sections = currentNode.content?.sections ?? [];
                  const totalPages = sections.length;
                  const onLastLessonPage = totalPages <= 1 || lessonTextPageIndex >= totalPages - 1;
                  return (
                    <>
                      {totalPages > 1 && lessonTextPageIndex > 0 && (
                        <button
                          type="button"
                          onClick={() => setLessonTextPageIndex((i) => i - 1)}
                          className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                          Anterior
                        </button>
                      )}
                      <div className="flex-1" />
                      {onLastLessonPage ? (
                        <button
                          onClick={handleStepComplete}
                          className="px-6 py-3 rounded-xl shadow-lg font-bold text-white bg-finomik-primary hover:opacity-90 transition-all flex items-center gap-2"
                        >
                          Marcar como Leído <Check size={20} />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setLessonTextPageIndex((i) => i + 1)}
                          className="px-6 py-3 rounded-xl shadow-lg font-bold text-white bg-finomik-primary hover:opacity-90 transition-all flex items-center gap-2"
                        >
                          Siguiente <ChevronRight size={20} />
                        </button>
                      )}
                    </>
                  );
                })()
              ) : null}
            </div>
          </div>
        </div>
      </div>
      <StudyNotes 
        isOpen={isNotesOpen} 
        onClose={() => setIsNotesOpen(false)} 
        activeNoteIds={currentNode.noteIds}
      />
    </div>
  );
};


