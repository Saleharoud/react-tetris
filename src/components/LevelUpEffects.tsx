import React, { useEffect, useState } from "react";
import { useSpring, animated, config } from "@react-spring/web";
import { BOARD_WIDTH, BOARD_HEIGHT } from "../types";

interface LevelParticle {
  id: number;
  x: number;
  y: number;
  color: string;
}

interface LevelUpEvent {
  detail: {
    level: number;
  };
}

const COLORS = ["#FFD700", "#FFA500", "#FF4500", "#FF1493", "#9400D3"];

const LevelUpEffects: React.FC = () => {
  const [particles, setParticles] = useState<LevelParticle[]>([]);

  useEffect(() => {
    const handleLevelUp = (e: LevelUpEvent) => {
      const newParticles: LevelParticle[] = [];

      // Create particles around the board
      for (let i = 0; i < 50; i++) {
        const side = Math.floor(Math.random() * 4); // 0: top, 1: right, 2: bottom, 3: left
        let x, y;

        switch (side) {
          case 0: // top
            x = Math.random() * BOARD_WIDTH;
            y = -1;
            break;
          case 1: // right
            x = BOARD_WIDTH;
            y = Math.random() * BOARD_HEIGHT;
            break;
          case 2: // bottom
            x = Math.random() * BOARD_WIDTH;
            y = BOARD_HEIGHT;
            break;
          default: // left
            x = -1;
            y = Math.random() * BOARD_HEIGHT;
            break;
        }

        newParticles.push({
          id: Math.random(),
          x,
          y,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
        });
      }

      setParticles(newParticles);

      // Clean up particles after animation
      setTimeout(() => {
        setParticles([]);
      }, 2000);
    };

    document.addEventListener("levelUp" as any, handleLevelUp);
    return () => document.removeEventListener("levelUp" as any, handleLevelUp);
  }, []);

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
    >
      {particles.map((particle) => (
        <LevelParticle key={particle.id} particle={particle} />
      ))}
    </div>
  );
};

interface LevelParticleProps {
  particle: LevelParticle;
}

const LevelParticle: React.FC<LevelParticleProps> = ({ particle }) => {
  const blockSize = 30; // Match your game board block size
  const targetX = (BOARD_WIDTH / 2) * blockSize;
  const targetY = (BOARD_HEIGHT / 2) * blockSize;

  const spring = useSpring({
    from: {
      opacity: 1,
      scale: 0,
      x: particle.x * blockSize,
      y: particle.y * blockSize,
      rotate: 0,
    },
    to: [
      {
        opacity: 1,
        scale: 1,
        x: targetX,
        y: targetY,
        rotate: 360,
      },
      {
        opacity: 0,
        scale: 0,
        x: targetX,
        y: targetY,
        rotate: 720,
      },
    ],
    config: {
      ...config.gentle,
      duration: 1500 + Math.random() * 500,
    },
  });

  return (
    <animated.div
      style={{
        position: "absolute",
        width: "8px",
        height: "8px",
        backgroundColor: particle.color,
        borderRadius: "50%",
        transform: spring.scale.to(
          (s) => `scale(${s}) rotate(${spring.rotate.get()}deg)`
        ),
        opacity: spring.opacity,
        left: spring.x,
        top: spring.y,
        boxShadow: `0 0 8px ${particle.color}`,
      }}
    />
  );
};

export default LevelUpEffects;
