// FIX: Implemented the main App component to resolve module errors and provide core functionality.
import React, { useState, useEffect, useCallback, useRef } from 'react';
// FIX: Use GoogleGenAI from "@google/genai"
import { GoogleGenAI, Chat } from '@google/genai';
import { AGENTS, RANKS } from './constants';
import type { Message, Agent, Odyssey, Rank } from './types';
import { useSound } from './hooks/useSound';
import 'regenerator-runtime/runtime';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

import AgentPanel from './components/AgentPanel';
import ChatWindow from './components/ChatWindow';
import UserRankPanel from './components/UserRankPanel';
import SkillTree from './components/SkillTree';
import LoginScreen from './components/LoginScreen';
import ChallengesPage from './components/ChallengesPage';
import OdysseyGenerator from './components/OdysseyGenerator';
import LatinoChallengesPage from './components/LatinoChallengesPage';
import ProgramsPage from './components/ProgramsPage';

type View = 'login' | 'main' | 'challenges' | 'odyssey_generator' | 'latino_challenges' | 'programs';

const App: React.FC = () => {
  const [view, setView] = useState<View>('login');
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeAgent, setActiveAgent] = useState<Agent>(AGENTS[0]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const [currentXp, setCurrentXp] = useState(120); // Starting XP
  const [currentRank, setCurrentRank] = useState<Rank>(RANKS[0]);

  const [odysseys, setOdysseys] = useState<Odyssey[]>([]);

  const chatRef = useRef<Chat | null>(null);
  const stopGenerationRef = useRef<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const playSound = useSound();

  useEffect(() => {
    const rank = RANKS.slice().reverse().find(r => currentXp >= r.minXp) || RANKS[0];
    setCurrentRank(rank);
  }, [currentXp]);

  const startNewChat = useCallback(() => {
    if (!process.env.API_KEY) {
      console.error("API key not found.");
      const errorMessage: Message = {
        id: Date.now(),
        text: "La clave de API no fue encontrada. Por favor, configura la variable de entorno API_KEY.",
        sender: 'agent',
      };
      setMessages([errorMessage]);
      return;
    }
    // FIX: Initialize GoogleGenAI with a named apiKey object
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const personalityPrompt = activeAgent.personalities[0].prompt;
    
    // FIX: Use ai.chats.create to start a new chat session
    chatRef.current = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: personalityPrompt,
      },
    });

    const welcomeMessage: Message = {
      id: Date.now(),
      text: `Hola, soy ${activeAgent.name}. ${activeAgent.description} ¿En qué puedo ayudarte hoy?`,
      sender: 'agent',
    };
    setMessages([welcomeMessage]);
  }, [activeAgent]);

  useEffect(() => {
    startNewChat();
  }, [activeAgent, startNewChat]);

  const handleSendMessage = async () => {
    if (!input.trim() || !chatRef.current) return;

    const userMessage: Message = { id: Date.now(), text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    stopGenerationRef.current = false;
    playSound('send');
    
    try {
      // FIX: Use chat.sendMessageStream for streaming responses
      const stream = await chatRef.current.sendMessageStream({ message: input });
      let agentResponseText = '';
      let agentMessageId = 0;

      for await (const chunk of stream) {
        if (stopGenerationRef.current) {
            break;
        }
        // FIX: Access chunk.text directly to get the content
        agentResponseText += chunk.text;
        
        if (!agentMessageId) {
            agentMessageId = Date.now() + 1;
            setMessages(prev => [...prev, { id: agentMessageId, text: agentResponseText, sender: 'agent' }]);
        } else {
            setMessages(prev => prev.map(msg => 
                msg.id === agentMessageId ? { ...msg, text: agentResponseText } : msg
            ));
        }
      }

    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: Date.now() + 1,
        text: 'Lo siento, ha ocurrido un error. Por favor, inténtalo de nuevo.',
        sender: 'agent',
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      playSound('receive');
    }
  };

  const onStopGeneration = () => {
    stopGenerationRef.current = true;
    setIsLoading(false);
  };
  
  const onStopSpeaking = () => {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
  }

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

   useEffect(() => {
    setInput(transcript);
  }, [transcript]);

  const handleToggleListening = () => {
    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      resetTranscript();
      SpeechRecognition.startListening({ continuous: true, language: 'es-ES' });
    }
  };

  if (!browserSupportsSpeechRecognition) {
    console.log("Browser doesn't support speech recognition.");
  }
  
  const handleLogin = () => {
    setView('main');
    playSound('login');
  }
  
  const handleOdysseyCreated = (odyssey: Odyssey) => {
    setOdysseys(prev => [...prev, odyssey]);
    setView('main');
  }

  const renderView = () => {
    switch(view) {
      case 'login':
        return <LoginScreen onLogin={handleLogin} />;
      case 'challenges':
        return <ChallengesPage onBack={() => setView('main')} currentRank={currentRank} />;
      case 'odyssey_generator':
        return <OdysseyGenerator onBack={() => setView('main')} onOdysseyCreated={handleOdysseyCreated} />;
      case 'latino_challenges':
        return <LatinoChallengesPage onBack={() => setView('main')} />;
      case 'programs':
        return <ProgramsPage onUnlockAccelerator={() => setView('challenges')} onUnlockOdyssey={() => setView('odyssey_generator')} />;
      case 'main':
      default:
        return (
          <main className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4 h-full">
            <div className="lg:col-span-1 flex flex-col gap-4">
              <UserRankPanel rank={currentRank.name} onHomeClick={() => setView('programs')} />
              <AgentPanel
                agents={AGENTS}
                activeAgent={activeAgent}
                onSelectAgent={setActiveAgent}
              />
              <SkillTree />
            </div>
            <div className="lg:col-span-2">
              <ChatWindow
                messages={messages}
                activeAgent={activeAgent}
                onSendMessage={handleSendMessage}
                isLoading={isLoading}
                onStopGeneration={onStopGeneration}
                input={input}
                setInput={setInput}
                isListening={listening}
                onToggleListening={handleToggleListening}
                isSpeaking={isSpeaking}
                onStopSpeaking={onStopSpeaking}
              />
            </div>
          </main>
        );
    }
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen font-sans bg-cover bg-center" style={{backgroundImage: "url('/background.png')"}}>
      <div className="bg-black/50 backdrop-blur-sm min-h-screen">
          {renderView()}
      </div>
    </div>
  );
};

export default App;
