import React, { useEffect, useState } from "react";
import { useSpring, animated, config } from "@react-spring/web";
import { useGameStore } from "../store/gameStore";
import { BOARD_WIDTH } from "../types";

interface Sparkle {
  id: number;
  x: number;
  y: number;
  color: string;
}

const LineEffects: React.FC = () => {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  const clearingLines = useGameStore((state) => state.clearingLines);
  const board = useGameStore((state) => state.board);

  useEffect(() => {
    if (clearingLines.length > 0) {
      const newSparkles: Sparkle[] = [];
      clearingLines.forEach((lineY) => {
        // Create sparkles for each cell in the clearing line
        for (let x = 0; x < BOARD_WIDTH; x++) {
          const color = board[lineY][x] || "#ffffff";
          // Create multiple sparkles per cell
          for (let i = 0; i < 3; i++) {
            newSparkles.push({
              id: Math.random(),
              x,
              y: lineY,
              color,
            });
          }
        }
      });
      setSparkles(newSparkles);

      // Clean up sparkles after animation
      const timer = setTimeout(() => {
        setSparkles([]);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [clearingLines, board]);

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
      {sparkles.map((sparkle) => (
        <SparkleParticle key={sparkle.id} sparkle={sparkle} />
      ))}
    </div>
  );
};

interface SparkleParticleProps {
  sparkle: Sparkle;
}

const SparkleParticle: React.FC<SparkleParticleProps> = ({ sparkle }) => {
  const blockSize = 30; // Match your game board block size
  const randomAngle = Math.random() * Math.PI * 2;
  const distance = 50 + Math.random() * 50;

  const spring = useSpring({
    from: {
      opacity: 1,
      scale: 1,
      x: sparkle.x * blockSize + blockSize / 2,
      y: sparkle.y * blockSize + blockSize / 2,
    },
    to: {
      opacity: 0,
      scale: 0,
      x:
        sparkle.x * blockSize +
        Math.cos(randomAngle) * distance +
        blockSize / 2,
      y:
        sparkle.y * blockSize +
        Math.sin(randomAngle) * distance +
        blockSize / 2,
    },
    config: {
      ...config.gentle,
      duration: 500 + Math.random() * 500,
    },
  });

  return (
    <animated.div
      style={{
        position: "absolute",
        width: "4px",
        height: "4px",
        backgroundColor: sparkle.color,
        borderRadius: "50%",
        transform: spring.scale.to((s) => `scale(${s})`),
        opacity: spring.opacity,
        left: spring.x,
        top: spring.y,
        boxShadow: `0 0 4px ${sparkle.color}`,
      }}
    />
  );
};

export default LineEffects;
