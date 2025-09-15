import React from 'react';
import NexusLogo from './icons/NexusLogo';

const IntroScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-gray-900 z-50 flex flex-col items-center justify-center animate-fadeOut">
      <div className="flex flex-col items-center gap-6 animate-fadeInUp">
        <NexusLogo className="w-24 h-24 text-cyan-400" />
        <div className="text-center">
            <h1 className="text-5xl font-bold text-white">Nexus Sapiens</h1>
            <p className="text-lg text-cyan-400 mt-2">Evolve Your Mind.</p>
        </div>
      </div>
      <style>{`
        @keyframes fadeOut {
          0% { opacity: 1; }
          80% { opacity: 1; }
          100% { opacity: 0; visibility: hidden; }
        }
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeOut {
          animation: fadeOut 3s forwards;
        }
        .animate-fadeInUp {
          animation: fadeInUp 1.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default IntroScreen;
