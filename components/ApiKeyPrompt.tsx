import React from 'react';
import NexusLogo from './icons/NexusLogo';
import ClipboardIcon from './icons/ClipboardIcon';

const ApiKeyPrompt: React.FC = () => {

  const copyToClipboard = () => {
    navigator.clipboard.writeText('API_KEY').catch(err => {
      console.error('Failed to copy text: ', err);
    });
  };

  return (
    <div className="fixed inset-0 bg-gray-900 z-50 flex items-center justify-center text-center p-4">
      <div className="bg-gray-800 border border-cyan-500/30 rounded-2xl shadow-2xl w-full max-w-3xl m-4 text-white p-8">
        <div className="inline-block p-3 bg-cyan-400/10 rounded-full border border-cyan-500/30 mb-4">
          <NexusLogo className="w-8 h-8 text-cyan-400" />
        </div>
        <h1 className="text-3xl font-bold mb-4">Configuración Requerida</h1>
        <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
          Para activar la IA, necesitas proporcionar tu clave de API de Google Gemini a Vercel. Sigue estos 3 sencillos pasos.
        </p>

        <div className="grid md:grid-cols-3 gap-6 text-left">
          {/* Step 1 */}
          <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-700">
            <p className="font-mono text-cyan-400 mb-2">Paso 1</p>
            <h2 className="text-xl font-semibold text-white mb-3">Ir a Vercel</h2>
            <p className="text-gray-400 text-sm">
              En el panel de tu proyecto en Vercel, ve a: <br />
              <strong className="text-gray-300">Settings &rarr; Environment Variables</strong>.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-700">
            <p className="font-mono text-cyan-400 mb-2">Paso 2</p>
            <h2 className="text-xl font-semibold text-white mb-3">Crear la Variable</h2>
            <p className="text-gray-400 text-sm mb-4">
              Crea una nueva variable con este nombre exacto:
            </p>
            <div className="flex items-center gap-2 bg-gray-800 p-3 rounded-md">
              <code className="bg-yellow-500/20 text-yellow-300 font-mono p-1 rounded">API_KEY</code>
              <button 
                onClick={copyToClipboard} 
                title="Copy to clipboard"
                className="ml-auto p-1 text-gray-400 hover:text-white transition-colors"
              >
                <ClipboardIcon className="w-5 h-5" />
              </button>
            </div>
             <p className="text-gray-400 text-sm mt-3">
              En el campo "Value", pega tu clave de API de Google.
            </p>
          </div>
          
          {/* Step 3 */}
          <div className="bg-cyan-900/50 p-6 rounded-lg border border-cyan-500">
             <p className="font-mono text-cyan-300 mb-2">Paso 3</p>
            <h2 className="text-xl font-semibold text-white mb-3">¡Volver a Desplegar!</h2>
            <p className="text-cyan-200 text-sm">
              <strong className="text-white">Este es el paso más importante.</strong> Vercel solo aplica las nuevas variables después de un nuevo despliegue ("redeploy").
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyPrompt;
