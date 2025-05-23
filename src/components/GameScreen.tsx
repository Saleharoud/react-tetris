import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGameStore } from "../store/gameStore";
import GameBoard from "./GameBoard";
import VolumeControl from "./VolumeControl";
import ScreenEffects from "./ScreenEffects";

const PiecePreview: React.FC<{ piece: any; size?: number }> = ({
  piece,
  size = 20,
}) => {
  if (!piece) return null;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${piece.shape[0].length}, ${size}px)`,
        gap: "1px",
        padding: "15px",
        background: "rgba(0, 0, 0, 0.8)",
        borderRadius: "8px",
        border: "2px solid #ffd93d",
        boxShadow:
          "0 0 15px rgba(255, 217, 61, 0.4), inset 0 0 10px rgba(0, 0, 0, 0.8)",
      }}
    >
      {piece.shape.map((row: any[], y: number) =>
        row.map((cell: any, x: number) => (
          <div
            key={`${x}-${y}`}
            style={{
              width: `${size}px`,
              height: `${size}px`,
              backgroundColor: cell ? piece.color : "transparent",
              border: cell ? "none" : "1px solid rgba(255, 255, 255, 0.05)",
              boxSizing: "border-box",
              boxShadow: cell
                ? "inset 0 0 5px rgba(255, 255, 255, 0.3)"
                : "none",
              borderRadius: "2px",
            }}
          />
        ))
      )}
    </div>
  );
};

const KeyboardControls: React.FC = () => {
  const { settings } = useGameStore();
  const controls = settings.controls;

  const controlsList = [
    { key: controls.moveLeft, action: "Move Left" },
    { key: controls.moveRight, action: "Move Right" },
    { key: controls.softDrop, action: "Soft Drop" },
    { key: controls.hardDrop, action: "Hard Drop" },
    { key: controls.rotate, action: "Rotate" },
    { key: controls.hold, action: "Hold Piece" },
    { key: controls.pause, action: "Pause" },
  ];

  return (
    <div
      style={{
        background: "linear-gradient(145deg, #1a1a2e, #16213e)",
        padding: "20px",
        borderRadius: "15px",
        border: "2px solid #a855f7",
        boxShadow:
          "0 0 20px rgba(168, 85, 247, 0.3), inset 0 0 20px rgba(168, 85, 247, 0.1)",
      }}
    >
      <h3
        style={{
          margin: "0 0 15px 0",
          textAlign: "center",
          color: "#a855f7",
          fontSize: "16px",
          fontWeight: "700",
          textTransform: "uppercase",
          letterSpacing: "2px",
          textShadow: "0 0 10px rgba(168, 85, 247, 0.8)",
        }}
      >
        Controls
      </h3>
      <div style={{ display: "grid", gap: "8px" }}>
        {controlsList.map(({ key, action }) => (
          <div
            key={action}
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "10px",
              opacity: "0.9",
              fontSize: "14px",
            }}
          >
            <span>{action}</span>
            <kbd
              style={{
                background: "rgba(0, 0, 0, 0.3)",
                padding: "2px 6px",
                borderRadius: "4px",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                minWidth: "20px",
                textAlign: "center",
                fontSize: "12px",
              }}
            >
              {key.replace("Key", "").replace("Arrow", "↑")}
            </kbd>
          </div>
        ))}
      </div>
    </div>
  );
};

const GameScreen: React.FC = () => {
  const navigate = useNavigate();
  const gameLoopRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const lastDropTimeRef = useRef<number>(0);
  const [scale, setScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    gameStatus,
    dropInterval,
    settings,
    score,
    level,
    lines,
    heldPiece,
    startGame,
    pauseGame,
    resumeGame,
    movePiece,
    rotatePiece,
    hardDrop,
    holdPiece,
    nextPieces,
  } = useGameStore();

  const speedBlocksPerSecond = (1000 / dropInterval).toFixed(1);

  // Add resize handler
  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current) return;

      const maxHeight = window.innerHeight * 0.9; // 90% of viewport height
      const maxWidth = window.innerWidth * 0.9; // 90% of viewport width

      // Base size of the game container (original size)
      const baseWidth = 900; // Approximate width of the game container
      const baseHeight = 700; // Approximate height of the game container

      // Calculate scale based on both dimensions
      const scaleX = maxWidth / baseWidth;
      const scaleY = maxHeight / baseHeight;

      // Use the smaller scale to ensure the game fits both dimensions
      const newScale = Math.min(scaleX, scaleY, 1); // Never scale up beyond original size

      setScale(newScale);
    };

    handleResize(); // Initial calculation
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (gameStatus !== "playing" && gameStatus !== "paused") return;

      const { controls } = settings;

      switch (event.code) {
        case controls.moveLeft:
          movePiece(-1, 0);
          break;
        case controls.moveRight:
          movePiece(1, 0);
          break;
        case controls.softDrop:
          movePiece(0, 1);
          break;
        case controls.hardDrop:
          hardDrop();
          break;
        case controls.rotate:
          rotatePiece();
          break;
        case controls.hold:
          holdPiece();
          break;
        case controls.pause:
          if (gameStatus === "playing") {
            pauseGame();
          } else if (gameStatus === "paused") {
            resumeGame();
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    settings,
    gameStatus,
    movePiece,
    rotatePiece,
    hardDrop,
    holdPiece,
    pauseGame,
    resumeGame,
  ]);

  useEffect(() => {
    const gameLoop = (timestamp: number) => {
      if (!lastTimeRef.current) {
        lastTimeRef.current = timestamp;
        lastDropTimeRef.current = timestamp;
      }

      const deltaTime = timestamp - lastDropTimeRef.current;

      if (deltaTime > dropInterval && gameStatus === "playing") {
        if (!movePiece(0, 1)) {
          // If piece can't move down, place it
          const state = useGameStore.getState();
          state.placePiece();
        }
        lastDropTimeRef.current = timestamp;
      }

      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    if (gameStatus === "playing") {
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    }

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
        gameLoopRef.current = null;
      }
    };
  }, [gameStatus, dropInterval, movePiece]);

  return (
    <div
      className="game-screen"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 25%, #16213e 50%, #0f3460 75%, #533483 100%)",
        color: "white",
        fontFamily: "'Orbitron', sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background particles */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            radial-gradient(circle at 20% 20%, rgba(62, 84, 172, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(148, 93, 219, 0.1) 0%, transparent 50%),
            radial-gradient(rgba(255, 255, 255, 0.07) 1px, transparent 1px)
          `,
          backgroundSize: "100% 100%, 100% 100%, 50px 50px",
          opacity: 0.8,
          pointerEvents: "none",
          animation: "backgroundPulse 10s ease-in-out infinite",
        }}
      />

      <div
        ref={containerRef}
        style={{
          display: "flex",
          gap: "30px",
          padding: "30px",
          background: "rgba(0, 0, 0, 0.3)",
          borderRadius: "20px",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)",
          transform: `scale(${scale})`,
          transformOrigin: "center center",
          transition: "transform 0.3s ease",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "25px",
          }}
        >
          {/* Score Panel */}
          <div
            style={{
              background: "linear-gradient(145deg, #1a1a2e, #16213e)",
              borderRadius: "15px",
              padding: "20px",
              border: "2px solid #ff6b9d",
              boxShadow:
                "0 0 20px rgba(255, 107, 157, 0.3), inset 0 0 20px rgba(255, 107, 157, 0.1)",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: "24px",
                fontWeight: "900",
                color: "#64ffda",
                textShadow: "0 0 10px rgba(100, 255, 218, 0.8)",
                marginBottom: "10px",
              }}
            >
              Score: {score}
            </div>
            <div
              style={{
                fontSize: "18px",
                color: "#ff6b9d",
                textShadow: "0 0 10px rgba(255, 107, 157, 0.8)",
                marginBottom: "10px",
              }}
            >
              Level: {level}
            </div>
            <div
              style={{
                fontSize: "16px",
                color: "#ffd93d",
                textShadow: "0 0 10px rgba(255, 217, 61, 0.8)",
              }}
            >
              Lines: {lines}
            </div>
          </div>

          {/* Speed indicator */}
          <div
            style={{
              background: "linear-gradient(145deg, #1a1a2e, #16213e)",
              padding: "20px",
              borderRadius: "15px",
              border: "2px solid #64ffda",
              boxShadow:
                "0 0 20px rgba(100, 255, 218, 0.3), inset 0 0 20px rgba(100, 255, 218, 0.1)",
              textAlign: "center",
            }}
          >
            <div
              style={{
                color: "#64ffda",
                fontSize: "16px",
                fontWeight: "700",
                marginBottom: "10px",
                textTransform: "uppercase",
                letterSpacing: "2px",
                textShadow: "0 0 10px rgba(100, 255, 218, 0.8)",
              }}
            >
              Speed
            </div>
            <div
              style={{
                fontSize: "24px",
                fontWeight: "900",
                color: "#64ffda",
                textShadow: "0 0 10px rgba(100, 255, 218, 0.8)",
              }}
            >
              {speedBlocksPerSecond} bps
            </div>
          </div>

          <KeyboardControls />
          <VolumeControl />
        </div>

        <ScreenEffects>
          <div
            style={{
              position: "relative",
              background: "linear-gradient(145deg, #1a1a2e, #16213e)",
              borderRadius: "15px",
              padding: "20px",
              border: "2px solid #64ffda",
              boxShadow:
                "0 0 20px rgba(100, 255, 218, 0.3), inset 0 0 20px rgba(100, 255, 218, 0.1)",
            }}
          >
            <GameBoard />

            {gameStatus === "menu" && (
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  background: "rgba(0, 0, 0, 0.85)",
                  backdropFilter: "blur(5px)",
                  borderRadius: "15px",
                }}
              >
                <button
                  onClick={() => startGame()}
                  style={{
                    background: "linear-gradient(145deg, #64ffda, #00bfa5)",
                    color: "#0a0a0a",
                    border: "none",
                    padding: "20px 40px",
                    borderRadius: "10px",
                    fontSize: "20px",
                    fontWeight: "700",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    boxShadow: "0 5px 15px rgba(100, 255, 218, 0.4)",
                    fontFamily: "'Orbitron', sans-serif",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow =
                      "0 8px 25px rgba(100, 255, 218, 0.6)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 5px 15px rgba(100, 255, 218, 0.4)";
                  }}
                >
                  Start Game
                </button>
              </div>
            )}

            {gameStatus === "gameOver" && (
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  background: "linear-gradient(145deg, #ff1744, #d50000)",
                  borderRadius: "15px",
                  border: "3px solid #ff6b9d",
                  boxShadow:
                    "0 0 50px rgba(255, 23, 68, 0.8), inset 0 0 20px rgba(255, 255, 255, 0.1)",
                  backdropFilter: "blur(10px)",
                }}
              >
                <div
                  style={{
                    fontSize: "24px",
                    fontWeight: "900",
                    marginBottom: "20px",
                  }}
                >
                  GAME OVER
                </div>
                <div
                  style={{
                    fontSize: "18px",
                    marginBottom: "20px",
                  }}
                >
                  Final Score: {score}
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    onClick={() => {
                      const state = useGameStore.getState();
                      state.resetGame();
                      state.startGame();
                    }}
                    style={{
                      background: "linear-gradient(145deg, #64ffda, #00bfa5)",
                      color: "#0a0a0a",
                      border: "none",
                      padding: "15px 30px",
                      borderRadius: "10px",
                      fontSize: "16px",
                      fontWeight: "700",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      boxShadow: "0 5px 15px rgba(100, 255, 218, 0.4)",
                      fontFamily: "'Orbitron', sans-serif",
                    }}
                  >
                    Play Again
                  </button>
                  <button
                    onClick={() => {
                      const state = useGameStore.getState();
                      state.resetGame();
                      navigate("/");
                    }}
                    style={{
                      background: "linear-gradient(145deg, #ff6b9d, #ff4081)",
                      color: "white",
                      border: "none",
                      padding: "15px 30px",
                      borderRadius: "10px",
                      fontSize: "16px",
                      fontWeight: "700",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      boxShadow: "0 5px 15px rgba(255, 107, 157, 0.4)",
                      fontFamily: "'Orbitron', sans-serif",
                    }}
                  >
                    Back to Menu
                  </button>
                </div>
              </div>
            )}
          </div>
        </ScreenEffects>

        {gameStatus !== "menu" && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "25px",
              width: "200px",
            }}
          >
            <div>
              <h3
                style={{
                  margin: "0 0 15px 0",
                  textAlign: "center",
                  color: "#ffd93d",
                  fontSize: "16px",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  letterSpacing: "2px",
                  textShadow: "0 0 10px rgba(255, 217, 61, 0.8)",
                }}
              >
                Next
              </h3>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "15px",
                  alignItems: "center",
                }}
              >
                {nextPieces.slice(0, 3).map((piece, index) => (
                  <PiecePreview key={index} piece={piece} size={20} />
                ))}
              </div>
            </div>
            <div>
              <h3
                style={{
                  margin: "0 0 15px 0",
                  textAlign: "center",
                  color: "#ffd93d",
                  fontSize: "16px",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  letterSpacing: "2px",
                  textShadow: "0 0 10px rgba(255, 217, 61, 0.8)",
                }}
              >
                Hold
              </h3>
              <PiecePreview piece={heldPiece} size={20} />
            </div>
          </div>
        )}
      </div>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap');
          
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: scale(0.95);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }
          
          @keyframes backgroundPulse {
            0%, 100% {
              opacity: 0.8;
            }
            50% {
              opacity: 0.6;
            }
          }

          .game-screen {
            width: 100vw;
            height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            overflow: hidden;
          }
        `}
      </style>
    </div>
  );
};

export default GameScreen;
