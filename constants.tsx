// FIX: Create constants file to provide data to components
import type { Agent, Rank, Skill, WeekPlan } from './types';
import BrainIcon from './components/icons/BrainIcon';
import CodeIcon from './components/icons/CodeIcon';
import RocketIcon from './components/icons/RocketIcon';
import AnalysisIcon from './components/icons/AnalysisIcon';

export const AGENTS: Agent[] = [
  {
    id: 'stratego',
    name: 'Stratego',
    description: 'Experto en estrategia, sistemas y modelos mentales.',
    icon: BrainIcon,
    color: 'cyan',
    personalities: [],
  },
  {
    id: 'creon',
    name: 'Creon',
    description: 'Catalizador de ideas, experto en innovación y creatividad.',
    icon: RocketIcon,
    color: 'purple',
    personalities: [],
  },
  {
    id: 'nexus',
    name: 'Nexus',
    description: 'Asistente de desarrollo, experto en código y tecnología.',
    icon: CodeIcon,
    color: 'green',
    personalities: [],
  },
    {
    id: 'oraculo',
    name: 'Oráculo',
    description: 'Analista de datos y visualizador de futuros probables.',
    icon: AnalysisIcon,
    color: 'yellow',
    personalities: [],
  },
];

export const RANKS: Rank[] = [
    { name: 'Neófito Cognitivo', minXp: 0, icon: '...' },
    { name: 'Aprendiz Sintético', minXp: 100, icon: '...' },
    { name: 'Pensador Aumentado', minXp: 300, icon: '...' },
    { name: 'Arquitecto de Realidad', minXp: 700, icon: '...' },
    { name: 'Sapiens Nexus', minXp: 1500, icon: '...' },
];


export const ACCELERATOR_SKILLS: Skill[] = [
  { name: 'Pensamiento de Primeros Principios', category: 'Pensamiento Estratégico' },
  { name: 'Modelos Mentales', category: 'Pensamiento Estratégico' },
  { name: 'Teoría de Juegos', category: 'Pensamiento Estratégico' },
  { name: 'Design Thinking', category: 'Innovación y Creatividad' },
  { name: 'Creatividad Computacional', category: 'Innovación y Creatividad' },
  { name: 'Prospectiva Estratégica', category: 'Innovación y Creatividad' },
  { name: 'Comunicación Asertiva', category: 'Liderazgo y Comunicación' },
  { name: 'Liderazgo Adaptativo', category: 'Liderazgo y Comunicación' },
  { name: 'Narrativa y Storytelling', category: 'Liderazgo y Comunicación' },
];

export const ACCELERATOR_PROGRAM: WeekPlan[] = [
    { week: 1, title: "Fundamentos del Pensamiento Acelerado", focus: "Modelos Mentales y Primeros Principios", challenge: "Deconstruir una creencia personal usando Primeros Principios." },
    { week: 2, title: "El Arte de la Estrategia", focus: "Teoría de Juegos y Pensamiento Sistémico", challenge: "Mapear un sistema complejo (personal o profesional) e identificar puntos de apalancamiento." },
    { week: 3, title: "Navegando la Incertidumbre", focus: "Prospectiva Estratégica y Antifragilidad", challenge: "Diseñar un 'plan antifrágil' para un proyecto actual." },
    { week: 4, title: "Comunicación de Alto Impacto", focus: "Narrativa, Storytelling y Oratoria", challenge: "Crear un 'elevator pitch' de 1 minuto para una idea compleja." },
    { week: 5, title: "Máquinas de Creatividad", focus: "Design Thinking y Generación de Ideas", challenge: "Aplicar el ciclo de Design Thinking para resolver un problema cotidiano." },
    { week: 6, title: "Innovación Disruptiva", focus: "Estrategias de Océano Azul y Modelos de Negocio", challenge: "Idear una innovación que cree un nuevo mercado en tu industria." },
    { week: 7, title: "Liderazgo en la Era Exponencial", focus: "Liderazgo Adaptativo y Gestión del Cambio", challenge: "Liderar una pequeña iniciativa de cambio en tu entorno." },
    { week: 8, title: "Inteligencia Colectiva", focus: "Colaboración, Co-creación y Redes", challenge: "Organizar y facilitar una sesión de brainstorming efectiva." },
    { week: 9, title: "Biohacking y Rendimiento Cognitivo", focus: "Neurociencia, Nutrición y Flujo", challenge: "Implementar un nuevo hábito para optimizar tu energía mental." },
    { week: 10, title: "Filosofía Práctica y Ética", focus: "Estoicismo, Efectivismo y Toma de Decisiones", challenge: "Aplicar un marco ético para resolver un dilema complejo." },
    { week: 11, title: "Construyendo el Futuro", focus: "Tecnologías Exponenciales y Visión a Largo Plazo", challenge: "Desarrollar un 'manifiesto personal' para tu futuro deseado." },
    { week: 12, title: "Proyecto Sapiens: Síntesis Final", focus: "Integración de Habilidades y Presentación", challenge: "Presentar un proyecto que demuestre el dominio de 3 habilidades clave del programa." },
];

export const LATINO_CHALLENGES = [
    {
        category: "Desarrollo Económico y Social",
        challenges: [
            "Reducción de la desigualdad y la pobreza extrema.",
            "Transformación de las matrices productivas hacia la economía del conocimiento.",
            "Formalización de la economía y el empleo.",
            "Mejora de la calidad y cobertura de la educación pública.",
            "Fortalecimiento de los sistemas de salud y acceso universal.",
            "Solución al déficit de vivienda y urbanización sostenible.",
            "Integración económica regional y cadenas de valor.",
        ],
    },
    {
        category: "Gobernanza y Estado de Derecho",
        challenges: [
            "Lucha contra la corrupción y fortalecimiento de la transparencia.",
            "Fortalecimiento de las instituciones democráticas y el Estado de Derecho.",
            "Garantía de la seguridad ciudadana y reducción de la violencia.",
            "Reforma de los sistemas de justicia para mayor eficiencia y acceso.",
            "Protección de los derechos humanos y de las minorías.",
        ],
    },
    {
        category: "Sostenibilidad y Medio Ambiente",
        challenges: [
            "Adaptación y mitigación del cambio climático.",
            "Protección de la biodiversidad y los ecosistemas estratégicos (Amazonía, etc.).",
            "Gestión sostenible del agua y los recursos hídricos.",
            "Transición hacia energías limpias y renovables.",
            "Desarrollo de una economía circular y gestión de residuos.",
        ],
    },
];
