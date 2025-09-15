// FIX: Implemented the IntroScreen component to resolve module errors.
import React from 'react';
import NexusLogo from './icons/NexusLogo';

interface IntroScreenProps {
  onStart: () => void;
}

const IntroScreen: React.FC<IntroScreenProps> = ({ onStart }) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-center p-8 bg-gray-900 text-white">
      <NexusLogo className="w-20 h-20 text-cyan-400 mb-6 animate-pulse" />
      <h1 className="text-4xl md:text-5xl font-bold mb-4">Bienvenido a Nexus Sapiens</h1>
      <p className="text-lg md:text-xl text-gray-300 max-w-2xl mb-8">
        Una interfaz de IA conversacional diseñada para expandir tu intelecto y acelerar tu evolución.
      </p>
      <button
        onClick={onStart}
        className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-bold py-3 px-8 rounded-lg text-lg transition-transform transform hover:scale-105 shadow-lg shadow-cyan-500/30"
      >
        Iniciar
      </button>
    </div>
  );
};

export default IntroScreen;
