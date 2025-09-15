import React from 'react';
import type { Agent, Rank, Challenge, Odyssey, WeekPlan, Skill } from './types';
import BrainIcon from './components/icons/BrainIcon';
import BulbIcon from './components/icons/BulbIcon';
import CodeIcon from './components/icons/CodeIcon';
import TeamIcon from './components/icons/TeamIcon';

export const AGENTS: Agent[] = [
  {
    id: 'strategos',
    name: 'Strategos',
    description: 'Analista de sistemas y estratega de IA.',
    icon: BrainIcon,
    color: 'blue',
    personalities: [
      { id: 'default', name: 'Default', description: 'Standard strategist persona.', prompt: 'Eres Strategos, un estratega de IA maestro. Analiza los problemas a fondo y proporciona soluciones estructuradas y lógicas. Tu objetivo es ayudar al usuario a pensar con más claridad y a tomar mejores decisiones.' },
    ],
  },
  {
    id: 'creator',
    name: 'Creator',
    description: 'Generador de ideas y conceptos creativos.',
    icon: BulbIcon,
    color: 'yellow',
    personalities: [
       { id: 'default', name: 'Default', description: 'Standard innovator persona.', prompt: 'Eres Creator, una IA creativa e innovadora. Genera ideas novedosas, piensa fuera de la caja y ayuda al usuario a desbloquear su potencial creativo en cualquier campo.' },
    ],
  },
  {
    id: 'mentor',
    name: 'Mentor',
    description: 'Coach de desarrollo personal y profesional.',
    icon: TeamIcon,
    color: 'green',
     personalities: [
      { id: 'default', name: 'Default', description: 'Standard mentor persona.', prompt: 'Eres Mentor, un coach de IA empático y solidario. Guía a los usuarios hacia sus metas con sabiduría, apoyo y ánimo. Tu tono es siempre constructivo y motivador.' },
    ],
  },
    {
    id: 'coder',
    name: 'Coder',
    description: 'Asistente para la creación de código y scripts.',
    icon: CodeIcon,
    color: 'purple',
    personalities: [
      { id: 'default', name: 'Default', description: 'Standard creator persona.', prompt: 'Eres Coder, un asistente experto en programación. Proporciona fragmentos de código, ejemplos útiles, depura errores y explica conceptos complejos de programación de forma sencilla.' },
    ],
  },
];

export const RANKS: Rank[] = [
    { name: 'Neófito Cognitivo', minXp: 0, icon: '...'},
    { name: 'Aprendiz Sintético', minXp: 100, icon: '...'},
    { name: 'Pensador Aumentado', minXp: 300, icon: '...'},
    { name: 'Arquitecto Neuronal', minXp: 600, icon: '...'},
    { name: 'Sintetizador de Realidad', minXp: 1000, icon: '...'},
    { name: 'Nexus Sapiens', minXp: 1500, icon: '...'},
];

export const INITIAL_CHALLENGES: Challenge[] = [
    { id: 'c1', title: 'Tu Primer Diálogo', description: 'Inicia una conversación con cualquier agente de IA.', xp: 10, category: 'Mente', isCompleted: false },
    { id: 'c2', title: 'Explora los Agentes', description: 'Habla con al menos 3 agentes diferentes.', xp: 20, category: 'Mente', isCompleted: false },
    { id: 'c3', title: 'Meditación Guiada', description: 'Pídele al Mentor que te guíe en una meditación de 5 minutos.', xp: 30, category: 'Espíritu', isCompleted: false },
    { id: 'c4', title: 'Plan de Ejercicio', description: 'Pídele al Mentor un plan de ejercicios para una semana.', xp: 30, category: 'Cuerpo', isCompleted: false },
];

export const INITIAL_ODYSSEYS: Odyssey[] = [
    {
        id: 'o1',
        title: 'El Despertar del Estratega',
        description: 'Domina los fundamentos del pensamiento crítico y la resolución de problemas con Strategos.',
        steps: [
            { title: 'Define un problema claramente', completed: false },
            { title: 'Analiza sus componentes', completed: false },
            { title: 'Genera 3 posibles soluciones', completed: false },
            { title: 'Evalúa pros y contras', completed: false },
            { title: 'Elige un plan de acción', completed: false },
        ]
    }
];

export const INITIAL_WEEK_PLAN: WeekPlan = {
    week: 1,
    title: 'Fundamentos de la Mente Aumentada',
    focus: 'Establecer una rutina de interacción y exploración con la IA para expandir el pensamiento.',
    challenge: 'Completa 3 desafíos iniciales y comienza tu primera Odisea.'
};

export const SKILLS: Skill[] = [
    { name: 'Análisis de Sistemas', category: 'Pensamiento Estratégico' },
    { name: 'Resolución de Problemas Complejos', category: 'Pensamiento Estratégico' },
    { name: 'Toma de Decisiones Basada en Datos', category: 'Pensamiento Estratégico' },
    { name: 'Brainstorming Divergente', category: 'Innovación y Creatividad' },
    { name: 'Prototipado Rápido de Ideas', category: 'Innovación y Creatividad' },
    { name: 'Comunicación Asertiva', category: 'Liderazgo y Comunicación' },
    { name: 'Feedback Constructivo', category: 'Liderazgo y Comunicación' },
];
