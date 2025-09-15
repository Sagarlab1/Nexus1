// FIX: Implemented the SkillTree component to resolve module errors.
import React from 'react';
import { ACCELERATOR_SKILLS } from '../constants';
import BrainIcon from './icons/BrainIcon';
import TeamIcon from './icons/TeamIcon';
import BulbIcon from './icons/BulbIcon';

const categoryIcons = {
  'Pensamiento Estratégico': <BrainIcon className="w-6 h-6 mr-3 text-cyan-400" />,
  'Liderazgo y Comunicación': <TeamIcon className="w-6 h-6 mr-3 text-yellow-400" />,
  'Innovación y Creatividad': <BulbIcon className="w-6 h-6 mr-3 text-purple-400" />,
};

const SkillTree: React.FC = () => {
  const skillsByCategory = ACCELERATOR_SKILLS.reduce((acc, skill) => {
    acc[skill.category] = acc[skill.category] || [];
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, typeof ACCELERATOR_SKILLS>);

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-lg p-6 shadow-lg shadow-black/20">
      <h2 className="text-xl font-bold mb-1 text-white">Árbol de Habilidades</h2>
      <p className="text-sm text-cyan-400 font-mono mb-4">COMPETENCIAS CLAVE DEL ACELERADOR</p>
      <div className="space-y-4">
        {Object.entries(skillsByCategory).map(([category, skills]) => (
          <div key={category}>
            <h3 className="text-lg font-semibold text-white flex items-center mb-2">
              {categoryIcons[category as keyof typeof categoryIcons]}
              {category}
            </h3>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span key={skill.name} className="bg-gray-700 text-gray-300 text-sm font-medium px-3 py-1 rounded-full">
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillTree;
