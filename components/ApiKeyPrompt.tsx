import React from 'react';
import NexusLogo from './icons/NexusLogo';

const ApiKeyPrompt: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-gray-900 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 border border-red-500/50 rounded-xl shadow-2xl w-full max-w-lg m-4 text-white text-center p-8">
        <div className="flex justify-center mb-6">
          <div className="p-3 bg-red-400/10 rounded-full border border-red-500/30">
            <NexusLogo className="w-10 h-10 text-red-400" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-center mb-2">Configuración Requerida</h2>
        <p className="text-center text-gray-400 mb-6">
          La clave de API de Google Gemini no está configurada.
        </p>
        <div className="bg-gray-900/50 p-4 rounded-lg text-left">
            {/* FIX: Updated environment variable from VITE_API_KEY to API_KEY to match guidelines. */}
            <p className="text-gray-300">
                Por favor, establece la variable de entorno <code className="bg-yellow-400/20 text-yellow-300 font-mono p-1 rounded-md">API_KEY</code> en tu plataforma de despliegue (ej. Vercel) y vuelve a desplegar el proyecto.
            </p>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyPrompt;
