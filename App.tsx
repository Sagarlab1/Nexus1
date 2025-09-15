import React from 'react';
import { GoogleGenAI, Chat } from '@google/genai';
import { AGENTS } from './constants';
import type { Agent, Message } from './types';
import LoginScreen from './components/LoginScreen';
import AgentPanel from './components/AgentPanel';
import ChatWindow from './components/ChatWindow';
import ApiKeyPrompt from './components/ApiKeyPrompt';
import UserRankPanel from './components/UserRankPanel';

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
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: Event) => void;
  onend: () => void;
}

declare global {
  interface Window {
    SpeechRecognition: { new (): SpeechRecognition };
    webkitSpeechRecognition: { new (): SpeechRecognition };
  }
}
// --- End of Type definitions ---

const API_KEY = process.env.API_KEY;

const App: React.FC = () => {
  const [ai, setAi] = React.useState<GoogleGenAI | null>(null);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [activeAgent, setActiveAgent] = React.useState<Agent>(AGENTS[0]);
  const [chat, setChat] = React.useState<Chat | null>(null);
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [input, setInput] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const generationController = React.useRef<AbortController | null>(null);

  // Voice state
  const [isListening, setIsListening] = React.useState(false);
  const [isSpeaking, setIsSpeaking] = React.useState(false);
  const recognitionRef = React.useRef<SpeechRecognition | null>(null);

  React.useEffect(() => {
    if (API_KEY) {
      try {
        const genAI = new GoogleGenAI({ apiKey: API_KEY });
        setAi(genAI);
      } catch (e) {
        console.error("Error initializing GoogleGenAI", e);
      }
    }
  }, []);
  
  React.useEffect(() => {
    if (!ai) return;

    // Clear previous chat history and state when agent changes
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
    // Add a placeholder for the agent's response
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
       if (error instanceof Error && error.name === 'AbortError') {
         console.log("Generation aborted");
         setMessages(prev => prev.map(msg => msg.id === agentMessageId ? { ...msg, text: "Generación detenida." } : msg));
       } else {
        console.error("Error sending message:", error);
        const errorText = "Lo siento, ocurrió un error al procesar tu solicitud. Verifica la configuración de la API Key.";
        setMessages(prev => prev.map(msg => msg.id === agentMessageId ? { ...msg, text: errorText } : msg));
       }
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
      setIsListening(false);
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
          if (event.results[0].isFinal) {
             recognition.stop();
          }
        };
        
        recognition.onend = () => {
            setIsListening(false);
        };
        
        recognition.start();
        setIsListening(true);
      }
    }
  };

  if (!API_KEY) {
    return <ApiKeyPrompt />;
  }

  if (!isLoggedIn) {
    return <LoginScreen onLogin={() => setIsLoggedIn(true)} />;
  }
  
  return (
    <main className="w-screen h-screen bg-gray-900 text-white p-4 font-sans flex gap-4 overflow-hidden">
      <div className="w-1/4 flex flex-col gap-4">
        <UserRankPanel rank="Aprendiz Consciente" onHomeClick={() => {}} />
        <AgentPanel agents={AGENTS} activeAgent={activeAgent} onSelectAgent={setActiveAgent} />
      </div>

      <div className="w-1/2 flex-shrink-0">
         {ai ? (
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
         ) : (
            <div className="flex items-center justify-center h-full">
                <p>Initializing AI...</p>
            </div>
         )}
      </div>
      
      <div className="w-1/4 bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-lg p-6 shadow-lg shadow-black/20">
        <h3 className="text-lg font-bold mb-4">Panel de Herramientas</h3>
        <p className="text-gray-400 text-sm">Próximamente: Funcionalidades avanzadas y programas de estudio.</p>
      </div>
    </main>
  );
};

export default App;