import clsx from 'clsx';
import { useMemo } from 'react';

// Finger Mapping
const FINGER_MAP = {
  // --- Left Hand ---
  // Pinky
  '`': 'l-pinky', '~': 'l-pinky',
  '1': 'l-pinky', '!': 'l-pinky',
  'q': 'l-pinky', 'a': 'l-pinky', 'z': 'l-pinky', 
  'tab': 'l-pinky', 'capslock': 'l-pinky', 'shiftleft': 'l-pinky',
  // Ring
  '2': 'l-ring', '@': 'l-ring',
  'w': 'l-ring', 's': 'l-ring', 'x': 'l-ring',
  // Middle
  '3': 'l-middle', '#': 'l-middle',
  'e': 'l-middle', 'd': 'l-middle', 'c': 'l-middle',
  // Index
  '4': 'l-index', '$': 'l-index',
  '5': 'l-index', '%': 'l-index',
  'r': 'l-index', 'f': 'l-index', 'v': 'l-index',
  't': 'l-index', 'g': 'l-index', 'b': 'l-index',
  
  // --- Right Hand ---
  // Index
  '6': 'r-index', '^': 'r-index',
  '7': 'r-index', '&': 'r-index',
  'y': 'r-index', 'h': 'r-index', 'n': 'r-index',
  'u': 'r-index', 'j': 'r-index', 'm': 'r-index',
  // Middle
  '8': 'r-middle', '*': 'r-middle',
  'i': 'r-middle', 'k': 'r-middle', ',': 'r-middle', '<': 'r-middle',
  // Ring
  '9': 'r-ring', '(': 'r-ring',
  'o': 'r-ring', 'l': 'r-ring', '.': 'r-ring', '>': 'r-ring',
  // Pinky
  '0': 'r-pinky', ')': 'r-pinky',
  'p': 'r-pinky', ';': 'r-pinky', ':': 'r-pinky',
  '/': 'r-pinky', '?': 'r-pinky',
  '-': 'r-pinky', '_': 'r-pinky',
  '=': 'r-pinky', '+': 'r-pinky',
  '[': 'r-pinky', '{': 'r-pinky',
  ']': 'r-pinky', '}': 'r-pinky',
  "'": 'r-pinky', '"': 'r-pinky',
  '\\': 'r-pinky', '|': 'r-pinky',
  'enter': 'r-pinky', 'shiftright': 'r-pinky', 'backspace': 'r-pinky',
  
  // Thumbs
  ' ': 'thumbs' // Both or specific? Let's treat as a special case or both thumbs.
};

const Hand = ({ side, activeFinger, className }) => {
  const isLeft = side === 'left';
  
  const getColor = (fingerName) => {
    const isActive = activeFinger === 'thumbs' && fingerName === 'thumb' 
                     || activeFinger === `${side === 'left' ? 'l' : 'r'}-${fingerName}`;
    
    // Active: Bright Blue, Solid Opacity. Inactive: Slate, Low Opacity.
    if (isActive) return "#3b82f6"; // Blue-500
    return "#94a3b8"; // Slate-400
  };

  const getOpacity = (fingerName) => {
     const isActive = activeFinger === 'thumbs' && fingerName === 'thumb' 
                     || activeFinger === `${side === 'left' ? 'l' : 'r'}-${fingerName}`;
     return isActive ? "1" : "0.3"; 
  }

  // Adjusted coordinates for better spread matching standard keyboard layout
  return (
    <svg viewBox="0 0 160 140" className={clsx(className, isLeft ? "" : "transform scale-x-[-1]")}>
       {/* Palm - lowered and centered */}
       <path d="M40 90 Q 80 120 120 90 L 120 130 Q 80 150 40 130 Z" fill="currentColor" className="opacity-20" />
       
       {/* Fingers - Spread out to match ~45px key steps */ }
       {/* Pinky (Key: A/;) - Leftmost */ }
       <rect x="10" y="40" width="20" height="60" rx="10" fill={getColor('pinky')} opacity={getOpacity('pinky')} transform="rotate(-15 20 100)" />
       {/* Ring (Key: S/L) */ }
       <rect x="45" y="25" width="20" height="70" rx="10" fill={getColor('ring')} opacity={getOpacity('ring')} transform="rotate(-5 55 95)" />
       {/* Middle (Key: D/K) */ }
       <rect x="80" y="20" width="20" height="75" rx="10" fill={getColor('middle')} opacity={getOpacity('middle')} />
       {/* Index (Key: F/J) */ }
       <rect x="115" y="25" width="20" height="70" rx="10" fill={getColor('index')} opacity={getOpacity('index')} transform="rotate(5 125 95)" />
       {/* Thumb (Key: Space) */ }
       <ellipse cx="145" cy="110" rx="15" ry="20" fill={getColor('thumb')} opacity={getOpacity('thumb')} transform="rotate(20 145 110)" />
    </svg>
  );
};

