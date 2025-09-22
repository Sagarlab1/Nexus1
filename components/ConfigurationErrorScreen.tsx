
import React from 'react';
import AlertTriangleIcon from './icons/AlertTriangleIcon';

interface ConfigurationErrorScreenProps {
  error: string | null;
}

const ConfigurationErrorScreen: React.FC<ConfigurationErrorScreenProps> = ({ error }) => {
  return (
    <div className="fixed inset-0 bg-gray-900 z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl mx-auto bg-gray-800 border border-red-500/30 rounded-lg p-8 shadow-2xl text-white">
        <div className="flex items-center mb-6">
          <AlertTriangleIcon className="w-10 h-10 text-red-400 mr-4 flex-shrink-0" />
          <div>
            <h1 className="text-3xl font-bold text-white">Error de Configuración</h1>
            <p className="text-red-300">{error || 'No se pudo conectar con la IA de Google.'}</p>
          </div>
        </div>
        
        <div className="text-left space-y-4 text-gray-300">
            <p>
                Este error casi siempre ocurre porque la API Key de Google Gemini no está configurada correctamente para ser accedida desde el navegador en Vercel.
            </p>
            <h2 className="text-xl font-semibold text-cyan-400 pt-2">Cómo solucionarlo en Vercel:</h2>
            
            <ol className="list-decimal list-inside space-y-3 pl-2">
                <li>
                    Ve al <strong className="text-white">Dashboard de tu Proyecto</strong> en Vercel.
                </li>
                <li>
                    Navega a la pestaña de <strong className="text-white">"Settings"</strong> y luego a <strong className="text-white">"Environment Variables"</strong>.
                </li>
                <li>
                    Asegúrate de que existe una variable con el siguiente nombre exacto (es muy importante que empiece con <code className="bg-gray-700 text-yellow-300 px-1 py-0.5 rounded-md text-sm">NEXT_PUBLIC_</code>):
                    <div className="bg-gray-900 p-3 rounded-md mt-2 font-mono text-center text-lg">
                        NEXT_PUBLIC_API_KEY
                    </div>
                </li>
                <li>
                    En el campo del valor (<strong className="text-white">Value</strong>), pega tu API Key de Google Gemini.
                </li>
                <li>
                    <strong className="text-white">Guarda</strong> los cambios.
                </li>
                <li>
                    Finalmente, ve a la pestaña de <strong className="text-white">"Deployments"</strong>, busca el último despliegue, haz clic en los tres puntos (...) y selecciona <strong className="text-white">"Redeploy"</strong> para aplicar los cambios.
                </li>
            </ol>
            <p className="pt-2">
                Si después de seguir estos pasos el error persiste, verifica que tu API Key sea válida en <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">Google AI Studio</a>.
            </p>
        </div>
      </div>
    </div>
  );
};

export default ConfigurationErrorScreen;
