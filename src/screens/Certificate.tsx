import React from 'react';
import { useGame } from '../context/GameContext';
import { Award, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';
import { getTheme } from '../utils/theme';

const NOTE_LEGAL =
  'Este certificado acredita conocimientos trabajados en un entorno de simulación financiera con fines educativos. No constituye acreditación profesional ni asesoramiento financiero.';

export const Certificate = () => {
  const { user, setCurrentScreen, themeMode } = useGame();
  const theme = getTheme(themeMode);

  const cert = user.certificate ?? {
    certificateType: 'Foundation' as const,
    grade: 'Certified' as const,
    areas: ['Fundamentos Financieros'],
    certificateId: `FM-${new Date().getFullYear()}-DEMO`,
    academicYear: `${new Date().getFullYear() - 1}-${new Date().getFullYear()}`,
  };

  return (
    <div className={theme.contentPadding}>
      <div className="mb-6">
        <button
          onClick={() => setCurrentScreen('dashboard')}
          className="flex items-center gap-2 text-sm font-semibold text-[color:var(--finomik-blue-5)] hover:text-finomik-primary"
        >
          <ArrowLeft size={18} />
          Volver
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto bg-white border-2 border-[color:var(--finomik-blue-6)] rounded-3xl shadow-xl overflow-hidden"
      >
        <div className="bg-finomik-gradient-soft py-6 px-6 text-center border-b border-[color:var(--finomik-blue-6)]">
          <div className="inline-flex w-16 h-16 rounded-full bg-white/90 items-center justify-center mb-3">
            <Award size={32} className="text-finomik-primary" />
          </div>
          <h1 className="text-xl font-bold text-finomik-primary">
            Certificado Finomik de Educación Financiera
          </h1>
        </div>

        <div className="p-8 space-y-6">
          {!user.certificate && (
            <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-xl p-3">
              Completa al menos 8 lecciones para desbloquear tu certificado oficial. Este es un avance previo.
            </p>
          )}

          <div>
            <p className="text-[10px] uppercase tracking-wider text-[color:var(--finomik-blue-5)] font-semibold">
              Nombre del alumno
            </p>
            <p className="text-lg font-bold text-finomik-primary">{user.name}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-[color:var(--finomik-blue-5)] font-semibold">
                Tipo de certificado
              </p>
              <p className="font-semibold text-finomik-primary">{cert.certificateType}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-[color:var(--finomik-blue-5)] font-semibold">
                Calificación
              </p>
              <p className="font-semibold text-finomik-primary">{cert.grade}</p>
            </div>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-wider text-[color:var(--finomik-blue-5)] font-semibold mb-2">
              Áreas y temas completados
            </p>
            <ul className="list-disc list-inside text-sm text-finomik-primary space-y-1">
              {cert.areas.map((area, i) => (
                <li key={i}>{area}</li>
              ))}
            </ul>
          </div>

          <div className="flex flex-wrap gap-4 text-sm">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-[color:var(--finomik-blue-5)] font-semibold">
                Año académico
              </p>
              <p className="font-semibold">{cert.academicYear}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-[color:var(--finomik-blue-5)] font-semibold">
                ID del certificado
              </p>
              <p className="font-mono font-semibold text-finomik-primary">{cert.certificateId}</p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200">
            <p className="text-xs text-slate-600 leading-relaxed">{NOTE_LEGAL}</p>
          </div>

          <div className="flex justify-center pt-2">
            <div className="w-24 h-24 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 text-[10px]">
              QR
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