const VirtualKeyboard = ({ activeChar, showNumpad = false }) => {
  // ... (rows and memo logic unchanged)
  const rows = [
    [
      { key: '`', shift: '~' }, { key: '1', shift: '!' }, { key: '2', shift: '@' }, { key: '3', shift: '#' }, { key: '4', shift: '$' }, 
      { key: '5', shift: '%' }, { key: '6', shift: '^' }, { key: '7', shift: '&' }, { key: '8', shift: '*' }, { key: '9', shift: '(' }, 
      { key: '0', shift: ')' }, { key: '-', shift: '_' }, { key: '=', shift: '+' }, { key: 'Backspace', width: 'w-20' }
    ],
    [
      { key: 'Tab', width: 'w-16' }, { key: 'q' }, { key: 'w' }, { key: 'e' }, { key: 'r' }, { key: 't' }, { key: 'y' }, { key: 'u' }, 
      { key: 'i' }, { key: 'o' }, { key: 'p' }, { key: '[', shift: '{' }, { key: ']', shift: '}' }, { key: '\\', shift: '|', width: 'w-14' }
    ],
    [
      { key: 'CapsLock', label: 'Caps Lock', width: 'w-20' }, { key: 'a' }, { key: 's' }, { key: 'd' }, { key: 'f' }, { key: 'g' }, 
      { key: 'h' }, { key: 'j' }, { key: 'k' }, { key: 'l' }, { key: ';', shift: ':' }, { key: "'", shift: '"' }, { key: 'Enter', width: 'w-20' }
    ],
    [
      { key: 'ShiftLeft', label: 'Shift', width: 'w-24' }, { key: 'z' }, { key: 'x' }, { key: 'c' }, { key: 'v' }, { key: 'b' }, 
      { key: 'n' }, { key: 'm' }, { key: ',', shift: '<' }, { key: '.', shift: '>' }, { key: '/', shift: '?' }, { key: 'ShiftRight', label: 'Shift', width: 'w-24' }
    ],
    [
      { key: ' ', label: 'Space', width: 'w-ful max-w-xl flex-grow' }
    ]
  ];

  const numpadRows = [
    [
        { key: 'NumLock', width: 'w-10 text-[10px]' }, { key: '/', label: '/' }, { key: '*', label: '*' }, { key: '-', label: '-' }
    ],
    [
        { key: '7' }, { key: '8' }, { key: '9' }, { key: '+', height: 'h-24', label: '+' } // + spans 2 rows
    ],
    [
        { key: '4' }, { key: '5' }, { key: '6' }
        // + continues here
    ],
    [
        { key: '1' }, { key: '2' }, { key: '3' }, { key: 'Enter', height: 'h-24', label: 'E' } // Enter spans 2 rows
    ],
    [
        { key: '0', width: 'w-[4.6rem]' }, { key: '.' } // 0 spans 2 cols
        // Enter continues here
    ]
  ];

  const activeFinger = useMemo(() => {
    if (!activeChar) return null;
    const char = activeChar.toLowerCase();
    return FINGER_MAP[char];
  }, [activeChar]);

  const isKeyActive = (keyObj) => {
      const char = activeChar;
      if (!char) return false;
      
      const k = keyObj.key.toLowerCase();
      const lowerChar = char.toLowerCase();
      
      // Direct key match for the character itself (e.g. 'q' matches 'q' key)
      if (k === lowerChar) return true;
      
      // Shift match (e.g. '!' matched with '1') 
      if (keyObj.shift === char) return true;

      // Logic for Shift Keys
      if (keyObj.key === 'ShiftLeft' || keyObj.key === 'ShiftRight') {
          // Check if shift is needed
          const isShiftNeeded = /[A-Z]/.test(char) || '~!@#$%^&*()_+{}|:"<>?'.includes(char);
          
          if (!isShiftNeeded) return false;

          // Determine finger handling the character
          const finger = FINGER_MAP[char] || FINGER_MAP[lowerChar];
          
          if (finger) {
              const isLeftHand = finger.startsWith('l-');
              
              if (isLeftHand) {
                  // Left hand typing character -> Opposite hand (Right Shift) needed
                  return keyObj.key === 'ShiftRight';
              } else {
                  // Right hand typing character -> Opposite hand (Left Shift) needed
                  return keyObj.key === 'ShiftLeft';
              }
          }
           
          // Fallback: If we don't know the hand, highlight both to be safe
          return true; 
      }
      return false;
  };

  return (
    <div className="flex flex-col items-center gap-6 mt-8">
      {/* Container for Main Board + Numpad */}
      <div className="flex gap-4">
          {/* Main Keyboard */}
          <div className="relative w-full max-w-4xl p-4 bg-slate-800 rounded-xl shadow-lg select-none overflow-hidden h-[340px]">
            {/* Hands Overlay */}
            <div className="absolute inset-x-0 bottom-[-20px] top-[60px] flex justify-between px-[6%] pointer-events-none z-20">
                <Hand side="left" activeFinger={activeFinger} className="w-[42%] h-full text-slate-400" />
                <Hand side="right" activeFinger={activeFinger} className="w-[42%] h-full text-slate-400" />
            </div>

            {/* Keys */}
            <div className="flex flex-col gap-2 relative z-10">
              {rows.map((row, rowIndex) => (
                <div key={rowIndex} className="flex justify-center gap-1.5">
                  {row.map((keyObj, keyIndex) => {
                    const isActive = isKeyActive(keyObj);
                    const fingerColor = 'bg-slate-700/80 hover:bg-slate-600/80 border-slate-900'; 
                    
                    return (
                      <div
                        key={keyIndex}
                        className={clsx(
                          "flex items-center justify-center rounded transition-colors duration-150 font-medium text-slate-200 text-sm shadow-sm backdrop-blur-sm",
                          keyObj.width || "w-10",
                          "h-10",
                          isActive 
                              ? "bg-blue-500 text-white transform translate-y-0.5 shadow-none ring-2 ring-blue-400" 
                              : `${fingerColor} border-b-4`
                        )}
                      >
                        <div className="flex flex-col items-center">
                          {keyObj.shift && <span className="text-[10px] opacity-60 leading-none mb-0.5">{keyObj.shift}</span>}
                          <span className={clsx(keyObj.shift && "leading-none")}>{keyObj.label || keyObj.key.toUpperCase()}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Numpad Section */}
          {showNumpad && (
            <div className="p-4 bg-slate-800 rounded-xl shadow-lg select-none h-[340px] w-[200px] relative">
               <div className="grid grid-cols-4 gap-1.5 absolute top-4 left-4 right-4 bottom-4">
                   {/* Row 1 */}
                   {numpadRows[0].map((k,i) => <div key={'r1'+i} className={clsx("h-10 flex items-center justify-center rounded bg-slate-700/80 border-b-4 border-slate-900 text-slate-200 text-sm", k.width, isKeyActive(k) && "!bg-blue-500 !border-none translate-y-0.5")}>{k.label||k.key}</div>)}
                   
                   {/* Row 2 */}
                   {numpadRows[1].slice(0,3).map((k,i) => <div key={'r2'+i} className={clsx("h-10 flex items-center justify-center rounded bg-slate-700/80 border-b-4 border-slate-900 text-slate-200", isKeyActive(k) && "!bg-blue-500 !border-none translate-y-0.5")}>{k.key}</div>)}
                   <div className={clsx("row-span-2 h-full flex items-center justify-center rounded bg-slate-700/80 border-b-4 border-slate-900 text-slate-200", isKeyActive(numpadRows[1][3]) && "!bg-blue-500 !border-none translate-y-0.5")}>+</div>

                   {/* Row 3 */}
                   {numpadRows[2].map((k,i) => <div key={'r3'+i} className={clsx("h-10 flex items-center justify-center rounded bg-slate-700/80 border-b-4 border-slate-900 text-slate-200", isKeyActive(k) && "!bg-blue-500 !border-none translate-y-0.5")}>{k.key}</div>)}

                   {/* Row 4 */}
                   {numpadRows[3].slice(0,3).map((k,i) => <div key={'r4'+i} className={clsx("h-10 flex items-center justify-center rounded bg-slate-700/80 border-b-4 border-slate-900 text-slate-200", isKeyActive(k) && "!bg-blue-500 !border-none translate-y-0.5")}>{k.key}</div>)}
                   <div className={clsx("row-span-2 h-full flex items-center justify-center rounded bg-slate-700/80 border-b-4 border-slate-900 text-slate-200", isKeyActive(numpadRows[3][3]) && "!bg-blue-500 !border-none translate-y-0.5")}>Ent</div>

                   {/* Row 5 */}
                   <div className={clsx("col-span-2 h-10 flex items-center justify-center rounded bg-slate-700/80 border-b-4 border-slate-900 text-slate-200", isKeyActive(numpadRows[4][0]) && "!bg-blue-500 !border-none translate-y-0.5")}>0</div>
                   <div className={clsx("h-10 flex items-center justify-center rounded bg-slate-700/80 border-b-4 border-slate-900 text-slate-200", isKeyActive(numpadRows[4][1]) && "!bg-blue-500 !border-none translate-y-0.5")}>.</div>
               </div>
            </div>
          )}
      </div>
    </div>
  );
};

export default VirtualKeyboard;
