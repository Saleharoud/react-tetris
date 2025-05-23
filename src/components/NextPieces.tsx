import React from "react";
import { useGameStore } from "../store/gameStore";
import type { Tetromino } from "../types";

const NextPieces: React.FC = () => {
  const { nextPieces } = useGameStore();

  const renderPiece = (piece: Tetromino, index: number) => {
    const size = index === 0 ? 20 : 15; // First piece larger than others
    const opacity = 1 - index * 0.15; // Gradually decrease opacity

    return (
      <div
        key={index}
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${piece.shape[0].length}, ${size}px)`,
          gap: "1px",
          padding: "10px",
          backgroundColor: "rgba(0, 0, 0, 0.3)",
          borderRadius: "8px",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
          border: "2px solid rgba(255, 255, 255, 0.1)",
          transform: `scale(${1 - index * 0.1})`,
          transition: "all 0.3s ease-out",
          animation: "slideIn 0.3s ease-out",
          opacity,
        }}
      >
        {piece.shape.map((row, y) =>
          row.map((cell, x) => (
            <div
              key={`${x}-${y}`}
              style={{
                width: `${size}px`,
                height: `${size}px`,
                backgroundColor: cell ? piece.color : "transparent",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                boxSizing: "border-box",
                boxShadow: cell
                  ? "inset 0 0 5px rgba(255, 255, 255, 0.2)"
                  : "none",
                transition: "all 0.3s ease",
              }}
            />
          ))
        )}
      </div>
    );
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        padding: "10px",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        borderRadius: "8px",
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
        border: "2px solid rgba(255, 255, 255, 0.1)",
      }}
    >
      <h3 style={{ margin: "0 0 10px 0", textAlign: "center", color: "white" }}>
        Next
      </h3>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          alignItems: "center",
        }}
      >
        {nextPieces.map((piece, index) => renderPiece(piece, index))}
      </div>
      <style>
        {`
          @keyframes slideIn {
            from {
              transform: translateX(20px);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
        `}
      </style>
    </div>
  );
};

export default NextPieces;
