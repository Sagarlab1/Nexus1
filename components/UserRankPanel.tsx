import React from 'react';
import NexusLogo from './icons/NexusLogo.tsx';
import StarIcon from './icons/StarIcon.tsx';
import GraduationCapIcon from './icons/GraduationCapIcon.tsx';
import TrophyIcon from './icons/TrophyIcon.tsx';
import MessageSquareIcon from './icons/MessageSquareIcon.tsx';
import CompassIcon from './icons/CompassIcon.tsx';
import type { View } from '../types.ts';
import DumbbellIcon from './icons/DumbbellIcon.tsx';
import LogOutIcon from './icons/LogOutIcon.tsx';

interface UserRankPanelProps {
  rank: string;
  activeView: View;
  onNavigate: (view: View, agentId?: string) => void;
  onOpenPremium: () => void;
  isAiConfigured: boolean;
  onResetKey: () => void;
}

const NavButton = ({ icon: Icon, label, isActive, onClick }) => (
    <button 
        onClick={onClick}
        className={`w-full flex items-center p-3 rounded-lg transition-all duration-200 ${
            isActive 
            ? 'bg-cyan-500/20 text-cyan-300' 
            : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/70 hover:text-white transform hover:translate-x-1'
        }`}
    >
        <Icon className="w-5 h-5 mr-3" />
        <span className="font-semibold">{label}</span>
    </button>
);


const UserRankPanel: React.FC<UserRankPanelProps> = ({ rank, activeView, onNavigate, onOpenPremium, isAiConfigured, onResetKey }) => {
  return (
    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-lg p-6 shadow-lg shadow-black/20 text-white flex flex-col h-full">
        <div className="w-full flex items-center text-left mb-4 group">
             <NexusLogo className="w-10 h-10 text-cyan-400 mr-4 transition-transform duration-300 group-hover:rotate-180" />
            <div>
              <h1 className="text-2xl font-bold text-white">Nexus Sapiens</h1>
              <p className="text-sm text-cyan-400 font-mono">Centro de Mando</p>
            </div>
        </div>
      <div className="bg-gray-800/50 p-4 rounded-lg mb-4">
        <p className="text-sm text-gray-400 mb-1">Tu Rango Actual</p>
        <p className="text-xl font-bold">{rank}</p>
      </div>

      <nav className="space-y-2 flex-1">
        <NavButton
            icon={CompassIcon}
            label="Nexus Cero (Inicio)"
            isActive={activeView === 'nexus_zero_course'}
            onClick={() => onNavigate('nexus_zero_course', 'entrepreneurship')}
        />
        <hr className="border-gray-700 my-2" />
        <NavButton
            icon={MessageSquareIcon}
            label="Chat de Agentes"
            isActive={activeView === 'chat'}
            onClick={() => onNavigate('chat')}
        />
        <NavButton
            icon={GraduationCapIcon}
            label="Programas de 3 Meses"
            isActive={activeView === 'programs'}
            onClick={() => onNavigate('programs')}
        />
        <NavButton
            icon={TrophyIcon}
            label="Retos Sapiens Latinos"
            isActive={activeView === 'challenges'}
            onClick={() => onNavigate('challenges')}
        />
        <hr className="border-gray-700 my-2" />
        <button
            onClick={() => onNavigate('cognitive_gym')}
            className={`w-full flex items-center p-3 rounded-lg transition-all duration-200 ${
                activeView === 'cognitive_gym' 
                ? 'bg-pink-500/20 text-pink-300' 
                : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/70 hover:text-white transform hover:translate-x-1'
            }`}
        >
            <DumbbellIcon className="w-5 h-5 mr-3" />
            <span className="font-semibold">Gimnasio Cognitivo</span>
            <span className="ml-auto text-xs font-mono bg-pink-500/30 text-pink-300 px-2 py-0.5 rounded">
                Beta
            </span>
        </button>
      </nav>
      
      <div className="mt-4 pt-4 border-t border-gray-700/50 space-y-2">
         <button 
            onClick={onOpenPremium}
            className="w-full flex items-center justify-center gap-2 text-yellow-400 p-3 rounded-lg bg-yellow-500/10 hover:bg-yellow-500/20 transition-colors"
          >
            <StarIcon className="w-5 h-5" />
            <span className="font-bold">Ver Plan Premium</span>
          </button>
          <button 
            onClick={onResetKey}
            className={`w-full flex items-center justify-center gap-2 p-3 rounded-lg transition-colors ${
              isAiConfigured
                ? 'text-gray-400 bg-gray-800/50 hover:bg-gray-700/70'
                : 'text-yellow-300 bg-yellow-500/10 hover:bg-yellow-500/20 animate-pulse'
            }`}
           >
            <LogOutIcon className="w-5 h-5" />
            <span className="font-bold">{isAiConfigured ? 'Cambiar API Key' : 'Configurar API Key'}</span>
          </button>
      </div>
    </div>
  );
};

export default UserRankPanel;