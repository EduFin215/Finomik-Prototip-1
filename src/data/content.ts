export type NodeType = 'lesson' | 'minigame';
export type MinigameType = 'mcq' | 'true_false' | 'fill_blank' | 'case' | 'order' | 'match' | 'speed' | 'pasapalabra';

export interface LearningNode {
  id: string;
  type: NodeType;
  title: string;
  description?: string;
  noteIds?: number[]; // IDs of relevant study notes
  /**
   * Layout visual de la lección:
   * - mixed: vídeo + texto (por defecto)
   * - text_only: solo texto corto/interactive
   * - video_only: solo bloque de vídeo con breve descripción
   */
  layout?: 'mixed' | 'text_only' | 'video_only';
  // Lesson specific
  content?: {
    sections: {
      title: string;
      body: string;
      /**
       * Texto corto opcional para resaltar la idea clave de la sección.
       * Se usa para efectos interactivos (typewriter) en algunas lecciones.
       */
      highlightText?: string;
    }[];
  };
  // Minigame specific
  minigameType?: MinigameType;
  data?: any; // Flexible data for different minigames
}

// Capítulo 1: Fundamentos Financieros
const chapter1LearningPath: LearningNode[] = [
  // 1. Finanzas (MCQ)
  {
    id: "l1",
    type: "lesson",
    title: "¿Qué son las finanzas?",
    description: "Introducción a la gestión del dinero.",
    noteIds: [1],
    content: {
      sections: [
        {
          title: "¿Qué son las finanzas?",
          body: "Las finanzas son la disciplina que estudia cómo las personas, empresas y gobiernos gestionan el dinero y los recursos económicos a lo largo del tiempo, especialmente bajo condiciones de incertidumbre.\n\nResponden a tres grandes preguntas:\n• ¿Cómo obtenemos el dinero?\n• ¿Cómo lo utilizamos?\n• ¿Cómo lo hacemos crecer?"
        }
      ]
    }
  },
  {
    id: "g1",
    type: "minigame",
    title: "Quiz Rápido",
    description: "Demuestra lo aprendido.",
    minigameType: "mcq",
    noteIds: [1],
    data: {
      question: "¿Cuáles son las tres grandes preguntas de las finanzas?",
      options: [
        "Cómo ganar, gastar y perder dinero",
        "Cómo obtener, utilizar y hacer crecer el dinero",
        "Cómo imprimir, guardar y esconder dinero"
      ],
      correctIndex: 1
    }
  },

  // 2. Dinero (True/False)
  {
    id: "l2",
    type: "lesson",
    title: "El papel del dinero",
    description: "Funciones fundamentales.",
    noteIds: [2],
    content: {
      sections: [
        {
          title: "El papel del dinero",
          body: "El dinero cumple tres funciones fundamentales:\n\n1. Medio de intercambio: facilita las transacciones.\n2. Unidad de cuenta: permite medir el valor.\n3. Depósito de valor: permite transferir poder adquisitivo al futuro."
        }
      ]
    }
  },
  {
    id: "g2",
    type: "minigame",
    title: "Verdadero o Falso",
    description: "Conceptos básicos.",
    minigameType: "true_false",
    noteIds: [2],
    data: {
      question: "El dinero solo sirve para comprar cosas hoy, no para guardar valor.",
      isTrue: false
    }
  },

  // 3. Ingresos/Gastos (Fill Blank)
  {
    id: "l3",
    type: "lesson",
    title: "Ingresos y Gastos",
    description: "Flujo de caja básico.",
    noteIds: [3],
    content: {
      sections: [
        {
          title: "Ingresos y gastos",
          body: "Los ingresos son los recursos que recibimos. Los gastos son los recursos que utilizamos.\n\nEl equilibrio determina el ahorro:\n• Ingresos > Gastos → Ahorro\n• Ingresos < Gastos → Déficit"
        }
      ]
    }
  },
  {
    id: "g3",
    type: "minigame",
    title: "Completa la Frase",
    description: "Rellena el espacio.",
    minigameType: "fill_blank",
    noteIds: [3],
    data: {
      parts: ["Si tus ingresos superan a tus gastos, generas", "."],
      options: ["deuda", "ahorro", "déficit"],
      correct: "ahorro"
    }
  },

  // 4. Ahorro (Case)
  {
    id: "l4",
    type: "lesson",
    title: "El Ahorro",
    description: "Base de la inversión.",
    noteIds: [3],
    content: {
      sections: [
        {
          title: "Ahorro",
          body: "Ahorrar significa reservar parte de los ingresos actuales para el futuro. Es la base para invertir y protegerse ante imprevistos."
        }
      ]
    }
  },
  {
    id: "g4",
    type: "minigame",
    title: "Toma una Decisión",
    description: "Caso práctico.",
    minigameType: "case",
    noteIds: [3],
    data: {
      scenario: "Recibes un bono extra de 500€ en el trabajo. No tienes fondo de emergencia.",
      options: [
        { text: "Gastarlo en una fiesta", feedback: "¡Error! Primero asegura tu protección.", correct: false },
        { text: "Guardarlo por si acaso", feedback: "¡Correcto! La seguridad es lo primero.", correct: true }
      ]
    }
  },

  // 5. Inversión (Order)
  {
    id: "l5",
    type: "lesson",
    title: "Inversión",
    description: "Hacer crecer el dinero.",
    noteIds: [3],
    content: {
      sections: [
        {
          title: "Inversión",
          body: "Invertir implica destinar recursos hoy esperando un beneficio futuro. Conlleva riesgo, pero es necesario para batir a la inflación."
        }
      ]
    }
  },
  {
    id: "g5",
    type: "minigame",
    title: "Ordena por Riesgo",
    description: "De menor a mayor riesgo.",
    minigameType: "order",
    noteIds: [3],
    data: {
      items: [
        { id: "cash", text: "Efectivo bajo el colchón" },
        { id: "bonds", text: "Bonos del Estado" },
        { id: "crypto", text: "Criptomonedas volátiles" }
      ],
      correctOrder: ["cash", "bonds", "crypto"]
    }
  },

  // 6. Riesgo/Rentabilidad (Match)
  {
    id: "l6",
    type: "lesson",
    title: "Riesgo y Rentabilidad",
    description: "El binomio inseparable.",
    noteIds: [3],
    content: {
      sections: [
        {
          title: "Riesgo y rentabilidad",
          body: "Existe una relación directa: a mayor riesgo, mayor rentabilidad potencial. No existe rentabilidad alta sin riesgo."
        }
      ]
    }
  },
  {
    id: "g6",
    type: "minigame",
    title: "Conecta Conceptos",
    description: "Empareja las ideas.",
    minigameType: "match",
    noteIds: [3],
    data: {
      pairs: [
        { left: "Alto Riesgo", right: "Alta Rentabilidad Potencial" },
        { left: "Bajo Riesgo", right: "Baja Rentabilidad Esperada" }
      ]
    }
  },

  // 7. Valor del Dinero (Speed)
  {
    id: "l7",
    type: "lesson",
    title: "Valor del Dinero",
    description: "El tiempo es dinero.",
    noteIds: [4, 9],
    content: {
      sections: [
        {
          title: "Valor temporal",
          body: "Un euro hoy vale más que un euro mañana debido a la capacidad de invertirlo y a la inflación."
        }
      ]
    }
  },
  {
    id: "g7",
    type: "minigame",
    title: "Reto de Velocidad",
    description: "¡Piensa rápido!",
    minigameType: "speed",
    noteIds: [4, 9],
    data: {
      question: "¿Qué prefieres?",
      options: [
        { text: "100€ Hoy", correct: true },
        { text: "100€ en 10 años", correct: false }
      ],
      duration: 5 // seconds
    }
  },

  // 8. Sistema Financiero (MCQ - Cycle Restart)
  {
    id: "l8",
    type: "lesson",
    title: "Sistema Financiero",
    description: "Conectando agentes.",
    noteIds: [5, 8],
    content: {
      sections: [
        {
          title: "El Sistema",
          body: "Conecta ahorradores (exceso de capital) con inversores (necesidad de capital). Los bancos y mercados son los intermediarios."
        }
      ]
    }
  },
  {
    id: "g8",
    type: "minigame",
    title: "Quiz de Repaso",
    description: "Comprueba tu conocimiento.",
    minigameType: "mcq",
    noteIds: [5, 8],
    data: {
      question: "¿Quiénes tienen exceso de dinero en el sistema?",
      options: [
        "Los Inversores",
        "Los Ahorradores",
        "Los Bancos Centrales"
      ],
      correctIndex: 1
    }
  },

  // 9. Finanzas Personales (True/False)
  {
    id: "l9",
    type: "lesson",
    title: "Finanzas Personales",
    description: "Tu gestión individual.",
    noteIds: [6, 10, 11],
    content: {
      sections: [
        {
          title: "Gestión Personal",
          body: "Incluye presupuesto, fondo de emergencia y planificación. No depende de cuánto ganas, sino de cómo lo administras."
        }
      ]
    }
  },
  {
    id: "g9",
    type: "minigame",
    title: "Verdadero o Falso",
    description: "Mitos financieros.",
    minigameType: "true_false",
    noteIds: [6, 10, 11],
    data: {
      question: "Solo los ricos necesitan gestionar sus finanzas personales.",
      isTrue: false
    }
  },

  // 10. Corporativas (Fill Blank)
  {
    id: "l10",
    type: "lesson",
    title: "Finanzas Corporativas",
    description: "El mundo empresarial.",
    noteIds: [7, 12],
    content: {
      sections: [
        {
          title: "Objetivo Empresarial",
          body: "Las empresas buscan maximizar el valor para los accionistas a largo plazo mediante decisiones de inversión y financiación."
        }
      ]
    }
  },
  {
    id: "g10",
    type: "minigame",
    title: "Completa la Misión",
    description: "Objetivo clave.",
    minigameType: "fill_blank",
    noteIds: [7, 12],
    data: {
      parts: ["El objetivo es maximizar el", "de la empresa."],
      options: ["valor", "gasto", "número"],
      correct: "valor"
    }
  },

  // 11. JUEGO FINAL: PASAPALABRA
  {
    id: "final_boss",
    type: "minigame",
    title: "EL ROSCO FINAL",
    description: "Demuestra todo lo que sabes.",
    minigameType: "pasapalabra",
    noteIds: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    data: {
      questions: [
        { letter: "A", question: "Acción de guardar dinero para el futuro.", answer: "Ahorro" },
        { letter: "B", question: "Entidad financiera que custodia dinero y otorga préstamos.", answer: "Banco" },
        { letter: "C", question: "Dinero que se pide prestado y se debe devolver con intereses.", answer: "Credito" },
        { letter: "D", question: "Reparto de las inversiones en diferentes activos para reducir riesgo.", answer: "Diversificacion" },
        { letter: "E", question: "Situación donde los gastos superan a los ingresos.", answer: "Deficit" },
        { letter: "F", question: "Disciplina que gestiona el dinero.", answer: "Finanzas" },
        { letter: "G", question: "Salida de dinero para adquirir bienes o servicios.", answer: "Gasto" },
        { letter: "H", question: "Préstamo a largo plazo para comprar una vivienda.", answer: "Hipoteca" },
        { letter: "I", question: "Aumento generalizado de los precios.", answer: "Inflacion" },
        { letter: "L", question: "Facilidad con la que un activo se convierte en dinero efectivo.", answer: "Liquidez" }
      ]
    }
  }
];

