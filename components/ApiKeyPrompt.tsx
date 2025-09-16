import React, { useState } from 'react';
import NexusLogo from './icons/NexusLogo';
import ClipboardIcon from './icons/ClipboardIcon';
import CheckIcon from './icons/CheckIcon';
import RefreshIcon from './icons/RefreshIcon';

const ApiKeyPrompt: React.FC = () => {
    const [copied, setCopied] = useState(false);
    const [isReloading, setIsReloading] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText('API_KEY');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    
    const handleRecheck = () => {
        setIsReloading(true);
        // This forces a hard reload to fetch the latest deployment from the server,
        // which would include the newly set environment variable.
        window.location.reload();
    };

    return (
        <div className="fixed inset-0 bg-gray-900 z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-3xl m-auto bg-gray-800 border border-red-500/30 rounded-2xl shadow-2xl text-white p-8 animate-fade-in">
                <div className="text-center">
                    <NexusLogo className="w-16 h-16 text-cyan-400 mx-auto mb-6" />
                    <h1 className="text-3xl font-bold mb-2 text-red-400">Acción Requerida: Clave de API no Detectada</h1>
                    <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                        Para activar la IA, la clave de API de Google Gemini debe estar configurada como una <strong>variable de entorno</strong> en tu plataforma de despliegue (ej. Vercel).
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                    {/* Step 1 */}
                    <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-700">
                        <p className="font-bold text-cyan-400 mb-2">Paso 1</p>
                        <h2 className="text-lg font-semibold mb-2">Ir a Vercel</h2>
                        <p className="text-sm text-gray-400">En el panel de tu proyecto, ve a: <br /><strong className="text-gray-200">Settings → Environment Variables</strong>.</p>
                    </div>

                    {/* Step 2 */}
                    <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-700">
                         <p className="font-bold text-yellow-400 mb-2">Paso 2</p>
                        <h2 className="text-lg font-semibold mb-2">Crear la Variable</h2>
                        <p className="text-sm text-gray-400 mb-3">Crea una nueva variable con este nombre exacto:</p>
                        <div className="inline-flex items-center gap-2 bg-gray-700 px-3 py-1.5 rounded-md">
                            <code className="text-yellow-300 font-mono text-base">API_KEY</code>
                            <button onClick={handleCopy} title="Copiar nombre">
                                {copied ? <CheckIcon className="w-4 h-4 text-green-400" /> : <ClipboardIcon className="w-4 h-4 text-gray-400 hover:text-white" />}
                            </button>
                        </div>
                         <p className="text-xs text-gray-500 mt-2">Pega tu clave de Google AI Studio en el campo del valor.</p>
                    </div>

                    {/* Step 3 */}
                    <div className="bg-cyan-900/30 p-6 rounded-lg border border-cyan-700 ring-2 ring-cyan-500/50">
                        <p className="font-bold text-cyan-300 mb-2">Paso 3 (Crítico)</p>
                        <h2 className="text-lg font-semibold mb-2">Volver a Desplegar</h2>
                        <p className="text-sm text-gray-400"><strong className="text-white">Vercel solo aplica la variable después de un nuevo despliegue.</strong> Un simple "refresh" no funcionará.</p>
                    </div>
                </div>

                 <div className="mt-8 text-center border-t border-gray-700 pt-6">
                    <p className="text-gray-300 mb-4">Una vez que Vercel haya finalizado el nuevo despliegue, haz clic aquí:</p>
                    <button
                        onClick={handleRecheck}
                        disabled={isReloading}
                        className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-bold py-3 px-8 rounded-lg text-lg transition-all transform hover:scale-105 shadow-lg shadow-cyan-500/30 disabled:opacity-50 disabled:cursor-wait flex items-center justify-center mx-auto"
                    >
                        {isReloading ? (
                            <>
                                <RefreshIcon className="w-5 h-5 animate-spin mr-2" />
                                Verificando...
                            </>
                        ) : (
                           'Ya configuré la clave. Volver a verificar.'
                        )}
                    </button>
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
