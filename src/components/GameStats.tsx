import { motion } from "framer-motion";
import { useGameStore } from "../store/gameStore";

const GameStats = () => {
  const { score, level, lines } = useGameStore();

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-br from-cyan-900/50 to-cyan-800/50 backdrop-blur-sm rounded-2xl p-4 border border-cyan-500/30 text-center">
        <h3 className="text-cyan-300 font-bold text-sm mb-2">SCORE</h3>
        <div className="text-cyan-300 text-2xl font-bold">
          {score.toLocaleString()}
        </div>
      </div>

      <div className="bg-gradient-to-br from-pink-900/50 to-pink-800/50 backdrop-blur-sm rounded-2xl p-4 border border-pink-500/30 text-center">
        <h3 className="text-pink-300 font-bold text-sm mb-2">LEVEL</h3>
        <div className="text-pink-300 text-2xl font-bold">{level}</div>
      </div>

      <div className="bg-gradient-to-br from-yellow-900/50 to-yellow-800/50 backdrop-blur-sm rounded-2xl p-4 border border-yellow-500/30 text-center">
        <h3 className="text-yellow-300 font-bold text-sm mb-2">LINES</h3>
        <div className="text-yellow-300 text-2xl font-bold">{lines}</div>
      </div>
    </div>
  );
};

export default GameStats;
