import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from '@google/genai';
import VideoIcon from './icons/VideoIcon';
import NexusLogo from './icons/NexusLogo';

interface VideoGeneratorModalProps {
  onClose: () => void;
}

const loadingMessages = [
    "Contactando a la musa digital...",
    "Renderizando fotogramas cuánticos...",
    "Compilando secuencias de sueños...",
    "Ajustando la matriz de pixeles...",
    "El proceso de creación puede tardar unos minutos...",
    "La paciencia es una virtud creativa...",
];

const VideoGeneratorModal: React.FC<VideoGeneratorModalProps> = ({ onClose }) => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState(loadingMessages[0]);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isLoading) {
      intervalRef.current = setInterval(() => {
        setLoadingMessage(prev => {
          const currentIndex = loadingMessages.indexOf(prev);
          const nextIndex = (currentIndex + 1) % loadingMessages.length;
          return loadingMessages[nextIndex];
        });
      }, 3000);
    } else if(intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if(intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isLoading]);


  const handleGenerateVideo = async () => {
    if (!prompt.trim()) {
      setError('Por favor, ingresa una descripción para el video.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setGeneratedVideoUrl(null);

    try {
      // FIX: Initialize GoogleGenAI with a named apiKey parameter.
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      // FIX: Use ai.models.generateVideos to start the video generation process.
      let operation = await ai.models.generateVideos({
        // FIX: Use the 'veo-2.0-generate-001' model for video generation.
        model: 'veo-2.0-generate-001',
        prompt: prompt,
        config: {
          numberOfVideos: 1,
        },
      });

      // FIX: Poll the operation status until it is done.
      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 10000)); // Wait for 10 seconds before polling again
        operation = await ai.operations.getVideosOperation({ operation: operation });
      }
      
      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (downloadLink) {
        // FIX: Append the API key to the download link to fetch the video bytes.
        // NOTE: In a real app, fetching on the server is safer to protect the API key.
        // For this client-side example, we'll construct the URL directly.
        setGeneratedVideoUrl(`${downloadLink}&key=${process.env.API_KEY}`);
      } else {
        throw new Error('No se encontró el enlace de descarga del video.');
      }

    } catch (e) {
      console.error("Error generating video:", e);
      setError('Ocurrió un error al generar el video. Por favor, inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div
      className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-gray-800 border border-green-500/30 rounded-2xl shadow-2xl w-full max-w-lg m-4 text-white p-8 transform transition-all duration-300 scale-95 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center">
          <div className="inline-block p-3 bg-green-400/10 rounded-full border border-green-500/30 mb-4">
            <VideoIcon className="w-8 h-8 text-green-400" />
          </div>
          <h2 className="text-3xl font-bold text-center mb-2">Generador de Video</h2>
          <p className="text-center text-gray-400 mb-6">
            Describe una escena y la IA la convertirá en un video corto.
          </p>
        </div>
        
        {isLoading && (
            <div className="text-center p-8">
                <NexusLogo className="w-16 h-16 text-green-400 mx-auto animate-spin mb-6" />
                <p className="text-lg text-gray-300">{loadingMessage}</p>
            </div>
        )}

        {!isLoading && !generatedVideoUrl && (
             <div className="space-y-4">
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Ej: Un astronauta surfeando en un anillo de Saturno, estilo cinematográfico."
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                    rows={3}
                />
                <button
                    onClick={handleGenerateVideo}
                    className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-6 rounded-lg transition-transform transform hover:scale-105"
                >
                    Generar Video
                </button>
                 {error && <p className="text-red-500 mt-2 text-center">{error}</p>}
            </div>
        )}
        
        {generatedVideoUrl && (
            <div className="text-center">
                <video src={generatedVideoUrl} controls autoPlay className="w-full rounded-lg mb-4"></video>
                <button
                    onClick={() => { setGeneratedVideoUrl(null); setPrompt(''); }}
                    className="w-full bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg"
                >
                    Generar Otro Video
                </button>
            </div>
        )}


      </div>
    </div>
  );
};

export default VideoGeneratorModal;
