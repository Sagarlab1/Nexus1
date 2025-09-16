import React, { useState } from 'react';
import NexusLogo from './icons/NexusLogo';
import ClipboardIcon from './icons/ClipboardIcon';
import CheckIcon from './icons/CheckIcon';

const ApiKeyPrompt: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText('API_KEY');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-gray-900 z-50 flex items-center justify-center text-center p-4">
      <div className="bg-gray-800 border border-cyan-500/30 rounded-2xl shadow-2xl w-full max-w-4xl m-4 text-white p-8">
        <div className="inline-block p-3 bg-cyan-400/10 rounded-full border border-cyan-500/30 mb-4">
            <NexusLogo className="w-8 h-8 text-cyan-400" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Configuración Requerida</h1>
        <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Para que la aplicación funcione, la clave de API de Google Gemini debe ser configurada en tu plataforma de despliegue (ej. Vercel). Por favor, sigue estos 3 pasos.
        </p>
        
        <div className="grid md:grid-cols-3 gap-6 text-left">
            {/* Step 1 */}
            <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-700">
                <p className="text-sm font-semibold text-cyan-400 mb-2">Paso 1</p>
                <h2 className="text-xl font-bold mb-3">Ir a Vercel</h2>
                <p className="text-gray-400">En el panel de tu proyecto, ve a: <br /><strong className="text-gray-200">Settings &rarr; Environment Variables</strong>.</p>
            </div>

            {/* Step 2 */}
            <div className="bg-gray-900/50 p-6 rounded-lg border-2 border-yellow-500/50">
                <p className="text-sm font-semibold text-yellow-400 mb-2">Paso 2</p>
                <h2 className="text-xl font-bold mb-3">Crear la Variable</h2>
                <p className="text-gray-400 mb-4">Crea una nueva variable con este nombre exacto:</p>
                <div className="bg-gray-800 border border-gray-600 rounded-md px-3 py-2 flex items-center justify-between">
                    <span className="font-mono text-yellow-300">API_KEY</span>
                    <button onClick={handleCopy} className="text-gray-400 hover:text-white transition-colors">
                        {copied ? <CheckIcon className="w-5 h-5 text-green-400" /> : <ClipboardIcon className="w-5 h-5" />}
                    </button>
                </div>
                 <div className="mt-4 pt-4 border-t border-gray-700">
                    <p className="text-sm font-semibold text-yellow-400 mb-2">¡Punto Clave!</p>
                    <p className="text-xs text-gray-400 mb-2">Asegúrate de que la variable esté disponible para todos los entornos:</p>
                    <ul className="text-xs space-y-1 text-gray-300">
                        <li className="flex items-center"><CheckIcon className="w-4 h-4 mr-2 text-green-400" /> Producción</li>
                        <li className="flex items-center"><CheckIcon className="w-4 h-4 mr-2 text-green-400" /> Vista Previa (Preview)</li>
                        <li className="flex items-center"><CheckIcon className="w-4 h-4 mr-2 text-green-400" /> Desarrollo</li>
                    </ul>
                </div>
            </div>

            {/* Step 3 */}
            <div className="bg-cyan-500/10 p-6 rounded-lg border border-cyan-500/50 ring-2 ring-cyan-500/20">
                <p className="text-sm font-semibold text-cyan-400 mb-2">Paso 3</p>
                <h2 className="text-xl font-bold mb-3">¡Volver a Desplegar!</h2>
                <p className="text-gray-300">
                    <strong className="text-white">Este es el paso más importante.</strong> Vercel solo aplica las nuevas variables después de un nuevo despliegue ("redeploy").
                </p>
            </div>
        </div>

        <p className="text-xs text-gray-500 mt-8">
            Puedes obtener tu clave en <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="underline hover:text-cyan-400">Google AI Studio</a>.
        </p>
      </div>
    </div>
  );
};

export default ApiKeyPrompt;
