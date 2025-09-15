import React from 'react';
import LibraryIcon from './icons/LibraryIcon';

interface LibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LibraryModal: React.FC<LibraryModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="bg-gray-800 border border-gray-700/50 rounded-xl shadow-2xl shadow-black/50 w-full max-w-lg m-4 text-white transform transition-all animate-fadeInUp"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-8 text-center">
          <div className="flex justify-center mb-6">
             <div className="p-3 bg-cyan-400/10 rounded-full border border-cyan-500/30">
                <LibraryIcon className="w-10 h-10 text-cyan-400" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-center mb-2">Biblioteca</h2>
          <p className="text-center text-gray-400 mb-6">Aquí encontrarás tus conversaciones guardadas, documentos y recursos generados.</p>
          
          <div className="bg-gray-900/50 p-6 rounded-lg">
            <p className="text-gray-300">Esta función está en desarrollo.</p>
          </div>
        </div>
        <div className="p-4 bg-gray-900/50 rounded-b-xl flex justify-end">
             <button 
                onClick={onClose}
                className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 px-4 rounded-lg transition-colors"
             >
                Cerrar
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

export default LibraryModal;
