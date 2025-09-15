import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GoogleGenAI, Chat, GenerateContentResponse } from '@google/genai';
import ChatWindow from './components/ChatWindow';
import AgentPanel from './components/AgentPanel';
import UserRankPanel from './components/UserRankPanel';
import IntroScreen from './components/IntroScreen';
import LoginScreen from './components/LoginScreen';
import SkillTree from './components/SkillTree';
import ChallengesPage from './components/ChallengesPage';
import OdysseyGenerator from './components/OdysseyGenerator';
import AcceleratorPage from './components/AcceleratorPage';
import ProgramsPage from './components/ProgramsPage';
import LatinoChallengesPage from './components/LatinoChallengesPage';
import VideoGeneratorModal from './components/VideoGeneratorModal';
import PremiumModal from './components/PremiumModal';
import WeeklyCodex from './components/WeeklyCodex';
import MainDashboard from './components/MainDashboard'; // Assuming this component exists or will be created. Let's create it inline.

import { AGENTS, RANKS, INITIAL_CHALLENGES, INITIAL_ODYSSEYS, INITIAL_WEEK_PLAN } from './constants';
import type { Message, Agent, Challenge, Odyssey, Rank, WeekPlan } from './types';
import { useSound } from './hooks/useSound';

// Per guidelines, API_KEY is in process.env. Assume it's available.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

// Inline MainDashboard to avoid creating new files
const InlineMainDashboard: React.FC<{
  onNavigate: (view: string) => void,
  onOpenOdysseyGenerator: () => void,
}> = ({ onNavigate, onOpenOdysseyGenerator }) => (
    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-lg shadow-lg shadow-black/20 flex flex-col h-[calc(100vh-4rem)] p-6">
      <h2 className="text-2xl font-bold text-white mb-2">Panel Principal</h2>
      <p className="text-gray-400 mb-6">Selecciona una herramienta para continuar tu evolución.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
        <button onClick={() => onNavigate('chat')} className="bg-gray-800/60 p-6 rounded-lg border border-gray-700 hover:border-cyan-500 hover:bg-gray-800 transition-all text-left group">
          <h3 className="text-lg font-bold text-white">Chat con Agentes</h3>
          <p className="text-gray-400">Comunícate con tus especialistas de IA.</p>
        </button>
        <button onClick={() => onNavigate('challenges')} className="bg-gray-800/60 p-6 rounded-lg border border-gray-700 hover:border-cyan-500 hover:bg-gray-800 transition-all text-left group">
          <h3 className="text-lg font-bold text-white">Desafíos</h3>
          <p className="text-gray-400">Gana XP y desbloquea nuevas habilidades.</p>
        </button>
        <button onClick={onOpenOdysseyGenerator} className="bg-gray-800/60 p-6 rounded-lg border border-gray-700 hover:border-yellow-500 hover:bg-gray-800 transition-all text-left group">
          <h3 className="text-lg font-bold text-white">Generador de Odiseas</h3>
          <p className="text-gray-400">Crea planes de aprendizaje personalizados.</p>
        </button>
         <button onClick={() => onNavigate('accelerator')} className="bg-gray-800/60 p-6 rounded-lg border border-gray-700 hover:border-yellow-500 hover:bg-gray-800 transition-all text-left group">
          <h3 className="text-lg font-bold text-white">Acelerador de Contenido</h3>
          <p className="text-gray-400">Herramientas para crear contenido con IA.</p>
        </button>
      </div>
    </div>
);


