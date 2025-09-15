import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GoogleGenAI, Chat } from '@google/genai';
import ChatWindow from './components/ChatWindow';
import AgentPanel from './components/AgentPanel';
import UserRankPanel from './components/UserRankPanel';
import LoginScreen from './components/LoginScreen';
import ApiKeyPrompt from './components/ApiKeyPrompt';
import { AGENTS } from './constants';
import type { Message, Agent } from './types';

// FIX: Use process.env.API_KEY as required by the guidelines to fix the TypeScript error.
const API_KEY = process.env.API_KEY;

let ai: GoogleGenAI | null = null;
if (API_KEY) {
  ai = new GoogleGenAI({ apiKey: API_KEY });
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeAgent, setActiveAgent] = useState<Agent>(AGENTS[0]);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatInstances = useRef<Record<string, Chat>>({});
  const stopGenerationRef = useRef(false);

  const getOrCreateChat = useCallback((agent: Agent) => {
    if (!ai) return null;
    if (!chatInstances.current[agent.id]) {
      chatInstances.current[agent.id] = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
          systemInstruction: agent.personalities[0].prompt,
        },
      });
    }
    return chatInstances.current[agent.id];
  }, []);

  const handleSendMessage = useCallback(async () => {
    if (!input.trim() || !ai) return;

    const currentInput = input;
    const agentId = activeAgent.id;
    const userMessage: Message = { id: Date.now(), text: currentInput, sender: 'user' };

    setMessages(prev => ({ ...prev, [agentId]: [...(prev[agentId] || []), userMessage] }));
    setInput('');
    setIsLoading(true);
    stopGenerationRef.current = false;

    const agentMessageId = Date.now() + 1;
    const agentMessage: Message = { id: agentMessageId, text: '', sender: 'agent' };
    setMessages(prev => ({ ...prev, [agentId]: [...(prev[agentId] || []), agentMessage] }));

    try {
      const chat = getOrCreateChat(activeAgent);
      if (!chat) throw new Error("Chat not initialized");
      
      const stream = await chat.sendMessageStream({ message: currentInput });

      let fullResponse = '';
      for await (const chunk of stream) {
        if (stopGenerationRef.current) break;
        fullResponse += chunk.text;
        setMessages(prev => ({
          ...prev,
          [agentId]: prev[agentId].map(m => m.id === agentMessageId ? { ...m, text: fullResponse } : m)
        }));
      }
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage = "Lo siento, he encontrado un error. Por favor, inténtalo de nuevo.";
      setMessages(prev => ({
        ...prev,
        [agentId]: prev[agentId].map(m => m.id === agentMessageId ? { ...m, text: errorMessage } : m)
      }));
    } finally {
      setIsLoading(false);
    }
  }, [input, activeAgent, getOrCreateChat]);

  const handleStopGeneration = () => {
    stopGenerationRef.current = true;
    setIsLoading(false);
  };

  if (!API_KEY) {
    return <ApiKeyPrompt />;
  }
  
  if (!isLoggedIn) {
    return <LoginScreen onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <main className="bg-gray-900 text-white min-h-screen p-4">
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-12 gap-4 h-[calc(100vh-2rem)]">
        <div className="lg:col-span-3 space-y-4">
          <UserRankPanel rank="Aspirante" onHomeClick={() => {}} />
          <AgentPanel agents={AGENTS} activeAgent={activeAgent} onSelectAgent={setActiveAgent} />
        </div>
        <div className="lg:col-span-9">
          <ChatWindow
            messages={messages[activeAgent.id] || []}
            activeAgent={activeAgent}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            onStopGeneration={handleStopGeneration}
            input={input}
            setInput={setInput}
            isListening={false}
            onToggleListening={() => {}}
            isSpeaking={false}
            onStopSpeaking={() => {}}
          />
        </div>
      </div>
    </main>
  );
}

export default App;
