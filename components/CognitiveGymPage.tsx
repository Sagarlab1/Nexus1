import React, { useState } from 'react';
import SkillTree from './SkillTree.tsx';
import type { SkillBranch, AgentColor } from '../types.ts';
import DumbbellIcon from './icons/DumbbellIcon.tsx';
import BrainIcon from './icons/BrainIcon.tsx';
import BulbIcon from './icons/BulbIcon.tsx';
import RocketIcon from './icons/RocketIcon.tsx';
import CodeIcon from './icons/CodeIcon.tsx';

const skillTreeData: Record<string, SkillBranch> = {
  critical_thinking: {
    id: 'critical_thinking',
    name: 'Pensamiento Crítico',
    color: '#22d3ee', // cyan
    nodes: [
      { id: 'ct1', label: 'Fundamentos', description: 'Comprende los principios básicos del pensamiento crítico.', x: 100, y: 250, state: 'completed' },
      { id: 'ct2', label: 'Detección de Sesgos', description: 'Identifica y mitiga los sesgos cognitivos comunes.', x: 250, y: 150, state: 'completed' },
      { id: 'ct3', label: 'Argumentación', description: 'Construye y deconstruye argumentos de manera efectiva.', x: 250, y: 350, state: 'unlocked' },
      { id: 'ct4', label: 'Lógica Formal', description: 'Aplica los principios de la lógica para validar argumentos.', x: 400, y: 150, state: 'locked' },
      { id: 'ct5', label: 'Resolución de Problemas', description: 'Aplica un enfoque estructurado para resolver problemas complejos.', x: 400, y: 350, state: 'locked' },
      { id: 'ct6', label: 'Modelos Mentales', description: 'Utiliza diversos modelos mentales para entender el mundo.', x: 550, y: 250, state: 'locked' },
      { id: 'ct7', label: 'Maestría Socrática', description: 'Domina el arte de la pregunta para alcanzar la verdad.', x: 700, y: 250, state: 'locked' },
    ],
    edges: [
      { from: 'ct1', to: 'ct2' },
      { from: 'ct1', to: 'ct3' },
      { from: 'ct2', to: 'ct4' },
      { from: 'ct3', to: 'ct5' },
      { from: 'ct4', to: 'ct6' },
      { from: 'ct5', to: 'ct6' },
      { from: 'ct6', to: 'ct7' },
    ]
  },
  creativity: {
    id: 'creativity',
    name: 'Creatividad',
    color: '#a855f7', // purple
    nodes: [
      { id: 'cr1', label: 'Fundamentos', description: 'Desbloquea tu potencial creativo innato.', x: 100, y: 250, state: 'completed' },
      { id: 'cr2', label: 'Pensamiento Divergente', description: 'Genera una multitud de ideas sin juicio.', x: 250, y: 150, state: 'unlocked' },
      { id: 'cr3', label: 'Pensamiento Convergente', description: 'Selecciona y refina las mejores ideas.', x: 250, y: 350, state: 'unlocked' },
      { id: 'cr4', label: 'Técnicas de Ideación', description: 'Domina herramientas como SCAMPER y Brainstorming.', x: 400, y: 150, state: 'locked' },
      { id: 'cr5', label: 'Conexión de Ideas', description: 'Crea innovación conectando conceptos dispares.', x: 400, y: 350, state: 'locked' },
      { id: 'cr6', label: 'Innovación Disruptiva', description: 'Desarrolla ideas que cambian el paradigma.', x: 550, y: 250, state: 'locked' },
    ],
    edges: [
      { from: 'cr1', to: 'cr2' },
      { from: 'cr1', to: 'cr3' },
      { from: 'cr2', to: 'cr4' },
      { from: 'cr3', to: 'cr5' },
      { from: 'cr4', to: 'cr6' },
      { from: 'cr5', to: 'cr6' },
    ]
  },
  entrepreneurship: {
    id: 'entrepreneurship',
    name: 'Emprendimiento',
    color: '#eab308', // yellow
    nodes: [
        { id: 'en1', label: 'Mentalidad', description: 'Adopta la mentalidad de un emprendedor.', x: 100, y: 250, state: 'completed' },
        { id: 'en2', label: 'Ideación', description: 'Encuentra y valida problemas que valga la pena resolver.', x: 250, y: 150, state: 'unlocked' },
        { id: 'en3', label: 'Modelo de Negocio', description: 'Diseña un modelo de negocio sostenible.', x: 250, y: 350, state: 'locked' },
        { id: 'en4', label: 'MVP', description: 'Construye un Producto Mínimo Viable para aprender.', x: 400, y: 150, state: 'locked' },
        { id: 'en5', label: 'Marketing', description: 'Llega a tus primeros clientes.', x: 400, y: 350, state: 'locked' },
        { id: 'en6', label: 'Escalamiento', description: 'Crece tu negocio de manera sostenible.', x: 550, y: 250, state: 'locked' },
    ],
    edges: [
        { from: 'en1', to: 'en2' },
        { from: 'en1', to: 'en3' },
        { from: 'en2', to: 'en4' },
        { from: 'en3', to: 'en5' },
        { from: 'en4', to: 'en6' },
        { from: 'en5', to: 'en6' },
    ]
  },
  gen_ai: {
    id: 'gen_ai',
    name: 'IA Generativa',
    color: '#ec4899', // pink
    nodes: [
        { id: 'ai1', label: 'Fundamentos', description: 'Comprende qué son los LLMs y cómo funcionan.', x: 100, y: 250, state: 'completed' },
        { id: 'ai2', label: 'Prompt Engineering', description: 'Domina el arte de comunicarte con la IA.', x: 250, y: 250, state: 'unlocked' },
        { id: 'ai3', label: 'Modelos Multimodales', description: 'Trabaja con texto, imágenes y más.', x: 400, y: 150, state: 'locked' },
        { id: 'ai4', label: 'Fine-Tuning', description: 'Adapta modelos pre-entrenados a tus necesidades.', x: 400, y: 350, state: 'locked' },
        { id: 'ai5', label: 'Agentes IA', description: 'Construye sistemas autónomos que realizan tareas.', x: 550, y: 250, state: 'locked' },
        { id: 'ai6', label: 'Ética y Seguridad', description: 'Comprende los riesgos y cómo mitigarlos.', x: 700, y: 250, state: 'locked' },
    ],
    edges: [
        { from: 'ai1', to: 'ai2' },
        { from: 'ai2', to: 'ai3' },
        { from: 'ai2', to: 'ai4' },
        { from: 'ai3', to: 'ai5' },
        { from: 'ai4', to: 'ai5' },
        { from: 'ai5', to: 'ai6' },
    ]
  },
};

