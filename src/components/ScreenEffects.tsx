import React, { useEffect, useState } from "react";
import { useSpring, animated } from "@react-spring/web";
import { useGameStore } from "../store/gameStore";

interface ScreenEffectsProps {
  children: React.ReactNode;
}

const ScreenEffects: React.FC<ScreenEffectsProps> = ({ children }) => {
  const [shouldShake, setShouldShake] = useState(false);
  const gameStatus = useGameStore((state) => state.gameStatus);

  // Handle hard drop events
  useEffect(() => {
    if (gameStatus === "playing") {
      const hardDropHandler = () => setShouldShake(true);
      document.addEventListener("hardDrop", hardDropHandler);
      return () => document.removeEventListener("hardDrop", hardDropHandler);
    }
  }, [gameStatus]);

  // Reset shake state after animation
  useEffect(() => {
    if (shouldShake) {
      const timer = setTimeout(() => setShouldShake(false), 100);
      return () => clearTimeout(timer);
    }
  }, [shouldShake]);

  // Screen shake animation with reduced intensity
  const shakeAnimation = useSpring({
    transform: shouldShake
      ? `translate3d(${Math.random() * 2 - 1}px, ${
          Math.random() * 2 - 1
        }px, 0) rotate(${Math.random() * 0.5 - 0.25}deg)`
      : "translate3d(0px, 0px, 0) rotate(0deg)",
    config: {
      tension: 400,
      friction: 15,
    },
  });

  return (
    <animated.div
      style={{
        ...shakeAnimation,
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {children}
    </animated.div>
  );
};

export default ScreenEffects;
