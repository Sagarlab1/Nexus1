import React from 'react';
import NexusLogo from './icons/NexusLogo';

const ApiKeyPrompt: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-gray-900 z-50 flex flex-col items-center justify-center">
      <div className="text-center p-8 max-w-lg mx-auto bg-gray-800 rounded-lg border border-red-500/50 shadow-lg">
        <NexusLogo className="w-16 h-16 text-red-400 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-white mb-4">Configuración Requerida</h1>
        <p className="text-lg text-gray-300">
          La clave de API de Google Gemini no está configurada.
        </p>
        <p className="text-md text-gray-400 mt-4">
          {/* FIX: Updated environment variable name to API_KEY to match Gemini API guidelines. */}
          Por favor, establece la variable de entorno <code className="bg-gray-700 text-yellow-300 font-mono px-2 py-1 rounded">API_KEY</code> en tu plataforma de despliegue (ej. Vercel) y vuelve a desplegar el proyecto.
        </p>
      </div>
    </div>
  );
};

export default ApiKeyPrompt;
