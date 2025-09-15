import React from 'react';
import type { Agent, Personality } from '../types';
import { useSound } from '../hooks/useSound';
import StarIcon from './icons/StarIcon';

interface AgentPanelProps {
  agents: Agent[];
  activeAgent: Agent;
  onSelectAgent: (agent: Agent) => void;
  // Simplified for this version
  // activePersonalityId: string;
  // onSelectPersonality: (personalityId: string) => void;
  // isPremium: boolean;
}

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
        {agents.map((agent) => (
          <button
            key={agent.id}
            onClick={() => handleSelectAgent(agent)}
            className={`w-full flex items-center p-3 rounded-lg transition-all duration-200 border-2 ${
              activeAgent.id === agent.id
                ? `bg-${agent.color}-500/20 border-${agent.color}-500 shadow-lg shadow-${agent.color}-500/20`
                : 'bg-gray-800/50 border-transparent hover:bg-gray-700/70'
            }`}
          >
            <div className="mr-4">
              <agent.icon
                className={`w-8 h-8 ${
                  activeAgent.id === agent.id ? `text-${agent.color}-400` : 'text-gray-400'
                } transition-colors`}
              />
            </div>
            <div className="text-left">
              <p className="font-semibold text-white">{agent.name}</p>
              <p className="text-xs text-gray-400">{agent.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default AgentPanel;