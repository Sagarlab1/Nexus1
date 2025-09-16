import React from 'react';
import { GoogleGenAI, Chat } from '@google/genai';
import { AGENTS } from './constants';
import type { Agent, Message } from './types';
import LoginScreen from './components/LoginScreen';
import AgentPanel from './components/AgentPanel';
import ChatWindow from './components/ChatWindow';
import ApiKeyPrompt from './components/ApiKeyPrompt';
import UserRankPanel from './components/UserRankPanel';
import ApiStatusOverlay from './components/ApiStatusOverlay';

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
  onstart: () => void;
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
  const [apiStatus, setApiStatus] = React.useState<'checking' | 'ok' | 'error'>('checking');
  const [apiErrorDetails, setApiErrorDetails] = React.useState<string | null>(null);
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

  const initializeAndCheckApi = React.useCallback(async () => {
    if (!API_KEY) return;

    setApiStatus('checking');
    setApiErrorDetails(null);
    let genAI: GoogleGenAI | null = null;

    try {
      genAI = new GoogleGenAI({ apiKey: API_KEY });
      setAi(genAI);
    } catch (e) {
      console.error("Error initializing GoogleGenAI", e);
      setApiStatus('error');
      if (e instanceof Error) {
        setApiErrorDetails(`Error al inicializar la IA: ${e.message}\n\nPor favor, verifica que la clave de API sea correcta.`);
      } else {
        setApiErrorDetails(`Se produjo un error desconocido al inicializar la IA.`);
      }
      return;
    }

    try {
      await genAI.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: 'Hola',
        config: { thinkingConfig: { thinkingBudget: 0 } }
      });
      setApiStatus('ok');
    } catch (e) {
      setApiStatus('error');
      console.error('[API Status Check Failed]', e);
      if (e instanceof Error) {
        setApiErrorDetails(e.message);
      } else {
        setApiErrorDetails(String(e));
      }
    }
  }, []);

  React.useEffect(() => {
    if (isLoggedIn) {
      initializeAndCheckApi();
    }
  }, [isLoggedIn, initializeAndCheckApi]);
  
  React.useEffect(() => {
    if (!ai || apiStatus !== 'ok') return;

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
  }, [ai, activeAgent, apiStatus]);

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
           errorMessage = `Se produjo un error al comunicarse con la IA.\n\n*Detalles:* ${error.message}\n\nPor favor, verifica los siguientes puntos:\n1. La clave de API es válida y está correctamente configurada.\n2. La facturación está habilitada para tu proyecto de Google Cloud.\n3. La API de Gemini está activada en tu proyecto de Google Cloud.`;
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

  if (!API_KEY) {
    return <ApiKeyPrompt />;
  }

  if (!isLoggedIn) {
    return <LoginScreen onLogin={() => setIsLoggedIn(true)} />;
  }
  
  if (apiStatus !== 'ok') {
    return <ApiStatusOverlay status={apiStatus} errorDetails={apiErrorDetails} onRetry={initializeAndCheckApi} />;
  }

  return (
    <main className="w-screen h-screen bg-gray-900 text-white p-4 font-sans flex gap-4 overflow-hidden">
      <div className="w-1/4 flex flex-col gap-4">
        <UserRankPanel rank="Aprendiz Consciente" onHomeClick={() => {}} />
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
    </main>
  );
};

export default App;