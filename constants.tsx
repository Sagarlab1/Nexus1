import type { Agent, Rank, WeekPlan, Skill } from './types';

// Icons
import BrainIcon from './components/icons/BrainIcon';
import TeamIcon from './components/icons/TeamIcon';
import BulbIcon from './components/icons/BulbIcon';
import HeartMindIcon from './components/icons/HeartMindIcon';


export const AGENTS: Agent[] = [
  {
    id: 'stratego',
    name: 'Stratego',
    description: 'Analista de sistemas y estratega de negocios.',
    icon: BrainIcon,
    color: 'cyan',
    personalities: [],
  },
  {
    id: 'oraculo',
    name: 'Oráculo',
    description: 'Experto en creatividad, innovación y tendencias.',
    icon: BulbIcon,
    color: 'purple',
    personalities: [],
  },
  {
    id: 'mentor',
    name: 'Mentor',
    description: 'Coach de liderazgo y comunicación efectiva.',
    icon: TeamIcon,
    color: 'yellow',
    personalities: [],
  },
   {
    id: 'nexus',
    name: 'Nexus',
    description: 'IA central, uniendo todas las disciplinas.',
    icon: HeartMindIcon,
    color: 'pink',
    personalities: [],
  },
];

export const RANKS: Rank[] = [
  { name: 'Neófito', minXp: 0, icon: '🌱' },
  { name: 'Iniciado', minXp: 100, icon: '🔥' },
  { name: 'Adepto', minXp: 300, icon: '⚡️' },
  { name: 'Maestro', minXp: 700, icon: '🌟' },
  { name: 'Sapiens', minXp: 1500, icon: '🧠' },
];

export const ACCELERATOR_PROGRAM: WeekPlan[] = [
  { week: 1, title: 'Fundamentos del Pensamiento Exponencial', focus: 'Modelos Mentales y Metacognición', challenge: 'Analizar una creencia limitante personal usando 3 modelos mentales diferentes.' },
  { week: 2, title: 'Comunicación de Alto Impacto', focus: 'Storytelling y Oratoria Persuasiva', challenge: 'Crear un "elevator pitch" de 60 segundos sobre un proyecto personal y grabarlo.' },
  { week: 3, title: 'Principios de Innovación Disruptiva', focus: 'Design Thinking y Lean Startup', challenge: 'Identificar un problema cotidiano y prototipar una solución simple en papel.' },
  { week: 4, title: 'Liderazgo Adaptativo en la Incertidumbre', focus: 'Inteligencia Emocional y Gestión de Equipos', challenge: 'Realizar una "entrevista de empatía" con un colega para entender sus desafíos.' },
  { week: 5, title: 'Productividad y Enfoque Profundo', focus: 'Gestión de la Energía y Sistemas de Productividad', challenge: 'Diseñar y ejecutar un "bloque de trabajo profundo" de 90 minutos sin distracciones.' },
  { week: 6, title: 'Toma de Decisiones Complejas', focus: 'Heurísticas, Sesgos Cognitivos y Teoría de Juegos', challenge: 'Analizar una decisión importante reciente, identificando los sesgos que pudieron haber influido.' },
];

export const ACCELERATOR_SKILLS: Skill[] = [
    { name: 'Pensamiento de Primeros Principios', category: 'Pensamiento Estratégico' },
    { name: 'Análisis de Sistemas Complejos', category: 'Pensamiento Estratégico' },
    { name: 'Toma de Decisiones Basada en Datos', category: 'Pensamiento Estratégico' },
    { name: 'Síntesis y Abstracción', category: 'Innovación y Creatividad' },
    { name: 'Ideación y Brainstorming Estructurado', category: 'Innovación y Creatividad' },
    { name: 'Creación Rápida de Prototipos', category: 'Innovación y Creatividad' },
    { name: 'Comunicación Asertiva', category: 'Liderazgo y Comunicación' },
    { name: 'Negociación y Persuasión', category: 'Liderazgo y Comunicación' },
    { name: 'Inteligencia Emocional', category: 'Liderazgo y Comunicación' },
];

export const LATINO_CHALLENGES = [
    {
        category: 'Desarrollo Económico y Social',
        challenges: [
            "Reducción de la desigualdad y la pobreza.",
            "Transformación de las matrices productivas y diversificación económica.",
            "Mejora de la calidad y acceso a la educación.",
            "Fortalecimiento de los sistemas de salud pública.",
            "Formalización del empleo y mejora de las condiciones laborales.",
        ]
    },
    {
        category: 'Gobernanza, Instituciones y Seguridad',
        challenges: [
            "Lucha contra la corrupción y fortalecimiento de la transparencia.",
            "Mejora de la seguridad ciudadana y reducción de la violencia.",
            "Fortalecimiento del estado de derecho y la independencia judicial.",
            "Modernización del estado y eficiencia en la gestión pública.",
            "Crisis migratorias y desplazamiento forzado.",
        ]
    },
    {
        category: 'Sostenibilidad Ambiental y Cambio Climático',
        challenges: [
            "Protección de la biodiversidad y los ecosistemas estratégicos (Amazonía, etc.).",
            "Transición hacia energías limpias y renovables.",
            "Gestión sostenible del agua y los recursos hídricos.",
            "Adaptación al cambio climático y mitigación de sus efectos.",
            "Desarrollo de ciudades sostenibles y resilientes.",
        ]
    },
];
