import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaTrophy } from "react-icons/fa";
import { useGameStore } from "../store/gameStore";

const HighScoresScreen = () => {
  const navigate = useNavigate();
  const { highScores } = useGameStore();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        className="max-w-2xl w-full bg-black/20 backdrop-blur-lg rounded-3xl p-8 border border-white/10 shadow-2xl"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="flex items-center mb-8">
          <motion.button
            onClick={() => navigate("/")}
            className="mr-4 p-3 bg-gradient-to-r from-gray-600 to-gray-500 hover:from-gray-700 hover:to-gray-600 rounded-xl text-white transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaArrowLeft />
          </motion.button>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent flex items-center">
            <FaTrophy className="mr-4 text-yellow-400" />
            High Scores
          </h1>
        </div>

        {/* Scores List */}
        <div className="space-y-4">
          {highScores.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No high scores yet!</p>
              <p className="text-gray-500 mt-2">Play a game to set a record.</p>
            </div>
          ) : (
            highScores.map((score, index) => (
              <motion.div
                key={`${score.name}-${score.date}-${index}`}
                className="bg-gradient-to-br from-yellow-900/50 to-yellow-800/50 backdrop-blur-sm rounded-2xl p-6 border border-yellow-500/30"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-yellow-500/20 border border-yellow-500/30 mr-4">
                      <span className="text-yellow-300 font-bold">
                        {index + 1}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-lg">
                        {score.name}
                      </h3>
                      <p className="text-gray-400 text-sm">{score.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-yellow-300 font-bold text-2xl">
                      {score.score.toLocaleString()}
                    </div>
                    <div className="text-gray-400 text-sm">
                      Level {score.level} • {score.lines} Lines
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default HighScoresScreen;
