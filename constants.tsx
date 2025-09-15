import type { Agent, Rank, Skill, WeekPlan } from './types';
import BrainIcon from './components/icons/BrainIcon';
import CodeIcon from './components/icons/CodeIcon';
import BulbIcon from './components/icons/BulbIcon';
import TeamIcon from './components/icons/TeamIcon';

export const AGENTS: Agent[] = [
  {
    id: 'nexus',
    name: 'Nexus',
    description: 'Tu conector a la inteligencia colectiva.',
    icon: BrainIcon,
    color: 'cyan',
    personalities: [],
  },
  {
    id: 'strategos',
    name: 'Strategos',
    description: 'Analista experto en sistemas y estrategia.',
    icon: TeamIcon,
    color: 'yellow',
    personalities: [],
  },
  {
    id: 'kreator',
    name: 'Kreator',
    description: 'Generador de ideas y contenido innovador.',
    icon: BulbIcon,
    color: 'purple',
    personalities: [],
  },
    {
    id: 'code-weaver',
    name: 'Code Weaver',
    description: 'Asistente de programación y desarrollo.',
    icon: CodeIcon,
    color: 'green',
    personalities: [],
  },
];

export const RANKS: Rank[] = [
  { name: 'Neófito', minXp: 0, icon: '...' },
  { name: 'Iniciado', minXp: 100, icon: '...' },
  { name: 'Aprendiz', minXp: 250, icon: '...' },
  { name: 'Adepto', minXp: 500, icon: '...' },
  { name: 'Maestro', minXp: 1000, icon: '...' },
];

export const ACCELERATOR_SKILLS: Skill[] = [
  { name: 'Pensamiento de Primeros Principios', category: 'Pensamiento Estratégico' },
  { name: 'Modelos Mentales', category: 'Pensamiento Estratégico' },
  { name: 'Análisis de Sistemas Complejos', category: 'Pensamiento Estratégico' },
  { name: 'Toma de Decisiones Basada en Datos', category: 'Pensamiento Estratégico' },
  { name: 'Design Thinking', category: 'Innovación y Creatividad' },
  { name: 'Prototipado Rápido', category: 'Innovación y Creatividad' },
  { name: 'Creatividad Computacional', category: 'Innovación y Creatividad' },
  { name: 'Storytelling y Narrativa', category: 'Liderazgo y Comunicación' },
  { name: 'Comunicación Asertiva', category: 'Liderazgo y Comunicación' },
  { name: 'Liderazgo Adaptativo', category: 'Liderazgo y Comunicación' },
];

export const ACCELERATOR_PROGRAM: WeekPlan[] = [
    { week: 1, title: "Fundamentos del Pensamiento Acelerado", focus: "Modelos Mentales y Primeros Principios", challenge: "Deconstruir una creencia personal usando Primeros Principios." },
    { week: 2, title: "Análisis de Sistemas Complejos", focus: "Pensamiento Sistémico", challenge: "Mapear un sistema complejo de tu elección (ej. tu empresa, una industria)." },
    { week: 3, title: "Toma de Decisiones Cuantitativa", focus: "Estadística y Probabilidad Aplicada", challenge: "Analizar un conjunto de datos para tomar una decisión informada." },
    { week: 4, title: "Comunicación de Alto Impacto", focus: "Narrativa y Storytelling", challenge: "Crear una presentación de 5 minutos que narre una idea compleja." },
    { week: 5, title: "Introducción a la Innovación", focus: "Design Thinking", challenge: "Identificar un problema y generar 10 soluciones usando técnicas de Design Thinking." },
    { week: 6, title: "Prototipado y Experimentación", focus: "Metodología Lean Startup", challenge: "Crear un prototipo de baja fidelidad para una de tus soluciones." },
    { week: 7, title: "Liderazgo en la Era Digital", focus: "Liderazgo Adaptativo", challenge: "Resolver un caso de estudio sobre un dilema de liderazgo moderno." },
    { week: 8, title: "Productividad y Flujo", focus: "Gestión de la Energía y Enfoque Profundo", challenge: "Diseñar e implementar una semana de 'trabajo profundo' optimizada." },
    { week: 9, title: "Negociación y Persuasión", focus: "Psicología de la Influencia", challenge: "Participar en un role-play de negociación de alto riesgo." },
    { week: 10, title: "Creatividad Computacional", focus: "Introducción a la IA Generativa", challenge: "Usar una herramienta de IA para generar una pieza de arte, texto o código." },
    { week: 11, title: "Estrategia y Visión a Largo Plazo", focus: "Planificación de Escenarios", challenge: "Desarrollar tres posibles escenarios futuros para tu carrera o industria." },
    { week: 12, title: "Proyecto de Síntesis", focus: "Integración de Habilidades", challenge: "Presentar un proyecto final que aplique al menos 5 habilidades del acelerador a un problema real." },
];

export const LATINO_CHALLENGES = [
  {
    category: "Desarrollo Económico y Equidad",
    challenges: [
      "Reducción de la desigualdad de ingresos y la pobreza extrema.",
      "Formalización de la economía y el empleo.",
      "Diversificación de las economías más allá de las materias primas.",
      "Integración de la región en cadenas de valor globales de alta tecnología.",
      "Fomento del emprendimiento y la innovación como motores de crecimiento.",
    ],
  },
  {
    category: "Gobernanza, Instituciones y Seguridad",
    challenges: [
      "Fortalecimiento del estado de derecho y lucha contra la corrupción.",
      "Mejora de la seguridad ciudadana y reducción de la violencia.",
      "Modernización y digitalización del sector público.",
      "Garantizar la estabilidad política y la solidez democrática.",
      "Protección de los derechos humanos y las libertades fundamentales.",
    ],
  },
];
