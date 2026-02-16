import { useState, useEffect, useRef, useCallback } from 'react';
import { Timer, AlertCircle, RefreshCw, Save, Settings, Target } from 'lucide-react';
import clsx from 'clsx';
import VirtualKeyboard from './VirtualKeyboard';
import api from '../utils/api';

const TypingArea = ({ content, duration, mode = 'practice', onComplete, lessonId, examId, title }) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isActive, setIsActive] = useState(false);
  const [testContent, setTestContent] = useState(content);
  
  const [typedChars, setTypedChars] = useState('');
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [mistakes, setMistakes] = useState(0);
  const [backspaces, setBackspaces] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [missedKeys, setMissedKeys] = useState({});
  
  // Settings
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState({ strictMode: false, blindMode: false });
  
  const inputRef = useRef(null);
  const scrollRef = useRef(null);
  const activeCharRef = useRef(null);
  
  const totalChars = testContent.length;

  // Reset on content change
  useEffect(() => {
    setTestContent(content);
    setTypedChars('');
    setMistakes(0);
    setBackspaces(0);
    setStartTime(null);
    setIsActive(false);
    setTimeLeft(duration);
    setWpm(0);
    setAccuracy(100);
    setMissedKeys({});
  }, [content, duration]);

  // Auto-scroll to active character
  useEffect(() => {
    if (activeCharRef.current && scrollRef.current) {
        const container = scrollRef.current;
        const activeEl = activeCharRef.current;
        
        // Simple scroll into view logic
        const containerRect = container.getBoundingClientRect();
        const activeRect = activeEl.getBoundingClientRect();
        
        if (activeRect.bottom > containerRect.bottom - 20 || activeRect.top < containerRect.top + 20) {
             activeEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
  }, [typedChars]);

  // Calculate stats
  const calculateStats = useCallback(() => {
    if (!startTime) return;
    
    const now = Date.now();
    const timeElapsedMs = now - startTime;
    const minutes = timeElapsedMs / 60000;
    
    // Avoid WPM spike at start (wait 2 seconds or reasonable char count)
    if (minutes < 0.03) { // < ~2 seconds
        return; 
    }

    const words = typedChars.length / 5;
    
    // Gross WPM
    const grossWpm = minutes > 0 ? (words / minutes) : 0;
    
    setWpm(Math.round(grossWpm));
    
    const accuracyVal = typedChars.length > 0 
      ? ((typedChars.length - mistakes) / typedChars.length) * 100 
      : 100;
    setAccuracy(Math.max(0, Math.round(accuracyVal)));
  }, [typedChars, startTime, mistakes]);

  // Timer effect
  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        // Recalculate time left based on start time to avoid drift
        if (startTime) {
             const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
             const newTimeLeft = Math.max(0, duration - elapsedSeconds);
             setTimeLeft(newTimeLeft);
             if (newTimeLeft === 0) {
                 finishTest();
             }
        }
        calculateStats();
      }, 500); // 500ms update for smoother stats
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, calculateStats, startTime, duration]);

  const startTest = () => {
    if (!isActive) {
      setIsActive(true);
      setStartTime(Date.now());
      if (inputRef.current) inputRef.current.focus();
    }
  };

  const finishTest = async () => {
    // Prevent multiple calls
    if (!isActive) return;

    setIsActive(false);
    calculateStats(); // Final stats
    
    const results = {
      wpm,
      accuracy,
      mistakes,
      backspaces,
      duration: duration - timeLeft,
      mode,
      lesson_id: lessonId,
      exam_id: examId,
      // user_id handled by backend from token or we send it? Backend uses token usually but schema has user_id. 
      // We will send user_id from context if needed or let backend extract from token. 
      // Let's assume backend extracts from token for security, but our current backend might expect it.
      // Wait, backend 'Result.create(req.body)' takes body. We should probably send user_id from frontend context if backend doesn't extract it. 
      // Safe bet: send it.
       user_id: JSON.parse(localStorage.getItem('user'))?.userId,
       missed_keys: missedKeys
    };

    try {
      await api.post('/results', results);
      if (onComplete) onComplete(results);
    } catch (error) {
      console.error('Failed to save results', error);
    }
  };

  const handleKeyDown = (e) => {
    if (!isActive && timeLeft > 0) startTest();
    
    if (timeLeft === 0) return;

    if (e.key === 'Backspace') {
      if (typedChars.length > 0) {
        setTypedChars(prev => prev.slice(0, -1));
        setBackspaces(prev => prev + 1);
      }
      return;
    }



  // ... (inside handleKeyDown) ...
    if (e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) {
      const char = e.key;
      const index = typedChars.length;
      
      if (index < totalChars) {
        setTypedChars(prev => prev + char);
        if (char !== testContent[index]) {
          if (settings.strictMode) {
             setIsActive(false);
             alert('Strict Mode Failed! You made a mistake.');
             return;
          }

          setMistakes(prev => prev + 1);
          // Track missed key (the expected char)
          const expectedChar = testContent[index];
          setMissedKeys(prev => ({
            ...prev,
            [expectedChar]: (prev[expectedChar] || 0) + 1
          }));
        }
        
        // Auto-finish or Continue check if end of content
        if (index + 1 === totalChars) {
            // Check Performance Gating
            // Targets: 25 WPM, 97% Accuracy.
            // If mode is 'exam', maybe strict rules always apply? But user specifically asked for "The lesson".
            
           // Calculate final stats for this check
           // (State might lag slightly, so we recalculate locally)
           const timeElapsedMs = Date.now() - startTime;
           const minutes = timeElapsedMs / 60000;
           const words = (index + 1) / 5;
           const currentWpm = Math.round(words / minutes);
           const currentAcc = Math.round((((index + 1) - mistakes) / (index + 1)) * 100);
           
           if (currentWpm >= 25 && currentAcc >= 97) {
                // Success!
                setTimeout(finishTest, 100);
           } else {
               // Fail - Add more lines
               console.log(`Gating Check Failed: WPM ${currentWpm} (Target 25), Acc ${currentAcc}% (Target 97%)`);
               // Append content
               setTestContent(prev => prev + " " + content);
           }
        }
      }
    }
  };

  // Prevent copy paste
  const handlePaste = (e) => {
    e.preventDefault();
    alert("Copy-paste is disabled!");
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg" onPaste={handlePaste}>
      {/* Header Stats */}
      <div className="flex justify-between items-center mb-6 p-4 bg-slate-50 rounded-lg">
        <div className="flex items-center space-x-6">
          <div className="text-center">
            <div className="text-xs text-slate-500 uppercase font-bold">Time Left</div>
            <div className={`text-3xl font-mono font-bold ${timeLeft < 10 ? 'text-red-500' : 'text-slate-700'}`}>
              {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-slate-500 uppercase font-bold">WPM</div>
            <div className={`text-3xl font-mono font-bold ${wpm < 25 ? 'text-amber-500' : 'text-blue-600'}`}>{wpm}</div>
          </div>
          <div className="text-center">
             <div className="text-xs text-slate-500 uppercase font-bold">Accuracy</div>
             <div className={`text-3xl font-mono font-bold ${accuracy < 97 ? 'text-amber-500' : 'text-green-600'}`}>{accuracy}%</div>
          </div>
           {/* Gating Info */}
           <div className="hidden md:block h-8 w-px bg-slate-300 mx-2"></div>
           <div className="hidden md:flex flex-col text-xs text-slate-400">
              <span className="flex items-center gap-1"><Target className="w-3 h-3" /> Target:</span>
              <span>25 WPM | 97% Acc</span>
           </div>
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 text-slate-400 hover:text-slate-600 transition relative"
            title="Settings"
          >
            <Settings className="w-5 h-5" />
            {showSettings && (
               <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-xl border border-slate-100 p-4 z-10 text-left">
                  <h4 className="font-bold text-slate-700 mb-2">Settings</h4>
                  <div className="space-y-2">
                     <label className="flex items-center space-x-2 cursor-pointer">
                        <input 
                           type="checkbox" 
                           checked={settings.strictMode}
                           onChange={e => setSettings({...settings, strictMode: e.target.checked})}
                           className="rounded text-blue-600"
                        />
                        <span className="text-sm text-slate-600">Strict Mode</span>
                     </label>
                     <label className="flex items-center space-x-2 cursor-pointer">
                        <input 
                           type="checkbox" 
                           checked={settings.blindMode}
                           onChange={e => setSettings({...settings, blindMode: e.target.checked})}
                           className="rounded text-blue-600"
                        />
                        <span className="text-sm text-slate-600">Blind Mode</span>
                     </label>
                  </div>
               </div>
            )}
          </button>
          <button 
           onClick={() => window.location.reload()} 
           className="p-2 text-slate-400 hover:text-slate-600 transition"
           title="Restart"
         >
           <RefreshCw className="w-5 h-5" />
         </button>
        </div>
      </div>

      {/* Typing Display */}
      <div 
        ref={scrollRef}
        className="relative min-h-[200px] max-h-[300px] overflow-y-auto text-lg leading-relaxed font-mono tracking-wide p-6 border-2 border-slate-200 rounded-lg focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100 transition cursor-text select-none scroll-smooth"
        onClick={() => inputRef.current && inputRef.current.focus()}
      >
        <div className="pointer-events-none">
          {testContent.split('').map((char, i) => {
            let colorClass = 'text-slate-400';
            let bgClass = '';
            let isCurrent = (i === typedChars.length);
            
            if (i < typedChars.length) {
              const typesChar = typedChars[i];
              
              if (settings.blindMode) {
                 colorClass = 'text-slate-600'; // Neutral color for typed
              } else {
                  if (typesChar === char) {
                    colorClass = 'text-slate-800'; // Correct
                  } else {
                    colorClass = 'text-red-500'; // Incorrect text color
                    bgClass = 'bg-red-100'; // Incorrect bg
                  }
              }
            } else if (isCurrent) {
              bgClass = 'bg-blue-200 animate-pulse'; // Cursor
            }

            return (
              <span 
                  key={i} 
                  ref={isCurrent ? activeCharRef : null}
                  className={clsx(colorClass, bgClass, 'rounded-[2px]')}
              >
                  {char}
              </span>
            );
          })}
        </div>

        {/* Hidden Input */}
        <input
          ref={inputRef}
          type="text"
          className="absolute opacity-0 top-0 left-0 h-full w-full cursor-default"
          value={typedChars}
          onChange={() => {}} // Handled by keyDown
          onKeyDown={handleKeyDown}
          autoFocus
          autoComplete="off"
        />
      </div>

      {/* Results Overlay (if finished) */}
      {!isActive && timeLeft === 0 && (
         <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded text-center">
            <h3 className="text-xl font-bold text-green-800 mb-2">Test Completed!</h3>
            <p>Your results have been saved.</p>
         </div>
      )}
      <VirtualKeyboard 
        activeChar={testContent[typedChars.length]} 
        showNumpad={title && (title.toLowerCase().includes('numpad') || title.toLowerCase().includes('master'))} 
      />
    </div>
  );
};

export default TypingArea;
