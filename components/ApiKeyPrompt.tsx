import React, { useState } from 'react';
import NexusLogo from './icons/NexusLogo';
import AlertTriangleIcon from './icons/AlertTriangleIcon';

interface ApiKeyPromptProps {
  onKeySubmit: (key: string) => void;
  error?: string | null;
}

const ApiKeyPrompt: React.FC<ApiKeyPromptProps> = ({ onKeySubmit, error }) => {
  const [localKey, setLocalKey] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localKey.trim()) {
      onKeySubmit(localKey.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg m-auto bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-lg shadow-lg shadow-black/20 p-8 text-white text-center">
        <NexusLogo className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-white mb-2">Acción Requerida: Configura tu API Key</h1>
        <p className="text-gray-300 mb-6">
          Esta aplicación necesita una clave de API de Google Gemini para funcionar.
        </p>

        {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-300 text-sm rounded-lg p-3 mb-4 text-left flex items-start">
                <AlertTriangleIcon className="w-5 h-5 mr-3 flex-shrink-0" />
                <span>{error}</span>
            </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="password"
            value={localKey}
            onChange={(e) => setLocalKey(e.target.value)}
            placeholder="Pega tu clave de API de Gemini aquí"
            className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            aria-label="API Key de Google Gemini"
          />
          <button
            type="submit"
            disabled={!localKey.trim()}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-bold py-3 px-8 rounded-lg text-lg transition-all transform hover:scale-105"
          >
            Guardar Clave y Continuar
          </button>
        </form>

        <div className="mt-6 text-sm text-gray-400">
            <p>
                Puedes obtener tu clave de API gratuita desde Google AI Studio.
            </p>
            <a 
                href="https://aistudio.google.com/app/apikey" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-cyan-400 hover:text-cyan-300 underline"
            >
                Obtener una API Key →
            </a>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyPrompt;
