
import React, { useState, useEffect, useRef } from 'react';

const App: React.FC = () => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = window.setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  const handleStartPause = () => {
    setIsRunning(prev => !prev);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
  };

  const formatTime = (totalSeconds: number): string => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    const paddedHours = String(hours).padStart(2, '0');
    const paddedMinutes = String(minutes).padStart(2, '0');
    const paddedSeconds = String(seconds).padStart(2, '0');

    if (hours > 0) {
        return `${paddedHours}:${paddedMinutes}:${paddedSeconds}`;
    }
    return `${paddedMinutes}:${paddedSeconds}`;
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center justify-center font-sans">
      <div className="w-full max-w-md p-8 bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 text-center">
        <h1 className="text-4xl font-bold mb-4 text-cyan-400">Prosty Timer</h1>
        <div className="text-8xl font-mono my-10 bg-gray-900 p-6 rounded-lg tracking-wider">
          {formatTime(time)}
        </div>
        <div className="flex justify-center space-x-6">
          <button
            onClick={handleStartPause}
            className={`w-32 px-6 py-3 text-lg font-semibold rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-opacity-50 ${
              isRunning 
                ? 'bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-400 text-gray-900' 
                : 'bg-green-500 hover:bg-green-600 focus:ring-green-400 text-white'
            }`}
          >
            {isRunning ? (
                <><i className="fas fa-pause mr-2"></i> Pauza</>
            ) : (
                <><i className="fas fa-play mr-2"></i> Start</>
            )}
          </button>
          <button
            onClick={handleReset}
            className="w-32 px-6 py-3 text-lg font-semibold bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-red-500 focus:ring-opacity-50"
          >
           <i className="fas fa-sync-alt mr-2"></i> Reset
          </button>
        </div>
      </div>
       <footer className="mt-8 text-gray-500">
        <p>Stworzone z <i className="fas fa-heart text-red-500"></i> przy użyciu React & Tailwind CSS</p>
      </footer>
    </div>
  );
};

export default App;
