import React from 'react';
import { Newspaper, ExternalLink, Clock, Tag } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { getTheme } from '../utils/theme';

// Imágenes para cada noticia (picsum.photos con seeds fijos — siempre cargan y dan variedad)
const FINANCE_IMAGES = [
  'https://picsum.photos/seed/ecb1/800/450',
  'https://picsum.photos/seed/wallstreet2/800/450',
  'https://picsum.photos/seed/edu3/800/450',
  'https://picsum.photos/seed/vivienda4/800/450',
  'https://picsum.photos/seed/crypto5/800/450',
  'https://picsum.photos/seed/bonos6/800/450',
  'https://picsum.photos/seed/hipoteca7/800/450',
  'https://picsum.photos/seed/tech8/800/450',
  'https://picsum.photos/seed/esg9/800/450',
  'https://picsum.photos/seed/banco10/800/450',
  'https://picsum.photos/seed/ahorro11/800/450',
  'https://picsum.photos/seed/turismo12/800/450',
  'https://picsum.photos/seed/energia13/800/450',
  'https://picsum.photos/seed/casa14/800/450',
  'https://picsum.photos/seed/curso15/800/450',
  'https://picsum.photos/seed/pyme16/800/450',
  'https://picsum.photos/seed/pension17/800/450',
  'https://picsum.photos/seed/pago18/800/450',
  'https://picsum.photos/seed/fintech19/800/450',
  'https://picsum.photos/seed/invertir20/800/450',
];

