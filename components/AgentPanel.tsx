import React from 'react';
import type { Agent, Personality, AgentColor } from '../types.ts';
import { useSound } from '../hooks/useSound.ts';
import StarIcon from './icons/StarIcon.tsx';

interface AgentPanelProps {
  agents: Agent[];
  activeAgent: Agent;
  onSelectAgent: (agent: Agent) => void;
  // Simplified for this version
  // activePersonalityId: string;
  // onSelectPersonality: (personalityId: string) => void;
  // isPremium: boolean;
}

const agentColorStyles: Record<AgentColor, { active: string; icon: string }> = {
  cyan: {
    active: 'bg-cyan-500/20 border-cyan-500 shadow-lg shadow-cyan-500/20',
    icon: 'text-cyan-400',
  },
  purple: {
    active: 'bg-purple-500/20 border-purple-500 shadow-lg shadow-purple-500/20',
    icon: 'text-purple-400',
  },
  yellow: {
    active: 'bg-yellow-500/20 border-yellow-500 shadow-lg shadow-yellow-500/20',
    icon: 'text-yellow-400',
  },
  pink: {
    active: 'bg-pink-500/20 border-pink-500 shadow-lg shadow-pink-500/20',
    icon: 'text-pink-400',
  },
};

const AgentPanel: React.FC<AgentPanelProps> = ({ 
  agents, 
  activeAgent, 
  onSelectAgent,
}) => {
  const playSound = useSound();

  const handleSelectAgent = (agent: Agent) => {
    onSelectAgent(agent);
    playSound('select');
  };

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-lg p-6 shadow-lg shadow-black/20">
      <h2 className="text-xl font-bold mb-1 text-white">Agentes IA</h2>
      <p className="text-sm text-cyan-400 font-mono mb-4">ELIGE TU ESPECIALISTA</p>
      <div className="space-y-3">
        {agents.map((agent) => {
            const styles = agentColorStyles[agent.color];
            return (
              <button
                key={agent.id}
                onClick={() => handleSelectAgent(agent)}
                className={`w-full flex items-center p-3 rounded-lg transition-all duration-200 border-2 ${
                  activeAgent.id === agent.id
                    ? styles.active
                    : 'bg-gray-800/50 border-transparent hover:bg-gray-700/70'
                }`}
              >
                <div className="mr-4">
                  <agent.icon
                    className={`w-8 h-8 ${
                      activeAgent.id === agent.id ? styles.icon : 'text-gray-400'
                    } transition-colors`}
                  />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-white">{agent.name}</p>
                  <p className="text-xs text-gray-400">{agent.description}</p>
                </div>
              </button>
            )
        })}
      </div>
    </div>
  );
};

export default AgentPanel;