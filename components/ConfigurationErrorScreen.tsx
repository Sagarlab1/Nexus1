import React from 'react';
import NexusLogo from './icons/NexusLogo.tsx';
import AlertTriangleIcon from './icons/AlertTriangleIcon.tsx';

const ConfigurationErrorScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-gray-900 z-50 flex flex-col items-center justify-center p-4 text-center">
      <div className="w-full max-w-lg mx-auto bg-gray-800/50 border border-red-500/50 p-8 rounded-lg shadow-lg shadow-red-500/10">
        <div className="mb-6">
          <AlertTriangleIcon className="w-16 h-16 text-red-400 mx-auto" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-4">Error de Configuración</h1>
        <p className="text-gray-300 mb-6">
          La aplicación no pudo iniciarse porque la clave de API de Google Gemini no está configurada.
        </p>
        <div className="text-left bg-gray-900/70 p-4 rounded-md">
            <p className="font-mono text-sm text-gray-400">
                Para solucionar este problema, por favor agrega la variable de entorno <code className="bg-gray-700 text-yellow-300 px-1 rounded">API_KEY</code> a la configuración de tu proyecto en Vercel (u otro entorno de despliegue).
            </p>
        </div>
         <p className="text-center text-xs text-gray-500 mt-6">
            Puedes obtener tu clave desde Google AI Studio.
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

export default ConfigurationErrorScreen;