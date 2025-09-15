// FIX: Implement OdysseyGenerator component to resolve module errors.
import React, { useState } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import type { Odyssey } from '../types';
import NexusLogo from './icons/NexusLogo';

interface OdysseyGeneratorProps {
    onBack: () => void;
}

const OdysseyGenerator: React.FC<OdysseyGeneratorProps> = ({ onBack }) => {
    const [goal, setGoal] = useState('');
    const [duration, setDuration] = useState('3');
    const [odyssey, setOdyssey] = useState<Odyssey | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleGenerate = async () => {
        if (!goal.trim() || !process.env.API_KEY) {
            setError('Por favor, define tu meta y asegúrate de que la API Key esté configurada.');
            return;
        }

        setIsLoading(true);
        setOdyssey(null);
        setError('');

        // FIX: Initialize GoogleGenAI with named apiKey parameter as per guidelines.
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const prompt = `
            Crea un plan de aprendizaje y desarrollo personalizado, una "Odisea Sapiens", para un usuario que quiere alcanzar la siguiente meta: "${goal}".
            El plan debe tener una duración de ${duration} meses.
            La respuesta DEBE ser un objeto JSON que se ajuste al siguiente esquema.
            El plan debe ser ambicioso pero realista, dividido en ${duration} fases (una por mes), y cada fase debe tener entre 3 y 5 pasos o hitos clave.
            El título de la odisea debe ser inspirador y estar relacionado con la meta.
            La descripción debe resumir el viaje que el usuario está a punto de emprender.
        `;

        const responseSchema = {
            type: Type.OBJECT,
            properties: {
                id: { type: Type.STRING, description: 'Un ID único para la odisea, en formato kebab-case.' },
                title: { type: Type.STRING, description: 'El título inspirador de la odisea.' },
                description: { type: Type.STRING, description: 'Una breve descripción del plan.' },
                steps: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            title: { type: Type.STRING, description: 'El nombre del paso o hito.' },
                            completed: { type: Type.BOOLEAN, description: 'Estado inicial, siempre falso.' },
                        },
                        required: ['title', 'completed'],
                    },
                    description: 'Los pasos o hitos del plan de aprendizaje.'
                },
            },
            required: ['id', 'title', 'description', 'steps'],
        };
        
        try {
            // FIX: Use 'gemini-2.5-flash' model and responseSchema for structured JSON output.
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    responseMimeType: 'application/json',
                    responseSchema: responseSchema,
                },
            });

            // FIX: Access the generated text from response.text and parse it.
            const jsonText = response.text;
            const generatedOdyssey = JSON.parse(jsonText) as Odyssey;
            setOdyssey(generatedOdyssey);
        } catch (e) {
            console.error("Error generating odyssey:", e);
            setError("No se pudo generar tu Odisea. Intenta ser más específico con tu meta o vuelve a intentarlo más tarde.");
        } finally {
            setIsLoading(false);
        }
    };

    if (odyssey) {
        return (
            <div className="w-full h-full bg-gray-900 text-white p-8 overflow-y-auto">
                <div className="max-w-4xl mx-auto">
                    <button onClick={() => setOdyssey(null)} className="mb-8 text-cyan-400 hover:text-cyan-300">&larr; Forjar otra Odisea</button>
                    <h1 className="text-4xl font-bold mb-2">{odyssey.title}</h1>
                    <p className="text-lg text-gray-300 mb-8">{odyssey.description}</p>
                    <div className="space-y-4">
                        {odyssey.steps.map((step, index) => (
                            <div key={index} className="bg-gray-800/50 p-4 rounded-lg flex items-center">
                                <input type="checkbox" className="form-checkbox h-5 w-5 bg-gray-700 border-gray-600 text-cyan-500 focus:ring-cyan-600 rounded mr-4" />
                                <span className="text-lg">{step.title}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }
    
    return (
        <div className="w-full h-full bg-gray-900 text-white p-8 overflow-y-auto">
            <div className="max-w-2xl mx-auto">
                <button onClick={onBack} className="mb-8 text-cyan-400 hover:text-cyan-300">&larr; Volver</button>
                <h1 className="text-5xl font-bold mb-4">Forja tu Odisea Sapiens</h1>
                <p className="text-xl text-gray-300 mb-8">Define tu gran meta. La IA diseñará tu camino personalizado hacia la maestría.</p>

                <div className="space-y-6 bg-gray-800/50 p-6 rounded-lg border border-gray-700/50">
                    <div>
                        <label htmlFor="goal" className="block text-sm font-medium text-gray-300 mb-2">¿Cuál es tu meta o el área que quieres dominar?</label>
                        <textarea
                            id="goal"
                            rows={3}
                            value={goal}
                            onChange={(e) => setGoal(e.target.value)}
                            className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            placeholder="Ej: Convertirme en un experto en IA generativa y lanzar un producto en 6 meses."
                        />
                    </div>
                     <div>
                        <label htmlFor="duration" className="block text-sm font-medium text-gray-300 mb-2">Duración de tu Odisea</label>
                        <select
                            id="duration"
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                            className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        >
                            <option value="3">3 Meses (Intensivo)</option>
                            <option value="6">6 Meses (Recomendado)</option>
                            <option value="12">12 Meses (Profundo)</option>
                        </select>
                    </div>
                    <button
                        onClick={handleGenerate}
                        disabled={isLoading}
                        className="w-full bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold py-3 rounded-lg flex items-center justify-center disabled:bg-gray-600"
                    >
                        {isLoading ? <NexusLogo className="w-6 h-6 animate-spin" /> : "Forjar mi Odisea"}
                    </button>
                    {error && <p className="text-red-400 text-center">{error}</p>}
                </div>
            </div>
        </div>
    );
};

export default OdysseyGenerator;
