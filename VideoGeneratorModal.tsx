import React, { useState } from 'react';
// FIX: Import GoogleGenAI as per guidelines.
import { GoogleGenAI } from "@google/genai";
import VideoIcon from './components/icons/VideoIcon';

// FIX: Initialize Gemini API client as per guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

interface VideoGeneratorModalProps {
  onClose: () => void;
}

const VideoGeneratorModal: React.FC<VideoGeneratorModalProps> = ({ onClose }) => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  const loadingMessages = [
    "Iniciando el motor de renderizado de video...",
    "Sintetizando fotogramas a partir de tu prompt...",
    "Componiendo la secuencia de video...",
    "Aplicando efectos visuales y de iluminación...",
    "Renderizando el audio y sincronizando...",
    "Casi listo, finalizando la codificación del video...",
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("Por favor, introduce un prompt para el video.");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setVideoUrl(null);
    setLoadingMessage(loadingMessages[0]);

    try {
      // FIX: Use generateVideos for video generation
      let operation = await ai.models.generateVideos({
        model: 'veo-2.0-generate-001',
        prompt: prompt,
        config: {
          numberOfVideos: 1
        }
      });
      
      let messageIndex = 1;
      const interval = setInterval(() => {
        setLoadingMessage(loadingMessages[messageIndex % loadingMessages.length]);
        messageIndex++;
      }, 8000);

      // FIX: Poll the operation status until it's done.
      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 10000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
      }
      
      clearInterval(interval);
      
      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      
      if (downloadLink) {
        // FIX: Append API key to the download link for fetching.
        setVideoUrl(`${downloadLink}&key=${process.env.API_KEY}`);
      } else {
        throw new Error("La operación finalizó, pero no se encontró el video.");
      }

    } catch (err) {
      console.error("Error generating video:", err);
      setError("No se pudo generar el video. Por favor, intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-gray-800 border border-purple-500/30 rounded-2xl shadow-2xl w-full max-w-lg m-4 text-white p-8 relative transform transition-all duration-300 scale-95 animate-scale-in" onClick={(e) => e.stopPropagation()}>
        <div className="text-center mb-6">
          <div className="inline-block p-3 bg-purple-400/10 rounded-full border border-purple-500/30 mb-4">
            <VideoIcon className="w-8 h-8 text-purple-400" />
          </div>
          <h2 className="text-3xl font-bold">Generador de Video</h2>
          <p className="text-gray-400">Crea un video corto a partir de una descripción de texto.</p>
        </div>
        
        {isLoading && (
          <div className="text-center p-8">
            <div className="w-12 h-12 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-lg font-semibold">Generando video...</p>
            <p className="text-gray-400 mt-2">{loadingMessage}</p>
          </div>
        )}

        {videoUrl && !isLoading && (
          <div className="text-center">
            <p className="text-lg mb-4 text-green-400">¡Tu video está listo!</p>
            <video controls src={videoUrl} className="w-full rounded-lg" />
            <button onClick={() => setVideoUrl(null)} className="mt-6 w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 rounded-lg">
              Crear Otro Video
            </button>
          </div>
        )}

        {!isLoading && !videoUrl && (
          <div className="space-y-4">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ej: Un astronauta montando un caballo en Marte, estilo cinematográfico."
              className="w-full h-24 bg-gray-700 border border-gray-600 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            />
            {error && <p className="text-red-400 text-center">{error}</p>}
            <button
              onClick={handleGenerate}
              className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 rounded-lg transition-colors"
            >
              Generar Video
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoGeneratorModal;
