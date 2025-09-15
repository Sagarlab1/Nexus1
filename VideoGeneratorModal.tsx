import React, { useState, useEffect, useRef } from 'react';
// Fix: Import necessary types and classes from @google/genai
import { GoogleGenAI, VideosOperation } from '@google/genai';
import VideoIcon from './components/icons/VideoIcon';
import NexusLogo from './components/icons/NexusLogo';

// Fix: Initialize the GoogleGenAI client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

interface VideoGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const progressMessages = [
    "Contactando los servidores de video...",
    "Calentando los núcleos de la IA...",
    "Traduciendo tu idea en fotogramas...",
    "Renderizando el primer borrador...",
    "Aplicando mejoras de color y luz...",
    "Esto está tomando un poco más de lo esperado, ¡la IA está trabajando duro!",
    "Compilando los fotogramas finales...",
    "Casi listo...",
];

const VideoGeneratorModal: React.FC<VideoGeneratorModalProps> = ({ isOpen, onClose }) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progressMessage, setProgressMessage] = useState('');

  const operationRef = useRef<VideosOperation | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isGenerating) {
        let messageIndex = 0;
        setProgressMessage(progressMessages[messageIndex]);
        progressIntervalRef.current = setInterval(() => {
            messageIndex = (messageIndex + 1) % progressMessages.length;
            setProgressMessage(progressMessages[messageIndex]);
        }, 5000);
    } else {
        if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current);
        }
    }
    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, [isGenerating]);


  const pollOperation = async (op: VideosOperation) => {
    let currentOp = op;
    while (!currentOp.done) {
      await new Promise(resolve => setTimeout(resolve, 10000));
      // Correct polling as per documentation
      currentOp = await ai.operations.getVideosOperation({ operation: currentOp });
      operationRef.current = currentOp;
    }
    return currentOp;
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setError(null);
    setGeneratedVideoUrl(null);

    try {
      // Fix: Use correct model 'veo-2.0-generate-001'
      let operation = await ai.models.generateVideos({
        model: 'veo-2.0-generate-001',
        prompt: prompt,
        config: {
          numberOfVideos: 1,
        },
      });
      operationRef.current = operation;
      
      operation = await pollOperation(operation);

      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (downloadLink) {
        // As per docs, must append API key for access.
        const videoUrl = `${downloadLink}&key=${process.env.API_KEY}`;
        setGeneratedVideoUrl(videoUrl);
      } else {
        throw new Error('Video generation finished but no video URI was found.');
      }
    } catch (e) {
      console.error("Error generating video:", e);
      setError("Failed to generate video. The model might be busy or the prompt could be invalid.");
    } finally {
      setIsGenerating(false);
      operationRef.current = null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center backdrop-blur-sm" onClick={onClose}>
      <div className="bg-gray-800 border border-cyan-500/50 rounded-xl shadow-2xl w-full max-w-lg m-4 text-white" onClick={(e) => e.stopPropagation()}>
        <div className="p-8">
            <h2 className="text-2xl font-bold text-center mb-2">Generador de Video</h2>
            <p className="text-center text-gray-400 mb-6">Transforma texto en un video corto.</p>
            
            {!isGenerating && !generatedVideoUrl && (
              <>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Ej: Un astronauta montando un caballo en marte, cinemático..."
                  className="w-full h-24 bg-gray-900 border border-gray-600 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
                />
                <button
                  onClick={handleGenerate}
                  disabled={!prompt.trim()}
                  className="mt-4 w-full bg-cyan-600 hover:bg-cyan-500 disabled:bg-gray-600 text-white font-bold py-3 rounded-lg transition-colors"
                >
                  Generar Video
                </button>
              </>
            )}

            {isGenerating && (
                <div className="text-center p-8">
                    <NexusLogo className="w-16 h-16 text-cyan-400 mx-auto animate-spin mb-4" />
                    <p className="text-lg font-semibold">Generando video...</p>
                    <p className="text-gray-400 mt-2 min-h-[40px]">{progressMessage}</p>
                </div>
            )}

            {generatedVideoUrl && (
                <div className="text-center">
                    <h3 className="text-xl font-bold mb-4">¡Video generado!</h3>
                    <video src={generatedVideoUrl} controls autoPlay className="w-full rounded-lg" />
                     <button
                        onClick={() => { setGeneratedVideoUrl(null); setPrompt(''); }}
                        className="mt-4 w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 rounded-lg transition-colors"
                        >
                        Crear Otro Video
                    </button>
                </div>
            )}

            {error && <p className="mt-4 text-red-400 text-center">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default VideoGeneratorModal;
