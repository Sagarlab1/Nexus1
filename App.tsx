import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleGenAI } from '@google/genai';
import type { Message, Agent, Challenge, Rank } from './types';
import { AGENTS, INITIAL_CHALLENGES, USER_RANKS } from './constants';
import { useSound } from './hooks/useSound';

// Components
import AgentPanel from './components/AgentPanel';
import ChatWindow from './components/ChatWindow';
import UserRankPanel from './components/UserRankPanel';
import SkillTree from './components/SkillTree';
import IntroScreen from './components/IntroScreen';
import LoginScreen from './components/LoginScreen';
import ChallengesPage from './components/ChallengesPage';
import PremiumModal from './components/PremiumModal';
import WeeklyCodex from './components/WeeklyCodex';
import OdysseyGenerator from './components/OdysseyGenerator';
import LibraryModal from './components/LibraryModal';
import ProgramsPage from './components/ProgramsPage';
import LatinoChallengesPage from './components/LatinoChallengesPage';


// Icons
import TargetIcon from './components/icons/TargetIcon';
import StarIcon from './components/icons/StarIcon';
import LibraryIcon from './components/icons/LibraryIcon';

// Add type declarations for the Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showIntro, setShowIntro] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 'initial', text: 'Bienvenido a Nexus Sapiens. Soy Nexus Prime, tu asistente IA. ¿Cómo puedo ayudarte a evolucionar hoy?', sender: 'agent' }
  ]);
  const [activeAgent, setActiveAgent] = useState<Agent>(AGENTS[0]);
  const [activePersonalityId, setActivePersonalityId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [userXp, setUserXp] = useState(0);
  const [currentRank, setCurrentRank] = useState<Rank>(USER_RANKS[0]);
  const [challenges, setChallenges] = useState<Challenge[]>(INITIAL_CHALLENGES);
  const [activeView, setActiveView] = useState<'chat' | 'challenges' | 'programs' | 'latino-challenges'>('chat');
  const [isPremium, setIsPremium] = useState(false);
  const [isOdyssey, setIsOdyssey] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [showLibraryModal, setShowLibraryModal] = useState(false);
  const [unlockedSkills, setUnlockedSkills] = useState<string[]>([]);
  const [triggerUnlockAnimationId, setTriggerUnlockAnimationId] = useState<string | null>(null);

  // Voice State
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognitionRef = useRef<any>(null);

  const abortControllerRef = useRef<AbortController | null>(null);
  const playSound = useSound();

  useEffect(() => {
    const newRank = USER_RANKS.slice().reverse().find(rank => userXp >= rank.minXp) || USER_RANKS[0];
    if (newRank.name !== currentRank.name) {
      setCurrentRank(newRank);
      playSound('rankUp');
    }
  }, [userXp, currentRank.name, playSound]);

  useEffect(() => {
    if (isLoggedIn) {
      setShowIntro(true);
      const timer = setTimeout(() => setShowIntro(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isLoggedIn]);
  
  const speak = useCallback((text: string) => {
    // Clean text before speaking
    const cleanedText = text.replace(/\*/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanedText);
    utterance.lang = 'es-ES';
    utterance.rate = 1.1;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    speechSynthesis.speak(utterance);
  }, []);

  const handleStopSpeaking = () => {
    speechSynthesis.cancel();
    setIsSpeaking(false);
  };
  
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'es-ES';

      recognitionRef.current.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        setInput(input + finalTranscript + interimTranscript);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };
      
      recognitionRef.current.onend = () => {
         setIsListening(false);
      }
    }
  }, [input]);

  const handleToggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };


  const handleLogin = () => {
    setIsLoggedIn(true);
  };
  
  const handleSendMessage = useCallback(async (messageText: string) => {
    if(!messageText.trim()) return;

    playSound('send');
    setInput('');
    const newUserMessage: Message = {
      id: Date.now(),
      text: messageText,
      sender: 'user',
    };
    
    setMessages(prevMessages => [...prevMessages, newUserMessage]);
    setIsLoading(true);

    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    const agentResponseId = Date.now() + 1;
    let agentResponseText = '';

    setMessages(prev => [
      ...prev,
      { id: agentResponseId, text: '', sender: 'agent' },
    ]);
    
    const history = messages
      .filter(m => m.id !== 'initial')
      .map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      }));

    try {
      const activePersonality = activeAgent.personalities.find(p => p.id === activePersonalityId);
      const systemInstruction = {
          role: "model",
          parts: [{ text: activePersonality?.prompt || `Act as ${activeAgent.name}: ${activeAgent.description}` }]
      };

      const stream = await ai.models.generateContentStream({
        model: 'gemini-2.5-flash',
        contents: [...history, { role: "user", parts: [{ text: messageText }] }],
        config: {
          systemInstruction: systemInstruction.parts[0].text,
        },
      });

      for await (const chunk of stream) {
        if (signal.aborted) {
          break;
        }
        agentResponseText += chunk.text;
        setMessages(prev =>
          prev.map(msg =>
            msg.id === agentResponseId
              ? { ...msg, text: agentResponseText }
              : msg
          )
        );
      }
      speak(agentResponseText);

    } catch (error) {
      console.error("Error generating content:", error);
      const errorText = 'Lo siento, ha ocurrido un error. Por favor, inténtalo de nuevo.';
      setMessages(prev =>
        prev.map(msg =>
          msg.id === agentResponseId
            ? { ...msg, text: errorText }
            : msg
        )
      );
      speak(errorText);
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  }, [activeAgent, activePersonalityId, messages, playSound, speak]);

  const handleStopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsLoading(false);
    }
  };
  
  const resetChat = (agent: Agent) => {
     setMessages([
        { id: 'initial', text: `Ahora estás hablando con ${agent.name}. ¿Cómo puedo ayudarte a evolucionar hoy?`, sender: 'agent' }
    ]);
  }

  const handleSelectAgent = (agent: Agent) => {
    if (agent.id === activeAgent.id) return;
    setActiveAgent(agent);
    setActivePersonalityId('');
    resetChat(agent);
  };
  
  const handleSelectPersonality = (personalityId: string) => {
    setActivePersonalityId(prevId => {
        const newId = prevId === personalityId ? '' : personalityId;
        const agent = AGENTS.find(a => a.id === activeAgent.id);
        const personality = agent?.personalities.find(p => p.id === newId);
        const introText = personality 
            ? `Ahora estás hablando con ${personality.name}. ${personality.description}`
            : `Ahora estás hablando con ${activeAgent.name}. ¿Cómo puedo ayudarte a evolucionar hoy?`;
        setMessages([{id: 'initial', text: introText, sender: 'agent'}]);
        return newId;
    });
  };

  const handleCompleteChallenge = useCallback((challengeId: string, xp: number) => {
    const challenge = challenges.find(c => c.id === challengeId);
    if (!challenge || challenge.isCompleted) return;

    playSound('unlock');
    setChallenges(prev =>
      prev.map(c => (c.id === challengeId ? { ...c, isCompleted: true } : c))
    );
    setUserXp(prev => prev + xp);
    setUnlockedSkills(prev => [...prev, challengeId]);
    setTriggerUnlockAnimationId(challengeId);
    setTimeout(() => setTriggerUnlockAnimationId(null), 1000);
  }, [challenges, playSound]);
  
  const handlePremiumClick = () => {
      setActiveView('programs');
  }
  
  const handleLearnMore = () => {
      setShowPremiumModal(false);
      setActiveView('programs');
  }

  const handleUnlockAccelerator = () => {
    setIsPremium(true);
    playSound('premium');
    alert('¡Acelerador Sapiens Desbloqueado! Ahora tienes acceso a la Academia de Genios.');
    setActiveView('chat');
  };
  
  const handleUnlockOdyssey = () => {
    setIsPremium(true);
    setIsOdyssey(true);
    playSound('premium');
    alert('¡Odisea Sapiens Desbloqueada! Ahora tienes acceso a todas las funciones, incluyendo el Generador de Odiseas.');
    setActiveView('chat');
  };


  const renderMainView = () => {
    if (activeView === 'chat') {
        return (
            <div className="grid grid-cols-12 gap-6 h-full">
                <div className="col-span-12">
                    <ChatWindow
                      messages={messages}
                      activeAgent={activeAgent}
                      onSendMessage={() => handleSendMessage(input)}
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
    if (activeView === 'challenges') {
        return <ChallengesPage challenges={challenges} onCompleteChallenge={handleCompleteChallenge} />;
    }
    if (activeView === 'programs') {
        return <ProgramsPage onBack={() => setActiveView('chat')} onUnlockAccelerator={handleUnlockAccelerator} onUnlockOdyssey={handleUnlockOdyssey} />;
    }
    if(activeView === 'latino-challenges'){
        return <LatinoChallengesPage challenges={[]} onCompleteChallenge={()=>{}} />;
    }
    return null;
  };
  
  if (!isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  if (showIntro) {
    return <IntroScreen />;
  }

  return (
    <>
      <SkillTree 
        unlockedSkills={unlockedSkills} 
        activeAgent={activeAgent} 
        triggerUnlockAnimationId={triggerUnlockAnimationId}
      />
      <main className="min-h-screen bg-gray-900 text-white font-sans bg-grid p-3 md:p-6">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-4 lg:col-span-3">
            <div className="space-y-6">
                <UserRankPanel rank={currentRank.icon + " " + currentRank.name} onHomeClick={() => setActiveView('chat')} />
                 <nav className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-lg p-3 space-y-2">
                    <button onClick={() => setActiveView('challenges')} className={`w-full flex items-center p-3 rounded-md transition-colors ${activeView === 'challenges' ? 'bg-cyan-500/20 text-cyan-400' : 'text-gray-300 hover:bg-gray-700/50'}`}>
                       <TargetIcon className="w-5 h-5 mr-3"/> Desafíos
                    </button>
                     <button onClick={handlePremiumClick} className={`w-full flex items-center p-3 rounded-md transition-colors ${activeView === 'programs' ? 'bg-yellow-500/20 text-yellow-400' : 'text-gray-300 hover:bg-gray-700/50'}`}>
                       <StarIcon className="w-5 h-5 mr-3"/> Programas Premium
                    </button>
                    <button onClick={() => setShowLibraryModal(true)} className="w-full flex items-center p-3 rounded-md text-gray-300 hover:bg-gray-700/50 transition-colors">
                       <LibraryIcon className="w-5 h-5 mr-3"/> Librería
                    </button>
                </nav>
                <AgentPanel
                  agents={AGENTS}
                  activeAgent={activeAgent}
                  onSelectAgent={handleSelectAgent}
                  activePersonalityId={activePersonalityId}
                  onSelectPersonality={handleSelectPersonality}
                  isPremium={isPremium}
                />
                 <div className="space-y-6">
                    <WeeklyCodex />
                    {isOdyssey && <OdysseyGenerator />}
                </div>
            </div>
          </div>
          <div className="col-span-12 md:col-span-8 lg:col-span-9">
            {renderMainView()}
          </div>
        </div>
      </main>
      <PremiumModal isOpen={showPremiumModal} onClose={() => setShowPremiumModal(false)} onLearnMore={handleLearnMore} />
      <LibraryModal isOpen={showLibraryModal} onClose={() => setShowLibraryModal(false)} />
       <style>{`
        .bg-grid {
          background-image:
            linear-gradient(to right, rgba(107, 114, 128, 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(107, 114, 128, 0.1) 1px, transparent 1px);
          background-size: 40px 40px;
        }
      `}</style>
    </>
  );
}

export default App;