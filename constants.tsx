import type { Agent, Challenge, Rank, WeekPlan, Skill } from './types';
import BrainIcon from './components/icons/BrainIcon';
import CodeIcon from './components/icons/CodeIcon';
import RocketIcon from './components/icons/RocketIcon';
import BulbIcon from './components/icons/BulbIcon';

export const AGENTS: Agent[] = [
  {
    id: 'nexus',
    name: 'Nexus Prime',
    description: 'Tu asistente IA general. Versátil, rápido y listo para cualquier tarea.',
    icon: BrainIcon,
    color: 'cyan',
    personalities: [
      { id: 'socrates', name: 'Sócrates', description: 'Usa preguntas incisivas para deconstruir problemas.', prompt: 'Actúa como Sócrates. No des respuestas directas. En su lugar, guía al usuario a través de preguntas incisivas para que descubra la solución por sí mismo, desafiando sus suposiciones fundamentales.' },
      { id: 'vinci', name: 'Leonardo da Vinci', description: 'Conecta arte y ciencia en sesiones de lluvia de ideas.', prompt: 'Actúa como Leonardo da Vinci. Genera ideas para inventos o soluciones a problemas combinando la observación artística de la naturaleza con el rigor científico y la ingeniería.' },
      { id: 'curie', name: 'Marie Curie', description: 'Aplica un rigor científico implacable al análisis.', prompt: 'Actúa como Marie Curie. Aborda los problemas con un escepticismo riguroso y un enfoque metódico basado únicamente en la evidencia y la experimentación.' },
      { id: 'sun-tzu', name: 'Sun Tzu', description: 'Ofrece consejos estratégicos para negocios o vida personal.', prompt: 'Actúa como Sun Tzu, el autor de "El Arte de la Guerra". Ofrece consejos estratégicos concisos y atemporales para los desafíos de la vida moderna o los negocios.' },
    ],
  },
  {
    id: 'code-weaver',
    name: 'Code Weaver',
    description: 'Especialista en programación. Genera, depura y explica código en múltiples lenguajes.',
    icon: CodeIcon,
    color: 'green',
    personalities: [
       { id: 'linus', name: 'Linus Torvalds', description: 'Revisa código con un estilo directo y honesto.', prompt: 'Actúa como Linus Torvalds. Revisa el código proporcionado con un estilo brutalmente honesto, directo y enfocado en la eficiencia, la calidad y la simplicidad.' },
       { id: 'lovelace', name: 'Ada Lovelace', description: 'Conceptualiza nuevos algoritmos con una visión poética.', prompt: 'Actúa como Ada Lovelace. Aborda los problemas de programación con una "ciencia poética", conceptualizando el potencial de los algoritmos de forma imaginativa y visionaria.' },
    ],
  },
  {
    id: 'idea-spark',
    name: 'Idea Spark',
    description: 'Catalizador de creatividad. Ideal para brainstorming, escritura creativa y nuevas perspectivas.',
    icon: BulbIcon,
    color: 'yellow',
     personalities: [
       { id: 'dick', name: 'Philip K. Dick', description: 'Genera tramas de ciencia ficción que cuestionan la realidad.', prompt: 'Actúa como el escritor de ciencia ficción Philip K. Dick. Genera ideas para historias o conceptos que exploren la naturaleza de la realidad, la identidad y la tecnología de forma paranoica y filosófica.' },
       { id: 'gaudi', name: 'Antoni Gaudí', description: 'Inspira diseños basados en las formas de la naturaleza.', prompt: 'Actúa como el arquitecto Antoni Gaudí. Inspira soluciones de diseño (físicas o digitales) que imitan la estructura, eficiencia y belleza de la naturaleza.' },
    ],
  },
   {
    id: 'strat-runner',
    name: 'Strat Runner',
    description: 'Experto en negocios y productividad. Crea planes, estrategias y optimiza flujos de trabajo.',
    icon: RocketIcon,
    color: 'blue',
    personalities: [
        { id: 'musk', name: 'Elon Musk', description: 'Propone objetivos audaces y planes de "primeros principios".', prompt: 'Actúa como Elon Musk. Aborda los problemas de negocio o los objetivos utilizando el pensamiento de "primeros principios" para proponer soluciones ambiciosas, no convencionales y con un sentido de urgencia extremo.' },
        { id: 'drucker', name: 'Peter Drucker', description: 'Analiza problemas de gestión y ofrece soluciones atemporales.', prompt: 'Actúa como Peter Drucker, el padre de la gestión moderna. Ofrece consejos de gestión claros, efectivos y éticos para los desafíos empresariales.' },
    ],
  },
];


