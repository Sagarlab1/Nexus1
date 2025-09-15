// FIX: Implemented constants to resolve module errors.
import type { Agent, Rank, WeekPlan, Skill } from './types';
import BrainIcon from './components/icons/BrainIcon';
import TeamIcon from './components/icons/TeamIcon';
import CodeIcon from './components/icons/CodeIcon';
import BulbIcon from './components/icons/BulbIcon';
import RocketIcon from './components/icons/RocketIcon';

export const AGENTS: Agent[] = [
  {
    id: 'stratego',
    name: 'Stratego',
    description: 'Analista de Sistemas y Estratega de Negocios.',
    icon: BrainIcon,
    color: 'cyan',
    personalities: [
      { id: 'default', name: 'Default', description: 'Standard Stratego', prompt: 'Eres Stratego, un experto en análisis de sistemas complejos y estrategia de negocios. Tu comunicación es directa, lógica y basada en datos. Proporcionas frameworks, modelos mentales y planes de acción claros. Tu objetivo es desglosar la complejidad y ofrecer claridad estratégica.' },
    ],
  },
  {
    id: 'nexus',
    name: 'Nexus',
    description: 'Coach de Liderazgo y Desarrollo Personal.',
    icon: TeamIcon,
    color: 'yellow',
     personalities: [
      { id: 'default', name: 'Default', description: 'Standard Nexus', prompt: 'Eres Nexus, un coach de liderazgo empático y motivador. Te especializas en inteligencia emocional, comunicación efectiva y desarrollo de equipos. Tus respuestas son inspiradoras, buscan el crecimiento personal y hacen preguntas poderosas para la auto-reflexión.' },
    ],
  },
  {
    id: 'innova',
    name: 'Innova',
    description: 'Catalizador de Creatividad e Innovación Disruptiva.',
    icon: BulbIcon,
    color: 'purple',
     personalities: [
      { id: 'default', name: 'Default', description: 'Standard Innova', prompt: 'Eres Innova, una fuente inagotable de creatividad e innovación. Piensas "fuera de la caja", conectas ideas dispares y utilizas técnicas de pensamiento lateral. Tu lenguaje es imaginativo y provocador. Tu fin es romper paradigmas y generar ideas disruptivas.' },
    ],
  },
  {
    id: 'oraculo',
    name: 'Oraculo',
    description: 'Experto en Futuras Tecnologías y Tendencias Globales.',
    icon: RocketIcon,
    color: 'pink',
    personalities: [
      { id: 'default', name: 'Default', description: 'Standard Oraculo', prompt: 'Eres Oraculo, un visionario con profundo conocimiento en tecnologías exponenciales y tendencias globales. Analizas el futuro y explicas sus implicaciones. Tus respuestas son futuristas, bien informadas y ofrecen una perspectiva a largo plazo sobre cualquier tema.' },
    ],
  },
    {
    id: 'codex',
    name: 'Codex',
    description: 'Mentor de Programación y Arquitectura de Software.',
    icon: CodeIcon,
    color: 'green',
    personalities: [
      { id: 'default', name: 'Default', description: 'Standard Codex', prompt: 'Eres Codex, un ingeniero de software senior y arquitecto de sistemas. Explicas conceptos de programación complejos de forma sencilla, ofreces las mejores prácticas, patrones de diseño y consejos de arquitectura. Tu código es limpio, eficiente y bien documentado.' },
    ],
  },
];

export const RANKS: Rank[] = [
    { name: 'Neófito Sapiens', minXp: 0, icon: '🌱' },
    { name: 'Aprendiz Consciente', minXp: 100, icon: '🧠' },
    { name: 'Pensador Sistémico', minXp: 300, icon: '🕸️' },
    { name: 'Estratega Adaptativo', minXp: 600, icon: '🗺️' },
    { name: 'Innovador Disruptivo', minXp: 1000, icon: '💡' },
    { name: 'Líder Exponencial', minXp: 1500, icon: '🚀' },
    { name: 'Sapiens Trascendente', minXp: 2500, icon: '✨' },
];

