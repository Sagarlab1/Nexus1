// FIX: Implemented the VideoGeneratorModal component to resolve module errors.
import React, { useState } from 'react';
// FIX: Use GoogleGenAI from "@google/genai"
import { GoogleGenAI } from '@google/genai';
import NexusLogo from './icons/NexusLogo';

interface VideoGeneratorModalProps {
  onClose: () => void;
}

const VideoGeneratorModal: React.FC<VideoGeneratorModalProps> = ({ onClose }) => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [loadingMessage, setLoadingMessage] = useState('Iniciando la generación de video...');

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Por favor, introduce una descripción para el video.');
      return;
    }
    setError('');
    setVideoUrl('');
    setIsLoading(true);

    if (!process.env.API_KEY) {
      setError("API key not found. Please set the API_KEY environment variable.");
      setIsLoading(false);
      return;
    }

    try {
      // FIX: Initialize GoogleGenAI with a named apiKey object
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

      setLoadingMessage('Enviando prompt al modelo VEO...');
      // FIX: Use ai.models.generateVideos for video generation
      let operation = await ai.models.generateVideos({
        model: 'veo-2.0-generate-001',
        prompt: prompt,
        config: {
          numberOfVideos: 1,
        }
      });
      
      setLoadingMessage('La IA está visualizando tu idea... Esto puede tardar unos minutos.');
      await sleep(5000);
      setLoadingMessage('Renderizando los fotogramas...');

      // FIX: Poll for operation status until it is 'done'
      while (!operation.done) {
        await sleep(10000);
        operation = await ai.operations.getVideosOperation({ operation: operation });
      }

      setLoadingMessage('¡Video generado con éxito!');

      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (downloadLink) {
        // FIX: Append API key to the download URI as required by the API
        setVideoUrl(`${downloadLink}&key=${process.env.API_KEY}`);
      } else {
        throw new Error('No se encontró el enlace de descarga del video en la respuesta.');
      }

    } catch (e) {
      console.error(e);
      setError('Hubo un error al generar el video. Por favor, intenta de nuevo.');
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
        className="bg-gray-800 border border-purple-500/30 rounded-2xl shadow-2xl w-full max-w-lg m-4 text-white p-8 relative transform transition-all duration-300 scale-95 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-3xl font-bold text-center mb-2">Generador de Video IA</h2>
        <p className="text-center text-gray-400 mb-6">
          Describe una escena y la IA la convertirá en un video corto.
        </p>

        {isLoading ? (
          <div className="text-center">
            <NexusLogo className="w-16 h-16 text-purple-400 mx-auto animate-spin mb-4" />
            <p className="text-lg">{loadingMessage}</p>
          </div>
        ) : videoUrl ? (
          <div className="text-center">
            <video src={videoUrl} controls autoPlay className="w-full rounded-lg mb-4" />
            <p className="text-gray-400 mb-4">Tu video ha sido generado.</p>
            <button onClick={() => setVideoUrl('')} className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 px-4 rounded-lg">
              Generar otro video
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ej: Un astronauta montando un caballo en Marte, estilo cinematográfico."
              className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-y"
              rows={4}
            />
            <button
              onClick={handleGenerate}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white font-bold py-3 px-6 rounded-lg transition-transform transform hover:scale-105"
            >
              Generar Video
            </button>
            {error && <p className="text-red-400 text-center pt-2">{error}</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoGeneratorModal;
