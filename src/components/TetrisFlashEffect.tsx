import React, { useState, useEffect } from "react";
import { useSpring, animated } from "@react-spring/web";

interface TetrisFlashEvent {
  detail: {
    color: string;
  };
}

const TetrisFlashEffect: React.FC = () => {
  const [isFlashing, setIsFlashing] = useState(false);
  const [flashColor, setFlashColor] = useState("#FFFFFF");

  useEffect(() => {
    const handleTetris = (e: TetrisFlashEvent) => {
      setFlashColor(e.detail.color || "#FFFFFF");
      setIsFlashing(true);

      // Reset flash after animation
      setTimeout(() => {
        setIsFlashing(false);
      }, 500);
    };

    document.addEventListener("tetrisClear" as any, handleTetris);
    return () =>
      document.removeEventListener("tetrisClear" as any, handleTetris);
  }, []);

  const spring = useSpring({
    from: { opacity: isFlashing ? 0.7 : 0 },
    to: { opacity: 0 },
    config: {
      tension: 200,
      friction: 20,
    },
    reset: isFlashing,
  });

  return (
    <animated.div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: flashColor,
        pointerEvents: "none",
        mixBlendMode: "screen",
        ...spring,
      }}
    >
      {isFlashing && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            fontSize: "48px",
            fontWeight: "bold",
            color: "#FFFFFF",
            textShadow: "0 0 10px rgba(0,0,0,0.5)",
            animation: "tetrisText 0.5s ease-out",
          }}
        >
          TETRIS!
        </div>
      )}
      <style>
        {`
          @keyframes tetrisText {
            0% {
              transform: translate(-50%, -50%) scale(0.5);
              opacity: 0;
            }
            50% {
              transform: translate(-50%, -50%) scale(1.2);
              opacity: 1;
            }
            100% {
              transform: translate(-50%, -50%) scale(1);
              opacity: 1;
            }
          }
        `}
      </style>
    </animated.div>
  );
};

export default TetrisFlashEffect;
