import React, { useState, useEffect, useRef } from 'react';
// FIX: Correctly import GoogleGenAI and Chat types.
import { GoogleGenAI, Chat } from "@google/genai";
import ChatWindow from './components/ChatWindow';
import AgentPanel from './components/AgentPanel';
import UserRankPanel from './components/UserRankPanel';
import SkillTree from './components/SkillTree';
import LoginScreen from './components/LoginScreen';
import ChallengesPage from './components/ChallengesPage';
import LatinoChallengesPage from './components/LatinoChallengesPage';
import ProgramsPage from './components/ProgramsPage';
import OdysseyGenerator from './components/OdysseyGenerator';
import type { Message, Agent, Rank } from './types';
import { AGENTS, RANKS } from './constants';
import { useSound } from './hooks/useSound';

// FIX: Initialize Gemini API client as per guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [activeAgent, setActiveAgent] = useState<Agent>(AGENTS[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentView, setCurrentView] = useState('chat'); // 'chat', 'challenges', etc.
  
  const [userXp, setUserXp] = useState(0);
  const [currentRank, setCurrentRank] = useState<Rank>(RANKS[0]);

  const chatRef = useRef<Chat | null>(null);
  const stopGenerationRef = useRef(false);

  // Audio/Speech state (simplified)
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const playSound = useSound();

  useEffect(() => {
    // Determine user rank based on XP
    const newRank = RANKS.slice().reverse().find(r => userXp >= r.minXp) || RANKS[0];
    if (newRank.name !== currentRank.name) {
      setCurrentRank(newRank);
    }
  }, [userXp, currentRank.name]);

  useEffect(() => {
    // FIX: Re-create chat session when agent changes.
    const agentPrompt = `You are ${activeAgent.name}, ${activeAgent.description}.`;
    // FIX: Use ai.chats.create to start a new chat session.
    chatRef.current = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: agentPrompt,
      },
    });
    setMessages([]); // Clear messages when switching agent
    playSound('switch');
  }, [activeAgent, playSound]);


  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { id: Date.now(), text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);
    stopGenerationRef.current = false;
    playSound('send');
    
    const agentMessageId = Date.now() + 1;
    setMessages(prev => [...prev, { id: agentMessageId, text: '', sender: 'agent' }]);

    try {
        if (!chatRef.current) {
            throw new Error("Chat session not initialized.");
        }
        
        // FIX: Use chat.sendMessageStream for streaming response.
        const stream = await chatRef.current.sendMessageStream({ message: currentInput });

        let fullText = '';
        for await (const chunk of stream) {
            if (stopGenerationRef.current) {
                break;
            }
            // FIX: Access text directly from chunk.
            const chunkText = chunk.text;
            if (chunkText) {
                fullText += chunkText;
                setMessages(prev =>
                    prev.map(msg =>
                        msg.id === agentMessageId ? { ...msg, text: fullText } : msg
                    )
                );
            }
        }
    } catch (error) {
        console.error('Error sending message:', error);
        setMessages(prev =>
            prev.map(msg =>
                msg.id === agentMessageId ? { ...msg, text: 'Lo siento, he encontrado un error. Por favor, intenta de nuevo.' } : msg
            )
        );
    } finally {
        setIsLoading(false);
        playSound('receive');
    }
  };
  
  const handleStopGeneration = () => {
    stopGenerationRef.current = true;
    setIsLoading(false);
  };
  
  const handleLogin = () => {
    setIsLoggedIn(true);
    playSound('login');
    setMessages([{ id: 'welcome', text: `¡Hola! Soy ${activeAgent.name}. ¿En qué podemos trabajar hoy?`, sender: 'agent' }]);
  };
  
  const renderView = () => {
    switch (currentView) {
      case 'challenges':
        return <ChallengesPage onBack={() => setCurrentView('chat')} currentRank={currentRank} />;
      case 'latino_challenges':
        return <LatinoChallengesPage onBack={() => setCurrentView('chat')} />;
      case 'programs':
        return <ProgramsPage onUnlockAccelerator={() => setCurrentView('challenges')} onUnlockOdyssey={() => setCurrentView('odyssey_generator')} />;
      case 'odyssey_generator':
        return <OdysseyGenerator onBack={() => setCurrentView('chat')} />;
      case 'chat':
      default:
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-full">
            <div className="lg:col-span-1 flex flex-col gap-4">
              <UserRankPanel rank={currentRank.name} onHomeClick={() => setCurrentView('chat')} />
              <AgentPanel agents={AGENTS} activeAgent={activeAgent} onSelectAgent={setActiveAgent} />
              <SkillTree />
            </div>
            <div className="lg:col-span-2 h-full">
              <ChatWindow
                messages={messages}
                activeAgent={activeAgent}
                onSendMessage={handleSendMessage}
                isLoading={isLoading}
                onStopGeneration={handleStopGeneration}
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
  };

  if (!isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <main className="w-full h-screen bg-gray-900 text-white p-4 overflow-hidden">
        <div className="stars"></div>
        <div className="twinkling"></div>
        {renderView()}
    </main>
  );
};

export default App;
