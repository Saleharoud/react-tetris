import React from "react";
import { useGameStore } from "../store/gameStore";

const ScorePanel: React.FC = () => {
  const { score, level, lines, highScores, dropInterval, combo } =
    useGameStore();
  const currentHighScore = highScores.length > 0 ? highScores[0].score : 0;

  return (
    <div
      style={{
        padding: "20px",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        borderRadius: "8px",
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
        border: "2px solid rgba(255, 255, 255, 0.1)",
        color: "white",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
          }}
        >
          <h3 style={{ margin: 0, fontSize: "1.5em", color: "#4CAF50" }}>
            Score
          </h3>
          <span style={{ fontSize: "1.8em", fontWeight: "bold" }}>{score}</span>
        </div>

        {combo > 1 && (
          <div
            style={{
              backgroundColor: "#4CAF50",
              color: "white",
              padding: "5px 10px",
              borderRadius: "4px",
              textAlign: "center",
              animation: "pulse 1s infinite",
            }}
          >
            <span style={{ fontSize: "1.2em", fontWeight: "bold" }}>
              {combo}x Combo!
            </span>
            <style>
              {`
                @keyframes pulse {
                  0% { transform: scale(1); }
                  50% { transform: scale(1.05); }
                  100% { transform: scale(1); }
                }
              `}
            </style>
          </div>
        )}

        <div
          style={{
            height: "2px",
            background:
              "linear-gradient(to right, transparent, rgba(255, 255, 255, 0.1), transparent)",
            margin: "5px 0",
          }}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "0.9em",
            color: "#888",
          }}
        >
          <span>High Score</span>
          <span
            style={{ color: score > currentHighScore ? "#4CAF50" : "#888" }}
          >
            {currentHighScore}
          </span>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <div style={{ fontSize: "0.9em", color: "#888" }}>Level</div>
            <div style={{ fontSize: "1.2em" }}>{level}</div>
          </div>
          <div
            style={{
              width: "2px",
              height: "30px",
              background:
                "linear-gradient(to bottom, transparent, rgba(255, 255, 255, 0.1), transparent)",
            }}
          />
          <div>
            <div style={{ fontSize: "0.9em", color: "#888" }}>Lines</div>
            <div style={{ fontSize: "1.2em" }}>{lines}</div>
          </div>
          <div
            style={{
              width: "2px",
              height: "30px",
              background:
                "linear-gradient(to bottom, transparent, rgba(255, 255, 255, 0.1), transparent)",
            }}
          />
          <div>
            <div style={{ fontSize: "0.9em", color: "#888" }}>Speed</div>
            <div style={{ fontSize: "1.2em" }}>
              {Math.round(1000 / dropInterval)}x
            </div>
          </div>
        </div>

        <div
          style={{
            marginTop: "10px",
            padding: "10px",
            backgroundColor: "rgba(0, 0, 0, 0.3)",
            borderRadius: "4px",
            fontSize: "0.9em",
          }}
        >
          <div style={{ color: "#888", marginBottom: "5px" }}>
            Next Level in
          </div>
          <div
            style={{
              height: "4px",
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              borderRadius: "2px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${(lines % 10) * 10}%`,
                backgroundColor: "#4CAF50",
                transition: "width 0.3s ease-out",
              }}
            />
          </div>
          <div style={{ textAlign: "right", color: "#888", marginTop: "5px" }}>
            {10 - (lines % 10)} lines
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScorePanel;
