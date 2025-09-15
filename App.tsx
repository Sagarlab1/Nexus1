import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GoogleGenAI, Chat } from '@google/genai';
import type { Message, Agent, Challenge, Odyssey, Rank } from './types';
import { AGENTS, RANKS, INITIAL_CHALLENGES, INITIAL_ODYSSEYS, INITIAL_WEEK_PLAN } from './constants';
import { useSound } from './hooks/useSound';
import AgentPanel from './components/AgentPanel';
import ChatWindow from './components/ChatWindow';
import UserRankPanel from './components/UserRankPanel';
import IntroScreen from './components/IntroScreen';
import LoginScreen from './components/LoginScreen';
import ApiKeyPrompt from './components/ApiKeyPrompt';
import SkillTree from './components/SkillTree';
import ChallengesPage from './components/ChallengesPage';
import OdysseyGenerator from './components/OdysseyGenerator';
import WeeklyCodex from './components/WeeklyCodex';
import LibraryModal from './components/LibraryModal';
import PremiumModal from './components/PremiumModal';
import VideoGeneratorModal from './components/VideoGeneratorModal';
import AcceleratorPage from './components/AcceleratorPage';
import LatinoChallengesPage from './components/LatinoChallengesPage';
import ProgramsPage from './components/ProgramsPage';


type View = 'chat' | 'challenges' | 'odyssey' | 'accelerator' | 'programs' | 'latino';