// Capítulo 2: Presupuesto y Ahorro Mensual
const chapter2LearningPath: LearningNode[] = [
  // 1. Tu primer presupuesto
  {
    id: "c2_l1_presupuesto",
    type: "lesson",
    title: "Tu primer presupuesto mensual",
    description: "Da una misión a cada euro que entra.",
    layout: "text_only",
    noteIds: [3, 6],
    content: {
      sections: [
        {
          title: "¿Qué es un presupuesto?",
          body:
            "Un presupuesto es un plan sencillo que decide qué harás con tu dinero antes de gastarlo.\n\n" +
            "En lugar de preguntarte al final del mes \"¿dónde se ha ido mi sueldo?\", eliges por adelantado cuánto va a necesidades, a caprichos y a ahorro.",
          highlightText: "Cada euro de tu sueldo necesita una misión clara.",
        },
        {
          title: "Presupuesto sencillo",
          body:
            "Empieza por algo muy simple:\n\n" +
            "• Lo que entra cada mes.\n" +
            "• Lo que sí o sí tienes que pagar.\n" +
            "• Lo que gastas en ocio y caprichos.\n" +
            "• Lo que quieres reservar como ahorro.",
        },
      ],
    },
  },
  {
    id: "c2_g1_presupuesto",
    type: "minigame",
    title: "Mini Quiz de presupuesto",
    description: "Comprueba si has captado la idea.",
    minigameType: "mcq",
    noteIds: [3, 6],
    data: {
      question: "¿Cuál es el objetivo principal de un presupuesto mensual?",
      options: [
        "Controlar cada céntimo solo cuando ya se ha gastado.",
        "Decidir por adelantado cómo repartir tu dinero entre gastos y ahorro.",
        "Evitar por completo cualquier gasto en ocio o caprichos.",
      ],
      correctIndex: 1,
    },
  },

  // 2. Categorías de gastos
  {
    id: "c2_l2_categorias",
    type: "lesson",
    title: "Gastos fijos y variables",
    description: "No todos tus gastos se comportan igual.",
    layout: "video_only",
    noteIds: [3],
    content: {
      sections: [
        {
          title: "Gastos fijos",
          body:
            "Los gastos fijos se repiten cada mes con un importe parecido: alquiler, transporte público, suscripciones, facturas básicas.\n\n" +
            "Si sabes cuánto suman, sabes hasta dónde puedes llegar con el resto.",
          highlightText: "Primero protege tus gastos fijos esenciales.",
        },
        {
          title: "Gastos variables",
          body:
            "Los gastos variables cambian de un mes a otro: cenas fuera, ropa, ocio, pequeños viajes.\n\n" +
            "Son la palanca que puedes mover cuando necesitas ahorrar más o te estás pasando del presupuesto.",
        },
      ],
    },
  },
  {
    id: "c2_g2_categorias",
    type: "minigame",
    title: "Clasifica tus gastos",
    description: "Arrastra mentalmente cada gasto a su grupo.",
    minigameType: "fill_blank",
    noteIds: [3],
    data: {
      parts: [
        "El gasto en alquiler y luz pertenece a la categoría de gastos",
        "mientras que salir a cenar el sábado es un gasto",
      ],
      options: ["variables", "fijos"],
      correct: "fijos",
    },
  },

  // 3. Reglas sencillas de reparto
  {
    id: "c2_l3_regla",
    type: "lesson",
    title: "Reglas sencillas: 50/30/20",
    description: "Una plantilla rápida para empezar.",
    layout: "video_only",
    noteIds: [6],
    content: {
      sections: [
        {
          title: "La idea de 50/30/20",
          body:
            "La regla 50/30/20 propone este reparto sobre tu ingreso neto:\n\n" +
            "• 50% para necesidades básicas.\n" +
            "• 30% para deseos y estilo de vida.\n" +
            "• 20% para ahorro y objetivos futuros.\n\n" +
            "No es una ley rígida, es una plantilla inicial que puedes adaptar.",
          highlightText: "El truco está en reservar el ahorro primero, no al final del mes.",
        },
      ],
    },
  },
  {
    id: "c2_g3_regla",
    type: "minigame",
    title: "Ordena el reparto",
    description: "Coloca cada categoría donde toca.",
    minigameType: "order",
    noteIds: [6],
    data: {
      items: [
        { id: "needs", text: "Necesidades (alquiler, comida, transporte)" },
        { id: "wants", text: "Deseos (ocio, caprichos, lifestyle)" },
        { id: "savings", text: "Ahorro y objetivos futuros" },
      ],
      correctOrder: ["needs", "wants", "savings"],
    },
  },

  // 4. Fondo de emergencia y objetivos
  {
    id: "c2_l4_emergencias",
    type: "lesson",
    title: "Fondo de emergencia y objetivos",
    description: "Ahorro para imprevistos y sueños.",
    layout: "text_only",
    noteIds: [3, 6, 10],
    content: {
      sections: [
        {
          title: "Fondo de emergencia",
          body:
            "Un fondo de emergencia es un pequeño colchón de dinero para cuando algo se tuerce: una avería, un gasto médico, unas semanas sin ingreso.\n\n" +
            "Se construye poco a poco, sumando meses, hasta cubrir varios meses de gastos fijos.",
          highlightText: "Tu fondo de emergencia es tu escudo financiero.",
        },
        {
          title: "Ahorro para objetivos",
          body:
            "Además del colchón, puedes crear mini-huchas para objetivos concretos: un viaje, un máster, mudarte, lanzar un proyecto.\n\n" +
            "Cuando el objetivo tiene importe y fecha, es mucho más fácil mantener el hábito de ahorro.",
        },
      ],
    },
  },
  {
    id: "c2_g4_emergencias",
    type: "minigame",
    title: "Decisiones de ahorro",
    description: "¿Es buena idea o no?",
    minigameType: "true_false",
    noteIds: [3, 6, 10],
    data: {
      question:
        "Acabas de recibir un pago extra y aún no tienes fondo de emergencia. Decides destinarlo todo a un viaje y ya ahorrarás más adelante. ¿Es una decisión responsable?",
      isTrue: false,
    },
  },

  // 5. Juego final: Caso real de presupuesto (datos paso a paso + resumen dashboard)
  {
    id: "c2_final_presupuesto",
    type: "minigame",
    title: "Caso real: tu primer sueldo",
    description: "Vive un mes completo tomando decisiones con tu dinero.",
    minigameType: "case",
    noteIds: [3, 6, 10, 11],
    data: {
      steps: [
        { title: "Tu situación", body: "Tienes 23 años y acabas de empezar tu primer trabajo a jornada completa." },
        { title: "Tu sueldo", body: "Cobras 1.400€ netos al mes." },
        { title: "Gastos fijos", body: "Habitación 550€ · Transporte 60€ · Suscripciones y móvil 40€ · Comida ~250€." },
        { title: "Tu objetivo", body: "Ahorrar 3.000€ en 18 meses para irte de Erasmus. Aún no tienes fondo de emergencia." },
        { title: "Este mes", body: "Te tientan: un viaje de fin de semana con amigos, renovar el móvil y un curso online." },
      ],
      summary: {
        income: 1400,
        fixedLabel: "Gastos fijos",
        fixedTotal: 900,
        items: [
          { label: "Habitación", value: 550 },
          { label: "Transporte", value: 60 },
          { label: "Suscripciones y móvil", value: 40 },
          { label: "Comida", value: 250 },
        ],
        marginLabel: "Margen disponible",
        goalAmount: 3000,
        goalMonths: 18,
        goalLabel: "Objetivo Erasmus",
      },
      options: [
        {
          text:
            "Casi todo a ocio: pagas el viaje de fin de semana (250€), te compras un móvil nuevo a plazos (45€/mes) y apenas dejas 50€ de ahorro este mes.",
          feedback:
            "Esta opción maximiza el disfrute inmediato pero deja tu margen de ahorro casi a cero.\n\n" +
            "Con 50€ al mes, tardarías 60 meses en alcanzar 3.000€, muy por encima de los 18 meses que te has marcado. Además, el móvil a plazos suma un gasto fijo nuevo que reduce tu flexibilidad.\n\n" +
            "Financieramente, te acerca a vivir al límite cada mes y te aleja mucho de tu objetivo.",
          correct: false,
        },
        {
          text:
            "Todo al ahorro: renuncias al viaje, no compras nada extra y decides ahorrar todo lo que te quede después de gastos fijos, recortando al máximo en ocio.",
          feedback:
            "Es la opción más agresiva de ahorro: podrías llegar muy rápido a los 3.000€ si mantienes ese ritmo.\n\n" +
            "Pero vivir muchos meses casi sin ocio aumenta el riesgo de que abandones el plan a mitad y vuelvas a gastar sin control. La sostenibilidad también es importante en las finanzas personales.\n\n" +
            "Financieramente no es mala opción, pero puede ser poco realista a largo plazo.",
          correct: false,
        },
        {
          text:
            "Equilibrio inteligente: reservas primero 250€ fijos para ahorro, te permites un presupuesto moderado de ocio (100–150€) y pospones el móvil nuevo, aprovechando ofertas para el curso online si entra en el presupuesto.",
          feedback:
            "Esta opción equilibra presente y futuro.\n\n" +
            "Con 250€ de ahorro al mes, en 12 meses tendrías 3.000€ si mantienes el ritmo. Incluso si algún mes ahorras algo menos, puedes acercarte mucho a tu objetivo en 18 meses.\n\n" +
            "Además, mantienes algo de ocio y formación (curso online) sin disparar tus gastos fijos.\n\n" +
            "Es una estrategia realista, sostenible y alineada con tu objetivo. ¡Excelente decisión!",
          correct: true,
        },
        {
          text:
            "Todo a compras útiles: renuncias al viaje, pero renuevas el móvil a plazos y te apuntas al curso, dejando el ahorro para \"cuando te suban el sueldo\".",
          feedback:
            "Aunque el curso puede ser una buena inversión, dejas el ahorro totalmente condicionado a ingresos futuros que todavía no tienes.\n\n" +
            "Con el nuevo móvil a plazos, aumentas tus gastos fijos y reduces el margen de maniobra. Si no llega la subida de sueldo, tu objetivo del Erasmus se aleja cada mes que pasa.\n\n" +
            "Es una decisión arriesgada: dependes demasiado de un futuro incierto y no construyes tu colchón ahora.",
          correct: false,
        },
      ],
    },
  },
];

