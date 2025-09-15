import React from 'react';
import LibraryIcon from './icons/LibraryIcon';

interface LibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LibraryModal: React.FC<LibraryModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-gray-800 border border-cyan-500/50 rounded-2xl shadow-2xl shadow-cyan-500/20 max-w-2xl w-full p-8 text-center relative transform transition-all animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl font-bold">&times;</button>
        
        <div className="mx-auto mb-4 bg-cyan-500/20 rounded-full h-16 w-16 flex items-center justify-center">
            <LibraryIcon className="w-8 h-8 text-cyan-400" />
        </div>
        
        <h2 className="text-3xl font-bold text-white mb-3">Librería de Conocimiento</h2>
        <p className="text-cyan-400 font-mono text-sm mb-6">TUS CONVERSACIONES Y ODISEAS GUARDADAS</p>
        
        <div className="text-gray-400 text-center py-12 bg-gray-900/50 rounded-lg">
            <p>La librería está actualmente vacía.</p>
            <p className="text-sm">Guarda conversaciones importantes u Odiseas para verlas aquí.</p>
        </div>

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

export default LibraryModal;
