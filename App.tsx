import React, { useState, useEffect, useCallback } from 'react';
import { AGENTS } from './constants';
import type { Agent, Message } from './types';
// FIX: Import generateResponse to fix the error, and remove setApiKey, clearApiKey as they are no longer used.
import { initializeAi, generateResponse } from './services/ai';
import { useSound } from './hooks/useSound';

// Component Imports
import UserRankPanel from './components/UserRankPanel';
import LoginScreen from './components/LoginScreen';
import PremiumModal from './components/PremiumModal';
import ChatModal from './components/ChatModal';
import FloatingChatButton from './components/FloatingChatButton';
// FIX: ApiKeyPrompt is no longer used as per guidelines.
import NexusLogo from './components/icons/NexusLogo';


// Page/View Imports
import NexusZeroPage from './components/NexusZeroPage';
import ProgramsPage from './components/ProgramsPage';
import LatinoChallengesPage from './components/LatinoChallengesPage';
import CognitiveGymPage from './components/CognitiveGymPage';
import AlertTriangleIcon from './components/icons/AlertTriangleIcon';

export type View = 'chat' | 'nexus_zero_course' | 'programs' | 'challenges' | 'cognitive_gym';
// FIX: 'needs_key' status now represents a configuration error state, not a prompt for a key.
type AppStatus = 'loading' | 'config_error' | 'ready';

const App: React.FC = () => {
  const [appStatus, setAppStatus] = useState<AppStatus>('loading');
  const [initError, setInitError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [messagesByAgent, setMessagesByAgent] = useState<Record<string, Message[]>>({});
  const [activeAgent, setActiveAgent] = useState<Agent>(AGENTS[2]); // Default to Nexus
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeView, setActiveView] = useState<View>('nexus_zero_course');
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const playSound = useSound();
  
  const attemptInitialization = useCallback(async () => {
    setInitError(null);
    setAppStatus('loading');
    try {
        await initializeAi();
        setAppStatus('ready');
    } catch (error: any) {
        console.error("AI Initialization failed:", error);
        // FIX: Update error message to reflect new API key handling process.
        if (error.message === 'NO_API_KEY') {
            setInitError("La API Key de Google Gemini no está configurada. Por favor, configura la variable de entorno API_KEY para continuar.");
        } else {
            setInitError(error.message);
        }
        setAppStatus('config_error');
    }
  }, []);

  useEffect(() => {
    attemptInitialization();
  }, [attemptInitialization]);

  // FIX: Removed handleKeySubmit and handleResetKey as user-managed API keys are disallowed by guidelines.


  const messages = messagesByAgent[activeAgent.id] || [];
  const setMessages = (updater: React.SetStateAction<Message[]>) => {
    const newMessages = typeof updater === 'function' ? updater(messages) : updater;
    setMessagesByAgent(prev => ({ ...prev, [activeAgent.id]: newMessages }));
  };

  useEffect(() => {
    if (appStatus === 'ready' && !messagesByAgent[activeAgent.id]) {
      setMessages([{
        id: 'welcome-' + activeAgent.id,
        text: `Hola, soy ${activeAgent.name}. ¿En qué puedo ayudarte hoy?`,
        sender: 'agent',
      }]);
    }
  }, [activeAgent.id, messagesByAgent, appStatus]);

  const handleLogin = () => setIsLoggedIn(true);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;
    const messageText = input;
    setInput('');
    const userMessage: Message = { id: Date.now(), text: messageText, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    playSound('send');
    try {
      // FIX: Original error was here. generateResponse is now correctly imported and can be called.
      const responseText = await generateResponse(activeAgent, messageText);
      const agentMessage: Message = { id: Date.now() + 1, text: responseText, sender: 'agent' };
      setMessages(prev => [...prev, agentMessage]);
      playSound('receive');
    } catch (error) {
      console.error("Error al generar respuesta:", error);
      const errorMessage: Message = { id: Date.now() + 1, text: "Lo siento, ocurrió un error. Por favor, intenta de nuevo.", sender: 'agent' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNavigate = (view: View, agentId?: string) => {
    if (view === 'chat') {
      setIsChatModalOpen(true);
    } else {
      setIsChatModalOpen(false); // Close chat if navigating elsewhere
      setActiveView(view);
    }
    if (agentId) {
      const agent = AGENTS.find(a => a.id === agentId);
      if (agent) setActiveAgent(agent);
    }
  };
  
  const handleStopGeneration = () => setIsLoading(false);
  const handleToggleListening = () => setIsListening(prev => !prev);
  const handleStopSpeaking = () => setIsSpeaking(false);

  const renderActiveView = () => {
    switch (activeView) {
      case 'nexus_zero_course': return <NexusZeroPage onNavigateToPrograms={() => handleNavigate('programs')} />;
      case 'programs': return <ProgramsPage onOpenPremium={() => setIsPremiumModalOpen(true)} />;
      case 'challenges': return <LatinoChallengesPage />;
      case 'cognitive_gym': return <CognitiveGymPage />;
      default: return <NexusZeroPage onNavigateToPrograms={() => handleNavigate('programs')} />;
    }
  };
  
  if (appStatus === 'loading') {
    return (
        <div className="fixed inset-0 bg-gray-900 z-50 flex flex-col items-center justify-center text-white">
            <NexusLogo className="w-20 h-20 text-cyan-400 animate-spin mb-4" />
            <p className="text-xl text-gray-300">Inicializando Agentes de IA...</p>
        </div>
    );
  }

  // FIX: Replaced ApiKeyPrompt with a static error screen as user-provided keys are not allowed.
  if (appStatus === 'config_error') {
    return (
      <div className="fixed inset-0 bg-gray-900 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-lg mx-auto bg-gray-800 border border-red-500/30 rounded-lg p-8 shadow-2xl text-center">
          <AlertTriangleIcon className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-white mb-2">Error de Configuración</h1>
          <p className="text-gray-300 mb-6">
            {initError || 'No se pudo inicializar la aplicación. Por favor, contacta al soporte.'}
          </p>
          <p className="text-xs text-gray-500">
            Asegúrate de que la variable de entorno API_KEY esté correctamente configurada.
          </p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen font-sans bg-cover bg-center" style={{ backgroundImage: "url('/background.jpg')" }}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
      <div className="relative p-4 grid grid-cols-1 lg:grid-cols-4 gap-4 h-screen">
        <div className="lg:col-span-1 h-full">
          <UserRankPanel 
            rank="Aprendiz Consciente"
            activeView={isChatModalOpen ? 'chat' : activeView}
            onNavigate={handleNavigate}
            onOpenPremium={() => setIsPremiumModalOpen(true)}
            // FIX: Removed onResetKey prop as it is no longer supported.
          />
        </div>
        <div className="lg:col-span-3 h-full overflow-hidden">
            {renderActiveView()}
        </div>
      </div>
      
      {activeView !== 'chat' && !isChatModalOpen && (
          <FloatingChatButton agent={activeAgent} onClick={() => setIsChatModalOpen(true)} />
      )}

      {isChatModalOpen && (
          <ChatModal
            onClose={() => setIsChatModalOpen(false)}
            messages={messages}
            activeAgent={activeAgent}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            onStopGeneration={handleStopGeneration}
            input={input}
            setInput={setInput}
            isListening={isListening}
            onToggleListening={handleToggleListening}
            isSpeaking={isSpeaking}
            onStopSpeaking={handleStopSpeaking}
          />
      )}

      {isPremiumModalOpen && <PremiumModal onClose={() => setIsPremiumModalOpen(false)} />}
    </div>
  );
};

export default App;
