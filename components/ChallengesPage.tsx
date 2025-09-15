import React from 'react';
import type { Challenge } from '../types';
import TargetIcon from './icons/TargetIcon';

interface ChallengesPageProps {
  challenges: Challenge[];
  onCompleteChallenge: (challengeId: string) => void;
  onBack: () => void;
}

const CategoryIcon: React.FC<{ category: Challenge['category'] }> = ({ category }) => {
  const baseClasses = "w-5 h-5 mr-3";
  if (category === 'Mente') return <TargetIcon className={`${baseClasses} text-blue-400`} />;
  if (category === 'Cuerpo') return <TargetIcon className={`${baseClasses} text-green-400`} />;
  if (category === 'Espíritu') return <TargetIcon className={`${baseClasses} text-purple-400`} />;
  return null;
};

const ChallengesPage: React.FC<ChallengesPageProps> = ({ challenges, onCompleteChallenge, onBack }) => {
  const completedCount = challenges.filter(c => c.isCompleted).length;

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-lg shadow-lg shadow-black/20 flex flex-col h-[calc(100vh-4rem)]">
      <div className="p-4 border-b border-gray-700/50 flex items-center">
        <button onClick={onBack} className="mr-4 p-2 rounded-full hover:bg-gray-700/70 transition-colors">
            &larr;
        </button>
        <div>
            <h2 className="text-xl font-bold text-white">Desafíos</h2>
            <p className="text-sm text-gray-400">Completa desafíos para ganar XP y subir de rango. ({completedCount}/{challenges.length} completados)</p>
        </div>
      </div>
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="space-y-4">
          {challenges.map((challenge) => (
            <div
              key={challenge.id}
              className={`bg-gray-800/60 p-5 rounded-lg border border-gray-700 transition-all ${
                challenge.isCompleted ? 'opacity-50' : ''
              }`}
            >
              <div className="flex items-start">
                <div className="flex-1">
                  <div className="flex items-center text-sm text-gray-400 mb-2">
                     <CategoryIcon category={challenge.category} />
                     <span>{challenge.category.toUpperCase()} / +{challenge.xp} XP</span>
                  </div>
                  <h3 className="font-bold text-lg text-white">{challenge.title}</h3>
                  <p className="text-gray-300 mt-1">{challenge.description}</p>
                </div>
                <button
                  onClick={() => onCompleteChallenge(challenge.id)}
                  disabled={challenge.isCompleted}
                  className="ml-6 bg-cyan-600 hover:bg-cyan-500 disabled:bg-gray-600 disabled:cursor-not-allowed disabled:text-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  {challenge.isCompleted ? 'Completado' : 'Completar'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChallengesPage;