const TABS = [
    { id: 'critical_thinking', name: 'P. Crítico', icon: BrainIcon, color: 'cyan' as AgentColor },
    { id: 'creativity', name: 'Creatividad', icon: BulbIcon, color: 'purple' as AgentColor },
    { id: 'entrepreneurship', name: 'Emprendimiento', icon: RocketIcon, color: 'yellow' as AgentColor },
    { id: 'gen_ai', name: 'IA Generativa', icon: CodeIcon, color: 'pink' as AgentColor },
];

const tabStyles: Record<AgentColor, { active: string; icon: string }> = {
    cyan: {
        active: 'bg-cyan-500/20 border-cyan-500 text-white',
        icon: 'text-cyan-400',
    },
    purple: {
        active: 'bg-purple-500/20 border-purple-500 text-white',
        icon: 'text-purple-400',
    },
    yellow: {
        active: 'bg-yellow-500/20 border-yellow-500 text-white',
        icon: 'text-yellow-400',
    },
    pink: {
        active: 'bg-pink-500/20 border-pink-500 text-white',
        icon: 'text-pink-400',
    },
};

const CognitiveGymPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<string>('critical_thinking');
    const activeBranch = skillTreeData[activeTab];

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-lg shadow-lg shadow-black/20 h-full flex flex-col p-6 overflow-hidden">
        <div className="text-center mb-6 flex-shrink-0">
            <div className="inline-block p-3 bg-pink-500/10 rounded-full mb-3">
                <DumbbellIcon className="w-10 h-10 text-pink-400" />
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tighter text-white">Gimnasio Cognitivo</h1>
            <p className="max-w-2xl mx-auto text-md text-gray-400 mt-2">
                Tu árbol de competencias interactivo. Desbloquea nodos, visualiza tu progreso y elige tu camino hacia la maestría.
            </p>
        </div>

        <div className="mb-6 flex justify-center gap-2 md:gap-4 flex-wrap flex-shrink-0">
            {TABS.map(tab => {
                const styles = tabStyles[tab.color];
                return (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all border-2 ${
                            activeTab === tab.id
                            ? styles.active
                            : 'bg-gray-800/50 border-transparent hover:bg-gray-700 text-gray-300'
                        }`}
                    >
                        <tab.icon className={`w-5 h-5 ${styles.icon}`} />
                        {tab.name}
                    </button>
                )
            })}
        </div>

        <div className="flex-1 min-h-0">
             {activeBranch ? (
                <SkillTree branch={activeBranch} />
             ) : (
                <div className="w-full h-full flex items-center justify-center">
                    <p className="text-gray-500">Selecciona una rama de habilidad para comenzar.</p>
                </div>
             )}
        </div>
    </div>
  );
};

export default CognitiveGymPage;