import React, { useEffect, useState } from "react";
import { useSpring, animated, config } from "@react-spring/web";
import { useGameStore } from "../store/gameStore";

const ComboCounter: React.FC = () => {
  const combo = useGameStore((state) => state.combo);
  const [showCombo, setShowCombo] = useState(false);

  const spring = useSpring({
    scale: showCombo ? 1 : 0,
    y: showCombo ? 0 : 20,
    opacity: showCombo ? 1 : 0,
    config: config.wobbly,
  });

  useEffect(() => {
    if (combo > 1) {
      setShowCombo(true);
    } else {
      setShowCombo(false);
    }
  }, [combo]);

  if (!showCombo) return null;

  const getComboColor = (combo: number) => {
    if (combo >= 8) return "#FF2D00";
    if (combo >= 6) return "#FF7F00";
    if (combo >= 4) return "#FFFF00";
    return "#FFFFFF";
  };

  const getComboText = (combo: number) => {
    if (combo >= 8) return "UNSTOPPABLE!";
    if (combo >= 6) return "EXCELLENT!";
    if (combo >= 4) return "AWESOME!";
    return "COMBO!";
  };

  return (
    <animated.div
      style={{
        position: "absolute",
        top: "20px",
        left: "50%",
        transform: spring.scale.to(
          (s) => `translate(-50%, ${spring.y.get()}px) scale(${s})`
        ),
        opacity: spring.opacity,
        color: getComboColor(combo),
        textAlign: "center",
        pointerEvents: "none",
        textShadow: "0 0 10px rgba(0,0,0,0.5)",
      }}
    >
      <div
        style={{
          fontSize: "48px",
          fontWeight: "bold",
          lineHeight: "1",
        }}
      >
        {combo}x
      </div>
      <div
        style={{
          fontSize: "24px",
          fontWeight: "bold",
          marginTop: "5px",
          animation: "pulseText 1s infinite",
        }}
      >
        {getComboText(combo)}
      </div>
      <style>
        {`
          @keyframes pulseText {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
          }
        `}
      </style>
    </animated.div>
  );
};

export default ComboCounter;
