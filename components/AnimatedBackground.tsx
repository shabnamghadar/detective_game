'use client';

import { useEffect, useState } from 'react';

const icons = ['🕵️‍♀️', '🧶', '🔍', '🐾', '✨', '🎨', '🐭', '🐉', '🔧', '👠'];

export default function AnimatedBackground() {
  const [elements, setElements] = useState<{ id: number; left: number; top: number; icon: string; delay: number; duration: number }[]>([]);

  useEffect(() => {
    // Generate random positions/delays on mount only (client-side)
    const newElements = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      icon: icons[Math.floor(Math.random() * icons.length)],
      delay: Math.random() * 5,
      duration: 10 + Math.random() * 20, // 10-30s
    }));
    setElements(newElements);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {elements.map((el) => (
        <div
          key={el.id}
          className="absolute text-4xl opacity-20 animate-float"
          style={{
            left: `${el.left}%`,
            top: `${el.top}%`,
            animationDelay: `${el.delay}s`,
            animationDuration: `${el.duration}s`,
          }}
        >
          {el.icon}
        </div>
      ))}
      <style jsx>{`
        @keyframes float {
          0% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(10deg); }
          100% { transform: translateY(0) rotate(0deg); }
        }
        .animate-float {
          animation-name: float;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
        }
      `}</style>
    </div>
  );
}