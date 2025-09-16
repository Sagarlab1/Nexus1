import type React from 'react';

export interface Message {
  id: number | string;
  text: string;
  sender: 'user' | 'agent';
}

export interface Personality {
  id: string;
  name: string;
  description: string;
  prompt: string;
}

export interface Agent {
  id: string;
  name: string;
  description: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  color: string;
  prompt: string;
  personalities: Personality[];
}