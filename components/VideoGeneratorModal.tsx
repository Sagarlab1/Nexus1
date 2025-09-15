import React, { useState, useRef } from 'react';
import { GoogleGenAI } from '@google/genai';
import VideoIcon from './icons/VideoIcon';
import NexusLogo from './icons/NexusLogo';

interface VideoGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type GenerationState = 'idle' | 'generating' | 'polling' | 'success' | 'error';

const VideoGeneratorModal: React.FC<VideoGeneratorModalProps> = ({ isOpen, onClose }) => {
  const [prompt, setPrompt] = useState('');
  const [state, setState] = useState<GenerationState>('idle');
  const [progressMessage, setProgressMessage] = useState('');
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const pollingInterval = 10000; // 10 seconds

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setState('generating');
    setProgressMessage('Enviando solicitud al modelo de video...');
    setError(null);
    setVideoUrl(null);
    
    try {
      // FIX: Correctly initialize the Gemini AI client.
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      // FIX: Use generateVideos for video generation.
      let operation = await ai.models.generateVideos({
        model: 'veo-2.0-generate-001',
        prompt: prompt,
        config: {
          numberOfVideos: 1,
        },
      });

      setState('polling');
      setProgressMessage('La IA está generando tu video. Esto puede tardar varios minutos. ¡La paciencia es una virtud!');
      
      // FIX: Implement polling to check operation status.
      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, pollingInterval));
        operation = await ai.operations.getVideosOperation({ operation });
        setProgressMessage('El video se está procesando en la nube. ¡Casi listo!');
      }

      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (downloadLink) {
        // FIX: Append API key to the download URI for authorization.
        const finalUrl = `${downloadLink}&key=${process.env.API_KEY}`;
        setVideoUrl(finalUrl);
        setState('success');
        setProgressMessage('¡Video generado con éxito!');
      } else {
        throw new Error('No se encontró un enlace de video en la respuesta.');
      }
    } catch (err) {
      console.error('Error generating video:', err);
      setError('Ocurrió un error al generar el video. Por favor, intenta de nuevo.');
      setState('error');
    }
  };

  const handleClose = () => {
    onClose();
    // Reset state after a delay to allow for closing animation
    setTimeout(() => {
        setState('idle');
        setPrompt('');
        setVideoUrl(null);
        setError(null);
        setProgressMessage('');
    }, 300);
  };

  if (!isOpen) return null;

  return (
     <div 
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center backdrop-blur-sm"
      onClick={handleClose}
    >
      <div 
        className="bg-gray-800 border border-gray-700/50 rounded-xl shadow-2xl shadow-black/50 w-full max-w-2xl m-4 text-white transform transition-all animate-fadeInUp"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-8">
            <div className="flex items-center mb-6">
                 <VideoIcon className="w-8 h-8 text-cyan-400 mr-4"/>
                 <div>
                    <h2 className="text-2xl font-bold">Generador de Video</h2>
                    <p className="text-gray-400">Crea un video a partir de una descripción de texto.</p>
                 </div>
            </div>
            
            {state === 'success' && videoUrl ? (
                <div className="text-center">
                    <video src={videoUrl} controls autoPlay className="w-full rounded-lg mb-4 bg-black"></video>
                    <a href={videoUrl} download="nexus-sapiens-video.mp4" className="text-cyan-400 hover:underline">Descargar Video</a>
                </div>
            ) : (
                <>
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Ej: Un astronauta montando a caballo en Marte, estilo cinematográfico."
                        className="w-full h-24 bg-gray-900 border border-gray-600 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
                        disabled={state === 'generating' || state === 'polling'}
                    />
                    <button
                        onClick={handleGenerate}
                        disabled={!prompt.trim() || state === 'generating' || state === 'polling'}
                        className="mt-4 w-full bg-cyan-600 hover:bg-cyan-500 disabled:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
                    >
                        {(state === 'generating' || state === 'polling') ? <NexusLogo className="w-5 h-5 animate-spin" /> : <VideoIcon className="w-5 h-5" />}
                        <span>{state === 'idle' || state === 'error' ? 'Generar Video' : 'Generando...'}</span>
                    </button>
                </>
            )}

            {(state === 'generating' || state === 'polling') && (
                <div className="mt-4 text-center bg-gray-700/50 p-4 rounded-lg">
                    <p className="text-cyan-300">{progressMessage}</p>
                </div>
            )}
            {state === 'error' && <p className="mt-4 text-center text-red-400">{error}</p>}
        </div>
         <div className="p-4 bg-gray-900/50 rounded-b-xl flex justify-end gap-4">
             <button onClick={handleClose} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg transition-colors">Cerrar</button>
        </div>
      </div>
       <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default VideoGeneratorModal;
