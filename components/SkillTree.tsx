import React, { useEffect, useRef, useMemo } from 'react';
import type { Agent } from '../types';

interface SkillTreeProps {
  unlockedSkills: string[];
  activeAgent: Agent | null;
  triggerUnlockAnimationId: string | null;
}

const SkillTree: React.FC<SkillTreeProps> = ({ unlockedSkills, activeAgent, triggerUnlockAnimationId }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // FIX: Initialize useRef with null to provide an initial argument.
  const animationFrameId = useRef<number | null>(null);

  // FIX: Safely access activeAgent.color to avoid runtime errors when agent is null.
  // Rewritten to be more explicit and potentially avoid linter issues.
  const baseColor = useMemo(() => {
    const color = activeAgent?.color;
    if (color?.includes('blue')) {
      return 'rgba(59, 130, 246, 0.7)';
    }
    if (color?.includes('yellow')) {
      return 'rgba(250, 204, 21, 0.7)';
    }
    if (color?.includes('green')) {
      return 'rgba(74, 222, 128, 0.7)';
    }
    if (color?.includes('purple')) {
      return 'rgba(167, 139, 250, 0.7)';
    }
    return 'rgba(34, 211, 238, 0.7)';
  }, [activeAgent]);

  const nodes = useMemo(() => Array.from({ length: 50 }, (_, i) => ({
    id: `node-${i}`,
    x: Math.random(),
    y: Math.random(),
    vx: (Math.random() - 0.5) * 0.1,
    vy: (Math.random() - 0.5) * 0.1,
    radius: Math.random() * 1.5 + 1,
    isUnlocked: false,
    unlockProgress: 0,
  })), []);
  
  // Effect to handle unlock animation trigger
  useEffect(() => {
    if (triggerUnlockAnimationId) {
       const unlockedNode = nodes[Math.floor(Math.random() * nodes.length)];
       unlockedNode.isUnlocked = true;
    }
  }, [triggerUnlockAnimationId, nodes]);
  

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const resizeObserver = new ResizeObserver(() => {
        width = (canvas.width = canvas.offsetWidth);
        height = (canvas.height = canvas.offsetHeight);
    });
    resizeObserver.observe(canvas);

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw lines between nearby nodes
      ctx.strokeStyle = 'rgba(107, 114, 128, 0.1)';
      ctx.lineWidth = 0.5;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dist = Math.hypot(nodes[i].x * width - nodes[j].x * width, nodes[i].y * height - nodes[j].y * height);
          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(nodes[i].x * width, nodes[i].y * height);
            ctx.lineTo(nodes[j].x * width, nodes[j].y * height);
            ctx.stroke();
          }
        }
      }

      // Draw and update nodes
      nodes.forEach(node => {
        // Update position
        node.x += node.vx / width;
        node.y += node.vy / height;

        // Bounce off walls
        if (node.x <= 0 || node.x >= 1) node.vx *= -1;
        if (node.y <= 0 || node.y >= 1) node.vy *= -1;

        // Handle unlock animation
        if (node.isUnlocked && node.unlockProgress < 1) {
          node.unlockProgress += 0.05; // Animation speed
        } else if (node.isUnlocked && node.unlockProgress >= 1) {
            // Persist unlocked state visually
        }
        
        const currentRadius = node.isUnlocked ? 
            node.radius + 10 * Math.sin(Math.min(node.unlockProgress, 1) * Math.PI) :
            node.radius;

        ctx.beginPath();
        ctx.arc(node.x * width, node.y * height, currentRadius, 0, Math.PI * 2);
        
        ctx.fillStyle = node.isUnlocked ? baseColor : 'rgba(107, 114, 128, 0.3)';
        ctx.fill();
      });

      animationFrameId.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      resizeObserver.disconnect();
    };
  }, [nodes, baseColor]);
  
  // Sync unlocked state from props
   useEffect(() => {
    unlockedSkills.forEach((_, index) => {
        if (index < nodes.length) {
            nodes[index].isUnlocked = true;
            nodes[index].unlockProgress = 1; // Mark as fully unlocked
        }
    });
   }, [unlockedSkills, nodes]);


  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full -z-10" />;
};

export default SkillTree;
