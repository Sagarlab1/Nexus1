import React from 'react';
import { ACCELERATOR_PROGRAM, ACCELERATOR_SKILLS } from '../constants';
import BrainIcon from './icons/BrainIcon';
import RocketIcon from './icons/RocketIcon';
import TeamIcon from './icons/TeamIcon';
import StarIcon from './icons/StarIcon';

const AcceleratorPage: React.FC = () => {
  return (
    <div className="text-white p-6 space-y-8 animate-fadeIn">
      <div>
        <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Acelerador Sapiens</h1>
            <p className="text-yellow-400 font-mono text-lg">PROGRAMA DE EVOLUCIÓN DE 12 SEMANAS</p>
            <p className="mt-4 text-gray-300 max-w-3xl mx-auto">
                Un programa intensivo diseñado para forjar la próxima generación de innovadores, estrategas y líderes.
                Domina las habilidades críticas para navegar y dar forma al futuro.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 text-center">
            <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
                <BrainIcon className="w-10 h-10 text-blue-400 mx-auto mb-3" />
                <h3 className="text-lg font-semibold">Pensamiento Estratégico</h3>
                <p className="text-sm text-gray-400 mt-1">Deconstruye problemas complejos y piensa desde primeros principios.</p>
            </div>
             <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
                <RocketIcon className="w-10 h-10 text-green-400 mx-auto mb-3" />
                <h3 className="text-lg font-semibold">Innovación y Creatividad</h3>
                <p className="text-sm text-gray-400 mt-1">Genera ideas disruptivas y valídalas rápidamente en el mundo real.</p>
            </div>
             <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
                <TeamIcon className="w-10 h-10 text-purple-400 mx-auto mb-3" />
                <h3 className="text-lg font-semibold">Liderazgo y Comunicación</h3>
                <p className="text-sm text-gray-400 mt-1">Inspira acción, ofrece feedback constructivo y lidera con resonancia.</p>
            </div>
        </div>

      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4 text-cyan-400">Plan de Estudios</h2>
        <div className="space-y-3">
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
      
      <div>
        <h2 className="text-2xl font-bold mb-4 text-cyan-400">Habilidades Desarrolladas</h2>
         <div className="flex flex-wrap gap-3">
            {ACCELERATOR_SKILLS.map(skill => (
                <div key={skill.name} className="bg-gray-700/80 text-sm text-white py-1.5 px-3 rounded-full flex items-center gap-2">
                    <StarIcon className="w-4 h-4 text-yellow-400" />
                    {skill.name}
                </div>
            ))}
         </div>
      </div>
      <style>{`
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        .animate-fadeIn {
            animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default AcceleratorPage;
