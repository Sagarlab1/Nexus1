import React, { useState } from 'react';
import NexusLogo from './icons/NexusLogo';
import ClipboardIcon from './icons/ClipboardIcon';
import CheckIcon from './icons/CheckIcon';

const ApiKeyPrompt: React.FC = () => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText('API_KEY');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="fixed inset-0 bg-gray-900 z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl m-auto bg-gray-800 border border-cyan-500/30 rounded-2xl shadow-2xl text-white p-8">
                <div className="text-center">
                    <NexusLogo className="w-16 h-16 text-cyan-400 mx-auto mb-6" />
                    <h1 className="text-3xl font-bold mb-2">Configuración Requerida</h1>
                    <p className="text-gray-300 mb-8">
                        Para que la aplicación funcione, la clave de API de Google Gemini debe ser configurada en tu plataforma de despliegue (ej. Vercel). Por favor, sigue estos 3 pasos.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    {/* Step 1 */}
                    <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-700">
                        <p className="text-sm font-semibold text-cyan-400 mb-2">Paso 1</p>
                        <h2 className="text-lg font-bold mb-2">Ir a Vercel</h2>
                        <p className="text-xs text-gray-400">En el panel de tu proyecto, ve a: <br /><strong className="text-gray-200">Settings → Environment Variables</strong>.</p>
                    </div>

                    {/* Step 2 */}
                    <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-700 ring-2 ring-yellow-500/50">
                        <p className="text-sm font-semibold text-yellow-400 mb-2">Paso 2</p>
                        <h2 className="text-lg font-bold mb-2">Crear la Variable</h2>
                        <p className="text-xs text-gray-400 mb-3">Crea una nueva variable con este nombre exacto:</p>
                        <div className="flex justify-center">
                            <div className="flex items-center gap-2 bg-gray-700 px-3 py-1 rounded-md">
                                <code className="text-yellow-300 font-mono">API_KEY</code>
                                <button onClick={handleCopy} title="Copiar">
                                    {copied ? <CheckIcon className="w-4 h-4 text-green-400" /> : <ClipboardIcon className="w-4 h-4 text-gray-400 hover:text-white" />}
                                </button>
                            </div>
                        </div>
                         <div className="mt-3 text-left p-2 bg-yellow-900/30 rounded-md">
                             <p className="text-xs font-bold text-yellow-300">¡Punto Clave!</p>
                             <p className="text-xs text-yellow-400/80">Asegúrate de que la variable esté disponible para todos los entornos: ✅ Producción ✅ Vista Previa ✅ Desarrollo.</p>
                         </div>
                    </div>

                    {/* Step 3 */}
                    <div className="bg-cyan-900/30 p-6 rounded-lg border border-cyan-700 ring-2 ring-cyan-500/50">
                        <p className="text-sm font-semibold text-cyan-400 mb-2">Paso 3</p>
                        <h2 className="text-lg font-bold mb-2">¡Volver a Desplegar!</h2>
                        <p className="text-xs text-gray-400"><strong className="text-cyan-300">Este es el paso más importante.</strong> Vercel solo aplica las nuevas variables después de un nuevo despliegue ("redeploy").</p>
                    </div>
                </div>

                 <p className="text-xs text-gray-500 mt-6 text-center">
                    Una vez completado, recarga esta página. La aplicación funcionará para ti y para cualquiera que tenga el enlace.
                </p>
            </div>
        </div>
    );
};

export default ApiKeyPrompt;
