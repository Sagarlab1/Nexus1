import React from 'react';
import NexusLogo from './icons/NexusLogo';

const ApiKeyPrompt: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-gray-900 z-50 flex flex-col items-center justify-center text-white">
      <div className="text-center p-8 max-w-2xl mx-auto">
        <NexusLogo className="w-24 h-24 text-red-500 mx-auto mb-6" />
        <h1 className="text-4xl font-bold mb-4">Configuración Requerida</h1>
        <p className="text-lg text-gray-300 mb-6">
          La clave de API de Google Gemini no se ha encontrado en las variables de entorno.
        </p>
        <div className="bg-gray-800 p-4 rounded-lg text-left">
          <p className="font-mono text-gray-400">
            Para continuar, por favor, configure la variable de entorno <code className="bg-gray-700 text-cyan-400 px-2 py-1 rounded">API_KEY</code> en su entorno de ejecución.
          </p>
          <p className="mt-4 text-gray-400">
            Asegúrese de que la variable de entorno <code className="bg-gray-700 text-cyan-400 px-1 rounded">API_KEY</code> esté disponible a través de <code className="bg-gray-700 text-cyan-400 px-1 rounded">process.env.API_KEY</code>.
          </p>
           <p className="mt-4 text-sm text-gray-500">
            Esta aplicación está configurada para usar la variable de entorno directamente, de acuerdo con las directrices. No se le pedirá que ingrese la clave en la interfaz de usuario.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyPrompt;
