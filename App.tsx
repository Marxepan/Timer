import React, { useState, useEffect, useRef } from 'react';

const App: React.FC = () => {
  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (isActive) {
      intervalRef.current = window.setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    } else if (!isActive && intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive]);

  const handleToggle = () => {
    setIsActive(!isActive);
  };

  const handleReset = () => {
    setIsActive(false);
    setTime(0);
  };

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return [hours, minutes, seconds]
      .map(v => String(v).padStart(2, '0'))
      .join(':');
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center justify-center font-sans p-4">
      <div className="w-full max-w-2xl flex flex-col items-center justify-center text-center">
        <header className="mb-8">
          <h1 className="text-5xl font-bold text-green-400">Prosty Timer</h1>
        </header>

        <main className="w-full bg-gray-800 rounded-2xl shadow-2xl p-8 md:p-12 border border-gray-700">
          <div className="text-7xl md:text-9xl font-mono tracking-tighter mb-10" role="timer" aria-live="off">
            {formatTime(time)}
          </div>
          <div className="flex justify-center items-center gap-4 md:gap-8">
            <button
              onClick={handleToggle}
              className={`w-32 md:w-40 px-4 py-3 text-2xl font-semibold text-white rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-opacity-50 ${
                isActive ? 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500' : 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
              }`}
              aria-label={isActive ? 'Pauza' : 'Start'}
            >
              {isActive ? <><i className="fas fa-pause mr-2"></i> Pauza</> : <><i className="fas fa-play mr-2"></i> Start</>}
            </button>
            <button
              onClick={handleReset}
              className="w-32 md:w-40 px-4 py-3 text-2xl font-semibold bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-gray-500 focus:ring-opacity-50"
              aria-label="Resetuj"
            >
              <i className="fas fa-rotate-left mr-2"></i> Resetuj
            </button>
          </div>
        </main>

        <footer className="mt-12 text-center text-gray-500">
            <p>Stworzone z prostotą na uwadze.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
