import React, { useState } from 'react';
import NexusLogo from './icons/NexusLogo';

interface ApiKeyPromptProps {
  onKeySubmit: (key: string) => Promise<boolean>;
}

const ApiKeyPrompt: React.FC<ApiKeyPromptProps> = ({ onKeySubmit }) => {
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) {
      setError('Por favor, introduce una clave de API.');
      return;
    }
    setError(null);
    setIsLoading(true);
    const success = await onKeySubmit(apiKey);
    if (!success) {
      setError('La clave de API no es válida o no se pudo conectar. Verifica tu clave y la configuración de tu cuenta de Google AI.');
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 z-50 flex items-center justify-center text-center p-4">
      <div className="bg-gray-800 border border-cyan-500/30 rounded-2xl shadow-2xl w-full max-w-lg m-4 text-white p-8">
        <div className="inline-block p-3 bg-cyan-400/10 rounded-full border border-cyan-500/30 mb-4">
          <NexusLogo className="w-8 h-8 text-cyan-400" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Conecta tu Clave de API</h1>
        <p className="text-gray-300 mb-6">
          Para comenzar, por favor introduce tu clave de API de Google Gemini. La clave se guardará de forma segura en tu navegador para futuras sesiones.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Introduce tu clave de API aquí"
            className="bg-gray-900 border border-gray-600 rounded-lg w-full px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            disabled={isLoading}
          />
          {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
          <button
            type="submit"
            disabled={isLoading}
            className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-bold py-3 px-8 rounded-lg text-lg transition-transform transform hover:scale-105 shadow-lg shadow-cyan-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Verificando...
              </>
            ) : (
              'Guardar y Continuar'
            )}
          </button>
        </form>
        <p className="text-xs text-gray-500 mt-4">
            Puedes obtener tu clave en <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="underline hover:text-cyan-400">Google AI Studio</a>.
        </p>
      </div>
    </div>
  );
};

export default ApiKeyPrompt;
