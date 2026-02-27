export type ThemeMode = 'young' | 'adult';

export const getTheme = (mode: ThemeMode) => {
  const isYoung = mode === 'young';

  return {
    // Layout & Container
    container: 'bg-white',
    contentPadding: isYoung
      ? 'p-6 space-y-6 pb-12'
      : 'p-8 max-w-5xl mx-auto space-y-8 pb-12',
    
    // Cards
    card: isYoung 
      ? 'bg-white rounded-2xl shadow-sm border border-[color:var(--finomik-blue-6)]'
      : 'bg-white rounded-lg border border-[color:var(--finomik-blue-6)] shadow-none hover:border-[color:var(--finomik-blue-5)] transition-colors',
    cardHeader: isYoung
      ? 'mb-4'
      : 'mb-6 border-b border-[color:var(--finomik-blue-6)] pb-4',
    
    // Typography
    headingLarge: isYoung
      ? 'heading-1 text-2xl text-finomik-primary'
      : 'heading-1 text-3xl text-finomik-primary tracking-tight',
    headingMedium: isYoung
      ? 'heading-2 text-finomik-primary'
      : 'heading-2 text-finomik-primary',
    headingSmall: isYoung
      ? 'text-sm heading-2 text-finomik-primary'
      : 'text-sm heading-2 text-finomik-primary',
    textSubtle: isYoung
      ? 'text-xs text-[color:var(--finomik-blue-5)]'
      : 'text-sm text-[color:var(--finomik-blue-5)]',
    
    // Buttons
    buttonPrimary: isYoung 
      ? 'bg-finomik-gradient-strong text-white font-bold py-3 px-6 rounded-xl hover:opacity-95 transition-all shadow-lg shadow-[color:var(--finomik-blue-6)] active:scale-95'
      : 'bg-finomik-primary text-white font-medium py-2.5 px-6 rounded-lg hover:bg-[color:var(--finomik-blue-1)] transition-colors shadow-none',
    buttonSecondary: isYoung
      ? 'bg-finomik-blue-soft text-finomik-primary font-semibold rounded-xl hover:bg-[color:var(--finomik-blue-5)]/30 transition-colors'
      : 'bg-white text-finomik-primary font-medium border border-[color:var(--finomik-blue-6)] rounded-lg hover:bg-finomik-blue-soft transition-colors',
    
    // Icons & Accents
    iconContainer: isYoung ? 'rounded-full' : 'rounded-md',
    iconSize: isYoung ? 24 : 20,
    
    // Specific Components
    progressBar: isYoung ? 'h-3 rounded-full' : 'h-2 rounded-sm',
    navBar: isYoung 
      ? 'fixed bottom-0 left-0 right-0 bg-white border-t border-[color:var(--finomik-blue-6)] px-6 py-3 pb-6 md:pb-3 flex justify-between items-center z-50 shadow-[0_-4px_6px_-1px_rgba(11,48,100,0.12)]'
      : 'fixed top-0 left-0 right-0 bg-white border-b border-[color:var(--finomik-blue-6)] px-8 py-4 flex justify-between items-center z-50 shadow-sm',
      
    // Animations
    animation: isYoung ? { whileHover: { scale: 1.02 }, active: { scale: 0.95 } } : { whileHover: {}, active: {} },
  };
};
