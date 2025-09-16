import React from 'react';
import NexusLogo from './icons/NexusLogo';
import AlertTriangleIcon from './icons/AlertTriangleIcon';
import RefreshIcon from './icons/RefreshIcon';

type Status = 'checking' | 'error';

interface ApiStatusOverlayProps {
  status: Status;
  errorDetails: string | null;
  onRetry: () => void;
}

const parseError = (error: string | null): { title: string; isSpecific: boolean } => {
  if (!error) {
    return { title: 'Error Desconocido', isSpecific: false };
  }
  const lowerError = error.toLowerCase();
  if (lowerError.includes('api key not valid') || lowerError.includes('api_key_invalid')) {
    return { title: 'Clave de API Inválida', isSpecific: true };
  }
  if (lowerError.includes('billing')) {
    return { title: 'Problema de Facturación', isSpecific: true };
  }
  if (lowerError.includes('permission denied') || lowerError.includes('disabled')) {
    return { title: 'API Deshabilitada o Sin Permisos', isSpecific: true };
  }
  if (lowerError.includes('quota')) {
    return { title: 'Límite de Cuota Excedido', isSpecific: true };
  }
  if (lowerError.includes('location')) {
      return { title: 'Ubicación no Soportada', isSpecific: true };
  }
  return { title: 'Error de Conexión con la API', isSpecific: false };
};


const ApiStatusOverlay: React.FC<ApiStatusOverlayProps> = ({ status, errorDetails, onRetry }) => {
  const { title, isSpecific } = parseError(errorDetails);

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
            <h1 className="text-3xl font-bold mb-4">{title}</h1>
            <p className="text-gray-300 mb-6">
              {isSpecific ? 'Se ha identificado un problema específico. Revisa los detalles y la solución sugerida.' : 'No se pudo establecer una conexión exitosa con la API de Gemini.'}
            </p>

            <div className="bg-gray-900 p-4 rounded-lg text-left mb-6">
                 <p className="font-bold mb-2 text-red-300">Detalles del Error:</p>
                <p className="text-gray-300 font-mono whitespace-pre-wrap text-sm">{errorDetails || 'No se proporcionaron detalles.'}</p>
            </div>
            
            <div className="text-left mb-8">
                <p className="font-bold text-yellow-300">Pasos para Solucionarlo:</p>
                <ul className="list-disc list-inside text-gray-300 mt-2 space-y-2">
                    <li className={title.includes('Clave') ? 'font-bold text-white' : ''}>Asegúrate de que tu clave de API sea correcta y no haya expirado.</li>
                    <li className={title.includes('Facturación') ? 'font-bold text-white' : ''}>Verifica que la <a href="https://console.cloud.google.com/billing" target="_blank" rel="noopener noreferrer" className="underline hover:text-white">facturación esté habilitada</a> para tu proyecto de Google Cloud.</li>
                    <li className={title.includes('API') || title.includes('Permisos') ? 'font-bold text-white' : ''}>Confirma que la <a href="https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-white">API de Gemini (Generative Language API)</a> esté activada en tu proyecto.</li>
                    <li className={title.includes('Ubicación') ? 'font-bold text-white' : ''}>Confirma que estás accediendo desde una <a href="https://ai.google.dev/available_regions" target="_blank" rel="noopener noreferrer" className="underline hover:text-white">región soportada</a>.</li>
                    <li>Si has restringido tu clave de API, asegúrate de que el dominio de esta aplicación esté en la lista de permitidos.</li>
                </ul>
            </div>
            <button
                onClick={onRetry}
                className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-6 rounded-lg text-lg transition-transform transform hover:scale-105 shadow-lg shadow-cyan-500/30 flex items-center justify-center mx-auto"
            >
                <RefreshIcon className="w-5 h-5 mr-2" />
                Volver a Intentar
            </button>
         </div>
      )}
    </div>
  );
};

export default ApiStatusOverlay;