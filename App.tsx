
import React, { useState, useEffect } from 'react';
import { AGENTS } from './constants';
import type { Agent, Message } from './types';
import { initializeAi, generateResponse } from './services/ai';
import { useSound } from './hooks/useSound';

// Component Imports
import UserRankPanel from './components/UserRankPanel';
import LoginScreen from './components/LoginScreen';
import PremiumModal from './components/PremiumModal';
import ChatModal from './components/ChatModal';
import FloatingChatButton from './components/FloatingChatButton';
import NexusLogo from './components/icons/NexusLogo';

// Page/View Imports
import NexusZeroPage from './components/NexusZeroPage';
import ProgramsPage from './components/ProgramsPage';
import LatinoChallengesPage from './components/LatinoChallengesPage';
import CognitiveGymPage from './components/CognitiveGymPage';

export type View = 'chat' | 'nexus_zero_course' | 'programs' | 'challenges' | 'cognitive_gym';

const App: React.FC = () => {
  const [isAiReady, setIsAiReady] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [initializationError, setInitializationError] = useState<string | null>(null);
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

  useEffect(() => {
    try {
      initializeAi();
      setIsAiReady(true);
    } catch (error: any) {
      console.error("Fallo al inicializar la IA:", error);
      setInitializationError(error.message || "Ocurrió un error desconocido.");
      setIsAiReady(false);
    } finally {
      setIsInitializing(false);
    }
  }, []);


  const messages = messagesByAgent[activeAgent.id] || [];
  const setMessages = (updater: React.SetStateAction<Message[]>) => {
    const newMessages = typeof updater === 'function' ? updater(messages) : updater;
    setMessagesByAgent(prev => ({ ...prev, [activeAgent.id]: newMessages }));
  };

  useEffect(() => {
    if (isAiReady && !messagesByAgent[activeAgent.id]) {
      setMessages([{
        id: 'welcome-' + activeAgent.id,
        text: `Hola, soy ${activeAgent.name}. ¿En qué puedo ayudarte hoy?`,
        sender: 'agent',
      }]);
    }
  }, [activeAgent.id, messagesByAgent, isAiReady]);

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

  if (isInitializing) {
    return (
      <div className="fixed inset-0 bg-gray-900 z-50 flex items-center justify-center">
        <NexusLogo className="w-24 h-24 text-cyan-400 animate-pulse" />
      </div>
    );
  }

  if (!isAiReady) {
     return (
        <div className="fixed inset-0 bg-gray-900 z-50 flex items-center justify-center p-4 text-white">
          <div className="w-full max-w-md mx-auto bg-gray-800 border border-red-500 rounded-lg p-8 shadow-2xl text-center">
             <h1 className="text-2xl font-bold mb-3">Error de Inicialización de IA</h1>
             <p className="text-red-300 mb-4">{initializationError}</p>
             <p className="text-sm text-gray-400">
                Por favor, asegúrate de que la variable de entorno <code className="bg-gray-700 text-cyan-300 font-mono px-1 py-0.5 rounded-md">API_KEY</code> esté configurada correctamente en tu entorno de despliegue.
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
          />
        </div>
        <div className="lg:col-span-3 h-full overflow-hidden">
            {renderActiveView()}
        </div>
      </div>
      
      {activeView !== 'chat' && (
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
