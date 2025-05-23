import React from "react";
import { useGameStore } from "../store/gameStore";

const VolumeControl: React.FC = () => {
  const { settings, toggleSound, setVolume } = useGameStore();
  const { volume, music, soundEffects } = settings;

  return (
    <div
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        padding: "15px",
        borderRadius: "8px",
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
        border: "2px solid rgba(255, 255, 255, 0.1)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "10px",
        }}
      >
        <span>Sound</span>
        <button
          onClick={toggleSound}
          style={{
            backgroundColor: music && soundEffects ? "#4CAF50" : "#f44336",
            border: "none",
            borderRadius: "4px",
            padding: "5px 10px",
            color: "white",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.transform = "scale(1.05)")
          }
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          {music && soundEffects ? "On" : "Off"}
        </button>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <span>Volume</span>
        <input
          type="range"
          min="0"
          max="100"
          value={volume * 100}
          onChange={(e) => setVolume(Number(e.target.value) / 100)}
          disabled={!music && !soundEffects}
          style={{
            flex: 1,
            accentColor: "#4CAF50",
          }}
        />
        <span style={{ minWidth: "40px" }}>{Math.round(volume * 100)}%</span>
      </div>
    </div>
  );
};

export default VolumeControl;
