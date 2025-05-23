import { useRef, useEffect } from "react";
import { useGameStore } from "../store/gameStore";

const NextPiece = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { nextPiece } = useGameStore();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = "rgba(0, 0, 0, 0.9)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (nextPiece) {
      const blockSize = 20;
      const offsetX =
        (canvas.width - nextPiece.shape[0].length * blockSize) / 2;
      const offsetY = (canvas.height - nextPiece.shape.length * blockSize) / 2;

      for (let y = 0; y < nextPiece.shape.length; y++) {
        for (let x = 0; x < nextPiece.shape[y].length; x++) {
          if (nextPiece.shape[y][x]) {
            const blockX = offsetX + x * blockSize;
            const blockY = offsetY + y * blockSize;

            // Main block
            ctx.fillStyle = nextPiece.color;
            ctx.fillRect(blockX + 1, blockY + 1, blockSize - 2, blockSize - 2);

            // Highlight
            ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
            ctx.fillRect(blockX + 2, blockY + 2, blockSize - 4, 2);
            ctx.fillRect(blockX + 2, blockY + 2, 2, blockSize - 4);

            // Border
            ctx.strokeStyle = "rgba(0, 0, 0, 0.5)";
            ctx.lineWidth = 1;
            ctx.strokeRect(
              blockX + 0.5,
              blockY + 0.5,
              blockSize - 1,
              blockSize - 1
            );
          }
        }
      }
    }
  }, [nextPiece]);

  return (
    <div className="bg-gradient-to-br from-yellow-900/50 to-yellow-800/50 backdrop-blur-sm rounded-2xl p-4 border border-yellow-500/30">
      <h3 className="text-yellow-300 font-bold text-center mb-3">NEXT</h3>
      <div className="flex justify-center">
        <canvas
          ref={canvasRef}
          width={120}
          height={120}
          className="border border-yellow-500/30 rounded-lg bg-black/80"
        />
      </div>
    </div>
  );
};

export default NextPiece;
