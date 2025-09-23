import React, { useState, useRef, useEffect } from 'react';
import type { Message, Agent, AgentColor } from '../types.ts';
import UserIcon from './icons/UserIcon.tsx';
import SendIcon from './icons/SendIcon.tsx';
import ClipboardIcon from './icons/ClipboardIcon.tsx';
import CheckIcon from './icons/CheckIcon.tsx';

interface ChatWindowProps {
  messages: Message[];
  activeAgent: Agent;
  onSendMessage: (message: string) => void;
  isSending: boolean;
}

const agentColorStyles: Record<AgentColor, { bg: string; text: string; border: string }> = {
  cyan: { bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/30' },
  purple: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/30' },
  yellow: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', border: 'border-yellow-500/30' },
  pink: { bg: 'bg-pink-500/10', text: 'text-pink-400', border: 'border-pink-500/30' },
};

const ChatBubble: React.FC<{ message: Message; agent: Agent }> = ({ message, agent }) => {
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
        {message.action && (
          <div className="mt-3 pt-3 border-t border-gray-700/50">
            <button
              onClick={message.action.onClick}
              className="bg-cyan-500 hover:bg-cyan-400 text-white font-bold py-2 px-4 rounded-lg transition-colors w-full text-sm"
            >
              {message.action.text}
            </button>
          </div>
        )}
        <button
          onClick={handleCopy}
          className="absolute top-2 right-2 p-1 bg-gray-700 rounded-md text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Copiar texto"
        >
          {copied ? <CheckIcon className="w-4 h-4 text-green-400" /> : <ClipboardIcon className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, activeAgent, onSendMessage, isSending }) => {
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

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
    }
  };

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm border-gray-700/50 rounded-lg shadow-lg shadow-black/20 flex flex-col h-full">
      <header className="p-4 border-b border-gray-700/50 flex items-center">
        <div className={`w-10 h-10 rounded-full ${agentColorStyles[activeAgent.color].bg} flex items-center justify-center mr-4 border ${agentColorStyles[activeAgent.color].border}`}>
          <activeAgent.icon className={`w-6 h-6 ${agentColorStyles[activeAgent.color].text}`} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">{activeAgent.name}</h2>
          <p className="text-sm text-gray-400">{activeAgent.description}</p>
        </div>
      </header>

      <div className="flex-1 p-6 overflow-y-auto space-y-6">
        {messages.map((msg) => (
          <ChatBubble key={msg.id} message={msg} agent={activeAgent} />
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