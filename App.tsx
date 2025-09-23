import React, { useState, useEffect, useCallback } from 'react';
// import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { AGENTS } from './constants.tsx';
import type { Agent, Message, View } from './types.ts';
import { initializeAi, setAndValidateApiKey, clearApiKey, generateResponse } from './services/ai.ts';
import { useSound } from './hooks/useSound.ts';

// Component Imports
import UserRankPanel from './components/UserRankPanel.tsx';
import LoginScreen from './components/LoginScreen.tsx';
import PremiumModal from './components/PremiumModal.tsx';
import ChatModal from './components/ChatModal.tsx';
import FloatingChatButton from './components/FloatingChatButton.tsx';
import NexusLogo from './components/icons/NexusLogo.tsx';
import ApiKeyPrompt from './components/ApiKeyPrompt.tsx';

// Page/View Imports
import NexusZeroPage from './components/NexusZeroPage.tsx';
import ProgramsPage from './components/ProgramsPage.tsx';
import LatinoChallengesPage from './components/LatinoChallengesPage.tsx';
import CognitiveGymPage from './components/CognitiveGymPage.tsx';

const App: React.FC = () => {
  const [isInitializing, setIsInitializing] = useState(true);
  const [isAiConfigured, setIsAiConfigured] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [messagesByAgent, setMessagesByAgent] = useState<Record<string, Message[]>>({});
  const [activeAgent, setActiveAgent] = useState<Agent>(AGENTS[2]); // Default to Nexus
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeView, setActiveView] = useState<View>('nexus_zero_course');
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  // Temporarily disable speech recognition to solve library conflict
  const listening = false;
  const transcript = '';
  const resetTranscript = () => {};
  const browserSupportsSpeechRecognition = false;
  
  const playSound = useSound();
  
  useEffect(() => {
    // Simulate initialization and check for existing API key
    setTimeout(() => {
      setIsAiConfigured(initializeAi());
      setIsInitializing(false);
    }, 500);
  }, []);

  // Effect to update input with transcript when listening ends
  useEffect(() => {
    if (!listening && transcript) {
      setInput(prev => (prev ? prev + ' ' : '') + transcript);
      resetTranscript();
    }
  }, [listening, transcript]);

  const messages = messagesByAgent[activeAgent.id] || [];
  const setMessages = (updater: React.SetStateAction<Message[]>) => {
    const newMessages = typeof updater === 'function' ? updater(messages) : updater;
    setMessagesByAgent(prev => ({ ...prev, [activeAgent.id]: newMessages }));
  };

  useEffect(() => {
    if (isAiConfigured && !messagesByAgent[activeAgent.id]) {
      setMessages([{
        id: 'welcome-' + activeAgent.id,
        text: `Hola, soy ${activeAgent.name}. ¿En qué puedo ayudarte hoy?`,
        sender: 'agent',
      }]);
    }
  }, [activeAgent, isAiConfigured, messagesByAgent]);

  const handleLogin = () => setIsLoggedIn(true);

  const handleSetKey = async (apiKey: string) => {
    await setAndValidateApiKey(apiKey);
    setIsAiConfigured(true);
    setActiveView('nexus_zero_course');
  };

  const handleResetKey = useCallback(() => {
      clearApiKey();
      setIsAiConfigured(false);
      setActiveView('api_key_setup');
  }, []);

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
    } catch (error: any) {
      console.error("Error al generar respuesta:", error);
      const errorMessage: Message = { id: Date.now() + 1, text: `Lo siento, ocurrió un error: ${error.message}`, sender: 'agent' };
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
  
  const handleToggleListening = () => {
    alert("La función de reconocimiento de voz está temporalmente desactivada.");
  };

  const handleStopSpeaking = () => setIsSpeaking(false);

  const renderActiveView = () => {
    switch (activeView) {
      case 'nexus_zero_course': return <NexusZeroPage onNavigateToPrograms={() => handleNavigate('programs')} />;
      case 'programs': return <ProgramsPage onOpenPremium={() => setIsPremiumModalOpen(true)} />;
      case 'challenges': return <LatinoChallengesPage />;
      case 'cognitive_gym': return <CognitiveGymPage />;
      case 'api_key_setup': return <ApiKeyPrompt onSetKey={handleSetKey} />;
      default: return <NexusZeroPage onNavigateToPrograms={() => handleNavigate('programs')} />;
    }
  };
  
  if (isInitializing) {
    return (
        <div className="fixed inset-0 bg-gray-900 z-50 flex flex-col items-center justify-center text-white">
            <NexusLogo className="w-20 h-20 text-cyan-400 animate-spin mb-4" />
            <p className="text-xl text-gray-300">Inicializando Nexus Sapiens...</p>
        </div>
    );
  }

  if (!isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="h-screen w-screen bg-gray-900 text-white flex p-4 gap-4 overflow-hidden">
      <div className="w-1/4 max-w-sm flex-shrink-0">
         <UserRankPanel 
          rank="Neófito Cognitivo" 
          activeView={activeView} 
          onNavigate={handleNavigate}
          onOpenPremium={() => setIsPremiumModalOpen(true)}
          isAiConfigured={isAiConfigured}
          onResetKey={handleResetKey}
         />
      </div>
      <main className="flex-1 h-full relative">
        <div key={activeView} className="absolute inset-0 animate-fade-in">
          {renderActiveView()}
        </div>
      </main>
      
      {isPremiumModalOpen && <PremiumModal onClose={() => setIsPremiumModalOpen(false)} />}
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
          isListening={listening}
          onToggleListening={handleToggleListening}
          isSpeaking={isSpeaking}
          onStopSpeaking={handleStopSpeaking}
          browserSupportsSpeechRecognition={browserSupportsSpeechRecognition}
        />
      )}
      <FloatingChatButton agent={activeAgent} onClick={() => handleNavigate('chat')} />
    </div>
  );
};

export default App;