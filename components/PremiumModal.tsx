import React from 'react';
import StarIcon from './icons/StarIcon';
import RocketIcon from './icons/RocketIcon';
import VideoIcon from './icons/VideoIcon';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PremiumModal: React.FC<PremiumModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="bg-gray-800 border border-yellow-500/50 rounded-xl shadow-2xl shadow-black/50 w-full max-w-md m-4 text-white transform transition-all animate-fadeInUp"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-8">
          <div className="flex justify-center mb-6">
             <div className="p-3 bg-yellow-400/10 rounded-full border border-yellow-500/30">
                <StarIcon className="w-10 h-10 text-yellow-400" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-center mb-2">Desbloquea Nexus Pro</h2>
          <p className="text-center text-yellow-300 font-mono mb-6">ACCEDE A HERRAMIENTAS AVANZADAS</p>
          
          <ul className="space-y-4 text-gray-300">
            <li className="flex items-start gap-4">
              <RocketIcon className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-white">Generador de Odiseas</h3>
                <p className="text-sm">Crea planes de aprendizaje personalizados y paso a paso sobre cualquier tema.</p>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <VideoIcon className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-white">Generador de Video (Próximamente)</h3>
                <p className="text-sm">Transforma tus ideas en contenido de video corto con el poder de la IA.</p>
              </div>
            </li>
             <li className="flex items-start gap-4">
                <div className="w-6 h-6 flex-shrink-0 mt-1"/>
                 <div>
                    <h3 className="font-semibold text-white">... ¡Y mucho más en el futuro!</h3>
                </div>
            </li>
          </ul>

        </div>
        <div className="p-6 bg-gray-900/50 rounded-b-xl flex flex-col items-center">
            <button className="w-full bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold py-3 px-6 rounded-lg transition-transform transform hover:scale-105">
                Actualizar a Pro
            </button>
             <button 
                onClick={onClose}
                className="mt-3 text-sm text-gray-400 hover:text-white transition-colors"
             >
                Quizás más tarde
            </button>
        </div>
      </div>
       <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default PremiumModal;
