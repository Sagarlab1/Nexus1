import React, { useState } from 'react';
import NexusLogo from './icons/NexusLogo.tsx';
import AlertTriangleIcon from './icons/AlertTriangleIcon.tsx';

interface ApiKeyPromptProps {
  onSetKey: (apiKey: string) => Promise<void>;
}

const ApiKeyPrompt: React.FC<ApiKeyPromptProps> = ({ onSetKey }) => {
  const [apiKey, setApiKey] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) {
      setError("La clave de API no puede estar vacía.");
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      await onSetKey(apiKey);
      // On success, the App component will change the view
    } catch (err: any) {
      setError(err.message || "Ocurrió un error desconocido.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 z-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto">
        <div className="text-center mb-8">
            <NexusLogo className="w-20 h-20 text-cyan-400 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-white">Configuración de API Key</h1>
            <p className="text-gray-400 mt-2">
                Para usar Nexus Sapiens, necesitas una API Key de Google Gemini.
            </p>
        </div>

        <form 
            onSubmit={handleSubmit}
            className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 p-8 rounded-lg shadow-lg"
        >
          <div className="mb-4">
            <label htmlFor="apiKey" className="block text-sm font-bold text-gray-300 mb-2">
              Google Gemini API Key
            </label>
            <input
              id="apiKey"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="Pega tu clave aquí..."
            />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-300 px-4 py-3 rounded-lg mb-4 flex items-center">
                <AlertTriangleIcon className="w-5 h-5 mr-3" />
                <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-bold py-3 px-8 rounded-lg text-lg transition-all transform hover:scale-105 shadow-lg shadow-cyan-500/30 disabled:opacity-50 disabled:cursor-wait"
          >
            {isLoading ? 'Verificando...' : 'Guardar y Continuar'}
          </button>
          
           <p className="text-center text-xs text-gray-500 mt-4">
            Tu clave se guarda de forma segura en tu navegador y no se comparte.
            <a 
                href="https://aistudio.google.com/app/apikey" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-cyan-400 hover:underline ml-1"
            >
                Obtén una clave aquí.
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default ApiKeyPrompt;