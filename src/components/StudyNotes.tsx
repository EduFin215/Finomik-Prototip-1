import React from 'react';
import { X, BookOpen, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useGame } from '../context/GameContext';
import { getTheme } from '../utils/theme';

interface StudyNotesProps {
  isOpen: boolean;
  onClose: () => void;
  activeNoteIds?: number[];
}

const NOTES_CONTENT = [
  {
    id: 1,
    title: "¿Qué son las finanzas?",
    content: (
      <>
        <p className="mb-2">Las finanzas estudian cómo personas, empresas y gobiernos gestionan el dinero y los recursos económicos a lo largo del tiempo, especialmente bajo incertidumbre.</p>
        <p className="mb-2 font-medium">Responden a tres preguntas clave:</p>
        <ul className="list-disc list-inside space-y-1 ml-2 mb-2 text-slate-600">
          <li>¿Cómo obtenemos el dinero?</li>
          <li>¿Cómo lo utilizamos?</li>
          <li>¿Cómo lo hacemos crecer?</li>
        </ul>
        <p className="text-sm bg-blue-50 p-2 rounded border-l-4 border-blue-500">Toda decisión financiera implica elegir entre consumir hoy o reservar para el futuro.</p>
      </>
    )
  },
  {
    id: 2,
    title: "El papel del dinero en la economía",
    content: (
      <>
        <p className="mb-2 font-medium">El dinero cumple tres funciones:</p>
        <ul className="list-disc list-inside space-y-1 ml-2 mb-2 text-slate-600">
          <li>Medio de intercambio</li>
          <li>Unidad de cuenta</li>
          <li>Depósito de valor</li>
        </ul>
        <p>Permite eficiencia económica, especialización y crecimiento.</p>
      </>
    )
  },
  {
    id: 3,
    title: "Conceptos básicos fundamentales",
    content: (
      <div className="space-y-4">
        <div>
          <h4 className="font-bold text-slate-800 mb-1">3.1 Ingresos y gastos</h4>
          <p className="text-sm mb-1">Ingresos: recursos que recibimos.</p>
          <p className="text-sm mb-2">Gastos: recursos que utilizamos.</p>
          <div className="bg-slate-100 p-2 rounded text-sm font-mono text-center">
            Ingresos &gt; Gastos → Ahorro<br/>
            Ingresos &lt; Gastos → Déficit
          </div>
          <p className="text-xs text-slate-500 mt-1 text-center">El ahorro es la base de la inversión.</p>
        </div>
        <div>
          <h4 className="font-bold text-slate-800 mb-1">3.2 Ahorro</h4>
          <p className="mb-1">Ahorrar significa reservar recursos actuales para el futuro.</p>
          <p className="text-sm font-medium">Funciones:</p>
          <ul className="list-disc list-inside text-sm ml-2 text-slate-600">
            <li>Protección ante imprevistos</li>
            <li>Preparación de objetivos</li>
            <li>Base para invertir</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-slate-800 mb-1">3.3 Inversión</h4>
          <p className="mb-1">Invertir es destinar recursos hoy para obtener un beneficio futuro.</p>
          <p className="text-sm font-medium">Ejemplos:</p>
          <ul className="list-disc list-inside text-sm ml-2 text-slate-600">
            <li>Crear negocio</li>
            <li>Comprar acciones</li>
            <li>Comprar bonos</li>
            <li>Invertir en educación</li>
          </ul>
          <p className="text-xs text-slate-500 mt-1">Implica riesgo e incertidumbre.</p>
        </div>
        <div>
          <h4 className="font-bold text-slate-800 mb-1">3.4 Riesgo y rentabilidad</h4>
          <div className="bg-orange-50 p-2 rounded border border-orange-100 text-sm">
            <p className="font-medium text-orange-800">Relación directa:</p>
            <p>Mayor riesgo → Mayor rentabilidad potencial</p>
            <p>Menor riesgo → Menor rentabilidad esperada</p>
          </div>
          <p className="text-xs text-slate-500 mt-1 text-center">No existe rentabilidad sin riesgo.</p>
        </div>
      </div>
    )
  },
  {
    id: 4,
    title: "Valor del dinero en el tiempo",
    content: (
      <>
        <p className="text-lg font-bold text-center text-blue-600 mb-2">1€ hoy vale más que 1€ mañana.</p>
        <p className="mb-2 font-medium">Motivos:</p>
        <ul className="list-disc list-inside space-y-1 ml-2 mb-2 text-slate-600">
          <li>Puede invertirse</li>
          <li>Existe inflación</li>
          <li>Existe incertidumbre</li>
        </ul>
        <div className="bg-slate-100 p-3 rounded text-center mb-2">
          <span className="font-mono">1.000€ al 5% anual → 1.050€ en un año.</span>
        </div>
        <p className="text-sm">Base de: Intereses, Créditos, Hipotecas, Valoraciones.</p>
      </>
    )
  },
  {
    id: 5,
    title: "Sistema financiero",
    content: (
      <>
        <p className="mb-2">Conecta ahorradores con inversores.</p>
        <p className="mb-2 font-medium">Actores principales:</p>
        <div className="grid grid-cols-2 gap-2 text-sm text-center">
          <div className="bg-white border border-slate-200 p-1 rounded">Bancos</div>
          <div className="bg-white border border-slate-200 p-1 rounded">Mercados</div>
          <div className="bg-white border border-slate-200 p-1 rounded">Fondos</div>
          <div className="bg-white border border-slate-200 p-1 rounded">Bancos centrales</div>
          <div className="bg-white border border-slate-200 p-1 rounded">Empresas</div>
          <div className="bg-white border border-slate-200 p-1 rounded">Gobiernos</div>
        </div>
        <p className="mt-2 text-sm text-center text-slate-500">Permite crecimiento económico.</p>
      </>
    )
  },
  {
    id: 6,
    title: "Finanzas personales",
    content: (
      <>
        <p className="mb-2 font-medium">Incluye decisiones como:</p>
        <ul className="list-disc list-inside space-y-1 ml-2 mb-2 text-slate-600">
          <li>Presupuesto</li>
          <li>Fondo de emergencia</li>
          <li>Endeudamiento responsable</li>
          <li>Jubilación</li>
          <li>Diversificación</li>
        </ul>
        <p className="text-sm italic text-center text-slate-500">Depende más de disciplina que de ingresos.</p>
      </>
    )
  },
  {
    id: 7,
    title: "Finanzas corporativas",
    content: (
      <>
        <p className="mb-2 font-medium">Las empresas deciden:</p>
        <ul className="list-disc list-inside space-y-1 ml-2 mb-2 text-slate-600">
          <li>Cómo financiarse</li>
          <li>Dónde invertir</li>
          <li>Cómo repartir beneficios</li>
          <li>Cómo maximizar valor</li>
        </ul>
        <p className="text-sm font-bold text-blue-600 text-center">Objetivo: maximizar valor a largo plazo.</p>
      </>
    )
  },
  {
    id: 8,
    title: "Mercados financieros",
    content: (
      <>
        <p className="mb-2 font-medium">Permiten comprar y vender:</p>
        <div className="flex gap-2 justify-center mb-2 text-sm">
          <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded">Acciones</span>
          <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded">Bonos</span>
          <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded">Derivados</span>
          <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded">Divisas</span>
        </div>
        <p className="mb-1 font-medium">Funciones:</p>
        <ul className="list-disc list-inside text-sm text-slate-600">
          <li>Determinar precios</li>
          <li>Proveer liquidez</li>
          <li>Gestionar riesgos</li>
          <li>Facilitar financiación</li>
        </ul>
      </>
    )
  },
  {
    id: 9,
    title: "Inflación",
    content: (
      <>
        <p className="mb-2">Aumento general de precios.</p>
        <div className="bg-red-50 border border-red-100 p-3 rounded text-sm text-red-800">
          Si la inflación es 3%, el dinero pierde poder adquisitivo si no genera al menos 3%.
        </div>
      </>
    )
  },
  {
    id: 10,
    title: "Endeudamiento",
    content: (
      <>
        <p className="mb-2 font-medium">Tipos:</p>
        <ul className="list-disc list-inside space-y-1 ml-2 mb-2 text-slate-600">
          <li><span className="font-medium text-green-600">Deuda productiva</span> (genera valor)</li>
          <li><span className="font-medium text-red-600">Deuda de consumo</span> (gasto puro)</li>
        </ul>
        <p className="text-sm text-center">El problema no es la deuda, sino su uso y coste.</p>
      </>
    )
  },
  {
    id: 11,
    title: "Diversificación",
    content: (
      <>
        <p className="mb-2 font-bold text-center">No concentrar todo en un solo activo.</p>
        <p className="text-sm text-center bg-green-50 p-2 rounded text-green-800">Reduce riesgo sin necesariamente reducir rentabilidad esperada.</p>
      </>
    )
  },
  {
    id: 12,
    title: "Toma de decisiones financieras",
    content: (
      <>
        <p className="mb-2 font-medium">Implica:</p>
        <ul className="list-disc list-inside space-y-1 ml-2 mb-2 text-slate-600">
          <li>Evaluar alternativas</li>
          <li>Estimar riesgos</li>
          <li>Analizar costes</li>
          <li>Considerar horizonte temporal</li>
          <li>Alinear con objetivos</li>
        </ul>
        <p className="text-sm text-center font-medium">Las finanzas ayudan a gestionar incertidumbre.</p>
      </>
    )
  }
];

