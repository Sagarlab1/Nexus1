import React from 'react';
import NexusLogo from './icons/NexusLogo';
import AlertTriangleIcon from './icons/AlertTriangleIcon';

type Status = 'checking' | 'error';

interface ApiStatusOverlayProps {
  status: Status;
  errorDetails: string | null;
}

const ApiStatusOverlay: React.FC<ApiStatusOverlayProps> = ({ status, errorDetails }) => {
  return (
    <div className="fixed inset-0 bg-gray-900 z-50 flex items-center justify-center text-center p-4">
      {status === 'checking' && (
        <div className="flex flex-col items-center gap-4 text-gray-300">
          <NexusLogo className="w-16 h-16 text-cyan-400 animate-spin" />
          <p className="text-xl">Verificando conexión con la API de Gemini...</p>
        </div>
      )}
      {status === 'error' && (
         <div className="bg-gray-800 border border-red-500/30 rounded-2xl shadow-2xl w-full max-w-2xl m-4 text-white p-8">
            <div className="inline-block p-3 bg-red-400/10 rounded-full border border-red-500/30 mb-4">
              <AlertTriangleIcon className="w-8 h-8 text-red-400" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Error de Conexión con la API</h1>
            <p className="text-gray-300 mb-6">
              No se pudo establecer una conexión exitosa con la API de Gemini.
            </p>

            <div className="bg-gray-900 p-4 rounded-lg text-left mb-6">
                 <p className="font-bold mb-2 text-red-300">Detalles del Error:</p>
                <p className="text-gray-300 font-mono whitespace-pre-wrap text-sm">{errorDetails || 'No se proporcionaron detalles.'}</p>
            </div>
            
            <div className="text-left">
                <p className="font-bold text-yellow-300">Posibles Soluciones:</p>
                <ul className="list-disc list-inside text-gray-300 mt-2 space-y-2">
                    <li>Asegúrate de que tu clave de API sea correcta y no haya expirado.</li>
                    <li>Verifica que la <a href="https://console.cloud.google.com/billing" target="_blank" rel="noopener noreferrer" className="underline hover:text-white">facturación esté habilitada</a> para tu proyecto de Google Cloud.</li>
                    <li>Confirma que la <a href="https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-white">API de Gemini (Generative Language API)</a> esté activada en tu proyecto.</li>
                    <li>Si has restringido tu clave de API, asegúrate de que el dominio de esta aplicación esté en la lista de permitidos.</li>
                </ul>
            </div>
         </div>
      )}
    </div>
  );
};

export default ApiStatusOverlay;
