import React from 'react';
import TrophyIcon from './icons/TrophyIcon.tsx';
import FlagIcon from './icons/FlagIcon.tsx';

const LatinoChallengesPage: React.FC = () => {
  return (
    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-lg shadow-lg shadow-black/20 flex flex-col h-full p-8 overflow-y-auto">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-block p-4 bg-yellow-500/10 rounded-full mb-4">
            <TrophyIcon className="w-12 h-12 text-yellow-400" />
        </div>
        <h1 className="text-4xl font-bold text-white mb-2">100 Retos para Sapiens Latinos</h1>
        <p className="text-lg text-yellow-400 font-mono mb-10">DEMUESTRA TU INGENIO Y RESILIENCIA</p>

        <div className="bg-gray-800/60 p-8 rounded-lg border border-gray-700">
            <FlagIcon className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4">Próximamente</h2>
            <p className="text-gray-300">
                Estamos preparando una serie de 100 desafíos diseñados específicamente para poner a prueba y desarrollar el talento único de la comunidad latina. Desde problemas de lógica y estrategia hasta retos de creatividad y emprendimiento, prepárate para llevar tus habilidades al siguiente nivel.
            </p>
             <p className="text-gray-400 mt-4">
                ¡Mantente atento para el lanzamiento de este programa exclusivo!
            </p>
        </div>
        
      </div>
    </div>
  );
};

export default LatinoChallengesPage;