import React, { useRef, useEffect } from 'react';
import type { Message, Agent } from '../types';
import SendIcon from './icons/SendIcon';
import MicrophoneIcon from './icons/MicrophoneIcon';
import StopIcon from './icons/StopIcon';
import UserIcon from './icons/UserIcon';
import NexusLogo from './icons/NexusLogo';
import SpeakerOffIcon from './icons/SpeakerOffIcon';

interface ChatWindowProps {
  messages: Message[];
  activeAgent: Agent;
  onSendMessage: () => void;
  isLoading: boolean;
  onStopGeneration: () => void;
  input: string;
  setInput: (input: string) => void;
  isListening: boolean;
  onToggleListening: () => void;
  isSpeaking: boolean;
  onStopSpeaking: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  messages,
  activeAgent,
  onSendMessage,
  isLoading,
  onStopGeneration,
  input,
  setInput,
  isListening,
  onToggleListening,
  isSpeaking,
  onStopSpeaking,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (input.trim()) {
      onSendMessage();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-lg shadow-lg shadow-black/20 flex flex-col h-[calc(100vh-4rem)]">
      <div className="p-4 border-b border-gray-700/50 flex items-center">
        <activeAgent.icon
          className={`w-8 h-8 mr-3 text-${activeAgent.color}-400`}
        />
        <div>
          <h2 className="text-xl font-bold text-white">{activeAgent.name}</h2>
          <p className="text-sm text-gray-400">{activeAgent.description}</p>
        </div>
         {isSpeaking && (
             <button
                onClick={onStopSpeaking}
                className="ml-auto p-2 rounded-full hover:bg-gray-700 transition-colors"
                title="Stop Speaking"
              >
                <SpeakerOffIcon className="w-6 h-6 text-yellow-400" />
              </button>
         )}
      </div>
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="space-y-6">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-4 ${
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.sender === 'agent' && (
                <div className="w-8 h-8 flex-shrink-0 rounded-full bg-gray-800 flex items-center justify-center">
                    {isLoading && msg.id === messages[messages.length - 1].id ? (
                        <NexusLogo className={`w-6 h-6 text-${activeAgent.color}-400 animate-spin`} />
                    ) : (
                        <activeAgent.icon className={`w-6 h-6 text-${activeAgent.color}-400`} />
                    )}
                </div>
              )}
              <div
                className={`max-w-xl p-4 rounded-xl shadow-md ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-gray-700 text-gray-200 rounded-bl-none'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.text.replace(/\*/g, '')}</p>
              </div>
               {msg.sender === 'user' && (
                <div className="w-8 h-8 flex-shrink-0 rounded-full bg-gray-800 flex items-center justify-center">
                  <UserIcon className="w-6 h-6 text-gray-400" />
                </div>
              )}
            </div>
          ))}
           {isLoading && messages[messages.length - 1]?.sender !== 'agent' && (
             <div className="flex items-start gap-4 justify-start">
                <div className="w-8 h-8 flex-shrink-0 rounded-full bg-gray-800 flex items-center justify-center">
                    <NexusLogo className={`w-6 h-6 text-${activeAgent.color}-400 animate-spin`} />
                </div>
                <div className="max-w-xl p-4 rounded-xl shadow-md bg-gray-700 text-gray-200 rounded-bl-none">
                    <p className="whitespace-pre-wrap">Pensando...</p>
                </div>
             </div>
           )}
        </div>
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t border-gray-700/50">
        <div className="relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={`Habla con ${activeAgent.name}...`}
            className="w-full bg-gray-800 border border-gray-600 rounded-lg pr-40 pl-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
            rows={1}
            style={{ minHeight: '52px' }}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {isLoading && (
              <button
                onClick={onStopGeneration}
                className="p-2 rounded-full hover:bg-gray-700 transition-colors"
                title="Stop Generation"
              >
                <StopIcon className="w-6 h-6 text-red-500" />
              </button>
            )}
             <button
              onClick={onToggleListening}
              className={`p-2 rounded-full transition-colors ${isListening ? 'bg-red-500/20' : 'hover:bg-gray-700'}`}
              title={isListening ? 'Stop Listening' : 'Start Listening'}
            >
              <MicrophoneIcon className={`w-6 h-6 ${isListening ? 'text-red-500' : 'text-gray-400'}`} />
            </button>
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="bg-cyan-600 hover:bg-cyan-500 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-full p-2.5 transition-colors text-white"
            >
              <SendIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;