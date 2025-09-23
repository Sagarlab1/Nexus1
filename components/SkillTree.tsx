import React from 'react';
import type { SkillBranch, SkillNode } from '../types.ts';

interface SkillTreeProps {
  branch: SkillBranch;
}

const SkillTree: React.FC<SkillTreeProps> = ({ branch }) => {
  const { nodes, edges, color } = branch;

  // FIX: Explicitly type the Map to ensure correct type inference for its values.
  const nodeMap = new Map<string, SkillNode>(nodes.map(node => [node.id, node]));

  const stateClasses = {
    locked: {
      circle: 'fill-gray-700 stroke-gray-600',
      text: 'fill-gray-500',
    },
    unlocked: {
      circle: 'fill-gray-800 stroke-2', // color will be applied via style
      text: 'fill-white font-semibold',
    },
    completed: {
      circle: 'stroke-2', // color will be applied via style
      text: 'fill-white font-bold',
    },
  };

  return (
    <div className="w-full h-full bg-gray-900/50 rounded-lg p-4 relative overflow-auto">
      <svg width="100%" height="100%" viewBox="0 0 800 500" preserveAspectRatio="xMidYMid meet">
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        
        {/* Edges */}
        <g>
          {edges.map(edge => {
            const fromNode = nodeMap.get(edge.from);
            const toNode = nodeMap.get(edge.to);
            if (!fromNode || !toNode) return null;

            const isCompleted = fromNode.state === 'completed' && toNode.state !== 'locked';

            return (
              <line
                key={`${edge.from}-${edge.to}`}
                x1={fromNode.x}
                y1={fromNode.y}
                x2={toNode.x}
                y2={toNode.y}
                className={isCompleted ? 'stroke-2 transition-all' : 'stroke-gray-600 stroke-2'}
                style={{ stroke: isCompleted ? color : undefined }}
              />
            );
          })}
        </g>

        {/* Nodes */}
        <g>
          {nodes.map(node => (
            <g key={node.id} transform={`translate(${node.x}, ${node.y})`} className="cursor-pointer group">
              <title>{node.label}: {node.description}</title>
              <circle
                r="35"
                className={`transition-all ${stateClasses[node.state].circle}`}
                style={{ 
                  stroke: node.state !== 'locked' ? color : undefined,
                  fill: node.state === 'completed' ? color : undefined,
                }}
              />
              {node.state === 'unlocked' && (
                <circle
                  r="35"
                  className="fill-none animate-pulse"
                  style={{ stroke: color, strokeWidth: 3, filter: 'url(#glow)' }}
                />
              )}
               <foreignObject x="-30" y="-15" width="60" height="30">
                 <p 
                    xmlns="http://www.w3.org/1999/xhtml" 
                    className={`w-full h-full flex items-center justify-center text-center text-xs leading-tight break-words ${stateClasses[node.state].text} pointer-events-none select-none`}
                 >
                    {node.label}
                 </p>
               </foreignObject>
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
};

export default SkillTree;