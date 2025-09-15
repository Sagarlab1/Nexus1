import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GoogleGenAI, Chat } from '@google/genai';
import ChatWindow from './components/ChatWindow';
import AgentPanel from './components/AgentPanel';
import UserRankPanel from './components/UserRankPanel';
import LoginScreen from './components/LoginScreen';
import ApiKeyPrompt from './components/ApiKeyPrompt';
import ProgramsPage from './components/ProgramsPage';
import ChallengesPage from './components/ChallengesPage';
import LatinoChallengesPage from './components/LatinoChallengesPage';
import OdysseyGenerator from './components/OdysseyGenerator';
import LibraryModal from './components/LibraryModal';
import { AGENTS, RANKS } from './constants';
import type { Message, Agent, Rank } from './types';
// FIX: Import `PremiumModal` to resolve reference error.
import PremiumModal from './components/PremiumModal';

// Add minimal type definition for the Web Speech API
interface SpeechRecognition {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  start(): void;
  stop(): void;
  onresult: (event: any) => void;
  onend: () => void;
  onerror: (event: any) => void;
  // FIX: Added 'onstart' property to satisfy usage in 'handleToggleListening'.
  onstart: () => void;
}

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
  const [activeView, setActiveView] = useState('dashboard');
  
  // Premium & Feature States
  const [isPremium, setIsPremium] = useState(false);
  const [isOdyssey, setIsOdyssey] = useState(false);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  const [currentRank, setCurrentRank] = useState<Rank>(RANKS[0]);


  const chatInstances = useRef<Record<string, Chat>>({});
  const stopGenerationRef = useRef(false);

  // Speech synthesis and recognition state
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const speak = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-ES';
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      speechSynthesis.speak(utterance);
    }
  }, []);

  const handleStopSpeaking = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const getOrCreateChat = useCallback((agent: Agent) => {
    if (!ai) return null;
    if (!chatInstances.current[agent.id]) {
      chatInstances.current[agent.id] = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: { systemInstruction: agent.personalities[0].prompt },
      });
    }
    return chatInstances.current[agent.id];
  }, []);

  const handleSendMessage = useCallback(async () => {
    if (!input.trim() || !ai) return;

    const currentInput = input;
    const agentId = activeAgent.id;
    const userMessage: Message = { id: Date.now(), text: currentInput, sender: 'user' };

    handleStopSpeaking();
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
      speak(fullResponse.replace(/\*/g, ''));

    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage = "Lo siento, he encontrado un error. Por favor, inténtalo de nuevo.";
      setMessages(prev => ({
        ...prev,
        [agentId]: prev[agentId].map(m => m.id === agentMessageId ? { ...m, text: errorMessage } : m)
      }));
       speak(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [input, activeAgent, getOrCreateChat, speak]);

  const handleStopGeneration = () => {
    stopGenerationRef.current = true;
    setIsLoading(false);
  };
  
  const handleToggleListening = () => {
     if (isListening) {
      recognitionRef.current?.stop();
    } else {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition: SpeechRecognition = new SpeechRecognition();
        recognition.lang = 'es-ES';
        recognition.interimResults = true;
        recognition.continuous = false;
        recognition.onstart = () => setIsListening(true);
        recognition.onresult = (event) => setInput(event.results[0][0].transcript);
        recognition.onend = () => setIsListening(false);
        recognition.onerror = () => setIsListening(false);
        recognition.start();
        recognitionRef.current = recognition;
      }
    }
  };


  if (!API_KEY) return <ApiKeyPrompt />;
  if (!isLoggedIn) return <LoginScreen onLogin={() => setIsLoggedIn(true)} />;

  const renderView = () => {
    switch(activeView) {
      case 'programs': return <ProgramsPage onUnlockAccelerator={() => {setIsPremium(true); alert("Acelerador Desbloqueado!"); setActiveView('dashboard');}} onUnlockOdyssey={() => {setIsOdyssey(true); setIsPremium(true); alert("Odisea Desbloqueada!"); setActiveView('dashboard');}} />;
      case 'challenges': return <ChallengesPage onBack={() => setActiveView('dashboard')} currentRank={currentRank} />;
      case 'latino_challenges': return <LatinoChallengesPage onBack={() => setActiveView('dashboard')} />;
      case 'odyssey': return <OdysseyGenerator onBack={() => setActiveView('dashboard')} />;
      case 'dashboard':
      default:
        return (
          <div className="container mx-auto grid grid-cols-1 lg:grid-cols-12 gap-4 h-[calc(100vh-2rem)]">
            <div className="lg:col-span-3 space-y-4 flex flex-col">
              <UserRankPanel rank={currentRank.name} onHomeClick={() => setActiveView('dashboard')} />
              <div className="flex-grow">
                <AgentPanel agents={AGENTS} activeAgent={activeAgent} onSelectAgent={setActiveAgent} />
              </div>
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
                isListening={isListening}
                onToggleListening={handleToggleListening}
                isSpeaking={isSpeaking}
                onStopSpeaking={handleStopSpeaking}
              />
            </div>
          </div>
        );
    }
  };

  return (
    <main className="bg-gray-800 text-white min-h-screen p-4" style={{ backgroundImage: `radial-gradient(circle at 10% 20%, rgb(30, 41, 59) 0%, rgb(17, 24, 39) 90%)` }}>
      {renderView()}
      {isLibraryOpen && <LibraryModal onClose={() => setIsLibraryOpen(false)} onSelectLatinoChallenges={() => {setIsLibraryOpen(false); setActiveView('latino_challenges');}} />}
      {isPremiumModalOpen && <PremiumModal onClose={() => setIsPremiumModalOpen(false)} onLearnMore={() => {setIsPremiumModalOpen(false); setActiveView('programs');}} onUnlockAccelerator={() => {setIsPremium(true); alert("Acelerador Desbloqueado!"); setIsPremiumModalOpen(false);}} onUnlockOdyssey={() => {setIsOdyssey(true); setIsPremium(true); alert("Odisea Desbloqueada!"); setIsPremiumModalOpen(false);}} />}
    </main>
  );
}

declare global {
  interface Window {
    SpeechRecognition: { new (): SpeechRecognition };
    webkitSpeechRecognition: { new (): SpeechRecognition };
  }
}

export default App;