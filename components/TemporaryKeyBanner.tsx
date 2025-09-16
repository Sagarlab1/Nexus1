import React from 'react';
import InfoIcon from './icons/InfoIcon';
import TrashIcon from './icons/TrashIcon';

interface TemporaryKeyBannerProps {
  onClearKey: () => void;
}

const TemporaryKeyBanner: React.FC<TemporaryKeyBannerProps> = ({ onClearKey }) => {
  return (
    <div className="bg-yellow-900/50 border border-yellow-500/50 text-yellow-200 rounded-lg p-4 flex items-start gap-4 transition-opacity duration-300">
      <InfoIcon className="w-6 h-6 flex-shrink-0 mt-0.5 text-yellow-400" />
      <div className="flex-1">
        <h3 className="font-bold text-white">Clave de API Guardada Localmente</h3>
        <p className="text-sm">
          La clave de API está guardada en este navegador. Para usar una clave diferente o si prefieres configurar la variable de entorno en Vercel, primero debes olvidar la clave actual.
        </p>
      </div>
      <button 
        onClick={onClearKey} 
        title="Olvidar la clave guardada en este navegador"
        className="text-yellow-300 hover:text-white transition-colors p-2 rounded-full hover:bg-yellow-500/20 -mr-1 -mt-1 flex items-center gap-2"
      >
        <TrashIcon className="w-5 h-5" />
        <span className="text-sm">Olvidar Clave</span>
      </button>
    </div>
  );
};

export default TemporaryKeyBanner;