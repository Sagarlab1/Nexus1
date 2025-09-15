import React, { useState } from 'react';
// FIX: Import GoogleGenAI and Type enum from the correct package
import { GoogleGenAI, Type } from "@google/genai";
import type { Odyssey } from '../types';
import NexusLogo from './icons/NexusLogo';

// FIX: Initialize Gemini API client as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

interface OdysseyGeneratorProps {
  onBack: () => void;
}

const OdysseyGenerator: React.FC<OdysseyGeneratorProps> = ({ onBack }) => {
  const [goal, setGoal] = useState('');
  const [interests, setInterests] = useState('');
  const [experience, setExperience] = useState('Principiante');
  
  const [generatedOdyssey, setGeneratedOdyssey] = useState<Odyssey | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goal.trim()) {
      setError("Por favor, define tu meta principal.");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setGeneratedOdyssey(null);

    const prompt = `
      Crea un plan de aprendizaje personalizado llamado "Odisea Sapiens".
      El objetivo es guiar a un usuario desde su estado actual hasta alcanzar una meta específica.
      Genera un plan de 5 pasos accionables.

      Información del Usuario:
      - Meta Principal: ${goal}
      - Intereses Adicionales: ${interests}
      - Nivel de Experiencia: ${experience}

      Responde ÚNICAMENTE con un objeto JSON que siga el esquema proporcionado. El título y la descripción deben ser inspiradores.
    `;
    
    // FIX: Define responseSchema for structured JSON output
    const odysseySchema = {
      type: Type.OBJECT,
      properties: {
        id: { type: Type.STRING },
        title: { type: Type.STRING, description: "Título inspirador para la odisea." },
        description: { type: Type.STRING, description: "Breve descripción de la odisea." },
        steps: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: "Título de un paso accionable." },
              completed: { type: Type.BOOLEAN, description: "Siempre debe ser 'false' inicialmente." },
            },
            required: ['title', 'completed'],
          },
        },
      },
      required: ['id', 'title', 'description', 'steps'],
    };

    try {
      // FIX: Use generateContent with responseMimeType and responseSchema
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: odysseySchema,
        },
      });

      // FIX: Access text and parse it as JSON
      const jsonText = response.text;
      const parsedOdyssey = JSON.parse(jsonText);
      setGeneratedOdyssey(parsedOdyssey);

    } catch (err) {
      console.error("Error generating odyssey:", err);
      setError("No se pudo forjar tu Odisea. La IA podría estar sobrecargada. Por favor, intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-center p-8 bg-gray-900 text-white">
        <NexusLogo className="w-16 h-16 text-yellow-400 animate-spin mb-6" />
        <h1 className="text-3xl font-bold mb-4">Forjando tu Odisea...</h1>
        <p className="text-lg text-gray-300 max-w-xl">
          Nexus está trazando un camino único basado en tu meta, conectando conocimientos y diseñando hitos para tu evolución.
        </p>
      </div>
    );
  }

  if (generatedOdyssey) {
    return (
      <div className="w-full h-full bg-gray-900 text-white p-8 overflow-y-auto animate-fade-in">
        <div className="max-w-4xl mx-auto">
          <button onClick={() => setGeneratedOdyssey(null)} className="mb-8 text-yellow-400 hover:text-yellow-300">&larr; Forjar otra Odisea</button>
          <h1 className="text-4xl font-bold mb-2">{generatedOdyssey.title}</h1>
          <p className="text-xl text-gray-300 mb-12">{generatedOdyssey.description}</p>
          <div className="space-y-4">
            {generatedOdyssey.steps.map((step, index) => (
              <div key={index} className="bg-gray-800/50 p-4 rounded-lg flex items-center">
                <div className="w-8 h-8 flex-shrink-0 rounded-full bg-gray-700 flex items-center justify-center mr-4">
                  <span className="font-bold text-yellow-400">{index + 1}</span>
                </div>
                <p className="text-lg text-gray-200">{step.title}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-gray-900 text-white p-8 overflow-y-auto">
      <div className="max-w-2xl mx-auto">
        <button onClick={onBack} className="mb-8 text-cyan-400 hover:text-cyan-300">&larr; Volver</button>
        <h1 className="text-5xl font-bold mb-4">Forja tu Odisea Sapiens</h1>
        <p className="text-xl text-gray-300 mb-12">Define tu meta y deja que la IA cree tu plan de estudios 100% personalizado.</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="goal" className="block text-sm font-medium text-gray-300 mb-2">Tu Meta Principal</label>
            <input type="text" id="goal" value={goal} onChange={e => setGoal(e.target.value)} className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500" placeholder="Ej: Convertirme en un experto en IA generativa" />
          </div>
          <div>
            <label htmlFor="interests" className="block text-sm font-medium text-gray-300 mb-2">Tus Intereses Secundarios</label>
            <input type="text" id="interests" value={interests} onChange={e => setInterests(e.target.value)} className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500" placeholder="Ej: Filosofía, neurociencia, arte" />
          </div>
          <div>
            <label htmlFor="experience" className="block text-sm font-medium text-gray-300 mb-2">Tu Nivel de Experiencia</label>
            <select id="experience" value={experience} onChange={e => setExperience(e.target.value)} className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500">
              <option>Principiante</option>
              <option>Intermedio</option>
              <option>Avanzado</option>
            </select>
          </div>
          {error && <p className="text-red-400 text-center">{error}</p>}
          <button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold py-3 px-6 rounded-lg text-lg transition-transform transform hover:scale-105 shadow-lg shadow-yellow-500/30">
            Forjar mi Odisea
          </button>
        </form>
      </div>
    </div>
  );
};

export default OdysseyGenerator;
