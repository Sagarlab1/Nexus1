import React, { useState } from 'react';
import NexusLogo from './icons/NexusLogo';

interface ApiKeyPromptProps {
    onKeySubmit: (key: string) => Promise<void>;
}

const ApiKeyPrompt: React.FC<ApiKeyPromptProps> = ({ onKeySubmit }) => {
    const [apiKey, setApiKey] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!apiKey.trim() || isVerifying) return;

        setIsVerifying(true);
        setError(null);

        try {
            await onKeySubmit(apiKey.trim());
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Ocurrió un error desconocido.');
        } finally {
            setIsVerifying(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-900 z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md m-auto bg-gray-800 border border-cyan-500/30 rounded-2xl shadow-2xl text-white p-8 text-center">
                <NexusLogo className="w-16 h-16 text-cyan-400 mx-auto mb-6" />
                <h1 className="text-3xl font-bold mb-2">Configuración Requerida</h1>
                <p className="text-gray-300 mb-6">
                    Por favor, introduce tu clave de API de Google Gemini para continuar.
                </p>

                <form onSubmit={handleSubmit}>
                    <input
                        type="password"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="Pega tu clave de API aquí"
                        className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        disabled={isVerifying}
                    />
                    {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
                    <button
                        type="submit"
                        disabled={!apiKey.trim() || isVerifying}
                        className="mt-6 w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-bold py-3 px-8 rounded-lg text-lg transition-transform transform hover:scale-105 shadow-lg shadow-cyan-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isVerifying ? 'Verificando...' : 'Guardar y Continuar'}
                    </button>
                </form>

                <p className="text-xs text-gray-500 mt-6">
                    Tu clave se guardará de forma segura en tu navegador. Puedes obtenerla en <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="underline hover:text-cyan-400">Google AI Studio</a>.
                </p>
            </div>
        </div>
    );
};

export default ApiKeyPrompt;
