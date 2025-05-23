import { useRef, useEffect } from "react";
import { useGameStore } from "../store/gameStore";

const HoldPiece = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { heldPiece } = useGameStore();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = "rgba(0, 0, 0, 0.9)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (heldPiece) {
      const blockSize = 20;
      const offsetX =
        (canvas.width - heldPiece.shape[0].length * blockSize) / 2;
      const offsetY = (canvas.height - heldPiece.shape.length * blockSize) / 2;

      for (let y = 0; y < heldPiece.shape.length; y++) {
        for (let x = 0; x < heldPiece.shape[y].length; x++) {
          if (heldPiece.shape[y][x]) {
            const blockX = offsetX + x * blockSize;
            const blockY = offsetY + y * blockSize;

            // Main block
            ctx.fillStyle = heldPiece.color;
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
  }, [heldPiece]);

  return (
    <div className="bg-gradient-to-br from-green-900/50 to-green-800/50 backdrop-blur-sm rounded-2xl p-4 border border-green-500/30">
      <h3 className="text-green-300 font-bold text-center mb-3">HOLD</h3>
      <div className="flex justify-center">
        <canvas
          ref={canvasRef}
          width={120}
          height={120}
          className="border border-green-500/30 rounded-lg bg-black/80"
        />
      </div>
      <p className="text-xs text-green-200 text-center mt-2 opacity-70">
        Press C to hold
      </p>
    </div>
  );
};

export default HoldPiece;
