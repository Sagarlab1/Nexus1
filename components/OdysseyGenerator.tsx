import React, { useState } from 'react';
// FIX: Import GoogleGenAI and Type from @google/genai
import { GoogleGenAI, Type } from '@google/genai';
import type { Odyssey } from '../types';
import RocketIcon from './icons/RocketIcon';
import NexusLogo from './icons/NexusLogo';

// Per instructions, API key must be from process.env
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const OdysseyGenerator: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [odyssey, setOdyssey] = useState<Odyssey | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateOdyssey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setIsLoading(true);
    setError(null);
    setOdyssey(null);

    try {
      // FIX: Use ai.models.generateContent with a JSON response schema
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Crea un plan de aprendizaje o "Odisea" para el tema: "${topic}". La odisea debe tener un título, una breve descripción y una lista de 5 a 7 pasos o hitos de aprendizaje.`,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              steps: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    completed: { type: Type.BOOLEAN },
                  },
                  required: ['title', 'completed'],
                },
              },
            },
            required: ['title', 'description', 'steps'],
          },
        },
      });
      
      const jsonText = response.text.trim();
      const parsedOdyssey = JSON.parse(jsonText);
      setOdyssey({ id: Date.now().toString(), ...parsedOdyssey });

    } catch (err) {
      console.error("Error generating odyssey:", err);
      setError("No se pudo generar la Odisea. El tema puede ser demasiado complejo. Inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-lg p-6 shadow-lg shadow-black/20 text-white mt-6">
       <div className="flex items-center mb-4">
        <RocketIcon className="w-6 h-6 text-cyan-400 mr-3" />
        <div>
          <h2 className="text-xl font-bold">Generador de Odiseas</h2>
          <p className="text-sm text-cyan-400 font-mono">TRAZA TU RUTA DE APRENDIZAJE</p>
        </div>
      </div>

      <form onSubmit={generateOdyssey} className="flex gap-2 mb-4">
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Ej: Aprender sobre React"
          className="flex-1 bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 text-sm"
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading || !topic.trim()} className="bg-cyan-600 hover:bg-cyan-500 disabled:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg text-sm">
          {isLoading ? <NexusLogo className="w-5 h-5 animate-spin" /> : 'Crear'}
        </button>
      </form>
      
      {error && <p className="text-red-500 text-center text-sm mb-4">{error}</p>}
      
      {odyssey && (
        <div className="mt-4 animate-fadeIn">
            <h3 className="text-lg font-bold text-cyan-400">{odyssey.title}</h3>
            <p className="text-sm text-gray-300 mb-4">{odyssey.description}</p>
            <ul className="space-y-2">
                {odyssey.steps.map((step, index) => (
                    <li key={index} className="bg-gray-800/70 p-2 rounded-md text-sm flex items-center">
                       <input type="checkbox" className="mr-3 h-4 w-4 rounded bg-gray-700 border-gray-600 text-cyan-600 focus:ring-cyan-500" />
                       <span>{step.title}</span>
                    </li>
                ))}
            </ul>
        </div>
      )}
    </div>
  );
};

export default OdysseyGenerator;
