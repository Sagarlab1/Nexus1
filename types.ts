import type React from 'react';

export interface Message {
  id: number | string;
  text: string;
  sender: 'user' | 'agent';
  action?: {
    text: string;
    onClick: () => void;
  };
}

export interface Personality {
  id:string;
  name: string;
  description: string;
  prompt: string;
}

export type AgentColor = 'cyan' | 'purple' | 'yellow' | 'pink';

export interface Agent {
  id: string;
  name: string;
  description: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  color: AgentColor;
  prompt: string;
  personalities: Personality[];
}

export type SkillNodeState = 'locked' | 'unlocked' | 'completed';

export interface SkillNode {
  id: string;
  label: string;
  description: string;
  x: number;
  y: number;
  state: SkillNodeState;
}

export interface SkillEdge {
  from: string;
  to: string;
}

export interface SkillBranch {
  id: string;
  name: string;
  color: string;
  nodes: SkillNode[];
  edges: SkillEdge[];
}

export type View = 'chat' | 'nexus_zero_course' | 'programs' | 'challenges' | 'cognitive_gym' | 'api_key_setup';