import React, { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'alumno' | 'profesor';

interface AuthState {
  isAuthenticated: boolean;
  role: UserRole | null;
}

interface AuthContextType {
  isAuthenticated: boolean;
  role: UserRole | null;
  login: (role: UserRole) => void;
  logout: () => void;
  isAlumno: boolean;
  isProfesor: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'finomik_auth';

function loadStoredAuth(): AuthState {
  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (stored) {
      const { role } = JSON.parse(stored) as { role: UserRole };
      if (role === 'alumno' || role === 'profesor') {
        return { isAuthenticated: true, role };
      }
    }
  } catch {
    // ignore
  }
  return { isAuthenticated: false, role: null };
}

function saveAuth(role: UserRole) {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ role }));
}

function clearAuth() {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // #region agent log
  fetch('http://127.0.0.1:7246/ingest/8dae4054-223c-427f-859a-09466d36a166',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AuthContext.tsx:AuthProvider',message:'AuthProvider mounting',data:{},timestamp:Date.now(),hypothesisId:'H4'})}).catch(()=>{});
  // #endregion
  const [auth, setAuth] = useState<AuthState>(loadStoredAuth);

  const login = (role: UserRole) => {
    setAuth({ isAuthenticated: true, role });
    saveAuth(role);
  };

  const logout = () => {
    setAuth({ isAuthenticated: false, role: null });
    clearAuth();
  };

  const value: AuthContextType = {
    isAuthenticated: auth.isAuthenticated,
    role: auth.role,
    login,
    logout,
    isAlumno: auth.role === 'alumno',
    isProfesor: auth.role === 'profesor',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
