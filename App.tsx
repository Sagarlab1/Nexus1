import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GoogleGenAI, Chat } from '@google/genai';
import type { Message, Agent, Rank } from './types';
import { AGENTS, RANKS } from './constants';
import ChatWindow from './components/ChatWindow';
import AgentPanel from './components/AgentPanel';
import UserRankPanel from './components/UserRankPanel';
import LoginScreen from './components/LoginScreen';
import ApiKeyPrompt from './components/ApiKeyPrompt';
import ChallengesPage from './components/ChallengesPage';
import PremiumModal from './components/PremiumModal';
import LibraryModal from './components/LibraryModal';
import LatinoChallengesPage from './components/LatinoChallengesPage';
import ProgramsPage from './components/ProgramsPage';
import OdysseyGenerator from './components/OdysseyGenerator';
import VideoGeneratorModal from './components/VideoGeneratorModal';

declare global {
    interface Window {
        SpeechRecognition: any;
        webkitSpeechRecognition: any;
    }
}


const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [view, setView] = useState<'chat' | 'challenges' | 'latino-challenges' | 'programs' | 'odyssey-generator'>('chat');
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeAgent, setActiveAgent] = useState<Agent>(AGENTS[0]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userXp, setUserXp] = useState(0); // Dummy XP state
  const [currentRank, setCurrentRank] = useState<Rank>(RANKS[0]);
  
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  const [isLibraryModalOpen, setIsLibraryModalOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognitionRef = useRef<any>(null);

  const chatRef = useRef<Chat | null>(null);
  const stopGenerationRef = useRef<boolean>(false);
  
  const API_KEY = process.env.API_KEY;

  useEffect(() => {
    const newRank = RANKS.slice().reverse().find(r => userXp >= r.minXp) || RANKS[0];
    setCurrentRank(newRank);
  }, [userXp]);

  const initializeChat = useCallback(() => {
    if (!API_KEY) return;
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const personalityPrompt = activeAgent.personalities.find(p => p.id === 'default')?.prompt || 'You are a helpful assistant.';
    chatRef.current = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: personalityPrompt,
      }
    });
  }, [activeAgent, API_KEY]);

  useEffect(() => {
    initializeChat();
    setMessages([]); // Reset messages when agent changes
  }, [activeAgent, initializeChat]);

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Cancel any previous speech
      const utterance = new SpeechSynthesisUtterance(text.replace(/\*/g, ''));
      utterance.lang = 'es-ES';
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSendMessage = useCallback(async () => {
    if (!input.trim() || !chatRef.current) return;

    const userMessage: Message = { id: Date.now(), text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    stopGenerationRef.current = false;

    const agentMessageId = Date.now() + 1;
    setMessages(prev => [...prev, { id: agentMessageId, text: '', sender: 'agent' }]);
    
    let fullResponseText = '';

    try {
      const stream = await chatRef.current.sendMessageStream({ message: input });

      for await (const chunk of stream) {
        if (stopGenerationRef.current) break;
        const chunkText = chunk.text;
        fullResponseText += chunkText;
        setMessages(prev =>
          prev.map(msg =>
            msg.id === agentMessageId ? { ...msg, text: fullResponseText } : msg
          )
        );
      }
      if (!stopGenerationRef.current) {
        speak(fullResponseText);
      }

    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = 'Lo siento, he encontrado un error.';
      setMessages(prev =>
        prev.map(msg =>
          msg.id === agentMessageId ? { ...msg, text: errorMessage } : msg
        )
      );
      speak(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [input]);
  
  const handleStopGeneration = () => {
    stopGenerationRef.current = true;
    setIsLoading(false);
  };

  const handleToggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = 'es-ES';
        
        recognitionRef.current.onstart = () => setIsListening(true);
        recognitionRef.current.onend = () => setIsListening(false);
        recognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
        };
        recognitionRef.current.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInput(transcript);
        };
        recognitionRef.current.start();
      } else {
        alert('Speech recognition is not supported in your browser.');
      }
    }
  };

  const handleStopSpeaking = () => {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
  };


  if (!API_KEY) {
    return <ApiKeyPrompt />;
  }

  if (!isLoggedIn) {
    return <LoginScreen onLogin={() => setIsLoggedIn(true)} />;
  }
  
  const renderView = () => {
      switch(view) {
          case 'chat':
              return (
                 <ChatWindow
                    messages={messages}
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
              );
          case 'challenges':
              return <ChallengesPage onBack={() => setView('chat')} currentRank={currentRank} />;
          case 'latino-challenges':
              return <LatinoChallengesPage onBack={() => setView('chat')} />;
          case 'programs':
              return <ProgramsPage onUnlockAccelerator={() => setView('challenges')} onUnlockOdyssey={() => setView('odyssey-generator')} />;
          case 'odyssey-generator':
              return <OdysseyGenerator onBack={() => setView('programs')} />;
      }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen font-sans bg-cover bg-center" style={{ backgroundImage: "url('/background.png')"}}>
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-1 space-y-4">
            <UserRankPanel rank={currentRank.name} onHomeClick={() => setView('chat')} />
            <AgentPanel
              agents={AGENTS}
              activeAgent={activeAgent}
              onSelectAgent={setActiveAgent}
            />
             <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-lg p-6 shadow-lg shadow-black/20">
                <button onClick={() => setIsPremiumModalOpen(true)} className="w-full text-white font-bold py-2 px-4 rounded bg-cyan-600 hover:bg-cyan-500">Programas Premium</button>
                <button onClick={() => setIsLibraryModalOpen(true)} className="w-full text-white font-bold py-2 px-4 rounded mt-2 bg-purple-600 hover:bg-purple-500">Biblioteca</button>
                <button onClick={() => setIsVideoModalOpen(true)} className="w-full text-white font-bold py-2 px-4 rounded mt-2 bg-green-600 hover:bg-green-500">Generador de Video</button>
             </div>
          </div>
          <main className="lg:col-span-2">
            {renderView()}
          </main>
        </div>
      </div>
      {isPremiumModalOpen && <PremiumModal 
        onClose={() => setIsPremiumModalOpen(false)} 
        onUnlockAccelerator={() => { setView('challenges'); setIsPremiumModalOpen(false); }}
        onLearnMore={() => { setView('programs'); setIsPremiumModalOpen(false); }}
        // FIX: Added 'onUnlockOdyssey' prop to handle navigation to the Odyssey generator from the premium modal.
        onUnlockOdyssey={() => { setView('odyssey-generator'); setIsPremiumModalOpen(false); }}
        />}
      {isLibraryModalOpen && <LibraryModal 
        onClose={() => setIsLibraryModalOpen(false)} 
        onSelectLatinoChallenges={() => { setView('latino-challenges'); setIsLibraryModalOpen(false); }}
        />}
       {isVideoModalOpen && <VideoGeneratorModal
        onClose={() => setIsVideoModalOpen(false)}
        />}
    </div>
  );
};

export default App;