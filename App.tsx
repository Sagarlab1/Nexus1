import React, { useState, useEffect } from 'react';
import UserRankPanel from './components/UserRankPanel.tsx';
import AgentPanel from './components/AgentPanel.tsx';
import ChatWindow from './components/ChatWindow.tsx';
import NexusZeroPage from './components/NexusZeroPage.tsx';
import ProgramsPage from './components/ProgramsPage.tsx';
import LatinoChallengesPage from './components/LatinoChallengesPage.tsx';
import CognitiveGymPage from './components/CognitiveGymPage.tsx';
import LoginScreen from './components/LoginScreen.tsx';
import ApiKeyPrompt from './components/ApiKeyPrompt.tsx';
import PremiumModal from './components/PremiumModal.tsx';
import ChatModal from './components/ChatModal.tsx';
import FloatingChatButton from './components/FloatingChatButton.tsx';
import { AGENTS } from './constants.tsx';
import type { View, Agent, Message } from './types.ts';
import { initializeAi, setAndValidateApiKey, clearApiKey, generateResponse, isAiReady } from './services/ai.ts';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAiConfigured, setIsAiConfigured] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const [activeView, setActiveView] = useState<View>('nexus_zero_course');
  const [activeAgent, setActiveAgent] = useState<Agent>(AGENTS.find(a => a.id === 'entrepreneurship') || AGENTS[0]);
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSending, setIsSending] = useState(false);
  
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);

  useEffect(() => {
    const aiReady = initializeAi();
    setIsAiConfigured(aiReady);
    setIsLoading(false);
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleSetKey = async (apiKey: string) => {
    await setAndValidateApiKey(apiKey);
    setIsAiConfigured(true);
    setActiveView('nexus_zero_course');
  };

  const handleResetKey = () => {
    clearApiKey();
    setIsAiConfigured(false);
    setActiveView('api_key_setup');
  };
  
  const initChat = (agent: Agent) => {
      setMessages([
          { id: `welcome-${agent.id}-${Date.now()}`, sender: 'agent', text: `¡Hola! Soy ${agent.name}. ¿Cómo puedo asistirte?` }
      ]);
  };

  const handleNavigate = (view: View, agentId?: string) => {
    setActiveView(view);
    let targetAgent = activeAgent;
    if (agentId) {
      const newAgent = AGENTS.find(a => a.id === agentId);
      if (newAgent) {
        setActiveAgent(newAgent);
        targetAgent = newAgent;
      }
    }
    if (view === 'chat' && (!messages.length || agentId)) {
      initChat(targetAgent);
    }
  };
  
  const handleSelectAgent = (agent: Agent) => {
    setActiveAgent(agent);
    initChat(agent);
  };

  const handleSendMessage = async (message: string) => {
    const userMessage: Message = { id: Date.now(), sender: 'user', text: message };
    setMessages(prev => [...prev, userMessage]);
    
    if (!isAiReady()) {
      setIsSending(true);
      setTimeout(() => {
        const agentMessage: Message = {
          id: Date.now() + 1,
          sender: 'agent',
          text: 'Modo de demostración: La funcionalidad de chat está desactivada.',
          action: {
            text: 'Configurar API Key',
            onClick: () => {
              setShowChatModal(false);
              handleNavigate('api_key_setup');
            },
          }
        };
        setMessages(prev => [...prev, agentMessage]);
        setIsSending(false);
      }, 500);
      return;
    }

    setIsSending(true);
    try {
      const responseText = await generateResponse(activeAgent, message);
      const agentMessage: Message = { id: Date.now() + 1, sender: 'agent', text: responseText };
      setMessages(prev => [...prev, agentMessage]);
    } catch (error: any) {
      const errorMessage: Message = { id: Date.now() + 1, sender: 'agent', text: `Error: ${error.message}` };
      setMessages(prev => [...prev, errorMessage]);
      if (error.message.includes('reconfiguración')) {
        setTimeout(() => window.location.reload(), 3000);
      }
    } finally {
      setIsSending(false);
    }
  };
  
  const renderContent = () => {
    if (activeView === 'api_key_setup') {
      return <ApiKeyPrompt onSetKey={handleSetKey} />;
    }
    switch (activeView) {
      case 'chat':
        return <ChatWindow messages={messages} activeAgent={activeAgent} onSendMessage={handleSendMessage} isSending={isSending} />;
      case 'nexus_zero_course':
        return <NexusZeroPage onNavigateToPrograms={() => setActiveView('programs')} />;
      case 'programs':
        return <ProgramsPage onOpenPremium={() => setShowPremiumModal(true)} />;
      case 'challenges':
        return <LatinoChallengesPage />;
      case 'cognitive_gym':
        return <CognitiveGymPage />;
      default:
        return <NexusZeroPage onNavigateToPrograms={() => setActiveView('programs')} />;
    }
  };
  
  if (isLoading) {
    return <div className="bg-gray-900 w-full h-screen"></div>;
  }
  
  if (!isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="bg-gray-900 text-white font-sans h-screen flex flex-col p-0 md:p-4 gap-4 bg-grid-pattern overflow-hidden">
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 h-full md:h-[calc(100vh-2rem)]">
        <aside className="hidden lg:block lg:col-span-3 h-full">
            <UserRankPanel 
                rank="Sapiens Inicial" 
                activeView={activeView}
                onNavigate={handleNavigate}
                onOpenPremium={() => setShowPremiumModal(true)}
                isAiConfigured={isAiConfigured}
                onResetKey={handleResetKey}
            />
        </aside>

        <section className="col-span-1 lg:col-span-6 h-full min-h-0">
            {renderContent()}
        </section>

        <aside className="hidden lg:block lg:col-span-3 h-full">
            <AgentPanel
                agents={AGENTS}
                activeAgent={activeAgent}
                onSelectAgent={handleSelectAgent}
            />
        </aside>
      </main>
      
      {showPremiumModal && <PremiumModal onClose={() => setShowPremiumModal(false)} />}

      {activeView !== 'chat' && <FloatingChatButton onClick={() => setShowChatModal(true)} />}

      {showChatModal && (
        <ChatModal 
          onClose={() => setShowChatModal(false)}
          messages={messages}
          activeAgent={activeAgent}
          onSendMessage={handleSendMessage}
          isSending={isSending}
          agents={AGENTS}
          onSelectAgent={handleSelectAgent}
        />
      )}
      
      <style>{`
          .bg-grid-pattern {
            background-image: linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
            background-size: 2rem 2rem;
            background-position: center center;
          }
      `}</style>
    </div>
  );
};

export default App;