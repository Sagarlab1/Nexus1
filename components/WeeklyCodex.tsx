import React from 'react';
import type { WeekPlan } from '../types';
import DocumentIcon from './icons/DocumentIcon';

interface WeeklyCodexProps {
  weekPlan: WeekPlan | null;
}

const WeeklyCodex: React.FC<WeeklyCodexProps> = ({ weekPlan }) => {
  if (!weekPlan) {
    return null; 
  }

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-lg p-6 shadow-lg shadow-black/20 text-white">
      <div className="flex items-center mb-4">
        <DocumentIcon className="w-6 h-6 text-cyan-400 mr-3" />
        <div>
          <h3 className="font-bold text-lg">Códice Semanal</h3>
          <p className="text-sm text-cyan-400 font-mono">SEMANA {weekPlan.week}</p>
        </div>
      </div>
      <div className="space-y-4">
        <div>
            <p className="text-sm font-semibold text-gray-400 mb-1">Título:</p>
            <p>{weekPlan.title}</p>
        </div>
        <div>
            <p className="text-sm font-semibold text-gray-400 mb-1">Enfoque:</p>
            <p className="text-gray-300">{weekPlan.focus}</p>
        </div>
        <div>
            <p className="text-sm font-semibold text-gray-400 mb-1">Desafío Clave:</p>
            <p className="text-gray-300">{weekPlan.challenge}</p>
        </div>
      </div>
    </div>
  );
};

export default WeeklyCodex;
