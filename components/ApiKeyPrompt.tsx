import React, { useState } from 'react';
import AlertTriangleIcon from './icons/AlertTriangleIcon';
import NexusLogo from './icons/NexusLogo';
import ClipboardIcon from './icons/ClipboardIcon';

interface ApiKeyPromptProps {
  errorMessage: string | null;
  onKeySubmit: (key: string) => void;
}

const ApiKeyPrompt: React.FC<ApiKeyPromptProps> = ({ errorMessage, onKeySubmit }) => {
  const [localKey, setLocalKey] = useState('');

  const copyToClipboard = () => {
    navigator.clipboard.writeText('API_KEY');
  };
  
  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if(localKey.trim()) {
          onKeySubmit(localKey.trim());
      }
  }

  return (
    <div className="fixed inset-0 bg-gray-900 z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl mx-auto bg-gray-800/50 border border-gray-700 rounded-lg p-8 shadow-2xl">
        <div className="text-center">
            <NexusLogo className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-white mb-3">Acción Requerida: Configura tu API Key</h1>
            <p className="text-gray-300 mb-6">La IA de esta aplicación necesita una clave de API de Google Gemini para funcionar.</p>
        </div>

        {errorMessage && (
             <div className="bg-red-900/50 border border-red-500/50 text-red-300 p-3 rounded-lg mb-6 text-center">
                <p><strong>Error de Inicialización:</strong> {errorMessage}</p>
             </div>
        )}
        
        <div className="grid md:grid-cols-2 gap-6 items-start">
            {/* Recommended Method */}
            <div className="bg-gray-900/50 p-6 rounded-lg text-left border border-gray-700">
                <h2 className="text-xl font-semibold text-white mb-3">Método Recomendado: Variable de Entorno</h2>
                <p className="text-gray-400 text-sm mb-4">
                    Para mayor seguridad, configura tu clave en tu proveedor de hosting (ej. Vercel, Netlify).
                </p>
                <ol className="list-decimal list-inside space-y-2 text-gray-300 text-sm">
                    <li>Ve a la configuración de tu proyecto y busca "Environment Variables".</li>
                    <li>
                      <span>Crea una variable con el nombre:</span>
                      <div className="flex items-center gap-2 mt-1">
                        <code className="bg-gray-700 text-cyan-300 font-mono px-2 py-1 rounded-md">API_KEY</code>
                        <button onClick={copyToClipboard} title="Copiar" className="p-1 rounded-md bg-gray-600 hover:bg-gray-500">
                          <ClipboardIcon className="w-4 h-4 text-gray-300" />
                        </button>
                      </div>
                    </li>
                    <li>Pega tu clave de API de Gemini.</li>
                    <li className="font-bold text-yellow-400">Importante: Guarda y vuelve a desplegar ("Redeploy") tu proyecto.</li>
                </ol>
            </div>

            {/* Manual Method */}
            <div className="bg-gray-900/50 p-6 rounded-lg text-left border border-gray-700">
                 <h2 className="text-xl font-semibold text-white mb-3">Alternativa: Ingresar manualmente</h2>
                 <p className="text-gray-400 text-sm mb-4">
                    Si no puedes usar variables de entorno, o para pruebas rápidas, pega tu clave aquí.
                 </p>
                 <form onSubmit={handleSubmit}>
                    <label htmlFor="apiKeyInput" className="block text-sm font-medium text-gray-300 mb-1">
                        Tu Clave de API de Google Gemini
                    </label>
                    <input
                        id="apiKeyInput"
                        type="password"
                        value={localKey}
                        onChange={(e) => setLocalKey(e.target.value)}
                        placeholder="Pega tu clave aquí"
                        className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                     <button
                        type="submit"
                        className="w-full mt-3 bg-cyan-600 hover:bg-cyan-500 disabled:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                        disabled={!localKey.trim()}
                    >
                        Guardar Clave y Continuar
                    </button>
                 </form>
                 <p className="text-xs text-gray-500 mt-2">La clave se guardará en el almacenamiento local de tu navegador.</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyPrompt;
