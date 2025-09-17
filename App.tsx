import React, { useState, useEffect } from 'react';
import { GoogleGenAI, Chat } from '@google/genai';
import { AGENTS } from './constants';
import type { Agent, Message } from './types';
import LoginScreen from './components/LoginScreen';
import AgentPanel from './components/AgentPanel';
import ChatWindow from './components/ChatWindow';
import UserRankPanel from './components/UserRankPanel';
import NexusLogo from './components/icons/NexusLogo';
import ProgramsPage from './components/ProgramsPage';
import LatinoChallengesPage from './components/LatinoChallengesPage';
import PremiumModal from './components/PremiumModal';
import NexusZeroPage from './components/NexusZeroPage';
import CriticalThinkingCoursePage from './components/CriticalThinkingCoursePage';
import CreativityCoursePage from './components/CreativityCoursePage';
import EntrepreneurshipCoursePage from './components/EntrepreneurshipCoursePage';
import GenerativeAiCoursePage from './components/GenerativeAiCoursePage';
import FloatingChatButton from './components/FloatingChatButton';
import ChatModal from './components/ChatModal';
import CognitiveGymPage from './components/CognitiveGymPage';


// --- Type definitions for Web Speech API ---
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onerror: (event: Event) => void;
  onend: () => void;
  onstart: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
}

declare global {
  interface Window {
    SpeechRecognition: { new (): SpeechRecognition };
    webkitSpeechRecognition: { new (): SpeechRecognition };
  }
}
// --- End of Type definitions ---

export type View = 'chat' | 'programs' | 'challenges' | 'nexus_zero_course' | 'critical_thinking_course' | 'creativity_course' | 'entrepreneurship_course' | 'gen_ai_course' | 'cognitive_gym';

