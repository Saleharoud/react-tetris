import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaPlay, FaCog, FaTrophy, FaGamepad } from "react-icons/fa";

const MainMenu = () => {
  const navigate = useNavigate();

  const menuItems = [
    {
      icon: FaPlay,
      label: "Start Game",
      path: "/game",
      color: "from-cyan-500 to-blue-500",
    },
    {
      icon: FaTrophy,
      label: "High Scores",
      path: "/highscores",
      color: "from-yellow-500 to-orange-500",
    },
    {
      icon: FaCog,
      label: "Settings",
      path: "/settings",
      color: "from-purple-500 to-pink-500",
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Logo */}
        <motion.div
          className="mb-12"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <div className="flex items-center justify-center mb-4">
            <FaGamepad className="text-6xl text-cyan-400 mr-4" />
            <h1 className="text-7xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              LUXURY
            </h1>
          </div>
          <h2 className="text-5xl font-bold text-white tracking-wider">
            TETRIS
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-cyan-500 to-purple-500 mx-auto mt-4 rounded-full"></div>
        </motion.div>

        {/* Menu Items */}
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          {menuItems.map((item, index) => (
            <motion.button
              key={item.label}
              onClick={() => navigate(item.path)}
              className={`relative group w-80 px-8 py-4 bg-gradient-to-r ${item.color} rounded-xl font-bold text-white text-xl shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-105 border border-white/10 backdrop-blur-sm`}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + index * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="flex items-center justify-center space-x-3">
                <item.icon className="text-2xl" />
                <span>{item.label}</span>
              </div>

              {/* Glow effect */}
              <div
                className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-0 group-hover:opacity-20 rounded-xl blur-xl transition-opacity duration-300`}
              ></div>
            </motion.button>
          ))}
        </motion.div>

        {/* Version info */}
        <motion.div
          className="mt-12 text-gray-400 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
        >
          <p>Version 2.0 | Built with React & TypeScript</p>
        </motion.div>

        {/* Floating elements */}
        <div className="absolute top-20 left-20 w-4 h-4 bg-cyan-400 rounded-full animate-bounce opacity-60"></div>
        <div className="absolute top-32 right-32 w-3 h-3 bg-purple-400 rounded-full animate-pulse opacity-60"></div>
        <div className="absolute bottom-40 left-40 w-2 h-2 bg-pink-400 rounded-full animate-ping opacity-60"></div>
      </motion.div>
    </div>
  );
};

export default MainMenu;
