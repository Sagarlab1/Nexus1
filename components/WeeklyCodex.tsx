import React, { useState, useEffect } from 'react';
import NexusLogo from './icons/NexusLogo';
import { GoogleGenAI } from '@google/genai';

interface WeeklyCodexProps {
  week: number;
  rank: string;
  onBack: () => void;
}

const WeeklyCodex: React.FC<WeeklyCodexProps> = ({ week, rank, onBack }) => {
  const [wisdom, setWisdom] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const generateWisdom = async () => {
      try {
        const apiKey = process.env.API_KEY;
        if (!apiKey) {
          throw new Error("API key not found");
        }
        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: `Genera 3 "píldoras de sabiduría" cortas y profundas para un estudiante en la semana ${week} de un programa de aceleración. El estudiante tiene el rango de '${rank}'. El tema de la semana es el liderazgo. El tono debe ser inspirador y memorable.`,
        });
        setWisdom(response.text);
      } catch (error) {
        console.error("Error generating wisdom:", error);
        setWisdom("No se pudieron generar los insights. Por favor, inténtalo de nuevo.");
      } finally {
        setIsLoading(false);
      }
    };
    generateWisdom();
  }, [week, rank]);

  return (
    <div className="w-full h-full bg-gray-900 text-white p-8 overflow-y-auto flex flex-col">
      <div className="max-w-3xl mx-auto w-full">
         <button onClick={onBack} className="mb-8 text-cyan-400 hover:text-cyan-300">&larr; Volver al Acelerador</button>
      </div>
      <div className="flex-grow flex items-center justify-center">
        <div className="w-full max-w-3xl bg-gray-800 border border-gray-700 p-12 rounded-lg shadow-2xl">
            <div className="flex items-center mb-6">
                 <NexusLogo className="w-10 h-10 text-cyan-400 mr-4"/>
                 <div>
                    <h1 className="text-3xl font-bold">Códice Semanal: Semana {week}</h1>
                    <p className="text-gray-400">Preparado para un Sapiens de Rango: {rank}</p>
                 </div>
            </div>
            
            <h2 className="text-xl font-semibold mb-4 text-cyan-400">Píldoras de Sabiduría</h2>
            {isLoading ? (
                <div className="space-y-2 animate-pulse">
                    <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-700 rounded w-4/5"></div>
                </div>
            ) : (
                <div className="text-gray-300 whitespace-pre-wrap prose prose-invert">
                    {wisdom.replace(/\*/g, '• ')}
                </div>
            )}

            <div className="text-center mt-12">
                 <button className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 px-6 rounded-lg transition-colors">
                    Descargar PDF (Simulado)
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default WeeklyCodex;
