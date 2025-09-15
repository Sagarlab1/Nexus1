import React from 'react';
import StarIcon from './icons/StarIcon';
import RocketIcon from './icons/RocketIcon';
import { ACCELERATOR_PROGRAM, ACCELERATOR_SKILLS } from '../constants';
import BrainIcon from './icons/BrainIcon';
import TeamIcon from './icons/TeamIcon';

interface ProgramsPageProps {
  onBack: () => void;
  onUnlockAccelerator: () => void;
  onUnlockOdyssey: () => void;
}

const ProgramsPage: React.FC<ProgramsPageProps> = ({ onBack, onUnlockAccelerator, onUnlockOdyssey }) => {
  return (
    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-lg shadow-lg shadow-black/20 flex flex-col h-[calc(100vh-8rem)] md:h-[calc(100vh-4.5rem)]">
      <div className="p-6 border-b border-gray-700/50 flex items-center justify-between sticky top-0 bg-gray-900/80 backdrop-blur-sm z-10">
        <div>
          <h1 className="text-2xl font-bold text-white">Programas Premium</h1>
          <p className="text-yellow-400 font-mono">ELEVA TU POTENCIAL</p>
        </div>
        <button onClick={onBack} className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg text-sm transition-colors">
          &larr; Volver al Panel
        </button>
      </div>
      <div className="flex-1 p-6 overflow-y-auto space-y-12 animate-fadeIn">
        
        {/* Accelerator Program Details */}
        <div>
            <div className="text-center mb-10">
                <StarIcon className="w-12 h-12 text-yellow-400 mx-auto mb-4"/>
                <h1 className="text-4xl font-bold text-white mb-2">Acelerador Sapiens</h1>
                <p className="text-yellow-400 font-mono text-lg">PROGRAMA DE EVOLUCIÓN DE 12 SEMANAS</p>
                <p className="mt-4 text-gray-300 max-w-3xl mx-auto">
                    Un programa intensivo diseñado para forjar la próxima generación de innovadores, estrategas y líderes.
                    Domina las habilidades críticas para navegar y dar forma al futuro.
                </p>
            </div>
    
            {/* Skills DNA */}
             <div>
                <h2 className="text-2xl font-bold mb-6 text-center text-cyan-400">ADN de Habilidades a Dominar</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 text-center">
                    <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
                        <BrainIcon className="w-10 h-10 text-blue-400 mx-auto mb-3" />
                        <h3 className="text-lg font-semibold">Pensamiento Estratégico</h3>
                         <ul className="text-sm text-gray-400 mt-2 space-y-1">
                            <li>Deconstrucción Socrática</li>
                            <li>Primeros Principios</li>
                            <li>Pensamiento Sistémico</li>
                        </ul>
                    </div>
                     <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
                        <RocketIcon className="w-10 h-10 text-green-400 mx-auto mb-3" />
                        <h3 className="text-lg font-semibold">Innovación y Creatividad</h3>
                        <ul className="text-sm text-gray-400 mt-2 space-y-1">
                            <li>Lluvia de Ideas Divergente</li>
                            <li>Prototipado Rápido</li>
                            <li>Validación Lean</li>
                        </ul>
                    </div>
                     <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
                        <TeamIcon className="w-10 h-10 text-purple-400 mx-auto mb-3" />
                        <h3 className="text-lg font-semibold">Liderazgo y Comunicación</h3>
                        <ul className="text-sm text-gray-400 mt-2 space-y-1">
                            <li>Narrativa de Influencia</li>
                            <li>Feedback Constructivo</li>
                            <li>Liderazgo Resonante</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Curriculum */}
            <div>
                <h2 className="text-2xl font-bold mb-4 text-center text-cyan-400">Plan de Estudios</h2>
                <div className="space-y-3 max-w-4xl mx-auto">
                  {ACCELERATOR_PROGRAM.map(week => (
                    <div key={week.week} className="bg-gray-800/60 p-4 rounded-lg border border-gray-700 flex items-start">
                        <div className="text-cyan-400 font-bold text-lg w-12 text-center flex-shrink-0">
                            <span className="text-xs font-mono block">SEM</span>
                            {week.week}
                        </div>
                        <div className="ml-4">
                            <h3 className="font-semibold text-white">{week.title}</h3>
                            <p className="text-sm text-gray-300"><span className="font-semibold text-gray-400">Foco:</span> {week.focus}</p>
                            <p className="text-sm text-gray-300 mt-1"><span className="font-semibold text-gray-400">Desafío:</span> {week.challenge}</p>
                        </div>
                    </div>
                  ))}
                </div>
            </div>
        </div>

        {/* Pricing Section */}
        <div className="pt-12 border-t border-gray-700/50">
             <h2 className="text-3xl font-bold text-center text-white mb-2">Elige tu Camino de Evolución</h2>
             <p className="text-center text-gray-400 mb-8">Invierte en tu futuro. Acceso completo, un único pago.</p>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {/* Accelerator Plan */}
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 flex flex-col">
                    <h3 className="text-2xl font-bold text-yellow-400">Acelerador Sapiens</h3>
                    <p className="text-gray-300 mt-2 mb-4 flex-grow">El programa estructurado de 12 semanas para dominar las habilidades del futuro.</p>
                    <p className="text-4xl font-bold text-white mb-4">$49 <span className="text-lg font-normal text-gray-400">/ Pago Único</span></p>
                    <button
                        onClick={onUnlockAccelerator}
                        className="w-full bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-white font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105"
                    >
                        Desbloquear Acelerador por $49
                    </button>
                </div>

                {/* Odyssey Plan */}
                 <div className="bg-gray-800 p-6 rounded-lg border-2 border-cyan-500 flex flex-col shadow-lg shadow-cyan-500/20">
                    <div className="flex justify-between items-center">
                        <h3 className="text-2xl font-bold text-cyan-400">Odisea Sapiens</h3>
                        <span className="text-xs font-bold bg-cyan-500 text-white py-1 px-2 rounded-full">RECOMENDADO</span>
                    </div>
                    <p className="text-gray-300 mt-2 mb-4 flex-grow">Todo lo del Acelerador, <span className="font-bold text-white">más</span> el poder de crear tus propios planes de estudio personalizados con IA.</p>
                    <p className="text-4xl font-bold text-white mb-4">$99 <span className="text-lg font-normal text-gray-400">/ Pago Único</span></p>
                    <button
                        onClick={onUnlockOdyssey}
                        className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105"
                    >
                        Forjar mi Odisea por $99
                    </button>
                </div>
             </div>
        </div>

      </div>
       <style>{`
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
            animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default ProgramsPage;