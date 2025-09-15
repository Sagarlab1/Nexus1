import React from 'react';
import NexusLogo from './icons/NexusLogo';

const ApiKeyPrompt: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-gray-900 z-50 flex items-center justify-center text-center p-4">
      <div className="bg-gray-800 border border-red-500/30 rounded-2xl shadow-2xl w-full max-w-lg m-4 text-white p-8">
        <div className="inline-block p-3 bg-red-400/10 rounded-full border border-red-500/30 mb-4">
          <NexusLogo className="w-8 h-8 text-red-400" />
        </div>
        <h1 className="text-3xl font-bold mb-4">Configuración Requerida</h1>
        <p className="text-gray-300 mb-6">
          La clave de API de Google Gemini no está configurada. Para que la aplicación funcione, este secreto debe ser proporcionado.
        </p>
        <div className="bg-gray-900 p-4 rounded-lg text-left">
          <p className="text-gray-400 text-sm">
            Por favor, establece la variable de entorno <code className="bg-yellow-500/20 text-yellow-300 font-mono p-1 rounded">API_KEY</code> en tu plataforma de despliegue (ej. Vercel) y vuelve a desplegar el proyecto.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyPrompt;