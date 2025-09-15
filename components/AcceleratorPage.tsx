import React from 'react';
import VideoIcon from './icons/VideoIcon';

interface AcceleratorPageProps {
  onBack: () => void;
  onOpenVideoGenerator: () => void;
}

const AcceleratorPage: React.FC<AcceleratorPageProps> = ({ onBack, onOpenVideoGenerator }) => {
  return (
    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-lg shadow-lg shadow-black/20 flex flex-col h-[calc(100vh-4rem)]">
      <div className="p-4 border-b border-gray-700/50 flex items-center">
        <button onClick={onBack} className="mr-4 p-2 rounded-full hover:bg-gray-700/70 transition-colors">
            &larr;
        </button>
        <div>
            <h2 className="text-xl font-bold text-white">Acelerador de Contenido</h2>
            <p className="text-sm text-gray-400">Herramientas de IA para crear contenido rápidamente.</p>
        </div>
      </div>
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button 
                onClick={onOpenVideoGenerator}
                className="bg-gray-800/60 p-6 rounded-lg border border-gray-700 hover:border-cyan-500 hover:bg-gray-800 transition-all text-left group"
            >
                <div className="flex items-center mb-3">
                    <VideoIcon className="w-8 h-8 text-cyan-400 mr-4" />
                    <h3 className="text-lg font-bold text-white">Generador de Video</h3>
                </div>
                <p className="text-gray-400">
                    Crea videos cortos a partir de un texto o una imagen. Ideal para redes sociales, prototipos o visualización de ideas.
                </p>
                <span className="mt-4 inline-block text-cyan-400 font-semibold group-hover:underline">
                    Abrir Herramienta &rarr;
                </span>
            </button>

             <div className="bg-gray-800/60 p-6 rounded-lg border border-gray-700 text-left opacity-50">
                <div className="flex items-center mb-3">
                    <div className="w-8 h-8 bg-gray-700 rounded-md mr-4" />
                    <h3 className="text-lg font-bold text-white">Generador de Imágenes (Próximamente)</h3>
                </div>
                <p className="text-gray-400">
                    Crea imágenes y arte visual a partir de descripciones detalladas.
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AcceleratorPage;
