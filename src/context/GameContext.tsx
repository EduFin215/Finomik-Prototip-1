import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ThemeMode } from '../utils/theme';

// Types
export type Screen =
  | 'dashboard'
  | 'world'
  | 'invest'
  | 'savingsFund'
  | 'news'
  | 'profile'
  | 'certificate'
  | 'sessionSummary';

export type InvestorLevel = 1 | 2 | 3 | 4;

export interface PortfolioHistoryEntry {
  type: 'buy' | 'sell';
  symbol: string;
  price: number;
  quantity: number;
  timestamp: number;
}

/** Summary shown on the full-screen session summary when a topic (chapter) is completed (simulated month). */
export interface SessionSummary {
  income: number;
  expenses: number;
  balanceBefore: number;
  balanceAfter: number;
  savingsFund: number;
  savingsInterest: number;
  reputationBefore: number;
  reputationAfter: number;
  healthBefore: number;
  healthAfter: number;
}

/** Certificate info for the certificate screen (simulated). */
export interface CertificateInfo {
  certificateType: 'Foundation' | 'Intermediate' | 'Advanced';
  grade: 'Certified' | 'Certified with Honors' | 'Certified with High Honors';
  areas: string[];
  certificateId: string;
  academicYear: string;
}

export interface UserState {
  name: string;
  level: number;
  xp: number;
  coins: number;
  streak: number;
  progress: number; // 0-100
  completedModules: string[];
  youngAvatarId?: string;
  unlockedAvatarIds?: string[];
  youngAvatarBackgroundId?: string;
  balance: number;
  savingsFund: number;
  savingsFundUnlocked: boolean;
  reputation: number;
  financialHealth: number;
  investorLevel: InvestorLevel;
  certificate: CertificateInfo | null;
  lastSessionSummary: SessionSummary | null;
  portfolio: {
    cash: number;
    holdings: Record<string, { quantity: number; averageCost: number }>;
    history: PortfolioHistoryEntry[];
  };
  hasSeenInvestOnboarding?: boolean;
}

interface GameContextType {
  currentScreen: Screen;
  setCurrentScreen: (screen: Screen) => void;
  user: UserState;
  setUser: React.Dispatch<React.SetStateAction<UserState>>;
  addCoins: (amount: number) => void;
  addXp: (amount: number) => void;
  completeModule: (moduleId: string) => void;
  completeLesson: (moduleId: string, isMinigame: boolean) => void;
  completeLessonWithMonthlyCycle: (moduleId: string, isMinigame: boolean) => void;
  runMonthlyCycle: () => SessionSummary;
  buyAsset: (symbol: string, price: number, quantity: number) => void;
  sellAsset: (symbol: string, price: number, quantity: number) => void;
  buyItem: (price: number) => boolean;
  themeMode: ThemeMode;
  toggleTheme: () => void;
  navigationMode: 'sequential' | 'free';
  toggleNavigationMode: () => void;
  autoCompleteChapter: (moduleIds: string[]) => void;
  youngAvatarId: string | undefined;
  setYoungAvatarId: (id: string) => void;
  youngAvatarBackgroundId: string | undefined;
  setYoungAvatarBackgroundId: (id: string) => void;
  isRestrictedByZeroBalance: boolean;
  setInvestorLevel: (level: InvestorLevel) => void;
  dismissSessionSummary: () => void;
  completeInvestOnboarding: () => void;
  setSavingsFundUnlocked: (value: boolean) => void;
}

const MONTHLY_INCOME = 1200;
const MONTHLY_EXPENSES = 700;
/** Tipo de interés anual del fondo de ahorro (2,5% anual). */
export const SAVINGS_INTEREST_RATE = 0.025;

