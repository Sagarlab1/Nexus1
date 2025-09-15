import React from 'react';
import NexusLogo from './icons/NexusLogo';

interface UserRankPanelProps {
  rank: string;
  onHomeClick: () => void;
}

const UserRankPanel: React.FC<UserRankPanelProps> = ({ rank, onHomeClick }) => {
  return (
    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-lg p-6 shadow-lg shadow-black/20 text-white">
        <button onClick={onHomeClick} className="w-full flex items-center text-left mb-4 group">
             <NexusLogo className="w-10 h-10 text-cyan-400 mr-4 transition-transform duration-300 group-hover:rotate-180" />
            <div>
              <h1 className="text-2xl font-bold text-white">Nexus Sapiens</h1>
              <p className="text-sm text-cyan-400 font-mono transition-colors group-hover:text-white">Panel Principal</p>
            </div>
        </button>
      <div className="bg-gray-800/50 p-4 rounded-lg">
        <p className="text-sm text-gray-400 mb-1">Tu Rango Actual</p>
        <p className="text-2xl font-bold">{rank}</p>
      </div>
    </div>
  );
};

export default UserRankPanel;