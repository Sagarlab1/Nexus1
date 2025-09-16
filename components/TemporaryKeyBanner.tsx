import React from 'react';
import InfoIcon from './icons/InfoIcon';

const TemporaryKeyBanner: React.FC = () => {
  const [isVisible, setIsVisible] = React.useState(true);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="bg-yellow-900/50 border border-yellow-500/50 text-yellow-200 rounded-lg p-4 flex items-start gap-4 transition-opacity duration-300">
      <InfoIcon className="w-6 h-6 flex-shrink-0 mt-0.5 text-yellow-400" />
      <div className="flex-1">
        <h3 className="font-bold text-white">Modo de Sesión Temporal</h3>
        <p className="text-sm">
          ¡Éxito! La clave funciona. Recuerda que esta clave solo está activa para esta sesión. Para un acceso permanente, debes configurar la variable de entorno <code className="bg-yellow-500/20 text-yellow-300 font-mono p-1 rounded text-xs">API_KEY</code> en Vercel y volver a desplegar tu proyecto.
        </p>
      </div>
      <button onClick={() => setIsVisible(false)} className="text-yellow-300 hover:text-white transition-colors p-1 -mr-1 -mt-1">&times;</button>
    </div>
  );
};

export default TemporaryKeyBanner;
