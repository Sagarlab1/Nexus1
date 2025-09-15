import React, { useState, useEffect } from 'react';
import { GoogleGenAI, Type, GenerateContentResponse } from '@google/genai';
import { ACCELERATOR_PROGRAM } from '../constants';
import NexusLogo from './icons/NexusLogo';
import DocumentIcon from './icons/DocumentIcon';

interface WeeklyCodexProps {
  week: number;
  rank: string;
  onBack: () => void;
}

interface CodexContent {
    title: string;
    introduction: string;
    core_concepts: { concept: string; explanation: string }[];
    practical_exercise: { title: string; steps: string[] };
    inspiring_quote: { quote: string; author: string };
}


const WeeklyCodex: React.FC<WeeklyCodexProps> = ({ week, rank, onBack }) => {
  const [codex, setCodex] = useState<CodexContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const weekData = ACCELERATOR_PROGRAM.find(w => w.week === week);

  useEffect(() => {
    const generateCodex = async () => {
      if (!weekData) {
        setError("Datos de la semana no encontrados.");
        setIsLoading(false);
        return;
      }

      try {
        // FIX: Initialize GoogleGenAI with a named apiKey parameter.
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const prompt = `Genera un "Códice Semanal" para un participante del programa "Acelerador Sapiens".
        
        Semana: ${weekData.week} - ${weekData.title}
        Enfoque de la semana: ${weekData.focus}
        Desafío práctico de la semana: ${weekData.challenge}
        Rango del participante: ${rank}
        
        El códice debe ser una guía profunda y motivadora. Adapta la complejidad y profundidad al rango del participante.
        Estructura la respuesta EXACTAMENTE en el siguiente formato JSON:`;
        
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
                        title: { type: Type.STRING },
                        introduction: { type: Type.STRING },
                        core_concepts: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    concept: { type: Type.STRING },
                                    explanation: { type: Type.STRING }
                                }
                            }
                        },
                        practical_exercise: {
                            type: Type.OBJECT,
                            properties: {
                                title: { type: Type.STRING },
                                steps: { type: Type.ARRAY, items: { type: Type.STRING }}
                            }
                        },
                        inspiring_quote: {
                            type: Type.OBJECT,
                            properties: {
                                quote: { type: Type.STRING },
                                author: { type: Type.STRING }
                            }
                        }
                    }
                }
            }
        });

        // FIX: Access the generated text directly from the 'text' property of the response.
        const jsonText = response.text;
        const parsedCodex = JSON.parse(jsonText);
        setCodex(parsedCodex);
      } catch (e) {
        console.error("Error generating codex:", e);
        setError("No se pudo generar el códice. Por favor, intenta de nuevo.");
      } finally {
        setIsLoading(false);
      }
    };

    generateCodex();
  }, [week, rank, weekData]);

  if (isLoading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-white p-8">
        <NexusLogo className="w-16 h-16 text-cyan-400 animate-spin" />
        <p className="mt-4 text-xl">Generando tu Códice Semanal...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-white p-8">
        <p className="text-xl text-red-500">{error}</p>
        <button onClick={onBack} className="mt-4 text-cyan-400 hover:text-cyan-300">&larr; Volver</button>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-lg shadow-lg shadow-black/20 text-white p-8 overflow-y-auto">
      <button onClick={onBack} className="mb-8 text-cyan-400 hover:text-cyan-300">&larr; Volver a los Desafíos</button>
      {codex && (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
                <p className="text-cyan-400 font-mono">SEMANA {week}</p>
                <h1 className="text-5xl font-bold mt-2">{codex.title}</h1>
            </div>

            <div className="bg-gray-800/50 p-6 rounded-lg mb-8">
                <p className="text-lg text-gray-300 whitespace-pre-wrap">{codex.introduction}</p>
            </div>

            <h2 className="text-3xl font-bold mb-4 border-b-2 border-cyan-500 pb-2">Conceptos Clave</h2>
            <div className="space-y-4 mb-8">
                {codex.core_concepts.map((item, index) => (
                    <div key={index} className="bg-gray-800/50 p-4 rounded-lg">
                        <h3 className="text-xl font-semibold text-cyan-400">{item.concept}</h3>
                        <p className="text-gray-300 mt-1">{item.explanation}</p>
                    </div>
                ))}
            </div>

             <h2 className="text-3xl font-bold mb-4 border-b-2 border-cyan-500 pb-2">Ejercicio Práctico</h2>
             <div className="bg-gray-800/50 p-6 rounded-lg mb-8">
                <h3 className="text-2xl font-semibold mb-4">{codex.practical_exercise.title}</h3>
                <ol className="list-decimal list-inside space-y-2 text-gray-300">
                    {codex.practical_exercise.steps.map((step, index) => <li key={index}>{step}</li>)}
                </ol>
             </div>

            <div className="border-t-2 border-gray-700 pt-8 mt-8 text-center">
                <p className="text-2xl italic text-gray-300">"{codex.inspiring_quote.quote}"</p>
                <p className="mt-2 text-cyan-400">- {codex.inspiring_quote.author}</p>
            </div>
        </div>
      )}
    </div>
  );
};

export default WeeklyCodex;
