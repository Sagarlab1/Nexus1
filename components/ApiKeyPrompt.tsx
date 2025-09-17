import React from 'react';
import AlertTriangleIcon from './icons/AlertTriangleIcon';
import NexusLogo from './icons/NexusLogo';
import ClipboardIcon from './icons/ClipboardIcon';

interface ApiKeyPromptProps {
  errorMessage: string;
}

const ApiKeyPrompt: React.FC<ApiKeyPromptProps> = ({ errorMessage }) => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText('VITE_API_KEY');
    // Add user feedback if needed, e.g., showing a temporary "Copied!" message.
  };

  return (
    <div className="fixed inset-0 bg-gray-900 z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl mx-auto bg-gray-800/50 border border-red-500/30 rounded-lg p-8 text-center shadow-2xl shadow-red-500/10">
        <NexusLogo className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-white mb-3">Acción Requerida</h1>
        <p className="text-lg text-red-400 font-mono mb-6 flex items-center justify-center gap-2">
            <AlertTriangleIcon className="w-6 h-6" />
            {errorMessage}
        </p>
        
        <div className="bg-gray-900/50 p-6 rounded-lg text-left border border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-3">¿Cómo solucionarlo?</h2>
            <p className="text-gray-300 mb-4">
                Esta aplicación requiere una clave de API de Google Gemini. Por seguridad, debe configurarse como una variable de entorno en tu proveedor de hosting (ej. Vercel, Netlify).
            </p>
            <ol className="list-decimal list-inside space-y-3 text-gray-300">
                <li>Ve a la configuración de tu proyecto y busca "Environment Variables".</li>
                <li>
                  <span>Crea una nueva variable con el nombre exacto:</span>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="bg-gray-700 text-cyan-300 font-mono px-2 py-1 rounded-md">VITE_API_KEY</code>
                    <button onClick={copyToClipboard} title="Copiar al portapapeles" className="p-1 rounded-md bg-gray-600 hover:bg-gray-500">
                      <ClipboardIcon className="w-4 h-4 text-gray-300" />
                    </button>
                  </div>
                   <span className="text-xs text-gray-500">¿Por qué este nombre? Por seguridad, las apps web necesitan un prefijo como `VITE_` para que la clave sea accesible desde el código.</span>
                </li>
                <li>Pega tu clave de API de Gemini como el valor de la variable.</li>
                <li className="font-bold text-yellow-400 bg-yellow-500/10 p-2 rounded-md">Importante: Guarda los cambios y vuelve a desplegar ("Redeploy") tu proyecto para que la nueva variable tenga efecto.</li>
            </ol>
        </div>
         <p className="text-sm text-gray-500 mt-6">
            Una vez configurada la clave y realizado el nuevo despliegue, la aplicación se cargará correctamente.
        </p>
      </div>
    </div>
  );
};

export default ApiKeyPrompt;