import React from 'react';
import NexusLogo from './icons/NexusLogo';

interface LoginScreenProps {
  onLogin: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  return (
    <div className="fixed inset-0 bg-gray-900 z-50 flex flex-col items-center justify-center">
      <div className="text-center p-8 max-w-lg mx-auto">
        <NexusLogo className="w-24 h-24 text-cyan-400 mx-auto mb-6" />
        <h1 className="text-5xl font-bold text-white mb-4">Bienvenido a Nexus Sapiens</h1>
        <p className="text-lg text-gray-300 mb-8">
            Una interfaz de IA conversacional diseñada para expandir tu intelecto y acelerar tu evolución.
        </p>
        <button
          onClick={onLogin}
          className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-bold py-3 px-8 rounded-lg text-lg transition-transform transform hover:scale-105 shadow-lg shadow-cyan-500/30"
        >
          Iniciar Evolución
        </button>
      </div>
    </div>
  );
};

export default LoginScreen;
