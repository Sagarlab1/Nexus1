import React, { useState } from 'react';
import { ACCELERATOR_PROGRAM } from './constants';
import DocumentIcon from './components/icons/DocumentIcon';
import WeeklyCodex from './components/WeeklyCodex';
import type { Rank } from './types';

interface ChallengesPageProps {
  onBack: () => void;
  currentRank: Rank;
}

const ChallengesPage: React.FC<ChallengesPageProps> = ({ onBack, currentRank }) => {
  const [codexWeek, setCodexWeek] = useState<number | null>(null);

  if (codexWeek !== null) {
    return <WeeklyCodex week={codexWeek} rank={currentRank.name} onBack={() => setCodexWeek(null)} />;
  }

  return (
    <div className="w-full h-full bg-gray-900 text-white p-8 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        <button onClick={onBack} className="mb-8 text-cyan-400 hover:text-cyan-300">&larr; Volver al Panel</button>
        <h1 className="text-5xl font-bold mb-4">El Acelerador Sapiens</h1>
        <p className="text-xl text-gray-300 mb-12">Un programa de 3 meses para forjar a la próxima generación de líderes e innovadores.</p>

        <div className="space-y-8">
          {ACCELERATOR_PROGRAM.map(week => (
            <div key={week.week} className="bg-gray-800/50 p-6 rounded-lg border border-gray-700/50">
              <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-mono text-cyan-400">Semana {week.week}</p>
                    <h2 className="text-2xl font-bold mt-1 mb-2">{week.title}</h2>
                    <p className="text-gray-400 mb-4"><span className="font-semibold text-gray-300">Enfoque:</span> {week.focus}</p>
                    <p className="text-gray-400"><span className="font-semibold text-gray-300">Desafío Práctico:</span> {week.challenge}</p>
                  </div>
                   <button 
                    onClick={() => setCodexWeek(week.week)}
                    className="ml-4 flex-shrink-0 p-2 rounded-full hover:bg-gray-700 transition-colors" title="Generar Códice Semanal">
                    <DocumentIcon className="w-6 h-6 text-gray-400" />
                   </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChallengesPage;
