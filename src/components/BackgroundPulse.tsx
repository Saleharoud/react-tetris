import React from "react";
import { useSpring, animated } from "@react-spring/web";
import { useGameStore } from "../store/gameStore";

const BackgroundPulse: React.FC = () => {
  const combo = useGameStore((state) => state.combo);

  const spring = useSpring({
    intensity: combo > 4 ? 1 : 0,
    color: combo >= 8 ? "#FF2D00" : combo >= 6 ? "#FF7F00" : "#FFFF00",
    config: {
      tension: 200,
      friction: 20,
    },
  });

  return (
    <animated.div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: "none",
        backgroundImage: spring.color.to(
          (c) => `radial-gradient(circle at center, ${c}33 0%, transparent 70%)`
        ),
        opacity: spring.intensity,
        animation: combo > 4 ? "pulse 1s ease-in-out infinite" : "none",
      }}
    >
      <style>
        {`
          @keyframes pulse {
            0% { transform: scale(1); opacity: 0.2; }
            50% { transform: scale(1.1); opacity: 0.3; }
            100% { transform: scale(1); opacity: 0.2; }
          }
        `}
      </style>
    </animated.div>
  );
};

export default BackgroundPulse;
