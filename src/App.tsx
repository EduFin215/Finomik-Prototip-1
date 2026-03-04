/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { GameProvider, useGame } from './context/GameContext';
import { SidebarAlumno } from './components/SidebarAlumno';
import { Login } from './screens/Login';
import { ProfessorArea } from './screens/ProfessorArea';
import { Dashboard } from './screens/Dashboard';
import { WorldMap } from './screens/WorldMap';
import { InvestPortfolio } from './screens/InvestPortfolio';
import { InvestMarket } from './screens/InvestMarket';
import { InvestOnboarding } from './screens/InvestOnboarding';
import { SavingsFund } from './screens/SavingsFund';
import { SavingsClass } from './screens/SavingsClass';
import { News } from './screens/News';
import { Profile } from './screens/Profile';
import { Certificate } from './screens/Certificate';
import { SessionSummaryScreen } from './screens/SessionSummaryScreen';
import { UserPersona } from './screens/UserPersona';
import { AvatarShop } from './screens/AvatarShop';
import { Inbox } from './screens/Inbox';
import { AIAssistant } from './components/AIAssistant';
import { InvestorLevelScreen } from './screens/InvestorLevelScreen';

const ScreenRouter = () => {
  const { currentScreen, user } = useGame();

  switch (currentScreen) {
    case 'dashboard': return <Dashboard />;
    case 'world': return <WorldMap />;
    case 'invest':
    case 'investPortfolio':
      // El simulador solo se muestra cuando el alumno ha pasado por el onboarding y ha superado el test final.
      // 'invest' se trata como alias de compatibilidad hacia la vista de resumen de cartera.
      return user.hasSeenInvestOnboarding && user.hasPassedToolsFinalTest
        ? <InvestPortfolio />
        : <InvestOnboarding />;
    case 'investMarket':
      // Acceso directo al mercado simulado, protegido igualmente por el onboarding previo.
      return user.hasSeenInvestOnboarding && user.hasPassedToolsFinalTest
        ? <InvestMarket />
        : <InvestOnboarding />;
    case 'savingsFund':
      // Si la clase previa no está completada, mostrar primero la clase + test; después, la herramienta
      return user.hasCompletedSavingsClass ? <SavingsFund /> : <SavingsClass />;
    case 'news': return <News />;
    case 'profile': return <Profile />;
    case 'certificate': return <Certificate />;
    case 'sessionSummary': return <SessionSummaryScreen />;
    case 'userPersona': return <UserPersona />;
    case 'avatarShop': return <AvatarShop />;
    case 'investorLevel': return <InvestorLevelScreen />;
    case 'inbox': return <Inbox />;
    default: return <Dashboard />;
  }
};

const LayoutAlumno = () => {
  const { currentScreen } = useGame();
  const isWorldMap = currentScreen === 'world';

  return (
    <div
      className={`flex min-h-screen bg-white text-finomik-primary selection:bg-finomik-blue-soft text-body ${
        isWorldMap ? 'h-screen overflow-hidden' : ''
      }`}
    >
      <SidebarAlumno />
      <main
        className={`flex-1 flex flex-col min-w-0 ${
          isWorldMap ? 'overflow-hidden' : ''
        }`}
        style={{ marginLeft: '16rem' }}
      >
        <ScreenRouter />
      </main>
      <AIAssistant />
    </div>
  );
};

const AppContent = () => {
  const { isAuthenticated, isAlumno, isProfesor } = useAuth();
  // #region agent log
  fetch('http://127.0.0.1:7246/ingest/8dae4054-223c-427f-859a-09466d36a166',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'App.tsx:AppContent',message:'AppContent branch',data:{isAuthenticated,isAlumno,isProfesor},timestamp:Date.now(),hypothesisId:'H5'})}).catch(()=>{});
  // #endregion
  if (!isAuthenticated) {
    return <Login />;
  }

  if (isProfesor) {
    return <ProfessorArea />;
  }

  // Alumno: mostrar la app de juego dentro de GameProvider
  return (
    <GameProvider>
      <LayoutAlumno />
    </GameProvider>
  );
};

export default function App() {
  // #region agent log
  fetch('http://127.0.0.1:7246/ingest/8dae4054-223c-427f-859a-09466d36a166',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'App.tsx:App',message:'App mounted',data:{},timestamp:Date.now(),hypothesisId:'H3'})}).catch(()=>{});
  // #endregion
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

