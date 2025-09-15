import React from 'react';
import StarIcon from './icons/StarIcon';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLearnMore: () => void;
}

const PremiumModal: React.FC<PremiumModalProps> = ({ isOpen, onClose, onLearnMore }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-gray-800 border border-yellow-500/50 rounded-2xl shadow-2xl shadow-yellow-500/20 max-w-md w-full p-8 text-center relative transform transition-all animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl font-bold">&times;</button>
        
        <div className="mx-auto mb-4 bg-yellow-500/20 rounded-full h-16 w-16 flex items-center justify-center">
            <StarIcon className="w-8 h-8 text-yellow-400" />
        </div>
        
        <h2 className="text-3xl font-bold text-white mb-3">Eleva tu Evolución</h2>
        <p className="text-yellow-400 font-mono text-sm mb-6">ACCEDE A NUESTROS PROGRAMAS DE ÉLITE</p>
        
        <p className="text-gray-300 mb-6">
            Descubre el "Acelerador Sapiens", un programa de 3 meses de clase mundial, y la "Odisea Sapiens", tu viaje de aprendizaje 100% personalizado.
        </p>
        
        <button
          onClick={onLearnMore}
          className="w-full bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-white font-bold py-3 px-8 rounded-lg text-lg transition-transform transform hover:scale-105 shadow-lg shadow-yellow-500/30"
        >
          Saber Más
        </button>
      </div>
       <style>{`
        @keyframes scaleIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
        }
        .animate-scaleIn {
            animation: scaleIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default PremiumModal;