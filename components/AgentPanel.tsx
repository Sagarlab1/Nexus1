import React from 'react';
import type { Agent, Personality } from '../types';
import { useSound } from '../hooks/useSound';
import StarIcon from './icons/StarIcon';

interface AgentPanelProps {
  agents: Agent[];
  activeAgent: Agent;
  onSelectAgent: (agent: Agent) => void;
  activePersonalityId: string;
  onSelectPersonality: (personalityId: string) => void;
  isPremium: boolean;
}

const AgentPanel: React.FC<AgentPanelProps> = ({ 
  agents, 
  activeAgent, 
  onSelectAgent,
  activePersonalityId,
  onSelectPersonality,
  isPremium 
}) => {
  const playSound = useSound();

  const handleSelectAgent = (agent: Agent) => {
    onSelectAgent(agent);
    playSound('select');
  };
  
  const handleSelectPersonality = (personalityId: string) => {
    onSelectPersonality(personalityId);
    playSound('select');
  }

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
                ? 'bg-cyan-500/20 border-cyan-500 shadow-lg shadow-cyan-500/20'
                : 'bg-gray-800/50 border-transparent hover:bg-gray-700/70'
            }`}
          >
            <div className="mr-4">
              <agent.icon
                className={`w-8 h-8 ${
                  activeAgent.id === agent.id ? 'text-cyan-400' : 'text-gray-400'
                } transition-colors`}
              />
            </div>
            <div className="text-left">
              <p className="font-semibold text-white">{agent.name}</p>
            </div>
          </button>
        ))}
      </div>
      
      {isPremium && (
        <div className="mt-6 pt-6 border-t border-gray-700/50">
          <h3 className="text-lg font-bold mb-1 text-white">Academia de Genios</h3>
          <p className="text-sm text-yellow-400 font-mono mb-4">INVOCA A UN MAESTRO</p>
          <div className="grid grid-cols-2 gap-2">
            {activeAgent.personalities.map(p => (
              <button
                key={p.id}
                onClick={() => handleSelectPersonality(p.id)}
                className={`text-left p-3 rounded-lg transition-all duration-200 border ${
                  activePersonalityId === p.id 
                    ? 'bg-yellow-500/20 border-yellow-500' 
                    : 'bg-gray-800/50 border-gray-700 hover:bg-gray-700/70'
                }`}
              >
                <p className={`font-semibold text-sm ${activePersonalityId === p.id ? 'text-yellow-400' : 'text-white'}`}>{p.name}</p>
                <p className="text-xs text-gray-400 mt-1">{p.description}</p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentPanel;