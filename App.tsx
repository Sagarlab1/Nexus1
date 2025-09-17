// FIX: Implement the main App component to resolve module import errors.
import React, { useState, useEffect } from 'react';
import { AGENTS } from './constants';
import type { Agent, Message } from './types';
import { generateResponse } from './services/ai';
import { useSound } from './hooks/useSound';

// Component Imports
import UserRankPanel from './components/UserRankPanel';
import LoginScreen from './components/LoginScreen';
import PremiumModal from './components/PremiumModal';
import ChatModal from './components/ChatModal';
import FloatingChatButton from './components/FloatingChatButton';

// Page/View Imports
import NexusZeroPage from './components/NexusZeroPage';
import ProgramsPage from './components/ProgramsPage';
import LatinoChallengesPage from './components/LatinoChallengesPage';
import CognitiveGymPage from './components/CognitiveGymPage';

// Correct: Export the View type so other components like UserRankPanel can import it.
export type View = 'chat' | 'nexus_zero_course' | 'programs' | 'challenges' | 'cognitive_gym';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [messagesByAgent, setMessagesByAgent] = useState<Record<string, Message[]>>({});
  const [activeAgent, setActiveAgent] = useState<Agent>(AGENTS[2]); // Default to Nexus
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeView, setActiveView] = useState<View>('nexus_zero_course');
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);

  // Placeholder state for voice features to ensure UI components function correctly
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const playSound = useSound();

  // Memoized values for current message thread
  const messages = messagesByAgent[activeAgent.id] || [];
  const setMessages = (updater: React.SetStateAction<Message[]>) => {
    const newMessages = typeof updater === 'function' ? updater(messages) : updater;
    setMessagesByAgent(prev => ({ ...prev, [activeAgent.id]: newMessages }));
  };

  useEffect(() => {
    // Set a welcome message for an agent if no conversation exists yet
    if (!messagesByAgent[activeAgent.id]) {
      setMessages([{
        id: 'welcome-' + activeAgent.id,
        text: `Hola, soy ${activeAgent.name}. ¿En qué puedo ayudarte hoy?`,
        sender: 'agent',
      }]);
    }
  }, [activeAgent.id, messagesByAgent, setMessages]);


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
      console.error("Error generating response:", error);
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
      case 'nexus_zero_course':
        return <NexusZeroPage onNavigateToPrograms={() => handleNavigate('programs')} />;
      case 'programs':
        return <ProgramsPage onOpenPremium={() => setIsPremiumModalOpen(true)} />;
      case 'challenges':
        return <LatinoChallengesPage />;
      case 'cognitive_gym':
        return <CognitiveGymPage />;
      default:
        return <NexusZeroPage onNavigateToPrograms={() => handleNavigate('programs')} />;
    }
  };

  if (!isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen font-sans bg-cover bg-center" style={{ backgroundImage: "url('/background.jpg')" }}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
      <div className="relative p-4 grid grid-cols-1 lg:grid-cols-4 gap-4 h-screen">
        <div className="lg:col-span-1 h-full">
          <UserRankPanel 
            rank="Sapiens Inicial"
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
