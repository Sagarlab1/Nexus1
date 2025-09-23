import React, { useState, useEffect } from 'react';
import UserRankPanel from './components/UserRankPanel.tsx';
import AgentPanel from './components/AgentPanel.tsx';
import ChatWindow from './components/ChatWindow.tsx';
import NexusZeroPage from './components/NexusZeroPage.tsx';
import ProgramsPage from './components/ProgramsPage.tsx';
import LatinoChallengesPage from './components/LatinoChallengesPage.tsx';
import CognitiveGymPage from './components/CognitiveGymPage.tsx';
import ApiKeyPrompt from './components/ApiKeyPrompt.tsx';
import PremiumModal from './components/PremiumModal.tsx';
import ChatModal from './components/ChatModal.tsx';
import FloatingChatButton from './components/FloatingChatButton.tsx';
import CriticalThinkingCoursePage from './components/CriticalThinkingCoursePage.tsx';
import CreativityCoursePage from './components/CreativityCoursePage.tsx';
import EntrepreneurshipCoursePage from './components/EntrepreneurshipCoursePage.tsx';
import GenerativeAiCoursePage from './components/GenerativeAiCoursePage.tsx';
import { AGENTS } from './constants.tsx';
import type { View, Agent, Message } from './types.ts';
import { generateResponse, setApiKey, validateApiKey } from './services/ai.ts';
import NexusLogo from './components/icons/NexusLogo.tsx';
import MenuIcon from './components/icons/MenuIcon.tsx';

const API_KEY_STORAGE_KEY = 'NEXUS_SAPIENS_API_KEY';

