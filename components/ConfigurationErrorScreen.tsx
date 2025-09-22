import React from 'react';
import AlertTriangleIcon from './icons/AlertTriangleIcon';
import NexusLogo from './icons/NexusLogo';

interface ConfigurationErrorScreenProps {
  errorMessage: string | null;
}

const ConfigurationErrorScreen: React.FC<ConfigurationErrorScreenProps> = ({ errorMessage }) => {
  return (
    <div className="fixed inset-0 bg-gray-900 z-50 flex flex-col items-center justify-center p-4 text-white">
      <div className="w-full max-w-2xl mx-auto bg-gray-800 border border-red-500/30 rounded-lg p-8 shadow-2xl text-center">
        <AlertTriangleIcon className="w-16 h-16 text-red-400 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-red-300 mb-2">Error de Configuración</h1>
        <p className="text-gray-300 mb-6">
          La aplicación no pudo inicializar el servicio de IA. Esto usualmente significa que la API Key no está configurada correctamente en el entorno de despliegue.
        </p>

        <div className="bg-gray-900/50 p-4 rounded-md border border-gray-700/80 text-left mb-6">
          <p className="font-mono text-sm text-red-400 break-words">
            <strong>Mensaje de Error:</strong> {errorMessage || "No se proporcionó un mensaje de error."}
          </p>
        </div>

        <div className="text-left space-y-4">
          <h2 className="text-xl font-semibold text-cyan-300">¿Cómo solucionarlo en Vercel?</h2>
          
          <div className="bg-gray-700/30 p-4 rounded-lg">
              <p className="font-bold">Paso 1: Ve a la configuración de tu proyecto en Vercel.</p>
              <p className="text-sm text-gray-400">Navega a tu proyecto, luego a la pestaña "Settings" y selecciona "Environment Variables".</p>
          </div>

          <div className="bg-gray-700/30 p-4 rounded-lg">
              <p className="font-bold">Paso 2: Asegúrate de que la variable de entorno exista y sea correcta.</p>
              <ul className="text-sm text-gray-400 list-disc list-inside mt-2 space-y-1">
                <li>El nombre de la variable <strong className="text-cyan-400">DEBE SER EXACTAMENTE</strong> <code className="bg-gray-900 px-1 py-0.5 rounded">NEXT_PUBLIC_API_KEY</code>. El prefijo `NEXT_PUBLIC_` es obligatorio para que Vercel la exponga al navegador.</li>
                <li>El valor debe ser tu clave de API de Google Gemini.</li>
              </ul>
          </div>
          
          <div className="bg-gray-700/30 p-4 rounded-lg">
              <p className="font-bold">Paso 3: Vuelve a desplegar tu aplicación.</p>
              <p className="text-sm text-gray-400">Después de añadir o cambiar la variable, necesitas crear un nuevo "deployment" (despliegue) para que los cambios tengan efecto. Puedes hacerlo desde la pestaña "Deployments" de tu proyecto.</p>
          </div>
        </div>

        <button
          onClick={() => window.location.reload()}
          className="mt-8 w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-bold py-3 px-8 rounded-lg text-lg transition-all"
        >
          Refrescar la página después de configurar
        </button>

      </div>
    </div>
  );
};

export default ConfigurationErrorScreen;