const NEWS = [
  { id: 1, title: "El BCE mantiene los tipos de interés sin cambios", summary: "El Banco Central Europeo decide pausar las subidas de tipos ante la moderación de la inflación en la eurozona.", source: "Financial Times", time: "Hace 2h", tag: "Macroeconomía", image: FINANCE_IMAGES[0] },
  { id: 2, title: "Wall Street abre en máximos históricos tras buenos datos de empleo", summary: "Los principales índices bursátiles de EE. UU. encadenan varias sesiones al alza impulsados por unos datos laborales mejor de lo esperado.", source: "Bloomberg", time: "Hace 3h", tag: "Mercados", image: FINANCE_IMAGES[1] },
  { id: 3, title: "Gobierno presenta nuevo plan de educación financiera en colegios", summary: "El Ministerio de Educación introduce contenidos de finanzas personales desde primaria para mejorar la cultura financiera de los jóvenes.", source: "El País", time: "Hace 5h", tag: "Educación", image: FINANCE_IMAGES[2] },
  { id: 4, title: "Los alquileres marcan máximos en las grandes ciudades europeas", summary: "La presión de la demanda y la falta de oferta disparan los precios del alquiler en las principales capitales.", source: "The Guardian", time: "Hace 7h", tag: "Vivienda", image: FINANCE_IMAGES[3] },
  { id: 5, title: "Nuevas regulaciones para criptomonedas en Europa", summary: "La ley MiCA entra en vigor estableciendo un marco claro para los activos digitales en la Unión Europea.", source: "Reuters", time: "Hace 1d", tag: "Cripto", image: FINANCE_IMAGES[4] },
  { id: 6, title: "¿Es buen momento para invertir en bonos del Estado?", summary: "Los analistas señalan que la renta fija vuelve a ofrecer rentabilidades atractivas tras años de tipos en mínimos.", source: "The Economist", time: "Hace 1d", tag: "Inversión", image: FINANCE_IMAGES[5] },
  { id: 7, title: "El euríbor encadena tres meses de descensos", summary: "Las hipotecas variables respiran tras la corrección del indicador de referencia en la zona euro.", source: "Cinco Días", time: "Hace 2d", tag: "Hipotecas", image: FINANCE_IMAGES[6] },
  { id: 8, title: "Las grandes tecnológicas aceleran sus planes de inversión en IA", summary: "Gigantes del sector anuncian nuevos centros de datos y contrataciones para reforzar sus capacidades en inteligencia artificial.", source: "Financial Times", time: "Hace 2d", tag: "Tecnología", image: FINANCE_IMAGES[7] },
  { id: 9, title: "Sube el interés por los fondos sostenibles entre los jóvenes", summary: "Los productos ESG ganan cuota en las carteras de inversión de menor edad, que priorizan impacto y rentabilidad.", source: "Morningstar", time: "Hace 3d", tag: "Sostenibilidad", image: FINANCE_IMAGES[8] },
  { id: 10, title: "Los bancos mejoran las condiciones de sus cuentas remuneradas", summary: "Varias entidades anuncian subidas en la remuneración del ahorro a la vista para captar nuevos clientes.", source: "Expansión", time: "Hace 3d", tag: "Ahorro", image: FINANCE_IMAGES[9] },
  { id: 11, title: "Cómo proteger tus ahorros de la inflación", summary: "Diversificar, revisar comisiones y mantener un colchón de seguridad son claves para no perder poder adquisitivo.", source: "EduDiario", time: "Hace 4d", tag: "Consejos", image: FINANCE_IMAGES[10] },
  { id: 12, title: "El turismo recupera niveles prepandemia y bate récords de gasto", summary: "Las llegadas internacionales impulsan el sector servicios y mejoran las previsiones de crecimiento para este año.", source: "ONU Turismo", time: "Hace 5d", tag: "Macroeconomía", image: FINANCE_IMAGES[11] },
  { id: 13, title: "Las energéticas moderan beneficios tras la caída del precio del gas", summary: "Las compañías del sector revisan a la baja sus previsiones de resultados ante un escenario de menores precios mayoristas.", source: "Reuters", time: "Hace 6d", tag: "Energía", image: FINANCE_IMAGES[12] },
  { id: 14, title: "Los jóvenes retrasan la compra de vivienda por la subida de tipos", summary: "La combinación de precios altos y financiación más cara aleja el acceso a la vivienda en propiedad de las nuevas generaciones.", source: "El Mundo", time: "Hace 1sem", tag: "Vivienda", image: FINANCE_IMAGES[13] },
  { id: 15, title: "Crece el interés por los cursos online de finanzas personales", summary: "Plataformas de formación reportan un aumento de inscripciones en contenidos de ahorro, inversión y planificación.", source: "Coursera", time: "Hace 1sem", tag: "Educación", image: FINANCE_IMAGES[14] },
  { id: 16, title: "Las pymes buscan alternativas de financiación fuera de la banca", summary: "Plataformas de crowdlending y fondos especializados ganan peso como vía para impulsar proyectos empresariales.", source: "Financial Times", time: "Hace 2sem", tag: "Empresa", image: FINANCE_IMAGES[15] },
  { id: 17, title: "Los planes de pensiones vuelven al debate político", summary: "Gobierno y oposición plantean incentivos fiscales distintos para fomentar el ahorro a largo plazo.", source: "La Vanguardia", time: "Hace 2sem", tag: "Pensiones", image: FINANCE_IMAGES[16] },
  { id: 18, title: "Las tarjetas 'buy now, pay later' ganan usuarios en Europa", summary: "Los métodos de pago aplazado se consolidan entre los consumidores jóvenes, mientras los reguladores piden más control.", source: "BBC", time: "Hace 3sem", tag: "Consumo", image: FINANCE_IMAGES[17] },
  { id: 19, title: "Las startups fintech baten récord de inversión en América Latina", summary: "Los fondos de capital riesgo aceleran sus apuestas por soluciones de pagos y crédito digital en la región.", source: "TechCrunch", time: "Hace 3sem", tag: "Fintech", image: FINANCE_IMAGES[18] },
  { id: 20, title: "Guía básica para empezar a invertir con poco dinero", summary: "Elegir productos sencillos, evitar endeudarse y marcar objetivos claros son claves para dar los primeros pasos.", source: "EduDiario", time: "Hace 1mes", tag: "Educación", image: FINANCE_IMAGES[19] },
];

