import React, { useState } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import type { Odyssey } from '../types';
import RocketIcon from './icons/RocketIcon';
import NexusLogo from './icons/NexusLogo';

interface OdysseyGeneratorProps {
  odysseys: Odyssey[];
  setOdysseys: React.Dispatch<React.SetStateAction<Odyssey[]>>;
  onBack: () => void;
}

const OdysseyGenerator: React.FC<OdysseyGeneratorProps> = ({ odysseys, setOdysseys, onBack }) => {
  const [topic, setTopic] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setIsLoading(true);
    setError(null);
    try {
      // FIX: Initialize GoogleGenAI with a named apiKey parameter.
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      // FIX: Call generateContent with model, contents, and config.
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Genera una "Odisea" de desarrollo personal de 5 pasos para aprender sobre "${topic}". La odisea debe tener un título creativo, una breve descripción y 5 pasos claros y accionables.`,
        config: {
          responseMimeType: 'application/json',
          // FIX: Use responseSchema for structured JSON output.
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: 'Título creativo para la odisea de aprendizaje.' },
              description: { type: Type.STRING, description: 'Una breve descripción de la odisea.' },
              steps: {
                type: Type.ARRAY,
                description: 'Los 5 pasos de la odisea.',
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING, description: 'El título del paso.' },
                    completed: { type: Type.BOOLEAN, description: 'Estado de completado, siempre falso por defecto.' },
                  },
                },
              },
            },
          },
        },
      });

      // FIX: Extract text from the response object.
      const jsonStr = response.text.trim();
      const newOdyssey = JSON.parse(jsonStr) as Omit<Odyssey, 'id'>;

      setOdysseys(prev => [{ id: `o-${Date.now()}`, ...newOdyssey }, ...prev]);
      setTopic('');
    } catch (err) {
      console.error('Error generating odyssey:', err);
      setError('No se pudo generar la Odisea. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-lg shadow-lg shadow-black/20 flex flex-col h-[calc(100vh-4rem)]">
      <div className="p-4 border-b border-gray-700/50 flex items-center">
        <button onClick={onBack} className="mr-4 p-2 rounded-full hover:bg-gray-700/70 transition-colors">
            &larr;
        </button>
        <div>
            <h2 className="text-xl font-bold text-white">Generador de Odiseas</h2>
            <p className="text-sm text-gray-400">Crea planes de aprendizaje sobre cualquier tema.</p>
        </div>
      </div>
      <div className="p-6">
        <div className="relative">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Ej: Aprender sobre React, Empezar a meditar..."
            className="w-full bg-gray-800 border border-gray-600 rounded-lg pr-32 pl-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            disabled={isLoading}
          />
          <button
            onClick={handleGenerate}
            disabled={!topic.trim() || isLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-purple-600 hover:bg-purple-500 disabled:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2"
          >
            {isLoading ? <NexusLogo className="w-5 h-5 animate-spin" /> : <RocketIcon className="w-5 h-5" />}
            <span>{isLoading ? 'Generando...' : 'Generar'}</span>
          </button>
        </div>
        {error && <p className="text-red-400 mt-2 text-sm">{error}</p>}
      </div>
      <div className="flex-1 p-6 pt-0 overflow-y-auto space-y-4">
        {odysseys.map(odyssey => (
            <div key={odyssey.id} className="bg-gray-800/60 p-5 rounded-lg border border-gray-700">
                <h3 className="text-xl font-bold text-purple-300">{odyssey.title}</h3>
                <p className="text-gray-400 mt-1 mb-4">{odyssey.description}</p>
                <ul className="space-y-2">
                    {odyssey.steps.map((step, index) => (
                        <li key={index} className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded-full border-2 ${step.completed ? 'bg-purple-500 border-purple-500' : 'border-gray-500'}`} />
                            <span className={`${step.completed ? 'text-gray-500 line-through' : 'text-gray-200'}`}>{step.title}</span>
                        </li>
                    ))}
                </ul>
            </div>
        ))}
      </div>
    </div>
  );
};

export default OdysseyGenerator;
