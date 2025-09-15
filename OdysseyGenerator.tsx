import React, { useState } from 'react';
// Fix: Import necessary types and classes from @google/genai
import { GoogleGenAI, Type, GenerateContentResponse } from '@google/genai';
import type { Odyssey } from './types';
import RocketIcon from './components/icons/RocketIcon';
import NexusLogo from './components/icons/NexusLogo';

// Fix: Initialize the GoogleGenAI client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

interface OdysseyGeneratorProps {
  onBack: () => void;
  onOdysseyGenerated: (odyssey: Odyssey) => void;
}

const OdysseyGenerator: React.FC<OdysseyGeneratorProps> = ({ onBack, onOdysseyGenerated }) => {
  const [topic, setTopic] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedOdyssey, setGeneratedOdyssey] = useState<Odyssey | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setIsLoading(true);
    setError(null);
    setGeneratedOdyssey(null);

    const prompt = `Create a detailed, step-by-step learning plan or "Odyssey" for the topic: "${topic}". The plan should have a main title, a short description, and exactly 5 actionable steps. Each step should have a title and be marked as not completed. The id should be a unique string.`;

    try {
      // Fix: Correctly call generateContent with model, contents, and JSON config.
      const response: GenerateContentResponse = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
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
                  required: ["title", "completed"],
                },
              },
            },
            required: ["id", "title", "description", "steps"],
          },
        },
      });
      
      const jsonText = response.text.trim();
      const parsedOdyssey = JSON.parse(jsonText);
      setGeneratedOdyssey(parsedOdyssey);
    } catch (e) {
      console.error("Error generating Odyssey:", e);
      setError("Failed to generate the learning plan. The model might be busy or the request could not be fulfilled. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-lg shadow-lg shadow-black/20 flex flex-col h-[calc(100vh-4rem)]">
      <div className="p-4 border-b border-gray-700/50 flex items-center">
        <button onClick={onBack} className="mr-4 p-2 rounded-full hover:bg-gray-700/70 transition-colors">&larr;</button>
        <div>
          <h2 className="text-xl font-bold text-white">Generador de Odiseas</h2>
          <p className="text-sm text-gray-400">Crea un plan de aprendizaje sobre cualquier tema.</p>
        </div>
      </div>
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="mb-4">
          <label htmlFor="topic" className="block text-sm font-medium text-gray-300 mb-2">Tema de la Odisea:</label>
          <input
            type="text"
            id="topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Ej: Fundamentos de la física cuántica"
            className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </div>
        <button
          onClick={handleGenerate}
          disabled={isLoading || !topic.trim()}
          className="w-full flex justify-center items-center gap-2 bg-yellow-600 hover:bg-yellow-500 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg p-3 font-bold transition-colors"
        >
          {isLoading ? <NexusLogo className="w-6 h-6 animate-spin" /> : <RocketIcon className="w-6 h-6" />}
          {isLoading ? 'Generando...' : 'Crear Odisea'}
        </button>
        
        {error && <p className="mt-4 text-red-400 text-center">{error}</p>}

        {generatedOdyssey && (
          <div className="mt-6 bg-gray-800/50 p-5 rounded-lg border border-gray-700">
            <h3 className="text-2xl font-bold text-yellow-400">{generatedOdyssey.title}</h3>
            <p className="text-gray-300 mt-2 mb-4">{generatedOdyssey.description}</p>
            <ul className="space-y-3">
              {generatedOdyssey.steps.map((step, index) => (
                <li key={index} className="flex items-center p-3 bg-gray-700/50 rounded-md">
                  <div className="w-5 h-5 border-2 border-gray-500 rounded-full mr-4" />
                  <span>{step.title}</span>
                </li>
              ))}
            </ul>
             <button
              onClick={() => onOdysseyGenerated(generatedOdyssey)}
              className="mt-6 w-full bg-cyan-600 hover:bg-cyan-500 rounded-lg p-3 font-bold transition-colors"
            >
              Añadir a mis Odiseas y Volver
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OdysseyGenerator;
