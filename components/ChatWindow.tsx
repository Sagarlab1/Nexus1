import React, { useState, useRef, useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import type { Message, Agent, AgentColor } from '../types.ts';
import UserIcon from './icons/UserIcon.tsx';
import SendIcon from './icons/SendIcon.tsx';
import ClipboardIcon from './icons/ClipboardIcon.tsx';
import CheckIcon from './icons/CheckIcon.tsx';
import SpeakerIcon from './icons/SpeakerIcon.tsx';
import SpeakerOffIcon from './icons/SpeakerOffIcon.tsx';
import MicrophoneIcon from './icons/MicrophoneIcon.tsx';
import StopIcon from './icons/StopIcon.tsx';
import XIcon from './icons/XIcon.tsx';


interface ChatWindowProps {
  messages: Message[];
  activeAgent: Agent;
  onSendMessage: (message: string) => void;
  isSending: boolean;
  onClose?: () => void;
}

const agentColorStyles: Record<AgentColor, { bg: string; text: string; border: string }> = {
  cyan: { bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/30' },
  purple: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/30' },
  yellow: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', border: 'border-yellow-500/30' },
  pink: { bg: 'bg-pink-500/10', text: 'text-pink-400', border: 'border-pink-500/30' },
};

interface ChatBubbleProps {
    message: Message;
    agent: Agent;
    onToggleSpeech: (message: Message) => void;
    isSpeaking: boolean;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message, agent, onToggleSpeech, isSpeaking }) => {
  const [copied, setCopied] = useState(false);
  const agentStyles = agentColorStyles[agent.color];

  const handleCopy = () => {
    navigator.clipboard.writeText(message.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (message.sender === 'user') {
    return (
      <div className="flex justify-end items-start gap-3">
        <div className="bg-blue-600 rounded-lg p-3 max-w-lg">
          <p className="text-white">{message.text}</p>
        </div>
        <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0">
          <UserIcon className="w-5 h-5 text-gray-400" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3">
      <div className={`w-8 h-8 rounded-full ${agentStyles.bg} flex items-center justify-center flex-shrink-0 border ${agentStyles.border}`}>
        <agent.icon className={`w-5 h-5 ${agentStyles.text}`} />
      </div>
      <div className={`bg-gray-800 rounded-lg p-3 max-w-lg group relative`}>
        <p className="text-gray-200 whitespace-pre-wrap">{message.text}</p>
        <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
                onClick={() => onToggleSpeech(message)}
                className="p-1 bg-gray-700 rounded-md text-gray-400 hover:text-white"
                aria-label={isSpeaking ? "Detener lectura" : "Leer en voz alta"}
            >
                {isSpeaking ? <SpeakerOffIcon className="w-4 h-4 text-cyan-400 animate-pulse" /> : <SpeakerIcon className="w-4 h-4" />}
            </button>
            <button
              onClick={handleCopy}
              className="p-1 bg-gray-700 rounded-md text-gray-400 hover:text-white"
              aria-label="Copiar texto"
            >
              {copied ? <CheckIcon className="w-4 h-4 text-green-400" /> : <ClipboardIcon className="w-4 h-4" />}
            </button>
        </div>
      </div>
    </div>
  );
};

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, activeAgent, onSendMessage, isSending, onClose }) => {
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | number | null>(null);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  useEffect(() => {
    setInputMessage(transcript);
  }, [transcript]);

  useEffect(() => {
    const synth = window.speechSynthesis;
    // Cancel speech when component unmounts or active agent changes
    return () => {
      if (synth.speaking) {
        synth.cancel();
        setSpeakingMessageId(null);
      }
    };
  }, [activeAgent]);

  const handleToggleSpeech = (message: Message) => {
    const synth = window.speechSynthesis;
    // Remove markdown for cleaner speech
    const utteranceText = message.text.replace(/[*_`]/g, '');

    if (speakingMessageId === message.id) {
      synth.cancel();
      setSpeakingMessageId(null);
    } else {
      if (synth.speaking) {
        synth.cancel();
      }
      const utterance = new SpeechSynthesisUtterance(utteranceText);
      utterance.lang = 'es-ES'; // Set language to Spanish
      utterance.onend = () => {
        setSpeakingMessageId(null);
      };
      utterance.onerror = (event) => {
        console.error('Speech synthesis error', event);
        setSpeakingMessageId(null);
      };
      synth.speak(utterance);
      setSpeakingMessageId(message.id);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    // Scroll to bottom when messages change
    scrollToBottom();
  }, [messages]);

  // Mobile-specific focus logic
  useEffect(() => {
    const handleFocus = () => {
      // Small delay to allow keyboard to appear
      setTimeout(() => {
        scrollToBottom();
      }, 300);
    };

    const inputElement = inputRef.current;
    if (inputElement) {
      inputElement.addEventListener('focus', handleFocus);
    }
    
    return () => {
      if (inputElement) {
        inputElement.removeEventListener('focus', handleFocus);
      }
    };
  }, []);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim() && !isSending) {
      onSendMessage(inputMessage);
      setInputMessage('');
      resetTranscript();
      if (listening) {
        SpeechRecognition.stopListening();
      }
    }
  };

  const handleListen = () => {
    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      resetTranscript();
      SpeechRecognition.startListening({ continuous: true, language: 'es-ES' });
    }
  };

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm border-gray-700/50 rounded-lg shadow-lg shadow-black/20 flex flex-col h-full">
      <header className="p-4 border-b border-gray-700/50 flex items-center justify-between">
        <div className="flex items-center">
            <div className={`w-10 h-10 rounded-full ${agentColorStyles[activeAgent.color].bg} flex items-center justify-center mr-4 border ${agentColorStyles[activeAgent.color].border}`}>
              <activeAgent.icon className={`w-6 h-6 ${agentColorStyles[activeAgent.color].text}`} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">{activeAgent.name}</h2>
              <p className="text-sm text-gray-400">{activeAgent.description}</p>
            </div>
        </div>
        {onClose && (
            <button
                onClick={onClose}
                className="text-gray-500 hover:text-white transition-colors"
                aria-label="Cerrar chat"
            >
                <XIcon className="w-6 h-6" />
            </button>
        )}
      </header>

      <div className="flex-1 p-6 overflow-y-auto space-y-6">
        {messages.map((msg) => (
          <ChatBubble 
            key={msg.id} 
            message={msg} 
            agent={activeAgent}
            onToggleSpeech={handleToggleSpeech}
            isSpeaking={speakingMessageId === msg.id}
          />
        ))}
        {isSending && (
          <div className="flex items-start gap-3">
            <div className={`w-8 h-8 rounded-full ${agentColorStyles[activeAgent.color].bg} flex items-center justify-center flex-shrink-0 border ${agentColorStyles[activeAgent.color].border}`}>
              <activeAgent.icon className={`w-5 h-5 ${agentColorStyles[activeAgent.color].text} animate-pulse`} />
            </div>
            <div className="bg-gray-800 rounded-lg p-3 max-w-lg">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <footer className="p-4 border-t border-gray-700/50">
        <form onSubmit={handleSubmit} className="flex items-center gap-3">
          <textarea
            ref={inputRef}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            placeholder={`Habla con ${activeAgent.name}...`}
            className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
            rows={1}
            disabled={isSending}
          />
          {browserSupportsSpeechRecognition && (
            <button
              type="button"
              onClick={handleListen}
              className={`p-3 rounded-full transition-colors flex-shrink-0 ${
                listening
                  ? 'bg-red-500 hover:bg-red-400 text-white animate-pulse'
                  : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
              }`}
              aria-label={listening ? 'Detener grabación' : 'Iniciar grabación'}
            >
              {listening ? <StopIcon className="w-5 h-5" /> : <MicrophoneIcon className="w-5 h-5" />}
            </button>
          )}
          <button
            type="submit"
            disabled={!inputMessage.trim() || isSending}
            className="bg-cyan-500 hover:bg-cyan-400 text-white rounded-full p-3 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed flex-shrink-0"
          >
            <SendIcon className="w-5 h-5" />
          </button>
        </form>
      </footer>
    </div>
  );
};

export default ChatWindow;