const App: React.FC = () => {
  const [apiKey, setLocalApiKey] = useState<string | null>(null);
  const [isKeyChecked, setIsKeyChecked] = useState(false);
  
  const defaultAgent = AGENTS.find(a => a.id === 'critical_thinking') || AGENTS[0];
  
  const [activeView, setActiveView] = useState<View>('nexus_zero_course');
  const [activeAgent, setActiveAgent] = useState<Agent>(defaultAgent);
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSending, setIsSending] = useState(false);
  
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const key = process.env.API_KEY || localStorage.getItem(API_KEY_STORAGE_KEY);
    if (key) {
      setApiKey(key);
      setLocalApiKey(key);
    }
    setIsKeyChecked(true);
  }, []);

  const initChat = (agent: Agent) => {
      setMessages([
          { id: `welcome-${agent.id}-${Date.now()}`, sender: 'agent', text: `¡Hola! Soy ${agent.name}. ¿Cómo puedo asistirte?` }
      ]);
  };
  
  // Initialize chat when the main app is ready to be shown
  useEffect(() => {
    if (apiKey) {
      initChat(defaultAgent);
    }
  }, [apiKey]);
  
  const handleSetKey = async (newKey: string) => {
    const isValid = await validateApiKey(newKey);
    if (isValid) {
      localStorage.setItem(API_KEY_STORAGE_KEY, newKey);
      setApiKey(newKey);
      setLocalApiKey(newKey);
    } else {
      throw new Error("La clave API no es válida o ha ocurrido un error al verificarla.");
    }
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
    if (view === 'chat' && (!messages.length || (agentId && activeAgent.id !== agentId))) {
      initChat(targetAgent);
    }
    setIsSidebarOpen(false);
  };

  const handleOpenPremium = () => {
    setShowPremiumModal(true);
    setIsSidebarOpen(false);
  }

  const handleSelectAgent = (agent: Agent) => {
    setActiveAgent(agent);
    initChat(agent);
  };

  const handleSendMessage = async (message: string) => {
    const userMessage: Message = { id: Date.now(), sender: 'user', text: message };
    setMessages(prev => [...prev, userMessage]);
    
    setIsSending(true);
    try {
      const responseText = await generateResponse(activeAgent, message);
      const agentMessage: Message = { id: Date.now() + 1, sender: 'agent', text: responseText };
      setMessages(prev => [...prev, agentMessage]);
    } catch (error: any) {
      const errorMessageText = error.message || "Ocurrió un error desconocido al comunicarse con el agente.";
      const errorMessage: Message = { id: Date.now() + 1, sender: 'agent', text: `Error: ${errorMessageText}` };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsSending(false);
    }
  };
  
  const renderContent = () => {
    switch (activeView) {
      case 'chat':
        return <ChatWindow messages={messages} activeAgent={activeAgent} onSendMessage={handleSendMessage} isSending={isSending} onClose={() => handleNavigate('nexus_zero_course')} />;
      case 'nexus_zero_course':
        return <NexusZeroPage onNavigateToPrograms={() => setActiveView('programs')} />;
      case 'programs':
        return <ProgramsPage onNavigate={handleNavigate} onOpenPremium={() => setShowPremiumModal(true)} />;
      case 'challenges':
        return <LatinoChallengesPage />;
      case 'cognitive_gym':
        return <CognitiveGymPage />;
      case 'critical_thinking_course':
        return <CriticalThinkingCoursePage onBack={() => setActiveView('programs')} />;
      case 'creativity_course':
        return <CreativityCoursePage onBack={() => setActiveView('programs')} />;
      case 'entrepreneurship_course':
        return <EntrepreneurshipCoursePage onBack={() => setActiveView('programs')} />;
      case 'gen_ai_course':
        return <GenerativeAiCoursePage onBack={() => setActiveView('programs')} />;
      default:
        return <NexusZeroPage onNavigateToPrograms={() => setActiveView('programs')} />;
    }
  };
  
  if (!isKeyChecked) {
    // Render a blank screen or a loading spinner while checking for the key
    return null;
  }

  if (!apiKey) {
    return <ApiKeyPrompt onSetKey={handleSetKey} />;
  }

  return (
    <div className="bg-gray-900 text-white font-sans h-screen flex flex-col bg-grid-pattern overflow-hidden">
      {/* Mobile Header */}
      <header className="lg:hidden flex justify-between items-center p-4 bg-gray-900/80 backdrop-blur-sm border-b border-gray-700/50 flex-shrink-0">
        <div className="flex items-center gap-3">
          <NexusLogo className="w-8 h-8 text-cyan-400" />
          <h1 className="text-xl font-bold">Nexus Sapiens</h1>
        </div>
        <button onClick={() => setIsSidebarOpen(true)} className="p-1 rounded-md hover:bg-gray-700">
          <MenuIcon className="w-6 h-6" />
        </button>
      </header>

      <div className="flex-1 flex p-0 md:p-4 gap-4 overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block lg:w-1/4 h-full">
            <UserRankPanel 
                rank="Sapiens Inicial" 
                activeView={activeView}
                onNavigate={handleNavigate}
                onOpenPremium={handleOpenPremium}
            />
        </aside>

        {/* Main Area (Content + Right Panel) */}
        <main className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 h-full min-w-0 p-4 pt-2 md:p-0">
          <section className="col-span-1 lg:col-span-2 h-full min-h-0">
              {renderContent()}
          </section>

          <aside className="hidden lg:block lg:col-span-1 h-full">
              <AgentPanel
                  agents={AGENTS}
                  activeAgent={activeAgent}
                  onSelectAgent={handleSelectAgent}
              />
          </aside>
        </main>
      </div>

       {/* Mobile Sidebar (Drawer) */}
       <div className={`fixed inset-0 z-50 flex lg:hidden transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)}></div>
        <div className={`relative bg-gray-900 h-full w-4/5 max-w-xs shadow-2xl transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <UserRankPanel 
            rank="Sapiens Inicial" 
            activeView={activeView}
            onNavigate={handleNavigate}
            onOpenPremium={handleOpenPremium}
          />
        </div>
      </div>
      
      {showPremiumModal && <PremiumModal onClose={() => setShowPremiumModal(false)} />}
      
      {activeView !== 'chat' && !showChatModal && (
        <FloatingChatButton 
            onClick={() => {
                if (!messages.length) initChat(activeAgent);
                setShowChatModal(true);
            }} 
        />
      )}

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
