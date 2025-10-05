import React, { useState, useEffect, useCallback, useMemo } from 'react';

// --- Helper Functions ---
const formatDateKey = (date: Date): string => {
  return date.toISOString().split('T')[0]; // YYYY-MM-DD
};

const SobrietyCounter: React.FC<{ startDate: Date }> = ({ startDate }) => {
  const [timeClean, setTimeClean] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = new Date();
      const diff = now.getTime() - startDate.getTime();

      if (diff >= 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeClean({ days, hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [startDate]);

  return (
    <div className="my-8 text-center">
      <h2 className="text-2xl text-green-300 mb-4">Jesteś czysty/a od:</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-white">
        {Object.entries(timeClean).map(([unit, value]) => (
          <div key={unit} className="bg-gray-800 p-4 rounded-lg shadow-lg">
            <div className="text-5xl font-mono tracking-tighter">{String(value).padStart(2, '0')}</div>
            <div className="text-sm uppercase text-green-400">{unit}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Calendar: React.FC<{
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  notes: Record<string, string[]>;
  sobrietyStartDate: Date;
}> = ({ currentDate, setCurrentDate, selectedDate, setSelectedDate, notes, sobrietyStartDate }) => {
  const monthNames = ["Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec", "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"];
  const daysOfWeek = ["Pn", "Wt", "Śr", "Cz", "Pt", "So", "Nd"];

  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const adjustedFirstDay = (firstDayOfMonth === 0) ? 6 : firstDayOfMonth - 1; // Adjust to Monday start
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();

  const handlePrevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  
  const today = new Date();

  return (
    <div className="bg-gray-800 p-6 rounded-2xl shadow-lg w-full">
      <div className="flex justify-between items-center mb-4">
        <button onClick={handlePrevMonth} className="text-green-400 hover:text-green-300" aria-label="Poprzedni miesiąc"><i className="fas fa-chevron-left"></i></button>
        <h3 className="text-xl font-semibold text-white">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h3>
        <button onClick={handleNextMonth} className="text-green-400 hover:text-green-300" aria-label="Następny miesiąc"><i className="fas fa-chevron-right"></i></button>
      </div>
      <div className="grid grid-cols-7 gap-2 text-center text-gray-400 text-sm mb-2">
        {daysOfWeek.map(day => <div key={day}>{day}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: adjustedFirstDay }).map((_, i) => <div key={`empty-${i}`} />)}
        {Array.from({ length: daysInMonth }).map((_, day) => {
          const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day + 1);
          const dateKey = formatDateKey(date);
          const isToday = formatDateKey(today) === dateKey;
          const isSelected = formatDateKey(selectedDate) === dateKey;
          const hasNote = notes[dateKey]?.length > 0;
          const isStartDate = formatDateKey(sobrietyStartDate) === dateKey;

          let classes = "w-10 h-10 flex items-center justify-center rounded-full cursor-pointer transition-colors duration-200 relative";
          if (isSelected) classes += " bg-green-500 text-white font-bold";
          else if (isToday) classes += " border-2 border-green-400 text-white";
          else classes += " hover:bg-gray-700 text-gray-200";

          return (
            <div key={day} className={classes} onClick={() => setSelectedDate(date)} role="button" tabIndex={0}>
              <span>{day + 1}</span>
              {hasNote && <div className="absolute bottom-1 h-1.5 w-1.5 bg-cyan-400 rounded-full"></div>}
              {isStartDate && <i className="fas fa-star text-yellow-400 absolute top-0 right-0 text-xs"></i>}
            </div>
          );
        })}
      </div>
    </div>
  );
};


const Notes: React.FC<{
    selectedDate: Date;
    notes: string[];
    addNote: (note: string) => void;
}> = ({ selectedDate, notes, addNote }) => {
    const [newNote, setNewNote] = useState("");
    const dateDisplay = useMemo(() => new Intl.DateTimeFormat('pl-PL', { dateStyle: 'full' }).format(selectedDate), [selectedDate]);

    const handleAddNote = () => {
        if (newNote.trim()) {
            addNote(newNote.trim());
            setNewNote("");
        }
    };

    return (
        <div className="bg-gray-800 p-6 rounded-2xl shadow-lg flex flex-col h-full w-full">
            <h3 className="text-xl font-semibold text-white mb-4">Notatki na dzień: <span className="text-green-400">{dateDisplay}</span></h3>
            <div className="flex-grow space-y-2 overflow-y-auto pr-2 mb-4">
                {notes.length > 0 ? (
                    notes.map((note, i) => (
                        <div key={i} className="bg-gray-700 p-3 rounded-lg text-gray-200 text-sm">{note}</div>
                    ))
                ) : (
                    <p className="text-gray-400 italic">Brak notatek na ten dzień.</p>
                )}
            </div>
            <div className="mt-auto">
                <textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    className="w-full h-24 p-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Twoje myśli..."
                    aria-label="Nowa notatka"
                ></textarea>
                <button
                    onClick={handleAddNote}
                    className="w-full mt-2 px-4 py-2 text-lg font-semibold bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50"
                    aria-label="Dodaj notatkę"
                >
                    <i className="fas fa-plus mr-2"></i> Dodaj Notatkę
                </button>
            </div>
        </div>
    );
};


const App: React.FC = () => {
  const [sobrietyStartDate, setSobrietyStartDate] = useState<Date | null>(() => {
    const savedDate = localStorage.getItem('sobriety_start_date');
    return savedDate ? new Date(savedDate) : null;
  });
  
  const [notes, setNotes] = useState<Record<string, string[]>>(() => {
    const savedNotes = localStorage.getItem('sobriety_notes');
    return savedNotes ? JSON.parse(savedNotes) : {};
  });

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [calendarCurrentDate, setCalendarCurrentDate] = useState(new Date());
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    if (sobrietyStartDate) {
      localStorage.setItem('sobriety_start_date', sobrietyStartDate.toISOString());
    }
  }, [sobrietyStartDate]);

  useEffect(() => {
    localStorage.setItem('sobriety_notes', JSON.stringify(notes));
  }, [notes]);

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

  const handleSetStartDate = (dateString: string) => {
    if (dateString) {
      const date = new Date(dateString);
      date.setHours(0, 0, 0, 0); // Set to start of the day
      setSobrietyStartDate(date);
    }
  };

  const addNoteForSelectedDate = useCallback((note: string) => {
    const dateKey = formatDateKey(selectedDate);
    const updatedNotes = { ...notes };
    if (!updatedNotes[dateKey]) {
      updatedNotes[dateKey] = [];
    }
    updatedNotes[dateKey].push(note);
    setNotes(updatedNotes);
  }, [notes, selectedDate]);


  if (!sobrietyStartDate) {
    return (
      <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md p-8 bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 text-center">
            <i className="fas fa-leaf text-5xl text-green-400 mb-4"></i>
            <h1 className="text-3xl font-bold mb-2 text-white">Witaj na Drodze do Czystości</h1>
            <p className="text-gray-400 mb-6">Zacznij swoją podróż. Wybierz datę, od której jesteś czysty/a.</p>
            <input
                type="date"
                onChange={(e) => handleSetStartDate(e.target.value)}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white mb-6 text-center"
                aria-label="Wybierz datę startową"
            />
            <p className="text-xs text-gray-500">Twoje dane są zapisywane tylko na Twoim urządzeniu.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center font-sans p-4 sm:p-6">
       {isOffline && (
        <div className="w-full max-w-4xl p-3 mb-4 bg-gray-700 text-white text-center rounded-lg shadow-lg flex items-center justify-center" role="status" aria-live="assertive">
          <i className="fas fa-circle-exclamation mr-3 text-yellow-400" aria-hidden="true"></i>
          <span>Brak połączenia. Aplikacja działa w trybie offline.</span>
        </div>
      )}
      <div className="w-full max-w-6xl">
        <header className="text-center mb-6">
            <h1 className="text-4xl font-bold text-green-400">Droga do Czystości</h1>
        </header>
        
        <main>
          <SobrietyCounter startDate={sobrietyStartDate} />
          
          <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Calendar 
              currentDate={calendarCurrentDate}
              setCurrentDate={setCalendarCurrentDate}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              notes={notes}
              sobrietyStartDate={sobrietyStartDate}
            />
            <Notes 
              selectedDate={selectedDate}
              notes={notes[formatDateKey(selectedDate)] || []}
              addNote={addNoteForSelectedDate}
            />
          </div>
        </main>
        
        <footer className="mt-12 text-center text-gray-500">
            <p>Stworzone z <i className="fas fa-heart text-green-500" aria-label="nadzieją"></i>. Jesteś silny/a.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;