const App: React.FC = () => {
  const [hasApiKey] = useState(!!process.env.API_KEY);
  const [showIntro, setShowIntro] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [ai, setAi] = useState<GoogleGenAI | null>(null);
  const chatRef = useRef<Chat | null>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [activeAgent, setActiveAgent] = useState<Agent>(AGENTS[0]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  const [xp, setXp] = useState(0);
  const [rank, setRank] = useState(RANKS[0].name);
  const [unlockedSkills, setUnlockedSkills] = useState<string[]>([]);
  const [triggerUnlockAnimationId, setTriggerUnlockAnimationId] = useState<string | null>(null);

  const [challenges, setChallenges] = useState<Challenge[]>(INITIAL_CHALLENGES);
  const [odysseys, setOdysseys] = useState<Odyssey[]>(INITIAL_ODYSSEYS);
  
  const [currentView, setCurrentView] = useState<View>('chat');

  const [isLibraryOpen, setLibraryOpen] = useState(false);
  const [isPremiumModalOpen, setPremiumModalOpen] = useState(false);
  const [isVideoGeneratorOpen, setVideoGeneratorOpen] = useState(false);
  
  const playSound = useSound();

  useEffect(() => {
    const timer = setTimeout(() => setShowIntro(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (hasApiKey) {
      // FIX: Correctly initialize GoogleGenAI with a named apiKey parameter as per guidelines.
      const genAI = new GoogleGenAI({ apiKey: process.env.API_KEY });
      setAi(genAI);
    }
  }, [hasApiKey]);

  useEffect(() => {
    if (ai) {
      handleSelectAgent(AGENTS[0]);
    }
  }, [ai]);

  useEffect(() => {
    const currentRank = RANKS.slice().reverse().find(r => xp >= r.minXp);
    if (currentRank && currentRank.name !== rank) {
      setRank(currentRank.name);
      playSound('rankUp');
    }
  }, [xp, rank, playSound]);

  const handleSelectAgent = useCallback((agent: Agent) => {
    if (!ai) return;
    setActiveAgent(agent);
    setMessages([]);
    // FIX: Use the correct method to create a chat session.
    chatRef.current = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: agent.personalities[0].prompt,
      }
    });
    setMessages([{ id: 'greeting', text: `Hola, soy ${agent.name}. ¿En qué puedo ayudarte hoy?`, sender: 'agent' }]);
  }, [ai]);
  
  const handleSendMessage = async () => {
    if (!input.trim() || !chatRef.current) return;

    const userMessage: Message = { id: `user-${Date.now()}`, text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    playSound('send');
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    const agentMessageId = `agent-${Date.now()}`;
    setMessages(prev => [...prev, { id: agentMessageId, text: '', sender: 'agent' }]);

    try {
      // FIX: Use sendMessageStream for streaming responses.
      const stream = await chatRef.current.sendMessageStream({ message: currentInput });
      let text = '';
      for await (const chunk of stream) {
        // FIX: Extract text correctly from streaming chunk.
        text += chunk.text;
        setMessages(prev => prev.map(m => m.id === agentMessageId ? { ...m, text } : m));
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages(prev => prev.map(m => m.id === agentMessageId ? { ...m, text: "Lo siento, ha ocurrido un error." } : m));
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleStopGeneration = () => {
     // Note: The SDK does not currently support aborting a stream.
     // This is a placeholder for future implementation.
    setIsLoading(false);
  };
  
  const handleCompleteChallenge = (challengeId: string) => {
    const newChallenges = challenges.map(c => {
      if (c.id === challengeId && !c.isCompleted) {
        setXp(prev => prev + c.xp);
        playSound('unlock');
        setTriggerUnlockAnimationId(challengeId);
        setTimeout(() => setTriggerUnlockAnimationId(null), 2000);
        return { ...c, isCompleted: true };
      }
      return c;
    });
    setChallenges(newChallenges);
  };

  const renderView = () => {
    switch (currentView) {
      case 'challenges':
        return <ChallengesPage challenges={challenges} onCompleteChallenge={handleCompleteChallenge} onBack={() => setCurrentView('chat')} />;
      case 'odyssey':
        return <OdysseyGenerator odysseys={odysseys} setOdysseys={setOdysseys} onBack={() => setCurrentView('chat')} />;
      case 'accelerator':
          return <AcceleratorPage onBack={() => setCurrentView('chat')} onOpenVideoGenerator={() => setVideoGeneratorOpen(true)} />;
       case 'programs':
          return <ProgramsPage onBack={() => setCurrentView('chat')} />;
       case 'latino':
          return <LatinoChallengesPage onBack={() => setCurrentView('chat')} />;
      case 'chat':
      default:
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
            onToggleListening={() => setIsListening(!isListening)}
            isSpeaking={false} // Placeholder for TTS feature
            onStopSpeaking={() => {}}
          />
        );
    }
  };

  if (!hasApiKey) return <ApiKeyPrompt />;
  if (showIntro) return <IntroScreen />;
  if (!isLoggedIn) return <LoginScreen onLogin={() => setIsLoggedIn(true)} />;

  return (
    <>
      <SkillTree unlockedSkills={unlockedSkills} activeAgent={activeAgent} triggerUnlockAnimationId={triggerUnlockAnimationId} />
      <main className="min-h-screen bg-gray-900 text-white p-4 font-sans bg-grid">
        <div className="container mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <UserRankPanel rank={rank} onHomeClick={() => setCurrentView('chat')} />
            <AgentPanel agents={AGENTS} activeAgent={activeAgent} onSelectAgent={handleSelectAgent} />
            <WeeklyCodex weekPlan={INITIAL_WEEK_PLAN} />
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-lg p-4 shadow-lg shadow-black/20 space-y-2">
                 <button onClick={() => setCurrentView('challenges')} className="w-full text-left p-2 hover:bg-gray-700/70 rounded-lg">Desafíos</button>
                 <button onClick={() => setCurrentView('odyssey')} className="w-full text-left p-2 hover:bg-gray-700/70 rounded-lg">Generador de Odiseas</button>
                 <button onClick={() => setLibraryOpen(true)} className="w-full text-left p-2 hover:bg-gray-700/70 rounded-lg">Biblioteca</button>
                 <button onClick={() => setCurrentView('accelerator')} className="w-full text-left p-2 hover:bg-gray-700/70 rounded-lg">Acelerador de Contenido</button>
                 <button onClick={() => setPremiumModalOpen(true)} className="w-full text-left p-2 hover:bg-gray-700/70 rounded-lg text-yellow-400">Funciones Premium</button>
            </div>
          </div>
          <div className="lg:col-span-9">
            {renderView()}
          </div>
        </div>
      </main>
      <LibraryModal isOpen={isLibraryOpen} onClose={() => setLibraryOpen(false)} />
      <PremiumModal isOpen={isPremiumModalOpen} onClose={() => setPremiumModalOpen(false)} />
      <VideoGeneratorModal isOpen={isVideoGeneratorOpen} onClose={() => setVideoGeneratorOpen(false)} />
      <style>{`.bg-grid { background-image: linear-gradient(rgba(107, 114, 128, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(107, 114, 128, 0.1) 1px, transparent 1px); background-size: 2rem 2rem; }`}</style>
    </>
  );
};

export default App;
