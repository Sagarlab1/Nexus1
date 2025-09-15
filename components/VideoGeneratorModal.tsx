// FIX: Implement VideoGeneratorModal to resolve module errors.
import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import VideoIcon from './icons/VideoIcon';
import NexusLogo from './icons/NexusLogo';

interface VideoGeneratorModalProps {
    onClose: () => void;
}

const VideoGeneratorModal: React.FC<VideoGeneratorModalProps> = ({ onClose }) => {
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [error, setError] = useState('');
    const [statusMessage, setStatusMessage] = useState('');

    const handleGenerate = async () => {
        if (!prompt.trim() || !process.env.API_KEY) {
            setError('Por favor, introduce un prompt y asegúrate de que la API Key está configurada.');
            return;
        }

        setIsLoading(true);
        setVideoUrl(null);
        setError('');
        setStatusMessage('Iniciando la generación de video...');

        // FIX: Initialize GoogleGenAI with named apiKey parameter as per guidelines.
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

        try {
            // FIX: Use ai.models.generateVideos and the 'veo-2.0-generate-001' model.
            let operation = await ai.models.generateVideos({
                model: 'veo-2.0-generate-001',
                prompt: prompt,
                config: {
                    numberOfVideos: 1,
                },
            });
            
            setStatusMessage('El modelo está procesando tu solicitud. Esto puede tardar varios minutos...');

            while (!operation.done) {
                await new Promise(resolve => setTimeout(resolve, 10000)); // Poll every 10 seconds
                // FIX: Use ai.operations.getVideosOperation to poll the status of the video generation.
                operation = await ai.operations.getVideosOperation({ operation });
                setStatusMessage('Aún trabajando en tu video... La creatividad toma tiempo.');
            }

            // FIX: Get the video download link from the operation response.
            const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;

            if (downloadLink) {
                 // FIX: Append the API key to the download link before fetching the video.
                const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
                const blob = await response.blob();
                const url = URL.createObjectURL(blob);
                setVideoUrl(url);
                setStatusMessage('¡Tu video está listo!');
            } else {
                throw new Error('No se encontró el enlace de descarga del video.');
            }

        } catch (e) {
            console.error("Error generating video:", e);
            setError("No se pudo generar tu video. Por favor, intenta con un prompt diferente.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-gray-800 border border-purple-500/30 rounded-2xl shadow-2xl w-full max-w-lg m-4 text-white p-8 relative" onClick={(e) => e.stopPropagation()}>
                <div className="text-center mb-6">
                    <div className="inline-block p-3 bg-purple-400/10 rounded-full border border-purple-500/30 mb-4">
                        <VideoIcon className="w-8 h-8 text-purple-400" />
                    </div>
                    <h2 className="text-3xl font-bold">Generador de Video IA</h2>
                    <p className="text-gray-400">Transforma tus ideas en clips de video cortos con el modelo Veo.</p>
                </div>

                {videoUrl ? (
                    <div className="space-y-4">
                        <video src={videoUrl} controls autoPlay className="w-full rounded-lg" />
                        <button onClick={() => { setVideoUrl(null); setPrompt(''); }} className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 px-4 rounded-lg">
                            Crear Otro Video
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            rows={3}
                            className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="Ej: Un astronauta surfeando en un anillo de Saturno, estilo cinematográfico."
                            disabled={isLoading}
                        />
                        <button onClick={handleGenerate} disabled={isLoading} className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 rounded-lg flex items-center justify-center disabled:bg-gray-600">
                            {isLoading ? <NexusLogo className="w-6 h-6 animate-spin" /> : "Generar Video"}
                        </button>
                        {isLoading && <p className="text-center text-purple-300 animate-pulse">{statusMessage}</p>}
                        {error && <p className="text-red-400 text-center">{error}</p>}
                    </div>
                )}
            </div>
        </div>
    );
};

export default VideoGeneratorModal;
