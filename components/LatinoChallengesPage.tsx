import React from 'react';
import { LATINO_CHALLENGES } from '../constants';

interface LatinoChallengesPageProps {
  onBack: () => void;
}

const LatinoChallengesPage: React.FC<LatinoChallengesPageProps> = ({ onBack }) => {
  return (
    <div className="w-full h-full bg-gray-900 text-white p-8 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        <button onClick={onBack} className="mb-8 text-cyan-400 hover:text-cyan-300">&larr; Volver</button>
        <h1 className="text-5xl font-bold mb-4">Los 100 Grandes Desafíos de Latinoamérica</h1>
        <p className="text-xl text-gray-300 mb-12">Un manifiesto de los retos y oportunidades que definen el presente y futuro de la región.</p>

        {LATINO_CHALLENGES.map(category => (
          <div key={category.category} className="mb-8">
            <h2 className="text-3xl font-bold border-b-2 border-cyan-500 pb-2 mb-4">{category.category}</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-300">
              {category.challenges.map((challenge, index) => (
                <li key={index}>{challenge}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LatinoChallengesPage;