export const StudyNotes = ({ isOpen, onClose, activeNoteIds }: StudyNotesProps) => {
  const { themeMode } = useGame();
  const theme = getTheme(themeMode);

  const displayedNotes = activeNoteIds 
    ? NOTES_CONTENT.filter(note => activeNoteIds.includes(note.id))
    : NOTES_CONTENT;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-[60] backdrop-blur-sm"
          />

          {/* Modal Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={`fixed inset-y-0 right-0 w-full md:max-w-[560px] md:w-[560px] bg-white shadow-2xl z-[70] flex flex-col ${themeMode === 'adult' ? 'pt-20 md:pt-0' : ''}`}
          >
            {/* Header */}
            <div className={`p-5 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10`}>
              <div className="flex items-center gap-3">
                <div className={`p-2.5 ${themeMode === 'young' ? 'bg-blue-100 text-blue-600 rounded-xl' : 'bg-slate-100 text-slate-700 rounded-xl'}`}>
                  <BookOpen size={24} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-finomik-primary">
                    {activeNoteIds ? 'Apuntes de la Lección' : 'Apuntes del Curso'}
                  </h2>
                  <p className="text-sm text-slate-500">
                    {activeNoteIds ? 'Conceptos clave de este tema' : 'Introducción a las Finanzas'}
                  </p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-5 md:p-7 space-y-6 bg-slate-50">
              {displayedNotes.length > 0 ? (
                displayedNotes.map((section) => (
                  <div key={section.id} className={`${theme.card} p-6 border border-slate-100`}>
                    <h3 className={`text-xl font-bold ${themeMode === 'young' ? 'text-blue-800' : 'text-slate-800'} mb-4 flex items-center gap-2`}>
                      <span className={`flex items-center justify-center w-8 h-8 text-sm rounded-full ${themeMode === 'young' ? 'bg-blue-100 text-blue-600' : 'bg-slate-200 text-slate-700'}`}>
                        {section.id}
                      </span>
                      {section.title}
                    </h3>
                    <div className="text-slate-700 leading-relaxed text-base">
                      {section.content}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center p-10 text-slate-500 text-base">
                  <p>No hay apuntes específicos para esta sección.</p>
                </div>
              )}

              {/* Conclusion */}
              {(!activeNoteIds || activeNoteIds.length > 5) && (
                <div className={`bg-blue-600 text-white p-7 ${themeMode === 'young' ? 'rounded-2xl' : 'rounded-lg'} text-center space-y-3`}>
                  <h3 className="font-bold text-xl">Conclusión</h3>
                  <p className="text-blue-100 text-base">Las finanzas organizan cómo se asignan recursos en la sociedad y permiten transformar ahorro en crecimiento.</p>
                  <p className="font-medium pt-2 border-t border-blue-500/30 mt-2 text-base">Entender finanzas permite tomar decisiones más racionales y estratégicas.</p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
