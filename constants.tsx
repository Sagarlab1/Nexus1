import type { Agent } from './types';

// Icons
import BrainIcon from './components/icons/BrainIcon';
import BulbIcon from './components/icons/BulbIcon';
import RocketIcon from './components/icons/RocketIcon';
import CodeIcon from './components/icons/CodeIcon';


export const AGENTS: Agent[] = [
  {
    id: 'critical_thinking',
    name: 'Pensamiento Crítico',
    description: 'Agente de Pensamiento Crítico',
    icon: BrainIcon,
    color: 'cyan',
    personalities: [],
  },
  {
    id: 'creativity',
    name: 'Creatividad',
    description: 'Agente de Creatividad',
    icon: BulbIcon,
    color: 'purple',
    personalities: [],
  },
  {
    id: 'entrepreneurship',
    name: 'Emprendimiento',
    description: 'Agente de Emprendimiento',
    icon: RocketIcon,
    color: 'yellow',
    personalities: [],
  },
   {
    id: 'gen_ai',
    name: 'IA Generativa',
    description: 'Agente de IA Generativa',
    icon: CodeIcon,
    color: 'pink',
    personalities: [],
  },
];