// FIX: Initialize GoogleGenAI with process.env.API_KEY as per guidelines.
// This assumes the API_KEY is available in the environment and fixes the `import.meta.env` error.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // FIX: Removed states related to manual API key management.
  // The API key is now handled exclusively by environment variables.
  
  const [activeAgent, setActiveAgent] = useState<Agent>(AGENTS[0]);
  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const generationController = React.useRef<AbortController | null>(null);

  // Navigation and Modals
  const [activeView, setActiveView] = useState<View>('nexus_zero_course');
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);


  // Voice state
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognitionRef = React.useRef<SpeechRecognition | null>(null);
  
  // FIX: Removed functions and useEffect related to manual API key management (handleInvalidKey, initializeAi).
  // The application now assumes a valid API key is provided via environment variables.

  useEffect(() => {
    // FIX: Simplified chat initialization. It no longer depends on a dynamic `ai` object.
    const initializeChat = async () => {
        try {
            setMessages([]);
            setIsLoading(false);
            
            const newChat = ai.chats.create({
              model: 'gemini-2.5-flash',
              config: {
                systemInstruction: activeAgent.prompt
              },
            });
            setChat(newChat);
            setMessages([
                { id: 'initial', text: `Hola, soy ${activeAgent.name}. ¿En qué podemos profundizar hoy?`, sender: 'agent' }
            ]);
        } catch (error) {
            console.error("Error initializing chat:", error);
            setMessages([{ id: 'error', text: 'Error al inicializar el chat. Por favor, verifica la configuración de la API Key y refresca la página.', sender: 'agent' }]);
        }
    }
    initializeChat();

  }, [activeAgent]);

  const handleSendMessage = async () => {
    if (!input.trim() || !chat || isLoading) return;

    const userMessage: Message = { id: Date.now(), text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    generationController.current = new AbortController();
    const agentMessageId = Date.now() + 1;
    setMessages(prev => [...prev, { id: agentMessageId, text: '', sender: 'agent' }]);

    try {
      const stream = await chat.sendMessageStream({ message: userMessage.text });
      let fullText = "";

      for await (const chunk of stream) {
        if (generationController.current.signal.aborted) {
          break;
        }
        fullText += chunk.text;
        setMessages(prev => prev.map(msg => msg.id === agentMessageId ? { ...msg, text: fullText } : msg));
      }
      speak(fullText);
    } catch (error) {
       console.error("Error sending message:", error);
       let errorMessage = "Ocurrió un error inesperado. Por favor, inténtalo de nuevo.";
       if (error instanceof Error) {
         if (error.name === 'AbortError') {
           errorMessage = "Generación detenida.";
         } else {
           errorMessage = `Se produjo un error al comunicarse con la IA.\n\n*Detalles:* ${error.message}`;
         }
       } else {
          errorMessage = `Se produjo un error inesperado.\n\n*Detalles:* ${String(error)}`;
       }
       setMessages(prev => prev.map(msg => msg.id === agentMessageId ? { ...msg, text: errorMessage } : msg));
    } finally {
      setIsLoading(false);
      generationController.current = null;
    }
  };

  const stopGeneration = () => {
    if (generationController.current) {
      generationController.current.abort();
    }
  };

  const speak = (text: string) => {
    const cleanedText = text.replace(/\*/g, '');
    if (!cleanedText) return;

    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(cleanedText);
    utterance.lang = 'es-ES';
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    speechSynthesis.speak(utterance);
  };

  const handleStopSpeaking = () => {
    speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognitionAPI) {
        const recognition = new SpeechRecognitionAPI();
        recognition.lang = 'es-ES';
        recognition.interimResults = true;
        recognition.continuous = false;
        recognitionRef.current = recognition;

        recognition.onresult = (event) => {
          const transcript = Array.from(event.results)
            .map(result => result[0])
            .map(result => result.transcript)
            .join('');
          setInput(transcript);
        };
        
        recognition.onend = () => {
            setIsListening(false);
        };

        recognition.onstart = () => {
            setIsListening(true);
        };
        
        recognition.start();
      }
    }
  };

  const handleNavigate = (view: View, agentId?: string) => {
    setActiveView(view);
    if (agentId) {
        const agentToSelect = AGENTS.find(a => a.id === agentId);
        if (agentToSelect) {
            setActiveAgent(agentToSelect);
        }
    }
  };
  
  // FIX: Removed handleKeySubmit function.

  const renderContent = () => {
    switch (activeView) {
      case 'nexus_zero_course':
        return <NexusZeroPage onNavigateToPrograms={() => handleNavigate('programs')} />;
      case 'programs':
        return <ProgramsPage onOpenPremium={() => setIsPremiumModalOpen(true)} />;
      case 'challenges':
        return <LatinoChallengesPage />;
      case 'cognitive_gym':
        return <CognitiveGymPage />;
      case 'critical_thinking_course':
        return <CriticalThinkingCoursePage />;
      case 'creativity_course':
        return <CreativityCoursePage />;
      case 'entrepreneurship_course':
        return <EntrepreneurshipCoursePage />;
      case 'gen_ai_course':
        return <GenerativeAiCoursePage />;
      case 'chat':
      default:
        return (
           <ChatWindow 
                messages={messages}
                activeAgent={activeAgent}
                onSendMessage={handleSendMessage}
                isLoading={isLoading}
                onStopGeneration={stopGeneration}
                input={input}
                setInput={setInput}
                isListening={isListening}
                onToggleListening={toggleListening}
                isSpeaking={isSpeaking}
                onStopSpeaking={handleStopSpeaking}
            />
        );
    }
  }


  if (!isLoggedIn) {
    return <LoginScreen onLogin={() => setIsLoggedIn(true)} />;
  }
  
  // FIX: Removed loading state and API key prompt rendering logic.
  // The app now proceeds directly to rendering content, assuming the API key is valid.
  
  const isCourseView = ['nexus_zero_course', 'critical_thinking_course', 'creativity_course', 'entrepreneurship_course', 'gen_ai_course'].includes(activeView);

  return (
    <main className="w-screen h-screen bg-gray-900 text-white p-4 font-sans flex flex-col gap-4 overflow-hidden">
       {isPremiumModalOpen && <PremiumModal onClose={() => setIsPremiumModalOpen(false)} />}
       {isChatModalOpen && (
          <ChatModal 
            onClose={() => setIsChatModalOpen(false)}
            messages={messages}
            activeAgent={activeAgent}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            onStopGeneration={stopGeneration}
            input={input}
            setInput={setInput}
            isListening={isListening}
            onToggleListening={toggleListening}
            isSpeaking={isSpeaking}
            onStopSpeaking={handleStopSpeaking}
          />
        )}
       <div className="flex flex-1 gap-4 overflow-hidden">
          <div className="w-1/4 flex flex-col gap-4 overflow-y-auto">
            <UserRankPanel 
                rank="Aprendiz Consciente" 
                onNavigate={handleNavigate} 
                activeView={activeView}
                onOpenPremium={() => setIsPremiumModalOpen(true)}
            />
            <AgentPanel agents={AGENTS} activeAgent={activeAgent} onSelectAgent={setActiveAgent} />
          </div>

          <div className="flex-1 relative">
            {renderContent()}
            {isCourseView && (
              <FloatingChatButton 
                agent={activeAgent} 
                onClick={() => setIsChatModalOpen(true)} 
              />
            )}
          </div>
      </div>
    </main>
  );
};

export default App;