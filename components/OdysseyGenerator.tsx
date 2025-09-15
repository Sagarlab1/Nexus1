// FIX: Implemented the OdysseyGenerator component to resolve module errors.
import React, { useState } from 'react';
// FIX: Use GoogleGenAI and Type from "@google/genai"
import { GoogleGenAI, Type } from '@google/genai';
import type { Odyssey } from '../types';
import NexusLogo from './icons/NexusLogo';

interface OdysseyGeneratorProps {
  onOdysseyCreated: (odyssey: Odyssey) => void;
  onBack: () => void;
}

const OdysseyGenerator: React.FC<OdysseyGeneratorProps> = ({ onOdysseyCreated, onBack }) => {
  const [goal, setGoal] = useState('');
  const [duration, setDuration] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!goal.trim() || !duration.trim()) {
      setError('Por favor, completa todos los campos.');
      return;
    }
    setError('');
    setIsLoading(true);

    if (!process.env.API_KEY) {
      setError("API key not found. Please set the API_KEY environment variable.");
      setIsLoading(false);
      return;
    }

    try {
      // FIX: Initialize GoogleGenAI with a named apiKey object
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        Crea un plan de aprendizaje detallado y personalizado llamado "Odisea Sapiens".
        
        **Meta del Usuario:** "${goal}"
        **Duración Deseada:** "${duration}"

        **Instrucciones:**
        1.  **Título de la Odisea:** Crea un título épico y motivador para esta odisea de aprendizaje.
        2.  **Descripción:** Escribe una breve descripción (1-2 frases) que resuma el propósito de la odisea.
        3.  **Pasos/Hitos:** Genera entre 5 y 8 pasos o hitos clave para alcanzar la meta. Cada paso debe ser una acción concreta y medible.
        
        Devuelve el resultado ÚNICAMENTE en formato JSON.
      `;

      // FIX: Use ai.models.generateContent with the correct model and JSON schema config
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
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
                  },
                  required: ['title'],
                },
              },
            },
            required: ['title', 'description', 'steps'],
          },
        },
      });
      
      // FIX: Access the response text directly and parse the JSON
      const jsonResponse = JSON.parse(response.text);
      
      const newOdyssey: Odyssey = {
        id: `odyssey-${Date.now()}`,
        title: jsonResponse.title,
        description: jsonResponse.description,
        steps: jsonResponse.steps.map((step: { title: string }) => ({ ...step, completed: false })),
      };
      
      onOdysseyCreated(newOdyssey);

    } catch (e) {
      console.error(e);
      setError('Hubo un error al forjar tu Odisea. Inténtalo de nuevo con una meta más clara.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-full bg-gray-900 text-white p-8 overflow-y-auto">
      <div className="max-w-2xl mx-auto">
        <button onClick={onBack} className="mb-8 text-cyan-400 hover:text-cyan-300">&larr; Volver</button>
        <h1 className="text-5xl font-bold mb-4">Forja tu Odisea Sapiens</h1>
        <p className="text-xl text-gray-300 mb-12">Define tu gran meta y la IA creará un plan de evolución personalizado para ti.</p>

        <div className="space-y-6 bg-gray-800/50 p-8 rounded-lg border border-gray-700/50">
          <div>
            <label htmlFor="goal" className="block text-lg font-semibold text-gray-200 mb-2">¿Cuál es tu gran meta u objetivo?</label>
            <textarea
              id="goal"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="Ej: Convertirme en un desarrollador Full-Stack especializado en IA en los próximos 6 meses."
              className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 resize-y"
              rows={3}
            />
          </div>
          <div>
            <label htmlFor="duration" className="block text-lg font-semibold text-gray-200 mb-2">¿En cuánto tiempo quieres lograrlo?</label>
            <input
              id="duration"
              type="text"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="Ej: 6 meses, 1 año..."
              className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>
          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="w-full bg-yellow-500 hover:bg-yellow-400 disabled:bg-gray-600 text-gray-900 font-bold py-3 px-6 rounded-lg transition-colors text-lg flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <NexusLogo className="w-6 h-6 mr-3 animate-spin" />
                Forjando...
              </>
            ) : (
              'Forjar mi Odisea'
            )}
          </button>
          {error && <p className="text-red-400 text-center">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default OdysseyGenerator;
