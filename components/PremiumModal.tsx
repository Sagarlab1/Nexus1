import React from 'react';
import StarIcon from './icons/StarIcon';

interface PremiumModalProps {
  onClose: () => void;
  onUnlockAccelerator: () => void;
  onUnlockOdyssey: () => void;
  onLearnMore: () => void;
}

const PremiumModal: React.FC<PremiumModalProps> = ({ onClose, onUnlockAccelerator, onLearnMore }) => {
  return (
    <div
      className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-gray-800 border border-cyan-500/30 rounded-2xl shadow-2xl w-full max-w-md m-4 text-white p-8 relative transform transition-all duration-300 scale-95 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center">
          <div className="inline-block p-3 bg-cyan-400/10 rounded-full border border-cyan-500/30 mb-4">
            <StarIcon className="w-8 h-8 text-cyan-400" />
          </div>
          <h2 className="text-3xl font-bold text-center mb-2">Accede al Acelerador Sapiens</h2>
          <p className="text-center text-gray-400 mb-6">
            Desbloquea programas de élite y herramientas de IA para una evolución sin precedentes.
          </p>
        </div>

        <div className="space-y-4">
             <button
                onClick={onLearnMore}
                className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
              >
                Saber Más sobre los Programas
            </button>
             <button
                onClick={onUnlockAccelerator}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-bold py-3 px-6 rounded-lg transition-transform transform hover:scale-105 shadow-lg shadow-cyan-500/30"
              >
                Desbloquear por $49 USD
            </button>
        </div>
      </div>
    </div>
  );
};

export default PremiumModal;
