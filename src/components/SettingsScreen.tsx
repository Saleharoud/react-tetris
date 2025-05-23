import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaVolumeUp, FaMusic, FaGamepad } from "react-icons/fa";
import { useGameStore } from "../store/gameStore";

const SettingsScreen = () => {
  const navigate = useNavigate();
  const { settings, updateSettings } = useGameStore();

  const handleVolumeChange = (volume: number) => {
    updateSettings({ volume });
  };

  const toggleMusic = () => {
    updateSettings({ music: !settings.music });
  };

  const toggleSoundEffects = () => {
    updateSettings({ soundEffects: !settings.soundEffects });
  };

  const themes = [
    {
      id: "luxury",
      name: "Luxury",
      description: "Premium dark theme with neon accents",
    },
    {
      id: "classic",
      name: "Classic",
      description: "Traditional Tetris colors",
    },
    { id: "neon", name: "Neon", description: "Bright cyberpunk aesthetic" },
  ];

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
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Settings
          </h1>
        </div>

        <div className="space-y-6">
          {/* Audio Settings */}
          <motion.div
            className="bg-gradient-to-br from-purple-900/50 to-purple-800/50 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <h2 className="text-purple-300 font-bold text-xl mb-4 flex items-center">
              <FaVolumeUp className="mr-2" />
              Audio Settings
            </h2>

            <div className="space-y-4">
              {/* Volume Slider */}
              <div>
                <label className="block text-white text-sm font-bold mb-2">
                  Master Volume: {Math.round(settings.volume * 100)}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={settings.volume}
                  onChange={(e) =>
                    handleVolumeChange(parseFloat(e.target.value))
                  }
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>

              {/* Music Toggle */}
              <div className="flex items-center justify-between">
                <span className="text-white font-medium flex items-center">
                  <FaMusic className="mr-2" />
                  Background Music
                </span>
                <button
                  onClick={toggleMusic}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.music ? "bg-purple-500" : "bg-gray-600"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.music ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {/* Sound Effects Toggle */}
              <div className="flex items-center justify-between">
                <span className="text-white font-medium">Sound Effects</span>
                <button
                  onClick={toggleSoundEffects}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.soundEffects ? "bg-purple-500" : "bg-gray-600"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.soundEffects ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Theme Selection */}
          <motion.div
            className="bg-gradient-to-br from-cyan-900/50 to-cyan-800/50 backdrop-blur-sm rounded-2xl p-6 border border-cyan-500/30"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <h2 className="text-cyan-300 font-bold text-xl mb-4">
              Visual Theme
            </h2>
            <div className="grid gap-3">
              {themes.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => updateSettings({ theme: theme.id as any })}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                    settings.theme === theme.id
                      ? "border-cyan-400 bg-cyan-900/30"
                      : "border-gray-600 hover:border-gray-500 bg-gray-800/30"
                  }`}
                >
                  <div className="text-white font-bold">{theme.name}</div>
                  <div className="text-gray-400 text-sm">
                    {theme.description}
                  </div>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Controls Info */}
          <motion.div
            className="bg-gradient-to-br from-yellow-900/50 to-yellow-800/50 backdrop-blur-sm rounded-2xl p-6 border border-yellow-500/30"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <h2 className="text-yellow-300 font-bold text-xl mb-4 flex items-center">
              <FaGamepad className="mr-2" />
              Controls
            </h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-300">Move Left:</span>
                  <span className="text-yellow-300 font-mono">←</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Move Right:</span>
                  <span className="text-yellow-300 font-mono">→</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Soft Drop:</span>
                  <span className="text-yellow-300 font-mono">↓</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-300">Rotate:</span>
                  <span className="text-yellow-300 font-mono">↑</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Hard Drop:</span>
                  <span className="text-yellow-300 font-mono">SPACE</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Hold:</span>
                  <span className="text-yellow-300 font-mono">C</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Pause:</span>
                  <span className="text-yellow-300 font-mono">P</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default SettingsScreen;
