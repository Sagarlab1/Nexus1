import React, { useState } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import type { Odyssey } from '../types';

interface OdysseyGeneratorProps {
  onBack: () => void;
}

const OdysseyGenerator: React.FC<OdysseyGeneratorProps> = ({ onBack }) => {
  const [goal, setGoal] = useState('');
  const [plan, setPlan] = useState<Odyssey | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!goal.trim()) {
      setError('Por favor, define tu objetivo.');
      return;
    }
    setIsLoading(true);
    setError('');
    setPlan(null);

    try {
      const apiKey = process.env.API_KEY;
      if (!apiKey) throw new Error("API key not found");
      const ai = new GoogleGenAI({ apiKey });

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Crea un plan de aprendizaje de 3 meses para este objetivo: "${goal}". El plan debe llamarse "Mi Odisea Sapiens". Descríbelo brevemente y divídelo en 12 pasos semanales.`,
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
                  }
                }
              }
            }
          }
        }
      });
      
      const parsedPlan = JSON.parse(response.text);
      setPlan(parsedPlan);

    } catch (e) {
      console.error("Error generating odyssey:", e);
      setError('Hubo un error al generar tu plan. Por favor, intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-full bg-gray-900 text-white p-8 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        <button onClick={onBack} className="mb-8 text-cyan-400 hover:text-cyan-300">&larr; Volver al Panel</button>
        <h1 className="text-5xl font-bold mb-4">Generador de Odisea</h1>
        <p className="text-xl text-gray-300 mb-8">Define tu meta. Forja tu camino. La IA diseñará tu plan de estudios personalizado.</p>
        
        <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700/50">
          <textarea
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="Ej: Lanzar una startup de EdTech en 6 meses..."
            className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-lg"
            rows={3}
          />
          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="mt-4 w-full bg-cyan-600 hover:bg-cyan-500 disabled:bg-gray-600 text-white font-bold py-3 rounded-lg"
          >
            {isLoading ? 'Generando tu Odisea...' : 'Generar Plan'}
          </button>
          {error && <p className="text-red-400 mt-2">{error}</p>}
        </div>

        {plan && (
          <div className="mt-8">
            <h2 className="text-3xl font-bold">{plan.title}</h2>
            <p className="text-gray-400 mb-4">{plan.description}</p>
            <div className="space-y-2">
              {plan.steps.map((step, index) => (
                <div key={index} className="flex items-center bg-gray-800 p-3 rounded">
                  <span className="text-cyan-400 mr-3">{index + 1}.</span>
                  <p>{step.title}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OdysseyGenerator;
