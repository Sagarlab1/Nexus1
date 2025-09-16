import React, { useState, useEffect } from 'react';
import NexusLogo from './icons/NexusLogo';
import ClipboardIcon from './icons/ClipboardIcon';
import CheckIcon from './icons/CheckIcon';
import RefreshIcon from './icons/RefreshIcon';
import TrashIcon from './icons/TrashIcon';
import AlertTriangleIcon from './icons/AlertTriangleIcon';

interface ApiKeyPromptProps {
    error: string | null;
}

const ApiKeyPrompt: React.FC<ApiKeyPromptProps> = ({ error }) => {
    const [manualApiKey, setManualApiKey] = useState('');
    const [savedKeyExists, setSavedKeyExists] = useState(false);

    useEffect(() => {
        if (localStorage.getItem('gemini_api_key')) {
            setSavedKeyExists(true);
        }
    }, []);

    const handleReload = () => {
        window.location.reload();
    };

    const handleSaveKey = () => {
        if (manualApiKey.trim()) {
            localStorage.setItem('gemini_api_key', manualApiKey.trim());
            handleReload();
        }
    };

    const handleClearKey = () => {
        localStorage.removeItem('gemini_api_key');
        handleReload();
    };

    return (
        <div className="fixed inset-0 bg-gray-900 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="w-full max-w-2xl m-auto bg-gray-800 border border-red-500/30 rounded-2xl shadow-2xl text-white p-8 animate-fade-in">
                <div className="text-center">
                    <NexusLogo className="w-16 h-16 text-cyan-400 mx-auto mb-6" />
                    <h1 className="text-3xl font-bold mb-2 text-red-400">Acción Requerida: Se necesita una API Key</h1>
                    <p className="text-gray-300 mb-6">Para activar las capacidades de IA de la plataforma, debes proporcionar tu propia clave de API de Google Gemini.</p>
                </div>
                
                {error && (
                  <div className="bg-red-900/50 border border-red-500/50 text-red-300 p-4 rounded-lg mb-6 text-left animate-fade-in">
                    <p className="font-bold text-lg mb-2">Error de Conexión con la IA</p>
                    <p className="text-sm font-mono bg-black/20 p-2 rounded">{error}</p>
                  </div>
                )}
                
                <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-700 mb-6">
                     <h2 className="text-xl font-bold text-white mb-3">Paso 1: Ingresa tu clave de API</h2>
                     <p className="text-sm text-gray-400 mb-4">Pega tu clave aquí. Se guardará de forma segura en tu navegador y no se compartirá.</p>
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
                             Guardar y Activar
                         </button>
                         {savedKeyExists && (
                            <button
                                onClick={handleClearKey}
                                title="Olvidar la clave guardada"
                                className="bg-red-600/50 hover:bg-red-500 text-white p-3 rounded-lg transition-colors"
                            >
                                <TrashIcon className="w-5 h-5" />
                            </button>
                         )}
                     </div>
                </div>

                <div className="bg-yellow-900/30 p-6 rounded-lg border border-yellow-500/40">
                     <h2 className="text-xl font-bold text-yellow-300 mb-3 flex items-center gap-2">
                        <AlertTriangleIcon className="w-6 h-6" />
                        Paso 2: Solución de Problemas
                    </h2>
                     <p className="text-sm text-yellow-200/80 mb-4">Si después de pegar la clave sigues viendo esta pantalla, generalmente se debe a uno de estos problemas comunes:</p>
                     <ul className="list-disc list-inside text-sm space-y-2 text-yellow-200/90">
                        <li><strong>Facturación no activada:</strong> Tu proyecto de Google Cloud debe tener una cuenta de facturación activa.</li>
                        <li><strong>API no habilitada:</strong> Asegúrate de haber activado la <strong>"Generative Language API"</strong> en la consola de Google Cloud.</li>
                        <li><strong>Clave incorrecta o incompleta:</strong> Verifica que hayas copiado la clave completa y sin espacios extra.</li>
                        <li><strong>Restricciones en la clave:</strong> Si restringiste tu clave (por IP o sitio web), elimínalas, ya que pueden interferir con el despliegue.</li>
                     </ul>
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