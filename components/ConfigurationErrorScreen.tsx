import React from 'react';
import AlertTriangleIcon from './icons/AlertTriangleIcon';
import NexusLogo from './icons/NexusLogo';

interface ConfigurationErrorScreenProps {
  error: string;
}

const ConfigurationErrorScreen: React.FC<ConfigurationErrorScreenProps> = ({ error }) => {
  return (
    <div className="fixed inset-0 bg-gray-900 z-50 flex items-center justify-center p-4 text-white">
      <div className="w-full max-w-2xl mx-auto bg-gray-800 border border-red-500/30 rounded-lg p-8 shadow-2xl text-center">
        <NexusLogo className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
        <div className="flex justify-center items-center gap-4 mb-4">
            <AlertTriangleIcon className="w-8 h-8 text-yellow-400" />
            <h1 className="text-3xl font-bold text-white">Error de Configuración</h1>
        </div>
        <p className="text-gray-300 mb-6">
          La aplicación no pudo inicializar el servicio de IA. Revisa el siguiente error.
        </p>
        
        <div className="bg-red-900/30 border border-red-500/50 text-red-300 p-3 rounded-lg mb-8 text-sm text-left font-mono">
            <p>{error}</p>
        </div>

        <div className="text-left bg-gray-900/50 p-6 rounded-lg border border-gray-700">
            <h2 className="text-xl font-bold mb-4 text-cyan-400">Cómo Solucionarlo en Vercel</h2>
            <ol className="list-decimal list-inside space-y-3 text-gray-300">
                <li>Ve al panel de control de tu proyecto en <strong>Vercel</strong>.</li>
                <li>Navega a la pestaña <strong>Settings</strong> y luego a <strong>Environment Variables</strong>.</li>
                <li>Crea una nueva variable con el nombre (Key) <code className="bg-gray-700 text-yellow-300 px-2 py-1 rounded">API_KEY</code>.</li>
                <li>Pega tu clave de API de Google Gemini en el campo <strong>Value</strong>.</li>
                <li>Asegúrate de que la variable esté disponible en todos los entornos (Production, Preview, Development).</li>
                <li>Guarda los cambios y <strong>vuelve a desplegar (Redeploy)</strong> tu proyecto para aplicar la nueva configuración.</li>
            </ol>
        </div>

      </div>
    </div>
  );
};

export default ConfigurationErrorScreen;
