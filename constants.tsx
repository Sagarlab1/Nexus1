import type { Agent } from './types';

// Icons
import BrainIcon from './components/icons/BrainIcon';
import BulbIcon from './components/icons/BulbIcon';
import RocketIcon from './components/icons/RocketIcon';
import CodeIcon from './components/icons/CodeIcon';


export const AGENTS: Agent[] = [
  {
    id: 'critical_thinking',
    name: 'Stratego',
    description: 'Analista de Sistemas y Estratega de Negocios.',
    icon: BrainIcon,
    color: 'cyan',
    personalities: [],
  },
  {
    id: 'creativity',
    name: 'Innova',
    description: 'Catalizador de Creatividad e Innovación Disruptiva.',
    icon: BulbIcon,
    color: 'purple',
    personalities: [],
  },
  {
    id: 'entrepreneurship',
    name: 'Nexus',
    description: 'Coach de Liderazgo y Desarrollo Personal.',
    icon: RocketIcon,
    color: 'yellow',
    personalities: [],
  },
   {
    id: 'gen_ai',
    name: 'Oraculo',
    description: 'Especialista en IA Generativa y Fronteras Tecnológicas.',
    icon: CodeIcon,
    color: 'pink',
    personalities: [],
  },
];
