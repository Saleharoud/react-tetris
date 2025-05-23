import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useGameStore } from "../store/gameStore";

const GameOverModal = () => {
  const navigate = useNavigate();
  const [playerName, setPlayerName] = useState("");
  const { score, level, lines, resetGame, addHighScore } = useGameStore();

  const handleRestart = () => {
    resetGame();
  };

  const handleSaveScore = () => {
    if (playerName.trim()) {
      addHighScore({
        name: playerName.trim(),
        score,
        level,
        lines,
        date: new Date().toLocaleDateString(),
      });
    }
    resetGame();
  };

  const handleMenu = () => {
    if (playerName.trim()) {
      addHighScore({
        name: playerName.trim(),
        score,
        level,
        lines,
        date: new Date().toLocaleDateString(),
      });
    }
    resetGame();
    navigate("/");
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="bg-gradient-to-br from-red-900/90 to-red-800/90 backdrop-blur-lg rounded-3xl p-8 border border-red-500/50 text-center max-w-md mx-4"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <motion.h2
          className="text-5xl font-bold text-white mb-6"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          GAME OVER
        </motion.h2>

        <motion.div
          className="space-y-4 mb-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="bg-black/30 rounded-xl p-4">
            <div className="text-cyan-300 text-lg font-bold">Final Score</div>
            <div className="text-white text-3xl font-bold">
              {score.toLocaleString()}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-black/30 rounded-xl p-3">
              <div className="text-pink-300 text-sm font-bold">Level</div>
              <div className="text-white text-xl font-bold">{level}</div>
            </div>
            <div className="bg-black/30 rounded-xl p-3">
              <div className="text-yellow-300 text-sm font-bold">Lines</div>
              <div className="text-white text-xl font-bold">{lines}</div>
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-white text-sm font-bold mb-2">
              Enter your name for the leaderboard:
            </label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Your name..."
              className="w-full px-4 py-2 rounded-xl bg-black/50 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition-colors"
              maxLength={20}
            />
          </div>
        </motion.div>

        <motion.div
          className="flex flex-col space-y-3"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <button
            onClick={handleSaveScore}
            className="px-8 py-3 bg-gradient-to-r from-green-500 to-green-400 hover:from-green-600 hover:to-green-500 rounded-xl font-bold text-white text-lg transition-all duration-300 transform hover:scale-105"
          >
            Save & Play Again
          </button>

          <button
            onClick={handleRestart}
            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-400 hover:from-blue-600 hover:to-blue-500 rounded-xl font-bold text-white text-lg transition-all duration-300 transform hover:scale-105"
          >
            Play Again
          </button>

          <button
            onClick={handleMenu}
            className="px-8 py-3 bg-gradient-to-r from-gray-600 to-gray-500 hover:from-gray-700 hover:to-gray-600 rounded-xl font-bold text-white text-lg transition-all duration-300 transform hover:scale-105"
          >
            Main Menu
          </button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default GameOverModal;
