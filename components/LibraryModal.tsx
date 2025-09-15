import React from 'react';
import { LATINO_CHALLENGES } from '../constants';
import TargetIcon from './icons/TargetIcon';

interface LibraryModalProps {
  onClose: () => void;
  onSelectLatinoChallenges: () => void;
}

const LibraryModal: React.FC<LibraryModalProps> = ({ onClose, onSelectLatinoChallenges }) => {
  return (
    <div
      className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-gray-800 border border-cyan-500/30 rounded-2xl shadow-2xl w-full max-w-lg m-4 text-white p-8 transform transition-all duration-300 scale-95 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-3xl font-bold text-center mb-6">Biblioteca Sapiens</h2>
        <div className="space-y-4">
          <button
            onClick={onSelectLatinoChallenges}
            className="w-full text-left p-4 bg-gray-700/50 hover:bg-gray-700 rounded-lg transition-colors flex items-center"
          >
            <TargetIcon className="w-8 h-8 mr-4 text-cyan-400" />
            <div>
              <p className="font-semibold text-lg">Los 100 Grandes Desafíos Latinos</p>
              <p className="text-sm text-gray-400">Un manifiesto de los retos y oportunidades clave en Latinoamérica.</p>
            </div>
          </button>
          {/* Future library items can be added here */}
        </div>
      </div>
    </div>
  );
};

export default LibraryModal;