import React, { useState } from 'react';
import { GoogleGenAI, Type, GenerateContentResponse } from '@google/genai';
import type { Odyssey } from '../types';
import RocketIcon from './icons/RocketIcon';
import NexusLogo from './icons/NexusLogo';

interface OdysseyGeneratorProps {
  onBack: () => void;
}

const OdysseyGenerator: React.FC<OdysseyGeneratorProps> = ({ onBack }) => {
  const [goal, setGoal] = useState('');
  const [duration, setDuration] = useState('3');
  const [odyssey, setOdyssey] = useState<Odyssey | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateOdyssey = async () => {
    if (!goal.trim()) {
      setError('Por favor, define tu meta principal.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setOdyssey(null);

    try {
      // FIX: Initialize GoogleGenAI with a named apiKey parameter.
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Crea un plan de aprendizaje detallado llamado "Odisea Sapiens" para un usuario que quiere alcanzar la siguiente meta: "${goal}". El plan debe tener una duración de ${duration} meses. Estructura la respuesta en JSON. El título de la odisea debe ser creativo y relacionado con la meta. La descripción debe ser motivadora. Los pasos deben ser claros, accionables y distribuidos lógicamente a lo largo de los meses. Genera al menos 10 pasos.`;

      // FIX: Use ai.models.generateContent for a single, non-chat generation.
      const response: GenerateContentResponse = await ai.models.generateContent({
        // FIX: Use the 'gemini-2.5-flash' model for general text tasks.
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          // FIX: Set responseMimeType to 'application/json' for JSON output.
          responseMimeType: 'application/json',
          // FIX: Define a responseSchema to enforce a structured JSON output.
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
                  required: ['title', 'completed'],
                },
              },
            },
            required: ['id', 'title', 'description', 'steps'],
          },
        },
      });

      // FIX: Access the generated text directly from the 'text' property of the response.
      const jsonText = response.text;
      const parsedOdyssey = JSON.parse(jsonText);
      setOdyssey(parsedOdyssey);
    } catch (e) {
      console.error('Error generating odyssey:', e);
      setError('No se pudo generar la Odisea. Por favor, intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const toggleStep = (index: number) => {
    if (odyssey) {
        const newSteps = [...odyssey.steps];
        newSteps[index].completed = !newSteps[index].completed;
        setOdyssey({...odyssey, steps: newSteps});
    }
  };


  return (
    <div className="w-full h-full bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-lg shadow-lg shadow-black/20 p-8 overflow-y-auto">
      <button onClick={onBack} className="mb-8 text-cyan-400 hover:text-cyan-300">&larr; Volver a Programas</button>
      <div className="max-w-3xl mx-auto text-center">
        <RocketIcon className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
        <h1 className="text-5xl font-bold mb-4">Forja tu Odisea Sapiens</h1>
        <p className="text-xl text-gray-300 mb-12">Define tu meta. La IA creará tu camino de evolución personalizado.</p>
      </div>

      {!odyssey && (
        <div className="max-w-xl mx-auto space-y-6">
          <div>
            <label htmlFor="goal" className="block text-lg font-semibold mb-2">¿Cuál es tu gran meta?</label>
            <textarea
              id="goal"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="Ej: Convertirme en un experto en IA y lanzar mi propia startup."
              className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              rows={4}
            />
          </div>
          <div>
            <label htmlFor="duration" className="block text-lg font-semibold mb-2">Duración del plan</label>
            <select
              id="duration"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              <option value="1">1 Mes</option>
              <option value="3">3 Meses</option>
              <option value="6">6 Meses</option>
              <option value="12">12 Meses</option>
            </select>
          </div>
          <button
            onClick={generateOdyssey}
            disabled={isLoading}
            className="w-full bg-yellow-500 hover:bg-yellow-400 disabled:bg-gray-600 text-gray-900 font-bold py-3 rounded-lg text-lg transition-transform transform hover:scale-105"
          >
            {isLoading ? <NexusLogo className="w-6 h-6 mx-auto animate-spin" /> : 'Forjar mi Odisea'}
          </button>
          {error && <p className="text-red-500 mt-4">{error}</p>}
        </div>
      )}

      {odyssey && (
        <div className="max-w-3xl mx-auto mt-12 bg-gray-800/50 p-8 rounded-lg">
           <h2 className="text-3xl font-bold text-yellow-400 text-center">{odyssey.title}</h2>
           <p className="text-gray-300 text-center mt-2 mb-8">{odyssey.description}</p>
           <div className="space-y-4">
               {odyssey.steps.map((step, index) => (
                   <div key={index} onClick={() => toggleStep(index)} className={`p-4 rounded-lg flex items-center cursor-pointer transition-colors ${step.completed ? 'bg-green-500/20' : 'bg-gray-700/50 hover:bg-gray-700'}`}>
                       <div className={`w-6 h-6 rounded-full border-2 flex-shrink-0 mr-4 ${step.completed ? 'bg-green-500 border-green-400' : 'border-gray-500'}`}>
                           {step.completed && <svg className="w-full h-full text-white p-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
                       </div>
                       <p className={`text-lg ${step.completed ? 'line-through text-gray-500' : 'text-white'}`}>{step.title}</p>
                   </div>
               ))}
           </div>
           <button onClick={() => setOdyssey(null)} className="mt-8 w-full bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 rounded-lg">Crear una Nueva Odisea</button>
        </div>
      )}

    </div>
  );
};

export default OdysseyGenerator;
