import React from 'react';
import AlertTriangleIcon from './icons/AlertTriangleIcon';

interface ConfigurationErrorScreenProps {
  error: Error;
  onReset: () => void;
}

const ConfigurationErrorScreen: React.FC<ConfigurationErrorScreenProps> = ({ error, onReset }) => {
  return (
    <div className="fixed inset-0 bg-gray-900 z-50 flex flex-col items-center justify-center p-4 text-white">
      <div className="w-full max-w-lg mx-auto text-center">
        <div className="mb-8">
          <AlertTriangleIcon className="w-20 h-20 text-red-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold">Error de Configuración</h1>
          <p className="text-gray-400 mt-2">
            No se pudo inicializar la aplicación.
          </p>
        </div>

        <div className="bg-gray-800/50 p-6 rounded-lg text-left mb-8">
          <p className="font-mono text-sm text-red-400 break-words">
            {error.message || 'Ocurrió un error desconocido.'}
          </p>
        </div>

        <button
          onClick={onReset}
          className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-bold py-3 px-8 rounded-lg text-lg transition-transform transform hover:scale-105 shadow-lg shadow-cyan-500/30"
        >
          Recargar Página
        </button>
      </div>
    </div>
  );
};

export default ConfigurationErrorScreen;