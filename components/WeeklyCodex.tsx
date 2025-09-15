
import React, { useState, useCallback } from 'react';
// Correct import for Gemini API
import { GoogleGenAI } from '@google/genai';
import DocumentIcon from './icons/DocumentIcon';
import NexusLogo from './icons/NexusLogo'; // for loading spinner

// Per instructions, API key must be from process.env
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const WeeklyCodex: React.FC = () => {
  const [codexEntry, setCodexEntry] = useState(
    "El conocimiento es la brújula, pero la acción es el viaje. Cada paso, por pequeño que sea, te acerca a una nueva versión de ti mismo."
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateCodex = useCallback(async () => {
    setIsGenerating(true);
    setError(null);
    try {
      // FIX: Use ai.models.generateContent to generate a new codex entry
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: "Genera una entrada de 'Códice' corta e perspicaz (alrededor de 30-50 palabras) sobre el crecimiento personal, el aprendizaje o la tecnología futura. El tono debe ser inspirador y que invite a la reflexión, como una pieza de sabiduría para un aprendiz avanzado.",
        config: {
            temperature: 0.9,
            topP: 1,
            topK: 32,
        }
      });
      // FIX: Extract text directly from the response object
      setCodexEntry(response.text);
    } catch (e) {
      console.error("Error generating codex:", e);
      setError("No se pudo generar una nueva entrada. Inténtalo de nuevo más tarde.");
    } finally {
      setIsGenerating(false);
    }
  }, []);

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-lg p-6 shadow-lg shadow-black/20 text-white mt-6">
      <div className="flex items-center mb-4">
        <DocumentIcon className="w-6 h-6 text-cyan-400 mr-3" />
        <div>
          <h2 className="text-xl font-bold">Códice Semanal</h2>
          <p className="text-sm text-cyan-400 font-mono">PÍLDORA DE SABIDURÍA</p>
        </div>
      </div>

      <div className="bg-gray-800/50 p-4 rounded-md min-h-[100px] flex items-center justify-center mb-4">
        {isGenerating ? (
          <NexusLogo className="w-8 h-8 text-cyan-500 animate-spin"/>
        ) : (
          <p className="text-gray-300 italic text-center">"{codexEntry}"</p>
        )}
      </div>

      {error && <p className="text-red-400 text-xs text-center mb-2">{error}</p>}

      <button
        onClick={generateCodex}
        disabled={isGenerating}
        className="w-full bg-gray-700 hover:bg-gray-600 disabled:bg-gray-600/50 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
      >
        {isGenerating ? 'Generando...' : 'Generar Nuevo Códice'}
      </button>
    </div>
  );
};

export default WeeklyCodex;
