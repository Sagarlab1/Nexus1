import React from 'react';
import FlagIcon from './icons/FlagIcon';

interface LatinoChallengesPageProps {
  onBack: () => void;
}

const LatinoChallengesPage: React.FC<LatinoChallengesPageProps> = ({ onBack }) => {
  return (
    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-lg shadow-lg shadow-black/20 flex flex-col h-[calc(100vh-4rem)]">
      <div className="p-4 border-b border-gray-700/50 flex items-center">
        <button onClick={onBack} className="mr-4 p-2 rounded-full hover:bg-gray-700/70 transition-colors">
            &larr;
        </button>
        <div>
            <h2 className="text-xl font-bold text-white">Reto Creadores Latinos</h2>
            <p className="text-sm text-gray-400">Una iniciativa especial (placeholder).</p>
        </div>
      </div>
      <div className="flex-1 p-6 overflow-y-auto flex items-center justify-center text-center">
        <div>
            <FlagIcon className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold">Página en Construcción</h3>
            <p className="text-gray-400 mt-2">Este espacio está reservado para una futura iniciativa.</p>
        </div>
      </div>
    </div>
  );
};

export default LatinoChallengesPage;
