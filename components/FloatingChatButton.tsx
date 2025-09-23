import React from 'react';
import MessageSquareIcon from './icons/MessageSquareIcon.tsx';

interface FloatingChatButtonProps {
  onClick: () => void;
}

const FloatingChatButton: React.FC<FloatingChatButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 bg-gradient-to-r from-cyan-500 to-blue-500 text-white w-16 h-16 rounded-full shadow-lg flex items-center justify-center transform hover:scale-110 transition-transform duration-200 z-40 animate-pulse"
      aria-label="Abrir chat"
    >
      <MessageSquareIcon className="w-8 h-8" />
    </button>
  );
};

export default FloatingChatButton;
