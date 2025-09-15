import React, { useState, useEffect, useRef } from 'react';
// FIX: Correctly import GoogleGenAI and Chat types
import { GoogleGenAI, Chat } from '@google/genai';
import type { Message, Agent, Rank } from './types';
import { AGENTS, RANKS } from './constants';

// Components
import ChatWindow from './components/ChatWindow';
import AgentPanel from './components/AgentPanel';
import UserRankPanel from './components/UserRankPanel';
import SkillTree from './components/SkillTree';
import IntroScreen from './components/IntroScreen';
import ChallengesPage from './components/ChallengesPage';
import OdysseyGenerator from './components/OdysseyGenerator';
import LatinoChallengesPage from './components/LatinoChallengesPage';
import ProgramsPage from './components/ProgramsPage';
import PremiumModal from './components/PremiumModal';
import LibraryModal from './components/LibraryModal';
import VideoGeneratorModal from './components/VideoGeneratorModal';

// Icons
import RocketIcon from './components/icons/RocketIcon';
import LibraryIcon from './components/icons/LibraryIcon';
import VideoIcon from './components/icons/VideoIcon';


const App: React.FC = () => {
    const [isStarted, setIsStarted] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [activeAgent, setActiveAgent] = useState<Agent>(AGENTS[0]);
    const [isLoading, setIsLoading] = useState(false);
    
    // Premium features and user progress
    const [xp, setXp] = useState(0);
    const [currentRank, setCurrentRank] = useState<Rank>(RANKS[0]);
    const [isAcceleratorUnlocked, setIsAcceleratorUnlocked] = useState(false);
    const [isOdysseyUnlocked, setIsOdysseyUnlocked] = useState(false);

    // View management
    const [currentView, setCurrentView] = useState<'chat' | 'accelerator' | 'odyssey' | 'latino_challenges' | 'programs_info'>('chat');

    // Modal visibility
    const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
    const [isLibraryModalOpen, setIsLibraryModalOpen] = useState(false);
    const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

    // AI State
    const [ai, setAi] = useState<GoogleGenAI | null>(null);
    const [chat, setChat] = useState<Chat | null>(null);
    const generationController = useRef<AbortController | null>(null);

    // Speech synthesis and recognition
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    
    useEffect(() => {
        // FIX: Initialize Gemini API client as per guidelines
        const genAI = new GoogleGenAI({ apiKey: process.env.API_KEY! });
        setAi(genAI);
    }, []);

    useEffect(() => {
        if (!ai) return;
        // FIX: Create a new chat session when the AI client or active agent changes
        const newChat = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: `Eres ${activeAgent.name}, un ${activeAgent.description}. Tu propósito es ayudar al usuario a expandir su intelecto. Adopta un tono sabio, inspirador y servicial.`,
            },
        });
        setChat(newChat);
        setMessages([{ id: 'initial', text: `Hola, soy ${activeAgent.name}. ¿En qué podemos profundizar hoy?`, sender: 'agent' }]);
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
            // FIX: Use chat.sendMessageStream for a streaming response
            const stream = await chat.sendMessageStream({ message: userMessage.text });
            let fullText = "";

            for await (const chunk of stream) {
                if (generationController.current.signal.aborted) {
                    break;
                }
                // FIX: Access streamed text directly from the 'text' property
                fullText += chunk.text;
                setMessages(prev => prev.map(msg => msg.id === agentMessageId ? { ...msg, text: fullText } : msg));
            }
        } catch (error) {
            console.error("Error sending message:", error);
            setMessages(prev => prev.map(msg => msg.id === agentMessageId ? { ...msg, text: "Lo siento, ocurrió un error al procesar tu solicitud." } : msg));
        } finally {
            setIsLoading(false);
            generationController.current = null;
        }
    };
    
    const stopGeneration = () => {
        if (generationController.current) {
            generationController.current.abort();
        }
        setIsLoading(false);
    };

    const handleSelectAgent = (agent: Agent) => {
        setActiveAgent(agent);
    };
    
    const renderView = () => {
        switch(currentView) {
            case 'accelerator':
                return <ChallengesPage onBack={() => setCurrentView('chat')} currentRank={currentRank} />;
            case 'odyssey':
                return <OdysseyGenerator onBack={() => setCurrentView('chat')} />;
            case 'latino_challenges':
                return <LatinoChallengesPage onBack={() => setCurrentView('chat')} />;
            case 'programs_info':
                return <ProgramsPage onUnlockAccelerator={() => {setIsAcceleratorUnlocked(true); setCurrentView('accelerator')}} onUnlockOdyssey={() => {setIsOdysseyUnlocked(true); setCurrentView('odyssey')}} />;
            default:
                return null;
        }
    };
    
    if (!isStarted) {
        return <IntroScreen onStart={() => setIsStarted(true)} />;
    }
    
    if (currentView !== 'chat') {
        return <div className="w-screen h-screen bg-black">{renderView()}</div>
    }

    return (
        <main className="w-screen h-screen bg-black text-white p-4 font-sans flex gap-4">
            {isPremiumModalOpen && <PremiumModal 
                onClose={() => setIsPremiumModalOpen(false)} 
                onUnlockAccelerator={() => { setIsAcceleratorUnlocked(true); setIsPremiumModalOpen(false); setCurrentView('accelerator'); }}
                onUnlockOdyssey={() => { setIsOdysseyUnlocked(true); setIsPremiumModalOpen(false); setCurrentView('odyssey'); }}
                onLearnMore={() => { setIsPremiumModalOpen(false); setCurrentView('programs_info'); }}
            />}
            {isLibraryModalOpen && <LibraryModal 
                onClose={() => setIsLibraryModalOpen(false)}
                onSelectLatinoChallenges={() => { setIsLibraryModalOpen(false); setCurrentView('latino_challenges'); }}
            />}
            {isVideoModalOpen && <VideoGeneratorModal onClose={() => setIsVideoModalOpen(false)} />}
            
            <div className="w-1/4 flex flex-col gap-4">
                <UserRankPanel rank={currentRank.name} onHomeClick={() => setCurrentView('chat')} />
                <AgentPanel agents={AGENTS} activeAgent={activeAgent} onSelectAgent={handleSelectAgent} />
                <SkillTree />
            </div>

            <div className="w-1/2 flex-shrink-0">
                <ChatWindow 
                    messages={messages}
                    activeAgent={activeAgent}
                    onSendMessage={handleSendMessage}
                    isLoading={isLoading}
                    onStopGeneration={stopGeneration}
                    input={input}
                    setInput={setInput}
                    isListening={isListening}
                    onToggleListening={() => setIsListening(!isListening)}
                    isSpeaking={isSpeaking}
                    onStopSpeaking={() => setIsSpeaking(false)}
                />
            </div>

            <div className="w-1/4 flex flex-col gap-4">
                <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-lg p-6 shadow-lg shadow-black/20 flex-1">
                    <h2 className="text-xl font-bold mb-1 text-white">Herramientas Sapiens</h2>
                    <p className="text-sm text-cyan-400 font-mono mb-4">MÓDULOS DE EXPANSIÓN</p>
                    <div className="space-y-3">
                        <button onClick={() => { if (isAcceleratorUnlocked) setCurrentView('accelerator'); else setIsPremiumModalOpen(true); }} className="w-full flex items-center p-3 rounded-lg bg-gray-800/50 border-transparent hover:bg-gray-700/70 transition-colors">
                            <RocketIcon className="w-7 h-7 mr-4 text-cyan-400"/>
                            <div>
                                <p className="font-semibold text-white">Acelerador Sapiens</p>
                                <p className="text-xs text-gray-400">Programa de 3 meses.</p>
                            </div>
                            {!isAcceleratorUnlocked && <span className="ml-auto text-xs bg-yellow-500 text-black font-bold px-2 py-0.5 rounded-full">LOCK</span>}
                        </button>
                        <button onClick={() => { if (isOdysseyUnlocked) setCurrentView('odyssey'); else setIsPremiumModalOpen(true); }} className="w-full flex items-center p-3 rounded-lg bg-gray-800/50 border-transparent hover:bg-gray-700/70 transition-colors">
                            <RocketIcon className="w-7 h-7 mr-4 text-yellow-400"/>
                            <div>
                                <p className="font-semibold text-white">Forjar Odisea</p>
                                <p className="text-xs text-gray-400">Plan de estudios por IA.</p>
                            </div>
                            {!isOdysseyUnlocked && <span className="ml-auto text-xs bg-yellow-500 text-black font-bold px-2 py-0.5 rounded-full">LOCK</span>}
                        </button>
                        <button onClick={() => setIsLibraryModalOpen(true)} className="w-full flex items-center p-3 rounded-lg bg-gray-800/50 border-transparent hover:bg-gray-700/70 transition-colors">
                            <LibraryIcon className="w-7 h-7 mr-4 text-green-400"/>
                            <div>
                                <p className="font-semibold text-white">Biblioteca</p>
                                <p className="text-xs text-gray-400">Accede a códices y manifiestos.</p>
                            </div>
                        </button>
                         <button onClick={() => setIsVideoModalOpen(true)} className="w-full flex items-center p-3 rounded-lg bg-gray-800/50 border-transparent hover:bg-gray-700/70 transition-colors">
                            <VideoIcon className="w-7 h-7 mr-4 text-purple-400"/>
                            <div>
                                <p className="font-semibold text-white">Generador de Video</p>
                                <p className="text-xs text-gray-400">Crea videos desde texto.</p>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default App;
