import React from 'react';
import { useAuth, UserRole } from '../context/AuthContext';
import { GraduationCap, UserCircle, LogIn } from 'lucide-react';
import { motion } from 'motion/react';

export const Login: React.FC = () => {
  const { login } = useAuth();
  // #region agent log
  fetch('http://127.0.0.1:7246/ingest/8dae4054-223c-427f-859a-09466d36a166',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Login.tsx',message:'Login screen rendering',data:{},timestamp:Date.now(),hypothesisId:'H5'})}).catch(()=>{});
  // #endregion
  const handleLogin = (role: UserRole) => {
    login(role);
  };

  return (
    <div className="min-h-screen bg-white text-finomik-primary flex flex-col items-center justify-center p-6 selection:bg-finomik-blue-soft">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md space-y-8"
      >
        {/* Logo / título */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-finomik-gradient-soft mb-4">
            <LogIn size={32} className="text-finomik-primary" />
          </div>
          <h1 className="heading-1 text-2xl md:text-3xl text-finomik-primary">
            Finomik
          </h1>
          <p className="text-body text-sm text-[color:var(--finomik-blue-5)]">
            Elige cómo quieres acceder
          </p>
        </div>

        {/* Opciones de acceso */}
        <div className="space-y-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleLogin('alumno')}
            className="w-full bg-finomik-gradient-soft border-2 border-[color:var(--finomik-blue-6)] rounded-2xl p-6 flex items-center gap-4 text-left hover:border-[color:var(--finomik-blue-4)] transition-colors shadow-sm"
          >
            <div className="w-14 h-14 rounded-xl bg-white/80 flex items-center justify-center shrink-0">
              <GraduationCap size={28} className="text-finomik-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="heading-2 text-lg text-finomik-primary">
                Entrar como alumno
              </h2>
              <p className="text-body text-sm text-[color:var(--finomik-blue-5)] mt-1">
                Accede al juego, aprende y practica finanzas
              </p>
            </div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleLogin('profesor')}
            className="w-full bg-white border-2 border-[color:var(--finomik-blue-6)] rounded-2xl p-6 flex items-center gap-4 text-left hover:border-[color:var(--finomik-blue-4)] hover:bg-finomik-blue-soft/30 transition-colors shadow-sm"
          >
            <div className="w-14 h-14 rounded-xl bg-finomik-blue-soft flex items-center justify-center shrink-0">
              <UserCircle size={28} className="text-finomik-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="heading-2 text-lg text-finomik-primary">
                Entrar como profesor
              </h2>
              <p className="text-body text-sm text-[color:var(--finomik-blue-5)] mt-1">
                Panel de profesor (próximamente)
              </p>
            </div>
          </motion.button>
        </div>

        <p className="text-center text-xs text-[color:var(--finomik-blue-5)]">
          No se requiere contraseña para esta versión. Elige el tipo de usuario para continuar.
        </p>
      </motion.div>
    </div>
  );
};
