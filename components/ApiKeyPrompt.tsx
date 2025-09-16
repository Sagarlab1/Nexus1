import React, { useState, useEffect } from 'react';
import NexusLogo from './icons/NexusLogo';
import ClipboardIcon from './icons/ClipboardIcon';
import CheckIcon from './icons/CheckIcon';
import RefreshIcon from './icons/RefreshIcon';
import TrashIcon from './icons/TrashIcon';

interface ApiKeyPromptProps {
    error: string | null;
}

const ApiKeyPrompt: React.FC<ApiKeyPromptProps> = ({ error }) => {
    const [copied, setCopied] = useState(false);
    const [isReloading, setIsReloading] = useState(false);
    const [manualApiKey, setManualApiKey] = useState('');
    const [savedKeyExists, setSavedKeyExists] = useState(false);

    useEffect(() => {
        if (localStorage.getItem('gemini_api_key')) {
            setSavedKeyExists(true);
        }
    }, []);

    const handleCopy = () => {
        navigator.clipboard.writeText('API_KEY');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    
    const handleRecheck = () => {
        setIsReloading(true);
        window.location.reload();
    };

    const handleSaveKey = () => {
        if (manualApiKey.trim()) {
            localStorage.setItem('gemini_api_key', manualApiKey.trim());
            handleRecheck();
        }
    };

    const handleClearKey = () => {
        localStorage.removeItem('gemini_api_key');
        handleRecheck();
    };

    return (
        <div className="fixed inset-0 bg-gray-900 z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-4xl m-auto bg-gray-800 border border-red-500/30 rounded-2xl shadow-2xl text-white p-8 animate-fade-in">
                <div className="text-center">
                    <NexusLogo className="w-16 h-16 text-cyan-400 mx-auto mb-6" />
                    <h1 className="text-3xl font-bold mb-2 text-red-400">Acción Requerida: Clave de API no Detectada</h1>
                    <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                        Para activar la IA, necesitas una clave de API de Google Gemini.
                    </p>
                </div>
                
                {error && (
                  <div className="bg-red-900/50 border border-red-500/50 text-red-300 p-4 rounded-lg mb-6 text-center animate-fade-in">
                    <p className="font-bold text-lg">Error de Inicialización</p>
                    <p className="text-sm">{error}</p>
                  </div>
                )}

                <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-700 mb-6">
                    <h2 className="text-xl font-bold text-white mb-3">Método Recomendado: Configuración en Vercel</h2>
                    <p className="text-sm text-gray-400 mb-4">Este método es más seguro y persistente. Vercel inyecta la clave durante el despliegue.</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                        <div>
                            <p className="font-semibold text-cyan-400 mb-2">Paso 1: Ir a Vercel</p>
                            <p className="text-xs text-gray-400">En tu proyecto, ve a <strong className="text-gray-200">Settings → Environment Variables</strong>.</p>
                        </div>
                        <div>
                            <p className="font-semibold text-yellow-400 mb-2">Paso 2: Crear Variable</p>
                             <div className="inline-flex items-center gap-2 bg-gray-700 px-2 py-1 rounded-md">
                                <code className="text-yellow-300 font-mono text-sm">API_KEY</code>
                                <button onClick={handleCopy} title="Copiar nombre">
                                    {copied ? <CheckIcon className="w-4 h-4 text-green-400" /> : <ClipboardIcon className="w-4 h-4 text-gray-400 hover:text-white" />}
                                </button>
                            </div>
                        </div>
                        <div>
                            <p className="font-semibold text-pink-400 mb-2">Paso 3: Redeploy</p>
                            <p className="text-xs text-gray-400">Debes hacer un <strong className="text-white">nuevo despliegue</strong> para que Vercel aplique el cambio.</p>
                        </div>
                    </div>
                     <div className="mt-4 text-center">
                        <button
                            onClick={handleRecheck}
                            disabled={isReloading}
                            className="text-sm bg-cyan-500/20 text-cyan-300 font-semibold py-2 px-4 rounded-lg hover:bg-cyan-500/40 transition-colors flex items-center justify-center mx-auto"
                        >
                             <RefreshIcon className={`w-4 h-4 mr-2 ${isReloading ? 'animate-spin' : ''}`} />
                            {isReloading ? 'Verificando...' : 'Verificar configuración de Vercel'}
                        </button>
                    </div>
                </div>
                
                <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-700">
                     <h2 className="text-xl font-bold text-white mb-3">Alternativa: Ingresar la clave manualmente</h2>
                     <p className="text-sm text-gray-400 mb-4">Si el método anterior falla, puedes pegar tu clave aquí. Se guardará en tu navegador.</p>
                     <div className="flex items-center gap-2">
                        <input 
                            type="password"
                            value={manualApiKey}
                            onChange={(e) => setManualApiKey(e.target.value)}
                            placeholder="Pega tu clave de API de Google Gemini aquí..."
                            className="flex-grow bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        />
                         <button
                            onClick={handleSaveKey}
                            disabled={!manualApiKey.trim()}
                            className="bg-green-600 hover:bg-green-500 text-white font-bold py-2.5 px-6 rounded-lg transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
                         >
                             Guardar y Continuar
                         </button>
                         {savedKeyExists && (
                            <button
                                onClick={handleClearKey}
                                title="Olvidar la clave guardada en este navegador"
                                className="bg-red-600/50 hover:bg-red-500 text-white p-3 rounded-lg transition-colors"
                            >
                                <TrashIcon className="w-5 h-5" />
                            </button>
                         )}
                     </div>
                </div>

                 <style>{`
                    @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
                    .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
                `}</style>
            </div>
        </div>
    );
};

export default ApiKeyPrompt;