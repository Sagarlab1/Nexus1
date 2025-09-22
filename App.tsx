import React, { useState, useEffect } from 'react';
import { AGENTS } from './constants';
import type { Agent, Message } from './types';
import { initializeAi, generateResponse, clearApiKey, setAndInitializeAi } from './services/ai';
import { useSound } from './hooks/useSound';

// Component Imports
import UserRankPanel from './components/UserRankPanel';
import LoginScreen from './components/LoginScreen';
import PremiumModal from './components/PremiumModal';
import ChatModal from './components/ChatModal';
import FloatingChatButton from './components/FloatingChatButton';
import NexusLogo from './components/icons/NexusLogo';
import ApiKeyPrompt from './components/ApiKeyPrompt';
import ConfigurationErrorScreen from './components/ConfigurationErrorScreen';

// Page/View Imports
import NexusZeroPage from './components/NexusZeroPage';
import ProgramsPage from './components/ProgramsPage';
import LatinoChallengesPage from './components/LatinoChallengesPage';
import CognitiveGymPage from './components/CognitiveGymPage';

export type View = 'chat' | 'nexus_zero_course' | 'programs' | 'challenges' | 'cognitive_gym';
type AppStatus = 'initializing' | 'ready' | 'needs_key' | 'error';

const App: React.FC = () => {
  const [appStatus, setAppStatus] = useState<AppStatus>('initializing');
  const [configError, setConfigError] = useState<Error | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [messagesByAgent, setMessagesByAgent] = useState<Record<string, Message[]>>({});
  const [activeAgent, setActiveAgent] = useState<Agent>(AGENTS[2]); // Default to Nexus
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeView, setActiveView] = useState<View>('nexus_zero_course');
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const playSound = useSound();
  
  useEffect(() => {
    const init = async () => {
        try {
            const isReady = await initializeAi();
            setAppStatus(isReady ? 'ready' : 'needs_key');
        } catch (e: any) {
            console.error("Unexpected Initialization error:", e);
            setConfigError(e);
            setAppStatus('error');
        }
    };
    init();
  }, []);

  const handleSetKey = async (apiKey: string) => {
    try {
      await setAndInitializeAi(apiKey);
      setAppStatus('ready');
    } catch (error: any) {
      console.error("Failed to set API Key:", error);
      throw error; // Re-throw to be caught by the ApiKeyPrompt component
    }
  };

  const handleResetKey = () => {
    clearApiKey();
    window.location.reload();
  };


  const messages = messagesByAgent[activeAgent.id] || [];
  const setMessages = (updater: React.SetStateAction<Message[]>) => {
    const newMessages = typeof updater === 'function' ? updater(messages) : updater;
    setMessagesByAgent(prev => ({ ...prev, [activeAgent.id]: newMessages }));
  };

  useEffect(() => {
    if (appStatus === 'ready' && !messagesByAgent[activeAgent.id]) {
      setMessages([{
        id: 'welcome-' + activeAgent.id,
        text: `Hola, soy ${activeAgent.name}. ¿En qué puedo ayudarte hoy?`,
        sender: 'agent',
      }]);
    }
  }, [activeAgent, appStatus, messagesByAgent]);

  const handleLogin = () => setIsLoggedIn(true);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;
    const messageText = input;
    setInput('');
    const userMessage: Message = { id: Date.now(), text: messageText, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    playSound('send');
    try {
      const responseText = await generateResponse(activeAgent, messageText);
      const agentMessage: Message = { id: Date.now() + 1, text: responseText, sender: 'agent' };
      setMessages(prev => [...prev, agentMessage]);
      playSound('receive');
    } catch (error: any) {
      console.error("Error al generar respuesta:", error);
       if (error.message.includes("configúrala de nuevo")) {
        handleResetKey(); // If key becomes invalid, force re-authentication.
        return;
      }
      const errorMessage: Message = { id: Date.now() + 1, text: `Lo siento, ocurrió un error: ${error.message}`, sender: 'agent' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNavigate = (view: View, agentId?: string) => {
    if (view === 'chat') {
      setIsChatModalOpen(true);
    } else {
      setIsChatModalOpen(false); // Close chat if navigating elsewhere
      setActiveView(view);
    }
    if (agentId) {
      const agent = AGENTS.find(a => a.id === agentId);
      if (agent) setActiveAgent(agent);
    }
  };
  
  const handleStopGeneration = () => setIsLoading(false);
  const handleToggleListening = () => setIsListening(prev => !prev);
  const handleStopSpeaking = () => setIsSpeaking(false);

  const renderActiveView = () => {
    switch (activeView) {
      case 'nexus_zero_course': return <NexusZeroPage onNavigateToPrograms={() => handleNavigate('programs')} />;
      case 'programs': return <ProgramsPage onOpenPremium={() => setIsPremiumModalOpen(true)} />;
      case 'challenges': return <LatinoChallengesPage />;
      case 'cognitive_gym': return <CognitiveGymPage />;
      default: return <NexusZeroPage onNavigateToPrograms={() => handleNavigate('programs')} />;
    }
  };
  
  if (appStatus === 'initializing') {
    return (
        <div className="fixed inset-0 bg-gray-900 z-50 flex flex-col items-center justify-center text-white">
            <NexusLogo className="w-20 h-20 text-cyan-400 animate-spin mb-4" />
            <p className="text-xl text-gray-300">