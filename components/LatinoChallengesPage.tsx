import React from 'react';
import type { Challenge } from '../types';
import BrainIcon from './icons/BrainIcon';
import RocketIcon from './icons/RocketIcon';
import HeartMindIcon from './icons/HeartMindIcon';

interface ChallengesPageProps {
  challenges: Challenge[];
  onCompleteChallenge: (challengeId: string, xp: number) => void;
}

const categoryIcons = {
  'Mente': BrainIcon,
  'Cuerpo': RocketIcon,
  'Espíritu': HeartMindIcon,
};

const categoryColors = {
  'Mente': 'text-blue-400',
  'Cuerpo': 'text-green-400',
  'Espíritu': 'text-purple-400',
}

const LatinoChallengesPage: React.FC<ChallengesPageProps> = ({ challenges, onCompleteChallenge }) => {
  const groupedChallenges = challenges.reduce((acc, challenge) => {
    (acc[challenge.category] = acc[challenge.category] || []).push(challenge);
    return acc;
  }, {} as Record<Challenge['category'], Challenge[]>);

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-lg shadow-lg shadow-black/20 flex flex-col h-[calc(100vh-8rem)] md:h-[calc(100vh-4.5rem)]">
      <div className="p-6 border-b border-gray-700/50">
        <h1 className="text-2xl font-bold text-white">Desafíos de Evolución (Latino)</h1>
        <p className="text-cyan-400 font-mono">PONTE A PRUEBA Y GANA XP</p>
      </div>
      <div className="flex-1 p-6 overflow-y-auto space-y-8">
        {Object.entries(groupedChallenges).map(([category, challengesInCategory]) => {
          const CategoryIcon = categoryIcons[category as Challenge['category']];
          const colorClass = categoryColors[category as Challenge['category']];
          return (
            <div key={category}>
              <div className="flex items-center gap-3 mb-4">
                <CategoryIcon className={`w-6 h-6 ${colorClass}`} />
                <h2 className={`text-xl font-bold ${colorClass}`}>{category}</h2>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {challengesInCategory.map((challenge) => (
                  <div key={challenge.id} className={`bg-gray-800/60 p-4 rounded-lg border border-gray-700 transition-all ${challenge.isCompleted ? 'opacity-50' : ''}`}>
                    <h3 className="font-semibold text-white">{challenge.title}</h3>
                    <p className="text-sm text-gray-400 mt-1 mb-3">{challenge.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-yellow-400 font-bold text-sm">+{challenge.xp} XP</span>
                      <button
                        onClick={() => onCompleteChallenge(challenge.id, challenge.xp)}
                        disabled={challenge.isCompleted}
                        className="bg-cyan-600 hover:bg-cyan-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white text-xs font-bold py-1.5 px-3 rounded-md transition-colors"
                      >
                        {challenge.isCompleted ? 'Completado' : 'Completar'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LatinoChallengesPage;
