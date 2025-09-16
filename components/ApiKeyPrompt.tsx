import React from 'react';
import NexusLogo from './icons/NexusLogo';

const ApiKeyPrompt: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-gray-900 z-50 flex items-center justify-center text-center p-4">
      <div className="bg-gray-800 border border-red-500/30 rounded-2xl shadow-2xl w-full max-w-2xl m-4 text-white p-8">
        <div className="inline-block p-3 bg-red-400/10 rounded-full border border-red-500/30 mb-4">
          <NexusLogo className="w-8 h-8 text-red-400" />
        </div>
        <h1 className="text-3xl font-bold mb-4">Configuración Requerida</h1>
        <p className="text-gray-300 mb-6">
          La clave de API de Google Gemini no está configurada. Para que la aplicación funcione, este secreto debe ser proporcionado en tu entorno de Vercel.
        </p>
        <div className="bg-gray-900 p-6 rounded-lg text-left space-y-4">
          <h2 className="text-xl font-semibold text-cyan-400">Cómo Configurar tu Clave de API en Vercel</h2>
          <ol className="list-decimal list-inside space-y-3 text-gray-300">
            <li>
              Ve al panel de control de tu proyecto en <strong>Vercel</strong>.
            </li>
            <li>
              Navega a la pestaña de <strong>Settings</strong> (Configuración) y luego a la sección <strong>Environment Variables</strong> (Variables de Entorno).
            </li>
            <li>
              Crea una nueva variable. En el campo "Name" (Nombre), introduce exactamente: <code className="bg-yellow-500/20 text-yellow-300 font-mono p-1 rounded mx-1">API_KEY</code>
            </li>
            <li>
              En el campo "Value" (Valor), pega tu clave secreta de la API de Google Gemini.
            </li>
            <li>
              Asegúrate de que la variable esté disponible para todos los entornos (Production, Preview, Development).
            </li>
            <li className="font-bold text-white mt-4 pt-3 border-t border-gray-700">
              <strong>Importante:</strong> Después de guardar la variable, debes ir a la pestaña <strong>Deployments</strong> y crear un nuevo despliegue ("redeploy") para que los cambios surtan efecto.
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyPrompt;
