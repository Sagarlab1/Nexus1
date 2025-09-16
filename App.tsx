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

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [apiKeyStatus, setApiKeyStatus] = useState<'checking' | 'needed' | 'valid'>('checking');
  const [ai, setAi] = useState<GoogleGenAI | null>(null);
  
  const [activeAgent, setActiveAgent] = useState<Agent>(AGENTS[0]);
  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const generationController = React.useRef<AbortController | null>(null);

  // Voice state
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognitionRef = React.useRef<SpeechRecognition | null>(null);

  const verifyAndSetKey = useCallback(async (key: string): Promise<boolean> => {
    if (!key) return false;
    try {
      const genAI = new GoogleGenAI({ apiKey: key });
      // A lightweight, non-streaming call to verify the key works.
      await genAI.models.generateContent({ model: 'gemini-2.5-flash', contents: 'test' });
      setAi(genAI);
      setApiKeyStatus('valid');
      return true;
    } catch (error) {
      console.error("API Key verification failed:", error);
      localStorage.removeItem('gemini_api_key');
      return false;
    }
  }, []);

  useEffect(() => {
    const initializeAI = async () => {
      const storedKey = localStorage.getItem('gemini_api_key');
      // We still check for env key as a fallback for correct Vercel setups
      const envKey = process.env.API_KEY;
      const keyToTry = storedKey || envKey;

      if (keyToTry) {
        const isValid = await verifyAndSetKey(keyToTry);
        if (!isValid) {
          setApiKeyStatus('needed');
        }
      } else {
        setApiKeyStatus('needed');
      }
    };
    initializeAI();
  }, [verifyAndSetKey]);
  
  const handleKeySubmit = async (key: string) => {
    const isValid = await verifyAndSetKey(key);
    if (isValid) {
      localStorage.setItem('gemini_api_key', key);
    } else {
      throw new Error("La clave de API es inválida o no se pudo verificar. Comprueba la clave y tu conexión.");
    }
  };

  const handleForgetApiKey = () => {
      localStorage.removeItem('gemini_api_key');
      setAi(null);
      setApiKeyStatus('needed');
  };
  
  useEffect(() => {
    if (!ai) return;

    setMessages([]);
    setIsLoading(false);
    
    const newChat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: `Eres ${activeAgent.name}, un ${activeAgent.description}. Tu propósito es ayudar al usuario a expandir su intelecto. Adopta un tono sabio, inspirador y servicial.`
      },
    });
    setChat(newChat);
    setMessages([
        { id: 'initial', text: `Hola, soy ${activeAgent.name}. ¿En qué podemos profundizar hoy?`, sender: 'agent' }
    ]);
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

  if (!isLoggedIn) {
    return <LoginScreen onLogin={() => setIsLoggedIn(true)} />;
  }
  
  if (apiKeyStatus === 'checking') {
     return (
        <div className="fixed inset-0 bg-gray-900 z-50 flex items-center justify-center text-center p-4">
            <div className="flex flex-col items-center gap-4 text-gray-300">
                <NexusLogo className="w-16 h-16 text-cyan-400 animate-spin" />
                <p className="text-xl">Verificando configuración...</p>
            </div>
        </div>
     );
  }

  if (apiKeyStatus === 'needed' || !ai) {
    return <ApiKeyPrompt onKeySubmit={handleKeySubmit} />;
  }

  return (
    <main className="w-screen h-screen bg-gray-900 text-white p-4 font-sans flex flex-col gap-4 overflow-hidden">
       <div className="flex flex-1 gap-4 overflow-hidden">
          <div className="w-1/4 flex flex-col gap-4">
            <UserRankPanel rank="Aprendiz Consciente" onHomeClick={() => {}} onForgetApiKey={handleForgetApiKey} />
            <AgentPanel agents={AGENTS} activeAgent={activeAgent} onSelectAgent={setActiveAgent} />
          </div>

          <div className="flex-1">
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
          </div>
      </div>
    </main>
  );
};

export default App;
