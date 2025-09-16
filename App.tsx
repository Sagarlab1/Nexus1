import React, { useState, useEffect, useCallback } from 'react';
import { GoogleGenAI, Chat } from '@google/genai';
import { AGENTS } from './constants';
import type { Agent, Message } from './types';
import LoginScreen from './components/LoginScreen';
import AgentPanel from './components/AgentPanel';
import ChatWindow from './components/ChatWindow';
import ApiKeyPrompt from './components/ApiKeyPrompt';
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

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [isCheckingKey, setIsCheckingKey] = useState(true);
  const [apiKeyError, setApiKeyError] = useState<string | null>(null);
  const [ai, setAi] = useState<GoogleGenAI | null>(null);
  
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
  
  const handleInvalidKey = (error: unknown) => {
    console.error("Error de inicialización de IA:", error);
    let message = "La inicialización de la IA falló. Verifica tu clave y la configuración de tu proyecto en Google Cloud.";
    if (error instanceof Error) {
        message = `Error: ${error.message}. Por favor, verifica que tu clave sea correcta y que tu proyecto de Google Cloud esté bien configurado (Facturación y API activada).`;
    }
    setApiKeyError(message);
    if (localStorage.getItem('gemini_api_key')) {
        localStorage.removeItem('gemini_api_key');
    }
    setApiKey(null);
    setAi(null);
  };

  useEffect(() => {
    const keyFromEnv = process.env.API_KEY;
    const keyFromStorage = localStorage.getItem('gemini_api_key');
    const effectiveApiKey = keyFromEnv || keyFromStorage;

    if (effectiveApiKey) {
      try {
        setApiKeyError(null); // Clear previous errors
        const genAI = new GoogleGenAI({ apiKey: effectiveApiKey });
        setAi(genAI);
        setApiKey(effectiveApiKey);
      } catch (error) {
        handleInvalidKey(error);
      }
    }
    setIsCheckingKey(false);
  }, []);
  
  
  useEffect(() => {
    if (!ai) return;

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
            handleInvalidKey(error);
        }
    }
    initializeChat();

  }, [ai, activeAgent]);

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
  
  if (isCheckingKey) {
     return (
        <div className="fixed inset-0 bg-gray-900 z-50 flex items-center justify-center text-center p-4">
            <div className="flex flex-col items-center gap-4 text-gray-300">
                <NexusLogo className="w-16 h-16 text-cyan-400 animate-spin" />
                <p className="text-xl">Inicializando sistema...</p>
            </div>
        </div>
     );
  }

  if (!apiKey || !ai) {
    return <ApiKeyPrompt error={apiKeyError} />;
  }
  
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