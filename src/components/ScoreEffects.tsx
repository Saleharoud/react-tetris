import React, { useEffect, useState } from "react";
import { useSpring, animated, config } from "@react-spring/web";

interface ScorePopup {
  id: number;
  score: number;
  x: number;
  y: number;
}

interface ScoreEvent {
  detail: {
    score: number;
    position: { x: number; y: number };
  };
}

const ScoreEffects: React.FC = () => {
  const [scorePopups, setScorePopups] = useState<ScorePopup[]>([]);

  useEffect(() => {
    const handleScoreEvent = (e: ScoreEvent) => {
      const { score, position } = e.detail;
      setScorePopups((prev) => [
        ...prev,
        {
          id: Math.random(),
          score,
          x: position.x,
          y: position.y,
        },
      ]);
    };

    document.addEventListener("scorePoints" as any, handleScoreEvent);
    return () =>
      document.removeEventListener("scorePoints" as any, handleScoreEvent);
  }, []);

  // Cleanup old popups
  useEffect(() => {
    const cleanup = setInterval(() => {
      setScorePopups((prev) =>
        prev.filter((popup) => Date.now() - popup.id < 2000)
      );
    }, 2000);

    return () => clearInterval(cleanup);
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
      {scorePopups.map((popup) => (
        <ScorePopup key={popup.id} popup={popup} />
      ))}
    </div>
  );
};

interface ScorePopupProps {
  popup: ScorePopup;
}

const ScorePopup: React.FC<ScorePopupProps> = ({ popup }) => {
  const blockSize = 30; // Match your game board block size

  const spring = useSpring({
    from: {
      opacity: 1,
      y: popup.y * blockSize,
      scale: 1.2,
    },
    to: {
      opacity: 0,
      y: popup.y * blockSize - 50,
      scale: 0.8,
    },
    config: {
      ...config.gentle,
      duration: 1500,
    },
  });

  return (
    <animated.div
      style={{
        position: "absolute",
        left: `${popup.x * blockSize}px`,
        top: spring.y,
        transform: spring.scale.to((s) => `scale(${s})`),
        opacity: spring.opacity,
        color: "#FFD700",
        fontWeight: "bold",
        fontSize: "16px",
        textShadow: "0 0 4px rgba(255, 215, 0, 0.5)",
        whiteSpace: "nowrap",
      }}
    >
      +{popup.score}
    </animated.div>
  );
};

export default ScoreEffects;