export const News = () => {
  const { themeMode } = useGame();
  const theme = getTheme(themeMode);

  const mainStory = NEWS[0];
  const middleFeature = NEWS[1];
  const subStories = NEWS.slice(2, 7); // 5 subdestacados
  const leftColumnStories = NEWS.slice(7, 15);
  const rightColumnStories = NEWS.slice(15);

  return (
    <div className={`min-h-screen ${theme.container} pb-24`}>
      {/* Cabecera tipo masthead de diario */}
      <div className={`bg-white border-b border-[color:var(--finomik-blue-6)] px-6 py-4 sticky top-0 z-20 ${themeMode === 'adult' ? 'shadow-sm' : ''}`}>
        <div className="flex flex-col gap-1 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Newspaper className="text-finomik-primary" />
              <h1 className={`${theme.headingLarge} tracking-[0.18em] uppercase`}>
                EduDiario
              </h1>
            </div>
            <p className={`${theme.textSubtle} text-xs md:text-sm mt-1`}>
              Noticias financieras al día para entender la economía sin complicaciones
            </p>
          </div>
          <div className="flex items-center gap-3 text-[11px] md:text-xs text-[color:var(--finomik-blue-6)] mt-2 md:mt-0">
            <span className="uppercase font-semibold tracking-[0.16em] text-finomik-primary">
              Edición digital
            </span>
            <span className="hidden md:inline-block">•</span>
            <span className="md:border-l md:border-[color:var(--finomik-blue-6)] md:pl-3">
              Hoy, {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: '2-digit', month: 'short', year: 'numeric' })}
            </span>
          </div>
        </div>
      </div>

      <div className="px-1 sm:px-2 md:px-4 lg:px-6 xl:px-8 pt-3 pb-10 w-full space-y-8">
        {/* Layout principal tipo portada en 3 columnas, ocupando todo el ancho */}
        {mainStory && (
          <section className="grid gap-6 md:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,2.2fr)_minmax(0,1.4fr)]">
            {/* Columna izquierda: titulares con resumen y miniatura */}
            <div className="space-y-3 border-t border-[color:var(--finomik-blue-6)]/40 pt-3">
              {leftColumnStories.map((item, index) => (
                <article
                  key={item.id}
                  className={`border-b last:border-b-0 border-[color:var(--finomik-blue-6)]/20 pb-3 ${
                    index === 0 ? 'pt-1' : 'pt-2'
                  } ${index === 0 ? 'bg-white/60 rounded-lg px-2' : ''}`}
                >
                  <div className="flex gap-3">
                    <div className="shrink-0 w-20 h-14 sm:w-24 sm:h-16 rounded-lg overflow-hidden bg-[color:var(--finomik-blue-6)]/30">
                      <img
                        src={item.image}
                        alt=""
                        className="w-full h-full object-cover"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className={`${theme.headingSmall} text-sm md:text-base font-semibold leading-snug hover:text-finomik-primary transition-colors cursor-pointer`}>
                        {item.title}
                      </h3>
                      <div className="mt-1 flex items-center gap-2 text-[11px] text-[color:var(--finomik-blue-6)]">
                        <span>{item.source}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock size={11} /> {item.time}
                        </span>
                      </div>
                      <p className={`${theme.textSubtle} mt-1 text-[11px] md:text-xs leading-snug line-clamp-3`}>
                        {item.summary}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Columna central: portada y destacados */}
            <div className="space-y-4 md:col-span-1 lg:col-span-1">
              {/* Portada principal */}
              <article
                className={`bg-white ${theme.card} border border-[color:var(--finomik-blue-6)]/60 overflow-hidden`}
              >
                <div className="relative h-56 sm:h-72 lg:h-80 overflow-hidden group">
                  <img
                    src={mainStory.image}
                    alt={mainStory.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
                  <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                    <span className="bg-finomik-primary rounded-full shadow-lg text-white text-[10px] sm:text-[11px] font-bold px-3 py-1 uppercase tracking-[0.16em]">
                      Portada
                    </span>
                    <span className="bg-white/90 text-[color:var(--finomik-blue-6)] rounded-full text-[10px] sm:text-[11px] font-semibold px-3 py-1 flex items-center gap-1">
                      <Tag size={12} className="text-finomik-primary" />
                      {mainStory.tag}
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 text-white space-y-2 sm:space-y-3">
                    <div className="flex flex-wrap items-center gap-2 text-[11px] sm:text-xs opacity-90">
                      <span className="font-semibold">{mainStory.source}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {mainStory.time}
                      </span>
                    </div>
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold leading-tight drop-shadow-sm">
                      {mainStory.title}
                    </h2>
                  </div>
                </div>
                <div className="p-4 sm:p-5 space-y-3">
                  <p className={`${theme.textSubtle} text-sm sm:text-base`}>
                    {mainStory.summary}
                  </p>
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-finomik-primary hover:underline"
                  >
                    Leer artículo completo
                    <ExternalLink size={16} />
                  </button>
                </div>
              </article>

              {/* Destacado intermedio más grande */}
              {middleFeature && (
                <article
                  className={`bg-white ${theme.card} border border-[color:var(--finomik-blue-6)]/50 overflow-hidden flex flex-col sm:flex-row`}
                >
                  <div className="relative w-full sm:w-1/2 h-40 sm:h-44 overflow-hidden">
                    <img
                      src={middleFeature.image}
                      alt={middleFeature.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex-1 p-4 space-y-2">
                    <div className="flex items-center gap-2 text-[11px] text-[color:var(--finomik-blue-6)]">
                      <span className="font-medium text-finomik-primary">{middleFeature.source}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock size={11} /> {middleFeature.time}
                      </span>
                    </div>
                    <h3 className="text-sm sm:text-base font-semibold leading-snug hover:text-finomik-primary transition-colors cursor-pointer">
                      {middleFeature.title}
                    </h3>
                    <p className={`${theme.textSubtle} text-xs sm:text-sm line-clamp-3`}>
                      {middleFeature.summary}
                    </p>
                  </div>
                </article>
              )}

              {/* Subdestacados debajo de la portada */}
              <div className="grid gap-4 sm:grid-cols-2">
                {subStories.map((item) => (
                  <article
                    key={item.id}
                    className={`bg-white ${theme.card} border border-[color:var(--finomik-blue-6)]/40 overflow-hidden group`}
                  >
                    <div className="flex">
                      <div className="relative w-24 sm:w-28 h-24 sm:h-28 overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="flex-1 p-3 space-y-2">
                        <div className="flex items-center gap-2 text-[10px] text-[color:var(--finomik-blue-6)]">
                          <span className="font-medium text-finomik-primary">{item.source}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock size={11} /> {item.time}
                          </span>
                        </div>
                        <h3 className="text-sm font-semibold leading-snug group-hover:text-finomik-primary transition-colors">
                          {item.title}
                        </h3>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            {/* Columna derecha: sidebar más larga */}
            <aside className="space-y-5 md:col-span-1 lg:col-span-1">
              <div className={`bg-white ${theme.card} border border-[color:var(--finomik-blue-6)]/50 p-4`}>
                <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[color:var(--finomik-blue-6)] mb-3 border-b border-[color:var(--finomik-blue-6)]/40 pb-2">
                  Últimas noticias
                </h3>
                <ul className="space-y-3">
                  {rightColumnStories.slice(0, 6).map((item) => (
                    <li key={item.id} className="group cursor-pointer border-b last:border-b-0 border-[color:var(--finomik-blue-6)]/10 pb-2">
                      <p className="text-xs font-medium leading-snug group-hover:text-finomik-primary transition-colors">
                        {item.title}
                      </p>
                      <div className="mt-1 flex items-center gap-2 text-[10px] text-[color:var(--finomik-blue-6)]">
                        <span className="flex items-center gap-1">
                          <Clock size={11} /> {item.time}
                        </span>
                        <span>•</span>
                        <span>{item.source}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className={`bg-white ${theme.card} border border-[color:var(--finomik-blue-6)]/50 p-4`}>
                <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[color:var(--finomik-blue-6)] mb-3 border-b border-[color:var(--finomik-blue-6)]/40 pb-2">
                  Lo más leído
                </h3>
                <ul className="space-y-3">
                  {rightColumnStories.slice(6, 12).map((item) => (
                    <li key={`popular-${item.id}`} className="group cursor-pointer">
                      <p className="text-xs font-medium leading-snug group-hover:text-finomik-primary transition-colors">
                        {item.title}
                      </p>
                      <div className="mt-1 flex items-center gap-2 text-[10px] text-[color:var(--finomik-blue-6)]">
                        <span>{item.source}</span>
                        <span>•</span>
                        <span>{item.tag}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className={`bg-white ${theme.card} border border-[color:var(--finomik-blue-6)]/50 p-4`}>
                <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[color:var(--finomik-blue-6)] mb-3 border-b border-[color:var(--finomik-blue-6)]/40 pb-2">
                  Píldoras EduFin
                </h3>
                <ul className="space-y-3 text-xs md:text-sm">
                  <li>
                    <p className="font-semibold text-finomik-primary mb-1">
                      ¿Qué es un tipo de interés?
                    </p>
                    <p className={theme.textSubtle}>
                      Es el precio del dinero. Cuanto más alto, más caro es endeudarse y más se premia el ahorro.
                    </p>
                  </li>
                  <li>
                    <p className="font-semibold text-finomik-primary mb-1">
                      Regla del 72
                    </p>
                    <p className={theme.textSubtle}>
                      Divide 72 entre la rentabilidad anual estimada para saber en cuántos años se duplicaría tu inversión.
                    </p>
                  </li>
                  <li>
                    <p className="font-semibold text-finomik-primary mb-1">
                      Diversificación inteligente
                    </p>
                    <p className={theme.textSubtle}>
                      Combinar activos distintos reduce el riesgo de tu cartera sin renunciar a crecimiento a largo plazo.
                    </p>
                  </li>
                </ul>
              </div>
            </aside>
          </section>
        )}
      </div>
    </div>
  );
};
