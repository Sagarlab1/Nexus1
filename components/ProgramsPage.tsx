import React from 'react';
import BrainIcon from './icons/BrainIcon.tsx';
import BulbIcon from './icons/BulbIcon.tsx';
import RocketIcon from './icons/RocketIcon.tsx';
import CodeIcon from './icons/CodeIcon.tsx';

const skills = [
  {
    id: 'critical_thinking',
    name: 'Pensamiento Crítico',
    description: 'Aprende a analizar información, deconstruir problemas complejos y tomar decisiones estratégicas con la guía de Stratego.',
    icon: BrainIcon,
    color: 'cyan',
    price: '$499 USD'
  },
  {
    id: 'creativity',
    name: 'Creatividad e Innovación',
    description: 'Desbloquea tu potencial creativo, genera ideas disruptivas y aprende a aplicar la innovación en cualquier campo con Innova.',
    icon: BulbIcon,
    color: 'purple',
    price: '$499 USD'
  },
  {
    id: 'entrepreneurship',
    name: 'Emprendimiento y Liderazgo',
    description: 'Desarrolla la mentalidad y las habilidades para liderar, construir proyectos y navegar el viaje del emprendedor junto a Nexus.',
    icon: RocketIcon,
    color: 'yellow',
    price: '$499 USD'
  },
  {
    id: 'gen_ai',
    name: 'Inteligencia Artificial Generativa',
    description: 'Domina las fronteras de la tecnología, aprende a utilizar herramientas de IA y comprende su impacto en el futuro con Oraculo.',
    icon: CodeIcon,
    color: 'pink',
    price: '$499 USD'
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
}

const ProgramsPage: React.FC<ProgramsPageProps> = ({ onOpenPremium }) => {
  return (
    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-lg shadow-lg shadow-black/20 flex flex-col h-full p-8 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-white mb-2">Programas de Aceleración de 3 Meses</h1>
        <p className="text-lg text-center text-cyan-400 font-mono mb-10">FORJA LAS 4 HABILIDADES DEL FUTURO</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {skills.map((skill) => {
            const styles = skillColorStyles[skill.color];
            return (
              <div 
                key={skill.name} 
                className={`bg-gray-800/60 p-6 rounded-lg border-2 border-transparent ${styles.hoverBorder} cursor-pointer transition-all duration-300 flex flex-col group`}
                onClick={onOpenPremium}
                role='button'
                tabIndex={0}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onOpenPremium()}
              >
                <div className="flex items-center mb-4">
                  <skill.icon className={`w-10 h-10 mr-4 ${styles.text}`} />
                  <h2 className={`text-2xl font-bold text-white`}>{skill.name}</h2>
                </div>
                <p className="text-gray-300 flex-1">
                  {skill.description}
                </p>
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-700/50">
                  <span className={`text-xl font-bold ${styles.text}`}>{skill.price}</span>
                  <p className="text-sm text-cyan-300 font-semibold group-hover:underline">» Ver Plan Premium</p>
                </div>
              </div>
            )
            })}
        </div>

        <div className="mt-12 text-center bg-gray-800 p-6 rounded-lg">
            <h3 className="text-2xl font-bold text-white mb-2">¿Estás listo para tu evolución?</h3>
            <p className="text-gray-400 mb-4">Nuestros programas intensivos están diseñados para transformar tu manera de pensar y actuar. Adquiere el Plan Premium para un acceso ilimitado.</p>
            <button 
              onClick={onOpenPremium}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-bold py-3 px-6 rounded-lg transition-transform transform hover:scale-105"
            >
                Convertirme en Premium
            </button>
        </div>
      </div>
    </div>
  );
};

export default ProgramsPage;