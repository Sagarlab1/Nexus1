import React from 'react';
import type { Agent } from '../types';

interface FloatingChatButtonProps {
  agent: Agent;
  onClick: () => void;
}

const FloatingChatButton: React.FC<FloatingChatButtonProps> = ({ agent, onClick }) => {
  // A safelist or map is needed for dynamic Tailwind classes in production
  const colorClasses = {
    cyan: 'from-cyan-500 to-cyan-700 shadow-cyan-500/40 focus:ring-cyan-500/50',
    purple: 'from-purple-500 to-purple-700 shadow-purple-500/40 focus:ring-purple-500/50',
    yellow: 'from-yellow-500 to-yellow-700 shadow-yellow-500/40 focus:ring-yellow-500/50',
    pink: 'from-pink-500 to-pink-700 shadow-pink-500/40 focus:ring-pink-500/50',
  }
  
  return (
    <button
      onClick={onClick}
      className={`fixed bottom-8 right-8 z-40 w-16 h-16 rounded-full bg-gradient-to-br text-white shadow-2xl flex items-center justify-center transition-transform transform hover:scale-110 focus:outline-none focus:ring-4 ${colorClasses[agent.color] || colorClasses.cyan}`}
      title={`Hablar con ${agent.name}`}
      aria-label={`Abrir chat con ${agent.name}`}
    >
      <agent.icon className="w-8 h-8" />
    </button>
  );
};

export default FloatingChatButton;
