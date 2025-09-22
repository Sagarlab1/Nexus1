import React, { useState } from 'react';
import NexusLogo from './icons/NexusLogo';
import AlertTriangleIcon from './icons/AlertTriangleIcon';

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
      setError('Por favor, introduce una clave de API.');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      await onSetKey(apiKey);
      // On success, the App component will change the view
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error desconocido.');
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 z-50 flex flex-col items-center justify-center p-4 text-white">
      <div className="w-full max-w-md mx-auto bg-gray-800 border border-cyan-500/30 rounded-lg p-8 shadow-2xl text-center">
        <NexusLogo className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-white mb-2">Configuración Requerida</h1>
        <p className="text-gray-300 mb-6">
          Para usar Nexus Sapiens, por favor introduce tu clave de API de Google Gemini.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Pega tu clave de API aquí"
            className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            aria-label="API Key Input"
            disabled={isLoading}
          />
          
          {error && (
            <div className="flex items-center justify-center gap-2 text-red-400 bg-red-500/10 p-3 rounded-lg">
              <AlertTriangleIcon className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-bold py-3 px-8 rounded-lg text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Validando...
              </>
            ) : (
              'Guardar y Continuar'
            )}
          </button>
        </form>
         <p className="text-xs text-gray-500 mt-4">
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
      </div>
    </div>
  );
};

export default ApiKeyPrompt;