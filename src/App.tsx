import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { motion } from "framer-motion";
import MainMenu from "./components/MainMenu";
import GameScreen from "./components/GameScreen";
import SettingsScreen from "./components/SettingsScreen";
import HighScoresScreen from "./components/HighScoresScreen";
import ParticleBackground from "./components/ParticleBackground";

function App() {
  return (
    <Router>
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <ParticleBackground />

        <motion.div
          className="relative z-10 min-h-screen"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Routes>
            <Route path="/" element={<MainMenu />} />
            <Route path="/game" element={<GameScreen />} />
            <Route path="/settings" element={<SettingsScreen />} />
            <Route path="/highscores" element={<HighScoresScreen />} />
          </Routes>
        </motion.div>
      </div>
    </Router>
  );
}

export default App;
