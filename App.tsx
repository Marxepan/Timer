
import React, { useState, useEffect, useRef } from 'react';

const App: React.FC = () => {
  const [time, setTime] = useState(0); // Czas w sekundach
  const [isRunning, setIsRunning] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (isRunning) {
      // Przy uruchamianiu lub wznawianiu, oblicz rzeczywisty czas rozpoczęcia,
      // odejmując już upłynięty czas od bieżącego znacznika czasu.
      const startTime = Date.now() - time * 1000;
      
      intervalRef.current = window.setInterval(() => {
        // Ciągle obliczaj czas, jaki upłynął od rzeczywistego czasu rozpoczęcia.
        const elapsedTime = Date.now() - startTime;
        setTime(Math.floor(elapsedTime / 1000));
      }, 100); // Aktualizuj co 100ms, aby wyświetlacz był bardziej responsywny
    }

    // Funkcja czyszcząca: uruchamia się, gdy isRunning staje się fałszywe lub komponent jest odmontowywany.
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning, time]); // Efekt jest uruchamiany ponownie tylko wtedy, gdy zmienia się stan isRunning

  useEffect(() => {
    const handleOffline = () => setIsOffline(true);
    const handleOnline = () => setIsOffline(false);

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

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

    // Zawsze pokazuj godziny, minuty i sekundy dla spójnego formatu wyświetlania.
    return `${paddedHours}:${paddedMinutes}:${paddedSeconds}`;
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center justify-center font-sans p-4">
      {isOffline && (
        <div 
          className="w-full max-w-md p-3 mb-6 bg-gray-700 text-white text-center rounded-lg shadow-lg flex items-center justify-center"
          role="status"
          aria-live="assertive"
        >
          <i className="fas fa-circle-exclamation mr-3 text-yellow-400" aria-hidden="true"></i>
          <span>Brak połączenia. Aplikacja działa w trybie offline.</span>
        </div>
      )}
      <div className="w-full max-w-md p-8 bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 text-center">
        <h1 className="text-4xl font-bold mb-4 text-cyan-400">Prosty Timer</h1>
        <div className="text-8xl font-mono my-10 bg-gray-900 p-6 rounded-lg tracking-wider" aria-live="polite" aria-atomic="true">
          {formatTime(time)}
        </div>
        <div className="flex justify-center space-x-6">
          <button
            onClick={handleStartPause}
            aria-label={isRunning ? 'Wstrzymaj timer' : 'Uruchom timer'}
            className={`w-32 px-6 py-3 text-lg font-semibold rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-opacity-50 ${
              isRunning 
                ? 'bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-400 text-gray-900' 
                : 'bg-green-500 hover:bg-green-600 focus:ring-green-400 text-white'
            }`}
          >
            {isRunning ? (
                <><i className="fas fa-pause mr-2" aria-hidden="true"></i> Pauza</>
            ) : (
                <><i className="fas fa-play mr-2" aria-hidden="true"></i> Start</>
            )}
          </button>
          <button
            onClick={handleReset}
            aria-label="Zresetuj timer"
            className="w-32 px-6 py-3 text-lg font-semibold bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-red-500 focus:ring-opacity-50"
          >
           <i className="fas fa-sync-alt mr-2" aria-hidden="true"></i> Reset
          </button>
        </div>
      </div>
       <footer className="mt-8 text-gray-500">
        <p>Stworzone z <i className="fas fa-heart text-red-500" aria-label="miłością"></i> przy użyciu React & Tailwind CSS</p>
      </footer>
    </div>
  );
};

export default App;
