/**
 * Estilo unificado para gráficos de línea: línea azul oscura, área con difuminado (gradiente vertical azul-gris → casi blanco).
 */

const LINE_COLOR_DARK = '#0B3064';   // finomik-primary

// Difuminado bajo la línea: azul-gris claro junto a la línea que se desvanece hasta casi blanco abajo
export const lineChartDefs = [
  {
    id: 'lineAreaGradient',
    type: 'linearGradient' as const,
    colors: [
      { offset: 0, color: '#B8C9DD' },
      { offset: 40, color: '#D4E0ED' },
      { offset: 70, color: '#E8EEF5' },
      { offset: 100, color: '#F5F7FA' },
    ],
  },
];

export const lineChartFill = [{ match: '*', id: 'lineAreaGradient' }];

export const lineChartTheme = {
  axis: {
    ticks: { text: { fill: '#64748b', fontSize: 11 } },
  },
  grid: {
    line: { stroke: 'rgba(0,0,0,0.06)', strokeWidth: 1 },
  },
};

export const lineChartDefaults = {
  curve: 'monotoneX' as const,
  lineWidth: 3,
  enableArea: true,
  areaOpacity: 1,
  fill: lineChartFill,
  defs: lineChartDefs,
  theme: lineChartTheme,
  colors: [LINE_COLOR_DARK],
  pointSize: 0,
  pointColor: LINE_COLOR_DARK,
  pointBorderWidth: 0,
  pointBorderColor: 'transparent',
  enableGridX: false,
  enableGridY: true,
  isInteractive: true,
  useMesh: true,
};

/** Clase para tooltips de gráficos de línea (estilo referencia: redondeado, sombra, fondo claro) */
export const lineChartTooltipClass =
  'bg-white/95 backdrop-blur-sm px-3 py-2 rounded-xl shadow-lg border border-slate-200/80 text-sm font-medium text-finomik-primary';