// Contenido de onboarding para el módulo Invertir (explicación de inversión obligatoria)
export interface InvestOnboardingSection {
  title: string;
  body: string;
  highlightText?: string;
}

export const investOnboardingContent = {
  title: "Inversión obligatoria: qué es y por qué importa",
  description: "Antes de practicar con el simulador, entiende la base sobre la que se construye tu ahorro a largo plazo.",
  content: {
    sections: [
      {
        title: "¿Qué es la inversión obligatoria?",
        body:
          "La inversión obligatoria es la parte de tu ahorro que viene determinada por ley o por tu contrato.",
        highlightText: "La inversión obligatoria es la base; la voluntaria es donde tú decides.",
      },
      {
        title: "Ejemplos de inversión obligatoria",
        body:
          "• Planes de pensiones de empleo.\n" +
          "• Aportaciones obligatorias del trabajador y de la empresa.\n" +
          "• Complementos públicos (por ejemplo, planes del sistema de la Seguridad Social).",
      },
      {
        title: "Características clave",
        body:
          "No es dinero que tú eliges cuándo o cuánto aportar: ya está comprometido. Forma parte de tu retiro futuro y suele tener ventajas fiscales.",
      },
      {
        title: "Por qué te interesa antes de invertir",
        body:
          "Antes de lanzarte a invertir por tu cuenta, conviene tener claro que la inversión obligatoria ya te está construyendo una base a largo plazo.",
      },
      {
        title: "El orden recomendado",
        body:
          "• Da prioridad al ahorro automático y a la fiscalidad que ya te aplica.\n\n" +
          "• Primero: asegurar la parte obligatoria y el fondo de emergencia.\n\n" +
          "• Después: la inversión voluntaria.\n\n" +
          "Así evitas duplicar esfuerzos y tienes una base sólida antes de asumir más riesgo.",
      },
      {
        title: "En este simulador practicarás la parte voluntaria",
        body:
          "Podrás elegir activos, diversificar, asumir riesgo y ver cómo evoluciona una cartera con el tiempo. Todo lo que aprendas te servirá para cuando quieras invertir por tu cuenta, siempre después de tener cubierta tu base de ahorro obligatorio.",
      },
    ],
  },
};

// Mapa de capítulos -> learning path
export const chapterLearningPaths: Record<number, LearningNode[]> = {
  1: chapter1LearningPath,
  2: chapter2LearningPath,
};

// Helper para obtener el learning path de un capítulo
export const getLearningPathForChapter = (chapterId: number): LearningNode[] => {
  return chapterLearningPaths[chapterId] ?? chapter1LearningPath;
};

// Compatibilidad hacia atrás: capítulo 1 como camino por defecto
export const learningPath: LearningNode[] = chapter1LearningPath;
