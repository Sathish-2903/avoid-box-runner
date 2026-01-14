import { useEffect, useState, useRef } from "react";

export default function App() {
  const [jump, setJump] = useState(false);
  const [boxX, setBoxX] = useState(100);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  // Use refs for values needed inside the interval to avoid stale closures or excessive dependency restarts
  const jumpRef = useRef(jump);

  useEffect(() => {
    jumpRef.current = jump;
  }, [jump]);

  // Jump action
  const handleJump = () => {
    if (gameOver) return;
    if (!gameStarted) {
      setGameStarted(true);
      return;
    }

    if (!jump) {
      setJump(true);
      setTimeout(() => setJump(false), 500);
    }
  };

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === "Space" || e.code === "ArrowUp") {
        handleJump();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [jump, gameOver, gameStarted]);

  // Game loop
  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const loop = setInterval(() => {
      setBoxX((prevX) => {
        // Move box
        const newX = prevX <= -10 ? 100 : prevX - 2;

        // Collision detection
        if (newX < 20 && newX > 10 && !jumpRef.current) {
          setGameOver(true);
        }
        return newX;
      });

      setScore((s) => s + 1);
    }, 45); // Slower speed for beginner level

    return () => clearInterval(loop);
  }, [gameStarted, gameOver]);

  const restartGame = (e) => {
    e.stopPropagation();
    setScore(0);
    setBoxX(100);
    setGameOver(false);
    setGameStarted(true);
    setJump(false);
  };

  return (
    <div
      onClick={handleJump}
      className="h-screen bg-teal-200 flex justify-center items-center md:items-start md:pt-10 cursor-pointer select-none overflow-hidden"
    >
      <div className="relative w-[95%] md:w-full max-w-4xl h-60 md:h-80 bg-pink-50 rounded-xl overflow-hidden border-4 border-pink-900 shadow-2xl">

        {/* Score */}
        <div className="absolute top-3 right-4 text-pink-900 font-bold text-xl md:text-2xl z-10 font-mono">
          Score: {score}
        </div>

        {/* Start Prompt */}
        {!gameStarted && !gameOver && (
          <div className="absolute inset-0 flex items-center justify-center text-pink-900 z-20 bg-white/50 backdrop-blur-sm p-4 text-center">
            <h2 className="text-xl md:text-3xl font-bold animate-bounce text-pink-600">Help Her Catch Him! <br /><span className="text-sm text-center block mt-2">(Tap or Press Space)</span></h2>
          </div>
        )}

        {/* Background Animation - Clouds ☁️ */}
        <div className="absolute top-10 left-0 w-full h-full pointer-events-none opacity-50">
          <div className="absolute top-2 w-full animate-slide" style={{ animationDuration: '15s' }}>☁️</div>
          <div className="absolute top-12 w-full animate-slide" style={{ animationDuration: '20s', animationDelay: '2s' }}>☁️</div>
          <div className="absolute top-5 w-full animate-slide" style={{ animationDuration: '12s', animationDelay: '7s' }}>☁️</div>
        </div>

        {/* Boy (The one she loves) - Running ahead ❤️ */}
        <div className="absolute right-4 md:right-10 bottom-8 md:bottom-12 text-3xl md:text-5xl transition-all duration-1000 animate-bob">
          <span className="scale-x-[-1] inline-block">🤵‍♂️</span><span className="text-sm md:text-lg absolute -top-2 right-0 animate-ping">❤️</span>
        </div>

        {/* Player - Girl (Bride) Chasing 👰‍♀️ */}
        <div
          className={`absolute left-8 md:left-20 w-10 md:w-12 h-10 md:h-12 flex items-center justify-center text-4xl md:text-6xl transition-all duration-300 ${jump ? "bottom-24 md:bottom-32 rotate-6" : "bottom-8 md:bottom-12 animate-bob"
            }`}
        >
          <span className="drop-shadow-lg filter scale-x-[-1]">👰‍♀️</span>
        </div>

        {/* Obstacle Box - Broken Heart 💔 */}
        <div
          className="absolute bottom-8 md:bottom-12 w-10 md:w-12 h-10 md:h-12 flex items-center justify-center text-3xl md:text-4xl"
          style={{ left: `${boxX}%` }}
        >
          <span className="animate-pulse duration-500">💔</span>
        </div>

        {/* Ground Line */}
        <div className="absolute bottom-0 w-full h-8 md:h-12 bg-pink-900"></div>

        {/* Game Over */}
        {gameOver && (
          <div className="absolute inset-0 bg-pink-900/90 flex flex-col items-center justify-center text-white z-50 p-4 text-center">
            <h1 className="text-3xl md:text-5xl font-extrabold mb-2 md:mb-4 text-yellow-300">He got away! 😭</h1>
            <p className="mb-4 md:mb-6 text-xl md:text-2xl text-pink-100">Distance: {score}m</p>
            <button
              onClick={restartGame}
              className="px-6 md:px-8 py-2 md:py-3 bg-yellow-400 hover:bg-yellow-500 text-pink-900 rounded-full font-bold text-lg md:text-xl shadow-lg transform hover:scale-105 transition-all outline-none"
            >
              Chase Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
