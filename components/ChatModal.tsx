import React from 'react';
import ChatWindow from './ChatWindow';
import type { Message, Agent } from '../types';
import XIcon from './icons/XIcon';

// This interface re-declares the props needed by ChatWindow
interface ChatModalProps {
  onClose: () => void;
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

const ChatModal: React.FC<ChatModalProps> = (props) => {
  return (
    <div 
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in"
      onClick={props.onClose}
    >
      <div 
        className="w-full max-w-2xl h-[80vh] max-h-[700px] m-auto transform transition-all animate-fade-in-up relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={props.onClose}
          className="absolute top-3 right-3 z-10 p-2 rounded-full text-gray-400 bg-gray-800/50 hover:bg-gray-700 hover:text-white transition-colors"
          aria-label="Cerrar chat"
        >
          <XIcon className="w-5 h-5" />
        </button>
        <ChatWindow {...props} />
      </div>
      <style>{`
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fade-in 0.2s ease-out forwards; }
        @keyframes fade-in-up {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fade-in-up 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default ChatModal;
