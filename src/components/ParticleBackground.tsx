import { useEffect, useRef } from "react";

const ParticleBackground = () => {
  const particlesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const createParticle = () => {
      if (!particlesRef.current) return;

      const particle = document.createElement("div");
      particle.className =
        "absolute w-1 h-1 bg-cyan-400 rounded-full opacity-60";
      particle.style.left = Math.random() * 100 + "%";
      particle.style.animationDuration = 8 + Math.random() * 4 + "s";
      particle.style.animationDelay = Math.random() * 2 + "s";

      particlesRef.current.appendChild(particle);

      // Remove particle after animation
      setTimeout(() => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle);
        }
      }, 12000);
    };

    // Create initial particles
    for (let i = 0; i < 50; i++) {
      setTimeout(() => createParticle(), i * 100);
    }

    // Continue creating particles
    const interval = setInterval(createParticle, 300);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div
        ref={particlesRef}
        className="fixed inset-0 overflow-hidden pointer-events-none z-0"
      />
      <style>{`
        @keyframes float-up {
          0% { 
            transform: translateY(100vh) rotate(0deg); 
            opacity: 0; 
          }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { 
            transform: translateY(-100px) rotate(360deg); 
            opacity: 0; 
          }
        }
        .absolute.w-1.h-1 {
          animation: float-up linear infinite;
        }
      `}</style>
    </>
  );
};

export default ParticleBackground;
