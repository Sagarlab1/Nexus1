// FIX: Implement the main App component to structure the application.
import React, { useState, useEffect, useCallback } from 'react';
import { GoogleGenAI, Chat } from '@google/genai';
import type { Message, Agent, Rank } from './types';
import { AGENTS, RANKS } from './constants';
import ChatWindow from './components/ChatWindow';
import AgentPanel from './components/AgentPanel';
import UserRankPanel from './components/UserRankPanel';
import LoginScreen from './components/LoginScreen';
import ChallengesPage from './components/ChallengesPage';
import LatinoChallengesPage from './components/LatinoChallengesPage';
import OdysseyGenerator from './components/OdysseyGenerator';
import ProgramsPage from './components/ProgramsPage';
import SkillTree from './components/SkillTree';

type Page = 'chat' | 'challenges' | 'latino_challenges' | 'programs' | 'odyssey';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeAgent, setActiveAgent] = useState<Agent>(AGENTS[0]);
  const [chatInstance, setChatInstance] = useState<Chat | null>(null);
  const [userXp, setUserXp] = useState(0);
  const [currentPage, setCurrentPage] = useState<Page>('chat');

  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const currentRank = RANKS.slice().reverse().find(r => userXp >= r.minXp) || RANKS[0];

  const initializeChat = useCallback(() => {
    if (process.env.API_KEY) {
        // FIX: Initialize GoogleGenAI with named apiKey parameter as per guidelines.
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        // FIX: Use the recommended 'gemini-2.5-flash' model.
        const chat = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: `Eres ${activeAgent.name}, ${activeAgent.description}.`,
            },
        });
        setChatInstance(chat);
    }
  }, [activeAgent]);

  useEffect(() => {
    if (isLoggedIn) {
        initializeChat();
        setMessages([
            {
                id: 'intro',
                text: `Hola, soy ${activeAgent.name}. ¿En qué podemos trabajar hoy para acelerar tu evolución?`,
                sender: 'agent',
            },
        ]);
    }
  }, [isLoggedIn, activeAgent, initializeChat]);


  const handleSendMessage = async () => {
    if (!input.trim() || !chatInstance) return;

    const userMessage: Message = { id: Date.now(), text: input, sender: 'user' };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // FIX: Use sendMessageStream for a streaming chat response.
      const responseStream = await chatInstance.sendMessageStream({ message: input });
      
      let agentResponseText = '';
      const agentMessageId = Date.now() + 1;

      // Initialize agent message
      setMessages((prev) => [
        ...prev,
        { id: agentMessageId, text: '...', sender: 'agent' },
      ]);
      
      for await (const chunk of responseStream) {
          // FIX: Access the generated text directly from the 'text' property of the chunk.
          agentResponseText += chunk.text;
          setMessages((prev) =>
              prev.map((msg) =>
                  msg.id === agentMessageId ? { ...msg, text: agentResponseText } : msg
              )
          );
      }
    } catch (error) {
        console.error('Error sending message:', error);
        setMessages((prev) => [
            ...prev,
            { id: 'error', text: 'Lo siento, he encontrado un error. Por favor, intenta de nuevo.', sender: 'agent' },
        ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectAgent = (agent: Agent) => {
    setActiveAgent(agent);
    setMessages([]); // Reset messages when switching agent
  };

  const handleLogin = () => {
      if (process.env.API_KEY) {
          setIsLoggedIn(true);
      } else {
          alert("API_KEY no encontrada. Por favor, configura la variable de entorno.");
      }
  };

  const renderPage = () => {
    switch (currentPage) {
        case 'challenges':
            return <ChallengesPage onBack={() => setCurrentPage('chat')} currentRank={currentRank} />;
        case 'latino_challenges':
            return <LatinoChallengesPage onBack={() => setCurrentPage('chat')} />;
        case 'programs':
            return <ProgramsPage onUnlockAccelerator={() => { setUserXp(userXp + 50); setCurrentPage('challenges'); }} onUnlockOdyssey={() => { setUserXp(userXp + 100); setCurrentPage('odyssey'); }} />;
        case 'odyssey':
            return <OdysseyGenerator onBack={() => setCurrentPage('chat')} />;
        case 'chat':
        default:
            return (
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 h-full">
                    <div className="md:col-span-1 space-y-4 flex flex-col">
                        <UserRankPanel rank={currentRank.name} onHomeClick={() => setCurrentPage('chat')} />
                        <AgentPanel agents={AGENTS} activeAgent={activeAgent} onSelectAgent={handleSelectAgent} />
                        <SkillTree />
                         <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-lg p-6 shadow-lg shadow-black/20 mt-auto">
                            <h3 className="text-lg font-bold text-white mb-2">Programas de Evolución</h3>
                            <button onClick={() => setCurrentPage('programs')} className="w-full text-left p-3 bg-cyan-600/50 hover:bg-cyan-600/70 rounded-lg transition-colors">
                                Ver Programas Premium
                            </button>
                        </div>
                    </div>
                    <div className="md:col-span-2">
                        <ChatWindow
                            messages={messages}
                            activeAgent={activeAgent}
                            onSendMessage={handleSendMessage}
                            isLoading={isLoading}
                            onStopGeneration={() => console.log('stop generation')}
                            input={input}
                            setInput={setInput}
                            isListening={isListening}
                            onToggleListening={() => setIsListening(!isListening)}
                            isSpeaking={isSpeaking}
                            onStopSpeaking={() => setIsSpeaking(false)}
                        />
                    </div>
                </div>
            );
    }
  }

  if (!isLoggedIn) {
      return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <main className="bg-gray-900 text-white w-full h-screen font-sans bg-grid-cyan-500/[0.2]">
      {renderPage()}
    </main>
  );
};

export default App;
