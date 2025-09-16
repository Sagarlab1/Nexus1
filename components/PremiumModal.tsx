import React from 'react';
import NexusLogo from './icons/NexusLogo';
import StarIcon from './icons/StarIcon';
import CheckIcon from './icons/CheckIcon';

interface PremiumModalProps {
  onClose: () => void;
}

const PremiumModal: React.FC<PremiumModalProps> = ({ onClose }) => {
  const features = [
    'Acceso ilimitado a todos los Programas de Aceleración (presentes y futuros).',
    'Acceso a todos los Agentes IA, incluyendo versiones avanzadas.',
    'Generación ilimitada de contenido y respuestas.',
    'Programas y Retos exclusivos para miembros Premium.',
    'Soporte prioritario y acceso a nuevas funcionalidades.',
  ];

  return (
    <div 
        className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
        onClick={onClose}
    >
      <div 
        className="w-full max-w-lg m-auto bg-gray-900 border border-yellow-500/30 rounded-2xl shadow-2xl text-white p-8 relative transform transition-all animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center">
          <div className="inline-block p-3 bg-yellow-500/10 rounded-full mb-4">
            <StarIcon className="w-10 h-10 text-yellow-400" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Plan Premium Nexus Sapiens</h1>
          <p className="text-gray-300 mb-6">
            Desbloquea todo el potencial de la plataforma y acelera tu evolución al máximo.
          </p>
        </div>

        <ul className="space-y-3 mb-8">
            {features.map((feature, index) => (
                <li key={index} className="flex items-start">
                    <CheckIcon className="w-5 h-5 text-green-400 mr-3 mt-1 flex-shrink-0" />
                    <span className="text-gray-300">{feature}</span>
                </li>
            ))}
        </ul>
        
        <div className="text-center mb-6">
            <p className="text-gray-400">Acceso de por vida</p>
            <p className="text-4xl font-bold text-white">$999 <span className="text-lg font-normal text-gray-300">USD</span></p>
            <p className="text-sm text-gray-500">(Pago único)</p>
        </div>

        <button
            className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-gray-900 font-bold py-3 px-8 rounded-lg text-lg transition-transform transform hover:scale-105 shadow-lg shadow-yellow-500/30"
        >
            Activar Premium Ahora
        </button>

         <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
            aria-label="Cerrar modal"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>
       <style>{`
        @keyframes fade-in-up {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        .animate-fade-in-up {
            animation: fade-in-up 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default PremiumModal;