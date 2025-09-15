import React, { useState, useEffect } from 'react';
// FIX: Import GoogleGenAI from the correct package
import { GoogleGenAI } from "@google/genai";
import { ACCELERATOR_PROGRAM } from '../constants';
import NexusLogo from './icons/NexusLogo';

// FIX: Initialize Gemini API client as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

interface WeeklyCodexProps {
  week: number;
  rank: string;
  onBack: () => void;
}

const WeeklyCodex: React.FC<WeeklyCodexProps> = ({ week, rank, onBack }) => {
  const [codexContent, setCodexContent] = useState('');
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

      setIsLoading(true);
      setError(null);
      
      const prompt = `
        Eres Nexus, una IA mentora para el programa "Acelerador Sapiens".
        Genera un "Códice Semanal" para un participante con el rango de "${rank}".
        El códice debe ser un documento profundo, inspirador y accionable.

        Semana: ${weekData.week}
        Título: "${weekData.title}"
        Enfoque Principal: "${weekData.focus}"
        Desafío Práctico: "${weekData.challenge}"

        Estructura del Códice (usa markdown con ** para negritas):
        1.  **Introducción Filosófica:** Una reflexión corta pero potente sobre la importancia del tema de la semana (${weekData.focus}), conectándolo con el desarrollo personal y profesional.
        2.  **Conceptos Clave (Profundización):** Explica los 2-3 conceptos más importantes del enfoque de la semana. Usa analogías y ejemplos claros. Adapta la profundidad al rango de "${rank}". Para un rango bajo, sé más introductorio. Para un rango alto, introduce matices más complejos.
        3.  **Guía para el Desafío Práctico:** Ofrece una guía paso a paso, consejos y posibles escollos a evitar para completar el desafío: "${weekData.challenge}".
        4.  **Recursos Adicionales:** Sugiere 2-3 recursos (un libro, un artículo/paper, y un video/podcast) para explorar el tema más a fondo.
        5.  **Reflexión Final:** Cierra con una pregunta poderosa o una cita inspiradora para que el participante medite durante la semana.

        El tono debe ser sabio, encouraging, y ligeramente formal. El objetivo es empoderar al participante.
      `;

      try {
        // FIX: Use the correct method 'generateContent' and model name 'gemini-2.5-flash'
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
        });
        
        // FIX: Access the generated text directly from the 'text' property
        setCodexContent(response.text);

      } catch (err) {
        console.error("Error generating codex:", err);
        setError("No se pudo generar el códice. Por favor, intenta de nuevo más tarde.");
      } finally {
        setIsLoading(false);
      }
    };

    generateCodex();
  }, [week, rank, weekData]);

  return (
    <div className="w-full h-full bg-gray-900 text-white p-8 overflow-y-auto animate-fade-in">
      <div className="max-w-4xl mx-auto">
        <button onClick={onBack} className="mb-8 text-cyan-400 hover:text-cyan-300">&larr; Volver al Acelerador</button>
        {weekData && (
          <>
            <p className="text-sm font-mono text-cyan-400">Semana {weekData.week}</p>
            <h1 className="text-4xl font-bold mt-1 mb-2">Códice: {weekData.title}</h1>
            <p className="text-lg text-gray-400 mb-8">Un resumen de inteligencia para tu rango de <span className="font-semibold text-cyan-300">{rank}</span>.</p>
          </>
        )}
        
        <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700/50 min-h-[50vh]">
          {isLoading && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <NexusLogo className="w-12 h-12 text-cyan-400 animate-spin mb-4" />
              <p className="text-lg text-gray-300">Generando tu códice semanal...</p>
              <p className="text-sm text-gray-500">Analizando conceptos clave y adaptando el contenido a tu nivel.</p>
            </div>
          )}
          {error && <p className="text-red-400">{error}</p>}
          {!isLoading && !error && (
            <div className="prose prose-invert prose-lg max-w-none whitespace-pre-wrap">
              {codexContent}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WeeklyCodex;
