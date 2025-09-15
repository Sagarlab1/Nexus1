// FIX: Implement WeeklyCodex component to resolve module not found error.
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { ACCELERATOR_PROGRAM } from '../constants';
import NexusLogo from './icons/NexusLogo';

interface WeeklyCodexProps {
  week: number;
  rank: string;
  onBack: () => void;
}

const WeeklyCodex: React.FC<WeeklyCodexProps> = ({ week, rank, onBack }) => {
  const [codex, setCodex] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const weekData = ACCELERATOR_PROGRAM.find(w => w.week === week);

  useEffect(() => {
    const generateCodex = async () => {
      if (!weekData || !process.env.API_KEY) {
        setCodex("No se pudo generar el códice. Falta información o la API Key.");
        setIsLoading(false);
        return;
      }

      // FIX: Initialize GoogleGenAI with named apiKey parameter as per guidelines.
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        **Instrucción de Sistema:**
        Eres un sabio mentor de la academia "Nexus Sapiens". Tu tarea es generar un "Códice Semanal" para un estudiante.
        El códice debe ser profundo, accionable y personalizado según el rango del estudiante.
        
        **Contexto de la Semana ${weekData.week}:**
        - **Título:** ${weekData.title}
        - **Enfoque:** ${weekData.focus}
        - **Desafío Práctico:** ${weekData.challenge}
        
        **Contexto del Estudiante:**
        - **Rango Actual:** ${rank}
        
        **Tu Tarea:**
        Escribe un códice que contenga las siguientes secciones:
        1.  **Reflexión Profunda:** Una breve meditación (2-3 párrafos) sobre el 'Enfoque' de la semana, adaptada a la perspectiva de alguien con el rango de '${rank}'.
        2.  **Sabiduría Clave:** 3-5 puntos clave o "perlas de sabiduría" sobre el tema, presentados como una lista de viñetas.
        3.  **Guía para el Desafío:** Consejos prácticos y detallados para abordar el 'Desafío Práctico' de la semana. Debe ser una guía paso a paso.
        4.  **Recursos Adicionales:** Sugiere 2-3 recursos (libros, artículos, videos, etc.) para profundizar en el tema.
        
        El tono debe ser inspirador, sabio y ligeramente futurista. Formatea la respuesta en Markdown.
      `;

      try {
        // FIX: Use ai.models.generateContent and the 'gemini-2.5-flash' model.
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
        });
        // FIX: Access the generated text directly from the 'text' property.
        setCodex(response.text);
      } catch (error) {
        console.error("Error generating codex:", error);
        setCodex("Ocurrió un error al generar tu códice semanal. Por favor, intenta de nuevo.");
      } finally {
        setIsLoading(false);
      }
    };

    generateCodex();
  }, [week, rank, weekData]);
  
  if (!weekData) {
      return (
          <div className="w-full h-full bg-gray-900 text-white p-8">
              <p>Semana no encontrada.</p>
              <button onClick={onBack} className="mt-4 text-cyan-400">&larr; Volver</button>
          </div>
      );
  }

  return (
    <div className="w-full h-full bg-gray-900 text-white p-8 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        <button onClick={onBack} className="mb-8 text-cyan-400 hover:text-cyan-300">&larr; Volver al Acelerador</button>
        <h1 className="text-4xl font-bold">Códice Semanal {weekData.week}</h1>
        <p className="text-xl text-gray-400 mb-2">{weekData.title}</p>
        <p className="text-md text-cyan-400 font-mono mb-8">Personalizado para Rango: {rank}</p>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <NexusLogo className="w-16 h-16 text-cyan-400 animate-spin" />
            <p className="mt-4 text-gray-300">Generando tu sabiduría semanal...</p>
          </div>
        ) : (
          <div className="prose prose-invert prose-lg max-w-none bg-gray-800/50 p-6 rounded-lg border border-gray-700/50" dangerouslySetInnerHTML={{ __html: codex.replace(/\n/g, '<br />').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
        )}
      </div>
    </div>
  );
};

export default WeeklyCodex;