export const INITIAL_CHALLENGES: Challenge[] = [
  { id: 'mente-1', title: 'Planifica tu semana', description: 'Pide a un agente que te ayude a crear un horario para los próximos 7 días.', xp: 50, category: 'Mente', isCompleted: false },
  { id: 'mente-2', title: 'Aprende un concepto nuevo', description: 'Pide a Nexus Prime que te explique la computación cuántica.', xp: 75, category: 'Mente', isCompleted: false },
  { id: 'mente-3', title: 'Genera una Odisea', description: 'Usa el Generador de Odiseas para trazar un plan de aprendizaje sobre IA.', xp: 100, category: 'Mente', isCompleted: false },
  { id: 'cuerpo-1', title: 'Rutina de ejercicio', description: 'Pide a Strat Runner un plan de ejercicios de 15 minutos para hacer en casa.', xp: 50, category: 'Cuerpo', isCompleted: false },
  { id: 'espiritu-1', title: 'Ejercicio de gratitud', description: 'Enumera 3 cosas por las que estás agradecido hoy y compártelas.', xp: 50, category: 'Espíritu', isCompleted: false },
];


export const USER_RANKS: Rank[] = [
    { name: "Neófito Neural", minXp: 0, icon: "🌱" },
    { name: "Aprendiz de Silicio", minXp: 100, icon: "💡" },
    { name: "Adepto Analítico", minXp: 250, icon: "🧠" },
    { name: "Virtuoso Vectorial", minXp: 500, icon: "✨" },
    { name: "Maestro de Modelos", minXp: 1000, icon: "🏆" },
    { name: "Sapiens Sintético", minXp: 2000, icon: "🌟" }
];

export const ACCELERATOR_PROGRAM: WeekPlan[] = [
    { week: 1, title: 'Fundamentos del Innovador', focus: 'Mindset y Pensamiento Exponencial', challenge: 'Deconstruye un objeto cotidiano usando Primeros Principios y rediséñalo.' },
    { week: 2, title: 'El Arte de la Pregunta', focus: 'Deconstrucción Socrática de Problemas', challenge: 'Toma un problema complejo actual y desglósalo en 5 niveles de "por qué".' },
    { week: 3, title: 'Comunicación de Alto Impacto', focus: 'Narrativa Estratégica y Storytelling', challenge: 'Crea un "pitch" de 1 minuto para una idea usando la estructura de Pixar.' },
    { week: 4, title: 'De la Idea al Prototipo', focus: 'Metodología Lean y Prototipado Rápido', challenge: 'Diseña el MVP para una nueva app, definiendo su única función central.' },
    { week: 5, title: 'Validación en el Mundo Real', focus: 'Estrategias de Validación de Mercado sin Presupuesto', challenge: 'Crea un plan de 5 pasos para validar la necesidad de tu MVP.' },
    { week: 6, title: 'Introducción al Liderazgo', focus: 'Principios de Influencia y Feedback Constructivo', challenge: 'Simula una conversación de feedback difícil con un Súper Agente.' },
    { week: 7, title: 'Liderazgo Resonante', focus: 'Inteligencia Emocional Aplicada', challenge: 'Analiza un caso de estudio de liderazgo y propón una intervención emocionalmente inteligente.' },
    { week: 8, title: 'Dominio de Datos e Insights', focus: 'Pensamiento Analítico y Toma de Decisiones Basada en Datos', challenge: 'A partir de un conjunto de datos, identifica 3 tendencias y una recomendación de negocio.' },
    { week: 9, title: 'Sistemas y Escalabilidad', focus: 'Pensamiento Sistémico para el Crecimiento', challenge: 'Diseña un sistema simple para automatizar una tarea repetitiva en tu vida.' },
    { week: 10, title: 'Tecnologías Exponenciales', focus: 'Comprensión Práctica de la IA Generativa', challenge: 'Propón una aplicación novedosa de la IA para resolver un problema en tu comunidad.' },
    { week: 11, title: 'El Proyecto Capstone', focus: 'Integración de Habilidades en un Proyecto Real', challenge: 'Define y estructura tu proyecto final, integrando al menos 3 habilidades clave.' },
    { week: 12, title: 'Presentación Final', focus: 'Comunicar tu Visión y Valor', challenge: 'Presenta tu Proyecto Capstone a un Súper Agente para recibir feedback final.' },
];

export const ACCELERATOR_SKILLS: Skill[] = [
    { name: 'Pensamiento de Primeros Principios', category: 'Pensamiento Estratégico' },
    { name: 'Deconstrucción Socrática', category: 'Pensamiento Estratégico' },
    { name: 'Pensamiento Sistémico', category: 'Pensamiento Estratégico' },
    { name: 'Narrativa de Influencia', category: 'Liderazgo y Comunicación' },
    { name: 'Feedback Constructivo', category: 'Liderazgo y Comunicación' },
    { name: 'Liderazgo Resonante', category: 'Liderazgo y Comunicación' },
    { name: 'Lluvia de Ideas Divergente', category: 'Innovación y Creatividad' },
    { name: 'Prototipado Rápido', category: 'Innovación y Creatividad' },
    { name: 'Validación de Mercado Lean', category: 'Innovación y Creatividad' },
];