
import type React from 'react';

export interface Message {
  id: number | string;
  text: string;
  sender: 'user' | 'agent';
}

export interface Personality {
  id: string;
  name: string;
  description: string;
  prompt: string;
}

export interface Agent {
  id: string;
  name: string;
  description: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  color: string;
  personalities: Personality[];
}

export interface Challenge {
    id: string;
    title: string;
    description: string;
    xp: number;
    category: 'Mente' | 'Cuerpo' | 'Espíritu';
    isCompleted: boolean;
}

export interface Odyssey {
  id: string;
  title: string;
  description: string;
  steps: {
    title: string;
    completed: boolean;
  }[];
}

export interface Rank {
    name: string;
    minXp: number;
    icon: string;
}

export interface WeekPlan {
  week: number;
  title: string;
  focus: string;
  challenge: string;
}

export interface Skill {
  name: string;
  category: 'Pensamiento Estratégico' | 'Innovación y Creatividad' | 'Liderazgo y Comunicación';
}
// FIX: Add LatinoChallengeCategory interface to resolve module export error.
export interface LatinoChallengeCategory {
  category: string;
  challenges: string[];
}