export const ACCELERATOR_PROGRAM: WeekPlan[] = [
  { week: 1, title: 'Fundamentos del Pensamiento Exponencial', focus: 'Modelos Mentales y Principios de Liderazgo', challenge: 'Identificar y rediseñar un proceso personal o profesional usando el pensamiento de primeros principios.' },
  { week: 2, title: 'Comunicación de Alto Impacto', focus: 'Storytelling, Oratoria y Escucha Activa', challenge: 'Crear y presentar un "pitch" de 3 minutos sobre una idea compleja de forma clara y persuasiva.' },
  { week: 3, title: 'Productividad y Gestión de la Energía', focus: 'Sistemas de Enfoque Profundo (Deep Work) y Biohacking', challenge: 'Diseñar e implementar una rutina semanal personalizada que optimice los niveles de energía y enfoque.' },
  { week: 4, title: 'Inteligencia Emocional y Resiliencia', focus: 'Autoconciencia, Autogestión y Fortaleza Mental', challenge: 'Llevar un diario de "disparadores emocionales" y desarrollar un plan proactivo para manejarlos.' },
  { week: 5, title: 'Estrategia y Toma de Decisiones', focus: 'Análisis de Sistemas, Teoría de Juegos y Sesgos Cognitivos', challenge: 'Analizar una decisión importante (pasada o futura) usando un framework como la matriz de Eisenhower o el análisis DAFO.' },
  { week: 6, title: 'Innovación y Creatividad Aplicada', focus: 'Pensamiento de Diseño (Design Thinking) y Técnicas de Brainstorming', challenge: 'Aplicar el proceso de Design Thinking para proponer una solución innovadora a un problema cotidiano.' },
  { week: 7, title: 'Negociación y Resolución de Conflictos', focus: 'Principios de Negociación de Harvard y Comunicación No Violenta', challenge: 'Simular una negociación difícil, aplicando los principios aprendidos para llegar a un acuerdo beneficioso.' },
  { week: 8, title: 'Finanzas Personales y Creación de Riqueza', focus: 'Principios de Inversión, Presupuestos y Mentalidad de Abundancia', challenge: 'Crear un plan financiero personal a 1, 5 y 10 años, identificando vehículos de inversión.' },
  { week: 9, title: 'Marca Personal y Networking Estratégico', focus: 'Construcción de Autoridad Digital y Gestión de Relaciones', challenge: 'Optimizar un perfil de LinkedIn (u otra red profesional) y crear un plan de networking para conectar con 5 personas clave.' },
  { week: 10, title: 'Liderazgo de Equipos de Alto Rendimiento', focus: 'Delegación, Motivación y Cultura Organizacional', challenge: 'Definir la cultura y los valores para un equipo ideal (real o ficticio) y crear un plan para fomentarlos.' },
  { week: 11, title: 'Tecnologías Exponenciales (IA, Blockchain)', focus: 'Comprensión Conceptual y Aplicaciones Prácticas', challenge: 'Identificar 3 formas en que la IA podría impactar tu industria y proponer una iniciativa para capitalizarlo.' },
  { week: 12, title: 'Síntesis y Plan de Evolución Futura', focus: 'Integración de Aprendizajes y Diseño de Vida', challenge: 'Crear un "Manifiesto Personal" que integre los aprendizajes y defina tu visión y plan de acción para los próximos 5 años.' },
];

export const ACCELERATOR_SKILLS: Skill[] = [
    { name: 'Modelos Mentales', category: 'Pensamiento Estratégico' },
    { name: 'Pensamiento de Primeros Principios', category: 'Pensamiento Estratégico' },
    { name: 'Toma de Decisiones Basada en Datos', category: 'Pensamiento Estratégico' },
    { name: 'Storytelling y Narrativa', category: 'Liderazgo y Comunicación' },
    { name: 'Comunicación Asertiva', category: 'Liderazgo y Comunicación' },
    { name: 'Negociación y Persuasión', category: 'Liderazgo y Comunicación' },
    { name: 'Pensamiento de Diseño (Design Thinking)', category: 'Innovación y Creatividad' },
    { name: 'Creatividad Aplicada', category: 'Innovación y Creatividad' },
    { name: 'Resolución de Problemas Complejos', category: 'Innovación y Creatividad' },
];

export const LATINO_CHALLENGES = [
  {
    category: "Economía y Desarrollo",
    challenges: [
      "Reducción de la desigualdad económica y social.",
      "Fomento de la innovación y el emprendimiento tecnológico (startups).",
      "Diversificación de las economías más allá de las materias primas.",
      "Integración económica regional y fortalecimiento de bloques comerciales.",
      "Formalización de la economía informal.",
      "Mejora de la infraestructura física (transporte, energía, telecomunicaciones).",
      "Aumento de la productividad y competitividad industrial.",
    ]
  },
  {
    category: "Política y Gobernanza",
    challenges: [
        "Fortalecimiento de la democracia y las instituciones.",
        "Lucha contra la corrupción y la impunidad.",
        "Garantizar la seguridad ciudadana y reducir la violencia.",
        "Reforma de los sistemas de justicia para mayor eficiencia y acceso.",
        "Modernización del estado y la administración pública.",
        "Protección de los derechos humanos y de las minorías.",
        "Gestión de crisis migratorias y de refugiados.",
    ]
  },
  {
    category: "Sociedad y Cultura",
    challenges: [
        "Mejora de la calidad y el acceso a la educación en todos los niveles.",
        "Fortalecimiento de los sistemas de salud pública.",
        "Reducción de la brecha digital y fomento de la alfabetización digital.",
        "Promoción de la igualdad de género y empoderamiento de la mujer.",
        "Preservación del patrimonio cultural y la diversidad.",
        "Combate a la desinformación y las noticias falsas.",
        "Fomento de la cohesión social y la confianza cívica.",
    ]
  },
    {
    category: "Medio Ambiente y Sostenibilidad",
    challenges: [
        "Protección de la Amazonía y otros ecosistemas vitales.",
        "Transición hacia energías limpias y renovables.",
        "Gestión sostenible del agua y los recursos hídricos.",
        "Adaptación al cambio climático y mitigación de sus efectos.",
        "Desarrollo de ciudades sostenibles y resilientes.",
        "Lucha contra la deforestación y la pérdida de biodiversidad.",
        "Manejo de residuos y promoción de la economía circular.",
    ]
  }
];
