import React, { useState } from 'react';
import NexusLogo from './icons/NexusLogo';

interface ApiKeyPromptProps {
  onKeySubmit: (key: string) => Promise<string | undefined>;
}

const ApiKeyPrompt: React.FC<ApiKeyPromptProps> = ({ onKeySubmit }) => {
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) {
      setError("Por favor, ingresa una clave de API.");
      return;
    }
    setError(null);
    setIsLoading(true);
    const submissionError = await onKeySubmit(apiKey);
    if (submissionError) {
      setError(submissionError);
    }
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-gray-900 z-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto bg-gray-800 border border-cyan-500/30 rounded-lg p-8 shadow-2xl text-center">
        <NexusLogo className="w-20 h-20 text-cyan-400 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-white mb-2">Configuración de API Key</h1>
        <p className="text-gray-300 mb-6">
          Para comenzar, por favor ingresa tu API Key de Google Gemini. Tu clave se guardará de forma segura en tu navegador.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Pega tu API Key aquí"
            className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            disabled={isLoading}
          />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-bold py-3 px-8 rounded-lg text-lg transition-all disabled:opacity-50 disabled:cursor-wait"
          >
            {isLoading ? "Verificando..." : "Guardar y Continuar"}
          </button>
        </form>
        <p className="text-xs text-gray-500 mt-4">
          ¿No tienes una clave? <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">Obtén una aquí</a>.
        </p>
      </div>
    </div>
  );
};

export default ApiKeyPrompt;
