import React, { useState } from 'react';
import NexusLogo from './icons/NexusLogo';
import AlertTriangleIcon from './icons/AlertTriangleIcon';

interface ApiKeyPromptProps {
  onSubmit: (apiKey: string) => void;
  error?: string | null;
}

const ApiKeyPrompt: React.FC<ApiKeyPromptProps> = ({ onSubmit, error }) => {
  const [apiKey, setApiKey] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      onSubmit(apiKey.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 z-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-lg mx-auto bg-gray-800 border border-cyan-500/30 rounded-lg p-8 shadow-2xl text-center">
        <NexusLogo className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-white mb-2">Configuración Requerida</h1>
        <p className="text-gray-300 mb-6">
          Para activar los agentes de IA, por favor introduce tu clave de API de Google Gemini.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Pega tu API Key aquí"
            className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            aria-label="Google Gemini API Key"
          />
          <button
            type="submit"
            disabled={!apiKey.trim()}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-8 rounded-lg text-lg transition-all transform hover:scale-105"
          >
            Guardar y Continuar
          </button>
        </form>

        {error && (
            <div className="mt-4 bg-red-900/30 border border-red-500/50 text-red-300 p-3 rounded-lg text-sm text-left flex items-start gap-2">
                <AlertTriangleIcon className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
            </div>
        )}

        <div className="mt-6 text-xs text-gray-500">
          <p>
            Puedes obtener tu API Key gratuitamente desde{' '}
            <a 
              href="https://aistudio.google.com/app/apikey" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-cyan-400 hover:underline"
            >
              Google AI Studio
            </a>.
          </p>
          <p className="mt-1">Tu clave se guardará de forma segura en tu navegador y no se compartirá.</p>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyPrompt;
