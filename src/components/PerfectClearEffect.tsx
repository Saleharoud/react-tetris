import React, { useEffect, useState } from "react";
import { useSpring, animated, config } from "@react-spring/web";
import { BOARD_WIDTH, BOARD_HEIGHT } from "../types";

interface PerfectClearEvent {
  detail: {
    score: number;
  };
}

const PerfectClearEffect: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const handlePerfectClear = (e: PerfectClearEvent) => {
      setScore(e.detail.score);
      setIsActive(true);

      // Reset after animation
      setTimeout(() => {
        setIsActive(false);
      }, 2000);
    };

    document.addEventListener("perfectClear" as any, handlePerfectClear);
    return () =>
      document.removeEventListener("perfectClear" as any, handlePerfectClear);
  }, []);

  const spring = useSpring({
    from: { opacity: isActive ? 1 : 0 },
    to: { opacity: 0 },
    config: {
      ...config.gentle,
      duration: 2000,
    },
    reset: isActive,
  });

  // Generate random positions for stars
  const stars = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * BOARD_WIDTH * 30,
    y: Math.random() * BOARD_HEIGHT * 30,
    delay: Math.random() * 500,
    duration: 1000 + Math.random() * 1000,
  }));

  if (!isActive) return null;

  return (
    <animated.div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(255, 215, 0, 0.2)",
        pointerEvents: "none",
        ...spring,
      }}
    >
      {/* Stars */}
      {stars.map((star) => (
        <div
          key={star.id}
          style={{
            position: "absolute",
            left: star.x,
            top: star.y,
            width: "4px",
            height: "4px",
            backgroundColor: "#FFD700",
            borderRadius: "50%",
            animation: `twinkle ${star.duration}ms ${star.delay}ms infinite`,
          }}
        />
      ))}

      {/* Perfect Clear Text */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: "64px",
            fontWeight: "bold",
            color: "#FFD700",
            textShadow: "0 0 20px rgba(255, 215, 0, 0.8)",
            animation: "perfectClear 1s ease-out",
          }}
        >
          PERFECT CLEAR!
        </div>
        <div
          style={{
            fontSize: "32px",
            color: "#FFFFFF",
            marginTop: "20px",
            animation: "scoreReveal 0.5s ease-out 0.5s both",
          }}
        >
          +{score} BONUS!
        </div>
      </div>

      <style>
        {`
          @keyframes twinkle {
            0% { transform: scale(0); opacity: 0; }
            50% { transform: scale(1.5); opacity: 1; }
            100% { transform: scale(0); opacity: 0; }
          }
          @keyframes perfectClear {
            0% { transform: scale(0.5); opacity: 0; }
            50% { transform: scale(1.2); opacity: 1; }
            100% { transform: scale(1); opacity: 1; }
          }
          @keyframes scoreReveal {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
        `}
      </style>
    </animated.div>
  );
};

export default PerfectClearEffect;
