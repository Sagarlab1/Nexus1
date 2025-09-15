import React from 'react';
// FIX: Added 'WeekPlan' and 'Skill' types to support new constants.
import type { Agent, Rank, WeekPlan, Skill } from '../types';
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

// FIX: Added 'ACCELERATOR_PROGRAM' to centralize constants and resolve import errors.
export const ACCELERATOR_PROGRAM: WeekPlan[] = [
    { week: 1, title: "Pensamiento Exponencial", focus: "Deconstruir problemas a sus fundamentos.", challenge: "Deconstruye un objeto cotidiano y rediseña 3 alternativas." },
    { week: 2, title: "Comunicación de Alto Impacto", focus: "Crear narrativas que inspiran acción.", challenge: "Crea un 'pitch' de 3 minutos para una causa social." },
];

// FIX: Added 'LATINO_CHALLENGES' to centralize constants and resolve import errors.
export const LATINO_CHALLENGES = [
    { category: 'Identidad y Cultura', challenges: ['Pérdida de lenguas indígenas.', 'Homogeneización cultural.'] },
    { category: 'Sociedad y Valores', challenges: ['Racismo interno.', 'Machismo y desigualdad.'] },
];

// FIX: Added 'ACCELERATOR_SKILLS' to centralize constants and resolve import errors.
export const ACCELERATOR_SKILLS: Skill[] = [
  { name: 'Pensamiento de Primeros Principios', category: 'Pensamiento Estratégico' },
  { name: 'Storytelling Persuasivo', category: 'Liderazgo y Comunicación' },
  { name: 'Síntesis de Información Compleja', category: 'Pensamiento Estratégico' },
  { name: 'Ideación y Brainstorming Estructurado', category: 'Innovación y Creatividad' },
  { name: 'Liderazgo Adaptativo', category: 'Liderazgo y Comunicación' },
  { name: 'Prototipado Rápido', category: 'Innovación y Creatividad' },
];