const defaultUser: UserState = {
  name: "Estudiante",
  level: 1,
  xp: 0,
  coins: 1000,
  streak: 3,
  progress: 0,
  completedModules: [],
  youngAvatarId: 'starter_rocket',
  unlockedAvatarIds: ['starter_rocket', 'starter_piggy', 'starter_lightbulb'],
  youngAvatarBackgroundId: 'blue_soft',
  balance: 1000,
  savingsFund: 0,
  savingsFundUnlocked: false,
  reputation: 50,
  financialHealth: 50,
  investorLevel: 1,
  certificate: null,
  lastSessionSummary: null,
  portfolio: {
    cash: 10000,
    holdings: {},
    history: []
  },
  hasSeenInvestOnboarding: false,
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('dashboard');
  const [user, setUser] = useState<UserState>(defaultUser);
  const [themeMode, setThemeMode] = useState<ThemeMode>('young');
  const [navigationMode, setNavigationMode] = useState<'sequential' | 'free'>('sequential');

  const toggleTheme = () => {
    setThemeMode(prev => prev === 'young' ? 'adult' : 'young');
  };

  const toggleNavigationMode = () => {
    setNavigationMode(prev => prev === 'sequential' ? 'free' : 'sequential');
  };

  const setSavingsFundUnlocked = (value: boolean) => {
    setUser(prev => ({
      ...prev,
      savingsFundUnlocked: value,
    }));
  };

  const autoCompleteChapter = (moduleIds: string[]) => {
    setUser(prev => {
      // Filter out already completed modules to avoid duplicates
      const newModules = moduleIds.filter(id => !prev.completedModules.includes(id));
      if (newModules.length === 0) return prev;

      return {
        ...prev,
        completedModules: [...prev.completedModules, ...newModules],
        progress: 100 // Set progress to 100% as requested
      };
    });
  };

  const addCoins = (amount: number) => {
    setUser(prev => ({ ...prev, coins: prev.coins + amount }));
  };

  const addXp = (amount: number) => {
    setUser(prev => {
      const newXp = prev.xp + amount;
      const newLevel = Math.floor(newXp / 100) + 1; // Simple level formula
      return { ...prev, xp: newXp, level: newLevel };
    });
  };

  const completeModule = (moduleId: string) => {
    setUser(prev => {
      if (prev.completedModules.includes(moduleId)) return prev;
      return {
        ...prev,
        completedModules: [...prev.completedModules, moduleId],
        progress: Math.min(prev.progress + 5, 100)
      };
    });
  };

  /** Completes a single lesson (no monthly cycle). Use when finishing a lesson mid-topic. */
  const completeLesson = (moduleId: string, isMinigame: boolean) => {
    if (user.completedModules.includes(moduleId)) return;
    const xpGain = isMinigame ? 100 : 20;
    const coinGain = isMinigame ? 50 : 10;
    setUser(prev => ({
      ...prev,
      completedModules: [...prev.completedModules, moduleId],
      progress: Math.min(prev.progress + 5, 100),
      xp: prev.xp + xpGain,
      level: Math.floor((prev.xp + xpGain) / 100) + 1,
      coins: prev.coins + coinGain,
    }));
  };

  const runMonthlyCycle = (): SessionSummary => {
    const balanceBefore = user.balance;
    const monthlyRate = SAVINGS_INTEREST_RATE / 12;
    const savingsInterest = Math.round(user.savingsFund * monthlyRate * 100) / 100;
    const newSavingsFund = user.savingsFund + savingsInterest;
    let newBalance = balanceBefore + MONTHLY_INCOME - MONTHLY_EXPENSES;
    if (newBalance < 0) newBalance = 0;
    const lessonCount = user.completedModules.length;
    const repVariation = lessonCount % 2 === 0 ? 1 : 0;
    const healthVariation = newBalance > balanceBefore ? 1 : (newBalance < balanceBefore ? -1 : 0);
    const newRep = Math.min(100, Math.max(0, user.reputation + repVariation));
    const newHealth = Math.min(100, Math.max(0, user.financialHealth + healthVariation));
    return {
      income: MONTHLY_INCOME,
      expenses: MONTHLY_EXPENSES,
      balanceBefore,
      balanceAfter: newBalance,
      savingsFund: newSavingsFund,
      savingsInterest,
      reputationBefore: user.reputation,
      reputationAfter: newRep,
      healthBefore: user.financialHealth,
      healthAfter: newHealth,
    };
  };

  const completeLessonWithMonthlyCycle = (moduleId: string, isMinigame: boolean) => {
    if (user.completedModules.includes(moduleId)) return;
    const summary = runMonthlyCycle();
    const xpGain = isMinigame ? 100 : 20;
    const coinGain = isMinigame ? 50 : 10;
    setUser(prev => {
      const newModules = [...prev.completedModules, moduleId];
      const newProgress = Math.min(prev.progress + 5, 100);
      const newXp = prev.xp + xpGain;
      const year = new Date().getFullYear();
      const certId = `FM-${year}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
      const healthAfter = summary.healthAfter;
      const certificate: CertificateInfo | null =
        prev.certificate !== null
          ? prev.certificate
          : newModules.length >= 8
            ? {
                certificateType: newModules.length >= 25 ? 'Advanced' : newModules.length >= 15 ? 'Intermediate' : 'Foundation',
                grade: healthAfter >= 72 ? 'Certified with High Honors' : healthAfter >= 65 ? 'Certified with Honors' : 'Certified',
                areas: ['Fundamentos Financieros', 'Presupuesto y Ahorro Mensual'],
                certificateId: certId,
                academicYear: `${year - 1}-${year}`,
              }
            : null;
      return {
        ...prev,
        balance: summary.balanceAfter,
        savingsFund: summary.savingsFund,
        reputation: summary.reputationAfter,
        financialHealth: summary.healthAfter,
        completedModules: newModules,
        progress: newProgress,
        xp: newXp,
        level: Math.floor(newXp / 100) + 1,
        coins: prev.coins + coinGain,
        lastSessionSummary: summary,
        certificate,
      };
    });
  };

  const dismissSessionSummary = () => {
    setUser(prev => ({ ...prev, lastSessionSummary: null }));
  };

  const setInvestorLevel = (level: InvestorLevel) => {
    setUser(prev => ({ ...prev, investorLevel: level }));
  };

  const completeInvestOnboarding = () => {
    setUser(prev => ({ ...prev, hasSeenInvestOnboarding: true }));
  };

  const isRestrictedByZeroBalance = user.balance === 0;

  const buyAsset = (symbol: string, price: number, quantity: number) => {
    const cost = price * quantity;
    if (user.portfolio.cash >= cost) {
      setUser(prev => {
        const currentHolding = prev.portfolio.holdings[symbol] || { quantity: 0, averageCost: 0 };
        const totalQuantity = currentHolding.quantity + quantity;
        const totalCost = (currentHolding.quantity * currentHolding.averageCost) + cost;
        const newAverageCost = totalCost / totalQuantity;

        return {
          ...prev,
          portfolio: {
            ...prev.portfolio,
            cash: prev.portfolio.cash - cost,
            holdings: {
              ...prev.portfolio.holdings,
              [symbol]: {
                quantity: totalQuantity,
                averageCost: newAverageCost
              }
            },
            history: [
              ...prev.portfolio.history,
              {
                type: 'buy',
                symbol,
                price,
                quantity,
                timestamp: Date.now()
              }
            ]
          }
        };
      });
    }
  };

  const sellAsset = (symbol: string, price: number, quantity: number) => {
    const currentHolding = user.portfolio.holdings[symbol];
    if (currentHolding && currentHolding.quantity >= quantity) {
      const revenue = price * quantity;
      setUser(prev => {
        const current = prev.portfolio.holdings[symbol];
        const newQuantity = current.quantity - quantity;
        
        const newHoldings = { ...prev.portfolio.holdings };
        if (newQuantity > 0) {
          newHoldings[symbol] = {
            ...current,
            quantity: newQuantity
          };
        } else {
          delete newHoldings[symbol];
        }

        return {
          ...prev,
          portfolio: {
            ...prev.portfolio,
            cash: prev.portfolio.cash + revenue,
            holdings: newHoldings,
            history: [
              ...prev.portfolio.history,
              {
                type: 'sell',
                symbol,
                price,
                quantity,
                timestamp: Date.now()
              }
            ]
          }
        };
      });
    }
  };

  const setYoungAvatarId = (id: string) => {
    setUser(prev => ({
      ...prev,
      youngAvatarId: id,
    }));
  };

  const setYoungAvatarBackgroundId = (id: string) => {
    setUser(prev => ({
      ...prev,
      youngAvatarBackgroundId: id,
    }));
  };

  const buyItem = (price: number): boolean => {
    if (user.coins >= price) {
      setUser(prev => ({ ...prev, coins: prev.coins - price }));
      return true;
    }
    return false;
  };

  return (
    <GameContext.Provider value={{
      currentScreen,
      setCurrentScreen,
      user,
      setUser,
      addCoins,
      addXp,
      completeModule,
      completeLesson,
      completeLessonWithMonthlyCycle,
      runMonthlyCycle,
      buyAsset,
      sellAsset,
      buyItem,
      themeMode,
      toggleTheme,
      navigationMode,
      toggleNavigationMode,
      autoCompleteChapter,
      youngAvatarId: user.youngAvatarId,
      setYoungAvatarId,
      youngAvatarBackgroundId: user.youngAvatarBackgroundId,
      setYoungAvatarBackgroundId,
      isRestrictedByZeroBalance,
      setInvestorLevel,
      dismissSessionSummary,
      completeInvestOnboarding,
      setSavingsFundUnlocked,
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGame must be used within a GameProvider');
  return context;
};
