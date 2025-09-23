import React from 'react';
import BrainIcon from './icons/BrainIcon.tsx';
import BulbIcon from './icons/BulbIcon.tsx';
import RocketIcon from './icons/RocketIcon.tsx';
import CodeIcon from './icons/CodeIcon.tsx';
import type { View } from '../types.ts';

const skills = [
  {
    id: 'critical_thinking',
    name: 'Pensamiento Crítico',
    description: 'Aprende a analizar información, deconstruir problemas complejos y tomar decisiones estratégicas con la guía de Stratego.',
    icon: BrainIcon,
    color: 'cyan',
  },
  {
    id: 'creativity',
    name: 'Creatividad e Innovación',
    description: 'Desbloquea tu potencial creativo, genera ideas disruptivas y aprende a aplicar la innovación en cualquier campo con Innova.',
    icon: BulbIcon,
    color: 'purple',
  },
  {
    id: 'entrepreneurship',
    name: 'Emprendimiento y Liderazgo',
    description: 'Desarrolla la mentalidad y las habilidades para liderar, construir proyectos y navegar el viaje del emprendedor junto a Nexus.',
    icon: RocketIcon,
    color: 'yellow',
  },
  {
    id: 'gen_ai',
    name: 'Inteligencia Artificial Generativa',
    description: 'Domina las fronteras de la tecnología, aprende a utilizar herramientas de IA y comprende su impacto en el futuro con Oraculo.',
    icon: CodeIcon,
    color: 'pink',
  }
];

const skillColorStyles: Record<string, { hoverBorder: string; text: string }> = {
  cyan: {
    hoverBorder: 'hover:border-cyan-500',
    text: 'text-cyan-400',
  },
  purple: {
    hoverBorder: 'hover:border-purple-500',
    text: 'text-purple-400',
  },
  yellow: {
    hoverBorder: 'hover:border-yellow-500',
    text: 'text-yellow-400',
  },
  pink: {
    hoverBorder: 'hover:border-pink-500',
    text: 'text-pink-400',
  },
};

interface ProgramsPageProps {
  onOpenPremium: () => void;
  onNavigate: (view: View, agentId?: string) => void;
}

const ProgramsPage: React.FC<ProgramsPageProps> = ({ onOpenPremium, onNavigate }) => {
  return (
    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-lg shadow-lg shadow-black/20 flex flex-col h-full p-8 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-white mb-2">Programas de Aceleración</h1>
        <p className="text-lg text-center text-cyan-400 font-mono mb-10">FORJA LAS 4 HABILIDADES DEL FUTURO</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {skills.map((skill) => {
            const styles = skillColorStyles[skill.color];
            const courseView = `${skill.id}_course` as View;
            return (
              <div 
                key={skill.name} 
                className={`bg-gray-800/60 p-6 rounded-lg border-2 border-transparent ${styles.hoverBorder} cursor-pointer transition-all duration-300 flex flex-col group`}
                onClick={() => onNavigate(courseView, skill.id)}
                role='button'
                tabIndex={0}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onNavigate(courseView, skill.id)}
              >
                <div className="flex items-center mb-4">
                  <skill.icon className={`w-10 h-10 mr-4 ${styles.text}`} />
                  <h2 className={`text-2xl font-bold text-white`}>{skill.name}</h2>
                </div>
                <p className="text-gray-300 flex-1">
                  {skill.description}
                </p>
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-700/50">
                   <span className={`text-lg font-bold ${styles.text}`}>Gratis</span>
                  <p className="text-sm text-cyan-300 font-semibold group-hover:underline">» Iniciar Curso</p>
                </div>
              </div>
            )
            })}
        </div>

        <div className="mt-12 text-center bg-gray-800 p-6 rounded-lg">
            <h3 className="text-2xl font-bold text-white mb-2">¿Quieres acceso total?</h3>
            <p className="text-gray-400 mb-4">Estos cursos son una introducción. Adquiere el Plan Premium para un acceso ilimitado a todos los programas avanzados, agentes IA y retos exclusivos.</p>
            <button 
              onClick={onOpenPremium}
              className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-gray-900 font-bold py-3 px-6 rounded-lg transition-transform transform hover:scale-105"
            >
                Ver Plan Premium
            </button>
        </div>
      </div>
    </div>
  );
};

export default ProgramsPage;