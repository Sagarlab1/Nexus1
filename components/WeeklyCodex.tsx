// FIX: Implemented the WeeklyCodex component to resolve module errors.
import React, { useState, useEffect } from 'react';
// FIX: Use GoogleGenAI from "@google/genai"
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
  const [error, setError] = useState('');

  const weekData = ACCELERATOR_PROGRAM.find(w => w.week === week);

  useEffect(() => {
    const generateCodex = async () => {
      if (!weekData) {
        setError('Datos de la semana no encontrados.');
        setIsLoading(false);
        return;
      }

      if (!process.env.API_KEY) {
        setError("API key not found. Please set the API_KEY environment variable.");
        setIsLoading(false);
        return;
      }

      try {
        // FIX: Initialize GoogleGenAI with a named apiKey object
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const prompt = `
          Eres "Stratego", un IA estratega y mentor experto.
          Tu tarea es generar un "Códice Semanal" para un participante del "Acelerador Sapiens".

          **Contexto del Participante:**
          - Rango Actual: ${rank}
          - Semana del Programa: ${week}
          - Título de la Semana: "${weekData.title}"
          - Enfoque Principal: "${weekData.focus}"
          - Desafío Práctico: "${weekData.challenge}"

          **Instrucciones para el Códice:**
          1.  **Título:** Crea un título inspirador para el códice de esta semana.
          2.  **Introducción (1 párrafo):** Una breve introducción que conecte el tema de la semana con el crecimiento personal y profesional del participante, ajustando el tono a su rango de '${rank}'.
          3.  **Conceptos Clave (3-4 bullets):** Explica los conceptos más importantes del enfoque de la semana de manera clara y concisa. Usa analogías o ejemplos simples.
          4.  **Estrategia para el Desafío (1-2 párrafos):** Ofrece un plan de acción o una estrategia paso a paso para abordar el desafío práctico de la semana. Sé muy concreto y accionable.
          5.  **Reflexión Profunda (1 pregunta):** Plantea una pregunta poderosa que invite al participante a reflexionar profundamente sobre el tema de la semana y su aplicación personal.

          **Formato de Salida:**
          Usa Markdown para formatear tu respuesta. Utiliza títulos (##), listas con viñetas (*) y negritas (**) para estructurar el contenido de forma clara y legible.
          No incluyas el prompt en la respuesta, solo el códice generado.
        `;
        
        // FIX: Use ai.models.generateContent with the correct model name
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
        });

        // FIX: Access the response text directly via the .text property
        setCodex(response.text);

      } catch (e) {
        console.error(e);
        setError('Hubo un error al generar el códice. Por favor, intenta de nuevo.');
      } finally {
        setIsLoading(false);
      }
    };

    generateCodex();
  }, [week, rank, weekData]);

  if (!weekData) {
    return (
      <div className="p-8 text-white">
        <h2 className="text-2xl text-red-500">Error</h2>
        <p>No se pudieron encontrar los datos para la semana {week}.</p>
        <button onClick={onBack} className="mt-4 text-cyan-400 hover:text-cyan-300">&larr; Volver</button>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-gray-900 text-white p-8 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        <button onClick={onBack} className="mb-8 text-cyan-400 hover:text-cyan-300">&larr; Volver al Acelerador</button>
        <p className="text-sm font-mono text-cyan-400">Semana {weekData.week}</p>
        <h1 className="text-4xl font-bold mt-1 mb-4">{weekData.title}</h1>
        
        <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700/50">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center min-h-[300px]">
              <NexusLogo className="w-12 h-12 text-cyan-400 animate-spin" />
              <p className="mt-4 text-gray-400">Generando tu Códice Semanal...</p>
            </div>
          ) : error ? (
            <p className="text-red-400">{error}</p>
          ) : (
            <div className="whitespace-pre-wrap font-sans text-gray-300">{codex}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WeeklyCodex;
