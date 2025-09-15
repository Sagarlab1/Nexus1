import React from 'react';
import { ACCELERATOR_PROGRAM, ACCELERATOR_SKILLS } from '../constants';
import StarIcon from './icons/StarIcon';

interface ProgramsPageProps {
  onUnlockAccelerator: () => void;
  onUnlockOdyssey: () => void;
}

const ProgramsPage: React.FC<ProgramsPageProps> = ({ onUnlockAccelerator, onUnlockOdyssey }) => {
  return (
    <div className="w-full h-full bg-gray-900 text-white p-8 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold mb-4">Elige tu Camino de Evolución</h1>
        <p className="text-xl text-gray-300 mb-12">Programas diseñados para forjar a la próxima generación de líderes e innovadores.</p>

        {/* Pricing Section */}
        <div className="grid md:grid-cols-2 gap-8">
            {/* Accelerator Plan */}
            <div className="bg-gray-800/50 p-8 rounded-lg border border-gray-700 flex flex-col">
                <h2 className="text-3xl font-bold text-cyan-400">Acelerador Sapiens</h2>
                <p className="text-gray-400 mt-2 mb-6">Un programa estructurado de 3 meses para dominar las habilidades del futuro.</p>
                <button 
                    onClick={onUnlockAccelerator}
                    className="mt-auto bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 rounded-lg"
                >
                    Desbloquear Acelerador por $49
                </button>
            </div>
            {/* Odyssey Plan */}
            <div className="bg-gray-800/50 p-8 rounded-lg border-2 border-yellow-400 flex flex-col">
                <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-bold text-yellow-400">Odisea Sapiens</h2>
                    <StarIcon className="text-yellow-400 w-8 h-8"/>
                </div>
                <p className="text-gray-400 mt-2 mb-6">Forja tu propio camino. Un plan de estudios 100% personalizado por IA para tu meta única.</p>
                <button 
                    onClick={onUnlockOdyssey}
                    className="mt-auto bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold py-3 rounded-lg"
                >
                    Forjar mi Odisea por $99
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ProgramsPage;