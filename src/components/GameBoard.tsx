import React, { useEffect } from "react";
import { useGameStore } from "../store/gameStore";
import "../styles/GameBoard.css";
import { BOARD_WIDTH, BOARD_HEIGHT } from "../types";
import LineEffects from "./LineEffects";
import ScoreEffects from "./ScoreEffects";
import LevelUpEffects from "./LevelUpEffects";
import TetrisFlashEffect from "./TetrisFlashEffect";
import ComboCounter from "./ComboCounter";
import PerfectClearEffect from "./PerfectClearEffect";
import BackgroundPulse from "./BackgroundPulse";

const GameBoard: React.FC = () => {
  const { board, currentPiece, gameStatus, clearingLines } = useGameStore();

  // Calculate ghost piece position
  const ghostPiece = (() => {
    if (!currentPiece || gameStatus !== "playing") return null;

    let ghostPiece = { ...currentPiece };
    let dropDistance = 0;

    while (!useGameStore.getState().checkCollision(ghostPiece, 0, 1)) {
      dropDistance++;
      ghostPiece = {
        ...ghostPiece,
        position: {
          x: ghostPiece.position.x,
          y: ghostPiece.position.y + 1,
        },
      };
    }

    return {
      ...currentPiece,
      position: {
        x: currentPiece.position.x,
        y: currentPiece.position.y + dropDistance,
      },
    };
  })();

  // Render cell with appropriate color
  const renderCell = (x: number, y: number) => {
    let cellContent = board[y][x];
    let isGhostPiece = false;
    let isCurrentPiece = false;
    const isClearing = clearingLines.includes(y);

    // Check if cell is part of current piece
    if (currentPiece && gameStatus === "playing") {
      const pieceX = x - currentPiece.position.x;
      const pieceY = y - currentPiece.position.y;
      if (
        pieceY >= 0 &&
        pieceY < currentPiece.shape.length &&
        pieceX >= 0 &&
        pieceX < currentPiece.shape[0].length
      ) {
        if (currentPiece.shape[pieceY][pieceX]) {
          cellContent = currentPiece.color;
          isCurrentPiece = true;
        }
      }
    }

    // Check if cell is part of ghost piece
    if (ghostPiece && !isCurrentPiece && gameStatus === "playing") {
      const ghostX = x - ghostPiece.position.x;
      const ghostY = y - ghostPiece.position.y;
      if (
        ghostY >= 0 &&
        ghostY < ghostPiece.shape.length &&
        ghostX >= 0 &&
        ghostX < ghostPiece.shape[0].length
      ) {
        if (ghostPiece.shape[ghostY][ghostX]) {
          cellContent = ghostPiece.color;
          isGhostPiece = true;
        }
      }
    }

    return (
      <div
        key={`${x},${y}`}
        style={{
          width: "30px",
          height: "30px",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          backgroundColor: cellContent ? cellContent : "transparent",
          boxSizing: "border-box",
          position: "relative",
          opacity: isGhostPiece ? 0.3 : 1,
          boxShadow: cellContent
            ? "inset 0 0 8px rgba(255, 255, 255, 0.3)"
            : "none",
          animation: isClearing ? "flash 0.2s infinite" : "none",
        }}
      >
        {/* Grid lines */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            pointerEvents: "none",
            borderRight:
              (x + 1) % 2 === 0
                ? "1px solid rgba(255, 255, 255, 0.05)"
                : "none",
            borderBottom:
              (y + 1) % 2 === 0
                ? "1px solid rgba(255, 255, 255, 0.05)"
                : "none",
          }}
        />
        {/* Cell highlight */}
        {cellContent && !isGhostPiece && (
          <div
            style={{
              position: "absolute",
              top: "2px",
              left: "2px",
              right: "2px",
              bottom: "2px",
              background:
                "linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, transparent 50%)",
              borderRadius: "2px",
              pointerEvents: "none",
            }}
          />
        )}
      </div>
    );
  };

  return (
    <div
      style={{
        position: "relative",
        display: "grid",
        gridTemplateColumns: `repeat(${BOARD_WIDTH}, 30px)`,
        gap: "1px",
        padding: "10px",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        borderRadius: "8px",
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
        border: "2px solid rgba(255, 255, 255, 0.1)",
      }}
    >
      <BackgroundPulse />
      {board.map((row, y) => row.map((_, x) => renderCell(x, y)))}
      <LineEffects />
      <ScoreEffects />
      <LevelUpEffects />
      <TetrisFlashEffect />
      <ComboCounter />
      <PerfectClearEffect />
      <style>
        {`
          @keyframes flash {
            0% { filter: brightness(1); }
            50% { filter: brightness(2); }
            100% { filter: brightness(1); }
          }
          @keyframes rotate {
            0% { transform: scale(1) rotate(0deg); }
            50% { transform: scale(1.1) rotate(180deg); }
            100% { transform: scale(1) rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default GameBoard;