function App() {
  const [appState, setAppState] = useState('intro'); // 'intro', 'login', 'app'
  const [view, setView] = useState('dashboard'); // 'dashboard', 'chat', 'challenges', 'odyssey-generator', 'accelerator', 'programs', 'latino'

  const [xp, setXp] = useState(0);
  const [rank, setRank] = useState<Rank>(RANKS[0]);
  const [unlockedSkills, setUnlockedSkills] = useState<string[]>([]);
  const [triggerUnlockAnimationId, setTriggerUnlockAnimationId] = useState<string|null>(null);

  const [challenges, setChallenges] = useState<Challenge[]>(INITIAL_CHALLENGES);
  const [odysseys, setOdysseys] = useState<Odyssey[]>(INITIAL_ODYSSEYS);
  
  const [activeAgent, setActiveAgent] = useState<Agent>(AGENTS[0]);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  const [isVideoGenOpen, setIsVideoGenOpen] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false); // Placeholder state
  const [isListening, setIsListening] = useState(false); // Placeholder state

  const chatInstances = useRef<Record<string, Chat>>({});
  const stopGenerationRef = useRef(false);
  const playSound = useSound();

  useEffect(() => {
    const timer = setTimeout(() => setAppState('login'), 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const currentRank = RANKS.slice().reverse().find(r => xp >= r.minXp);
    if (currentRank && currentRank.name !== rank.name) {
      setRank(currentRank);
      playSound('rankUp');
    }
  }, [xp, rank, playSound]);

  const getOrCreateChat = (agent: Agent) => {
    if (!chatInstances.current[agent.id]) {
        // Fix: Use correct model name 'gemini-2.5-flash'
        chatInstances.current[agent.id] = ai.chats.create({
            model: 'gemini-2.5-flash', 
            config: {
                systemInstruction: agent.personalities[0].prompt,
            },
        });
    }
    return chatInstances.current[agent.id];
  };

  const handleSendMessage = useCallback(async () => {
    if (!input.trim()) return;
    
    const currentInput = input;
    const agentId = activeAgent.id;
    const userMessage: Message = { id: Date.now(), text: currentInput, sender: 'user' };
    
    setMessages(prev => ({ ...prev, [agentId]: [...(prev[agentId] || []), userMessage] }));
    setInput('');
    setIsLoading(true);
    stopGenerationRef.current = false;
    playSound('send');
    
    const agentMessageId = Date.now() + 1;
    const agentMessage: Message = { id: agentMessageId, text: '', sender: 'agent' };
    setMessages(prev => ({ ...prev, [agentId]: [...(prev[agentId] || []), agentMessage] }));

    try {
        const chat = getOrCreateChat(activeAgent);
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
        const errorMessage = "Sorry, I encountered an error. Please try again.";
         setMessages(prev => ({
            ...prev,
            [agentId]: prev[agentId].map(m => m.id === agentMessageId ? { ...m, text: errorMessage } : m)
        }));
    } finally {
        setIsLoading(false);
    }
  }, [input, activeAgent, playSound]);

  const handleStopGeneration = () => {
    stopGenerationRef.current = true;
    setIsLoading(false);
  };
  
  const handleSelectAgent = (agent: Agent) => {
    setActiveAgent(agent);
    setView('chat');
  };
  
  const handleCompleteChallenge = (challengeId: string) => {
    const newChallenges = challenges.map(c => {
        if (c.id === challengeId && !c.isCompleted) {
            setXp(prev => prev + c.xp);
            setUnlockedSkills(prev => [...prev, c.title]);
            setTriggerUnlockAnimationId(c.id);
            setTimeout(() => setTriggerUnlockAnimationId(null), 2000);
            playSound('unlock');
            return { ...c, isCompleted: true };
        }
        return c;
    });
    setChallenges(newChallenges);
  };

  if (appState === 'intro') return <IntroScreen />;
  if (appState === 'login') return <LoginScreen onLogin={() => setAppState('app')} />;

  const renderContent = () => {
    switch(view) {
        case 'chat':
            return <ChatWindow
              messages={messages[activeAgent.id] || []}
              activeAgent={activeAgent}
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
              onStopGeneration={handleStopGeneration}
              input={input}
              setInput={setInput}
              isListening={isListening}
              onToggleListening={() => setIsListening(!isListening)}
              isSpeaking={isSpeaking}
              onStopSpeaking={() => setIsSpeaking(false)}
            />;
        case 'dashboard':
            return <InlineMainDashboard onNavigate={setView} onOpenOdysseyGenerator={() => { setIsPremiumModalOpen(true); }} />;
        case 'challenges':
            return <ChallengesPage challenges={challenges} onCompleteChallenge={handleCompleteChallenge} onBack={() => setView('dashboard')} />;
        case 'odyssey-generator':
             return <OdysseyGenerator onBack={() => setView('dashboard')} onOdysseyGenerated={(newOdyssey) => { setOdysseys(prev => [...prev, newOdyssey]); setView('dashboard'); }} />;
        case 'accelerator':
            return <AcceleratorPage onBack={() => setView('dashboard')} onOpenVideoGenerator={() => { setIsVideoGenOpen(true); }}/>;
        case 'programs':
            return <ProgramsPage onBack={() => setView('dashboard')} />;
        case 'latino':
            return <LatinoChallengesPage onBack={() => setView('dashboard')} />;
        default:
            setView('dashboard'); // Fallback to dashboard
            return null;
    }
  };

  return (
    <main className="bg-gray-900 text-white min-h-screen bg-grid-pattern">
      <SkillTree unlockedSkills={unlockedSkills} activeAgent={activeAgent} triggerUnlockAnimationId={triggerUnlockAnimationId}/>
      <div className="container mx-auto p-4 grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-3 space-y-4">
          <UserRankPanel rank={rank.name} onHomeClick={() => setView('dashboard')} />
          <AgentPanel agents={AGENTS} activeAgent={activeAgent} onSelectAgent={handleSelectAgent} />
          <WeeklyCodex weekPlan={INITIAL_WEEK_PLAN} />
        </div>
        <div className="lg:col-span-9">
            {renderContent()}
        </div>
      </div>
      <PremiumModal isOpen={isPremiumModalOpen} onClose={() => setIsPremiumModalOpen(false)} />
      <VideoGeneratorModal isOpen={isVideoGenOpen} onClose={() => setIsVideoGenOpen(false)} />
    </main>
  );
}

const bgPatternStyle = `
  .bg-grid-pattern {
    background-image: linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
    background-size: 2rem 2rem;
  }
`;
const styleSheet = document.createElement("style");
styleSheet.innerText = bgPatternStyle;
document.head.appendChild(styleSheet);


export default App;
