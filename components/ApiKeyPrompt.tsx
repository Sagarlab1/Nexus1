import React from 'react';
import { GoogleGenAI } from '@google/genai';
import NexusLogo from './icons/NexusLogo';
import ClipboardIcon from './icons/ClipboardIcon';
import AlertTriangleIcon from './icons/AlertTriangleIcon';

interface ApiKeyPromptProps {
  onKeyVerified: (ai: GoogleGenAI) => void;
}

const ApiKeyPrompt: React.FC<ApiKeyPromptProps> = ({ onKeyVerified }) => {
  const [keyInput, setKeyInput] = React.useState('');
  const [isVerifying, setIsVerifying] = React.useState(false);
  const [verificationError, setVerificationError] = React.useState<string | null>(null);

  const copyToClipboard = () => {
    navigator.clipboard.writeText('API_KEY').catch(err => {
      console.error('Failed to copy text: ', err);
    });
  };

  const handleVerify = async () => {
    if (!keyInput.trim()) {
      setVerificationError('Por favor, introduce una clave de API.');
      return;
    }
    setIsVerifying(true);
    setVerificationError(null);
    try {
      const testAi = new GoogleGenAI({ apiKey: keyInput });
      // Make a lightweight call to verify the key and its permissions.
      await testAi.models.generateContent({
        model: 'gemini-2.p5-flash',
        contents: 'Hola',
        config: { thinkingConfig: { thinkingBudget: 0 } },
      });
      onKeyVerified(testAi);
    } catch (e) {
      console.error("API Key verification failed", e);
      if (e instanceof Error) {
        setVerificationError(e.message);
      } else {
        setVerificationError('Se ha producido un error desconocido durante la verificación.');
      }
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 z-50 flex items-center justify-center text-center p-4">
      <div className="bg-gray-800 border border-cyan-500/30 rounded-2xl shadow-2xl w-full max-w-4xl m-4 text-white p-8">
        <div className="inline-block p-3 bg-cyan-400/10 rounded-full border border-cyan-500/30 mb-4">
          <NexusLogo className="w-8 h-8 text-cyan-400" />
        </div>
        <h1 className="text-3xl font-bold mb-4">Configuración Requerida</h1>
        <p className="text-gray-300 mb-8 max-w-3xl mx-auto">
          La aplicación no ha detectado una clave de API de Google Gemini. La forma recomendada es configurarla en Vercel siguiendo estos 3 pasos.
        </p>

        {/* Instructions */}
        <div className="grid md:grid-cols-3 gap-6 text-left mb-10">
          {/* Step 1, 2, 3 as before */}
           <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-700">
            <p className="font-mono text-cyan-400 mb-2">Paso 1</p>
            <h2 className="text-xl font-semibold text-white mb-3">Ir a Vercel</h2>
            <p className="text-gray-400 text-sm">
              En el panel de tu proyecto en Vercel, ve a: <br />
              <strong className="text-gray-300">Settings &rarr; Environment Variables</strong>.
            </p>
          </div>
          <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-700">
            <p className="font-mono text-cyan-400 mb-2">Paso 2</p>
            <h2 className="text-xl font-semibold text-white mb-3">Crear la Variable</h2>
            <p className="text-gray-400 text-sm mb-4">
              Crea una nueva variable con este nombre exacto:
            </p>
            <div className="flex items-center gap-2 bg-gray-800 p-3 rounded-md">
              <code className="bg-yellow-500/20 text-yellow-300 font-mono p-1 rounded">API_KEY</code>
              <button onClick={copyToClipboard} title="Copy to clipboard" className="ml-auto p-1 text-gray-400 hover:text-white transition-colors">
                <ClipboardIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="bg-cyan-900/50 p-6 rounded-lg border border-cyan-500">
             <p className="font-mono text-cyan-300 mb-2">Paso 3</p>
            <h2 className="text-xl font-semibold text-white mb-3">¡Volver a Desplegar!</h2>
            <p className="text-cyan-200 text-sm">
              <strong className="text-white">Este es el paso más importante.</strong> Vercel solo aplica las nuevas variables después de un nuevo despliegue ("redeploy").
            </p>
          </div>
        </div>

        {/* Verification Tool */}
        <div className="border-t border-gray-700 pt-8">
            <h2 className="text-xl font-semibold text-white mb-3">O prueba tu clave temporalmente aquí</h2>
            <p className="text-gray-400 text-sm mb-4 max-w-2xl mx-auto">
                Si tienes problemas con Vercel, pega tu clave aquí para verificarla y usar la aplicación en esta sesión.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 max-w-xl mx-auto">
                <input
                    type="password"
                    value={keyInput}
                    onChange={(e) => setKeyInput(e.target.value)}
                    placeholder="Pega tu clave de API de Google Gemini aquí..."
                    className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                <button
                    onClick={handleVerify}
                    disabled={isVerifying}
                    className="w-full sm:w-auto bg-cyan-600 hover:bg-cyan-500 disabled:bg-gray-600 disabled:cursor-wait text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
                >
                    {isVerifying ? (
                        <>
                            <NexusLogo className="w-5 h-5 mr-2 animate-spin" />
                            Verificando...
                        </>
                    ) : (
                        'Verificar y Continuar'
                    )}
                </button>
            </div>
            {verificationError && (
                <div className="mt-4 p-4 bg-red-900/50 border border-red-500/50 text-red-300 rounded-lg max-w-xl mx-auto text-left flex items-start gap-3">
                    <AlertTriangleIcon className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="font-bold">Error de Verificación</p>
                        <p className="font-mono text-xs mt-1">{verificationError}</p>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default ApiKeyPrompt;