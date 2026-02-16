const fs = require('fs');
const path = require('path');

const outputDir = path.join(__dirname, '../client/public/images/lessons');

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// Colors
const BG = '#1e293b'; // Slate 800
const KEY_BG = '#334155'; // Slate 700
const KEY_HIGHLIGHT = '#3b82f6'; // Blue 500
const KEY_HIGHLIGHT_SECONDARY = '#8b5cf6'; // Violet 500 (for alternate)
const TEXT = '#e2e8f0'; // Slate 200

const createKeyboardSVG = (highlightRowIndex, title, special = null) => {
    // Simple 4-row layout approximation
    // Row 0: Numbers
    // Row 1: Top (QWERTY)
    // Row 2: Home (ASDF)
    // Row 3: Bottom (ZXCV)
    
    // Numpad is special case
    
    let rects = '';
    const rows = [10, 10, 9, 7]; // key counts approx
    const startY = 60;
    const gap = 10;
    const keySize = 40;
    
    for (let r = 0; r < 4; r++) {
        const count = rows[r];
        const y = startY + r * (keySize + gap);
        const startX = 50 + (r * 15); // Stagger
        
        for (let k = 0; k < count; k++) {
            let fill = KEY_BG;
            
            // Logic for highlighting
            if (special === 'numpad') {
                 // Dim main keyboard
                 fill = '#0f172a';
            } else if (special === 'symbols') {
                 if (r === 0 && (k === 0 || k > 8)) fill = KEY_HIGHLIGHT_SECONDARY; // Symbols
            } else if (special === 'master') {
                 fill = KEY_HIGHLIGHT; // All
            } else {
                 if (r === highlightRowIndex) fill = KEY_HIGHLIGHT;
            }

            const x = startX + k * (keySize + gap);
            rects += `<rect x="${x}" y="${y}" width="${keySize}" height="${keySize}" rx="4" fill="${fill}" />`;
        }
    }
    
    // Numpad render if needed
    if (special === 'numpad') {
       const nx = 600;
       const ny = 60;
       for(let r=0; r<4; r++) {
           for(let k=0; k<3; k++) {
               rects += `<rect x="${nx + k*(keySize+gap)}" y="${ny + r*(keySize+gap)}" width="${keySize}" height="${keySize}" rx="4" fill="${KEY_HIGHLIGHT}" />`;           
           }
       }
    }

    return `<svg width="800" height="400" viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg">
      <rect width="800" height="400" fill="${BG}" />
      <g opacity="0.8">
        ${rects}
      </g>
      <text x="400" y="350" font-family="Arial, sans-serif" font-size="24" fill="${TEXT}" text-anchor="middle" font-weight="bold">${title.toUpperCase()}</text>
    </svg>`;
};

const images = [
    { file: 'lesson_home.svg', row: 2, title: 'Home Row Basics' },
    { file: 'lesson_top.svg', row: 1, title: 'Top Row Basics' },
    { file: 'lesson_bottom.svg', row: 3, title: 'Bottom Row Basics' },
    { file: 'lesson_number.svg', row: 0, title: 'Number Row Basics' },
    { file: 'lesson_numpad.svg', row: -1, title: 'Numpad Data Entry', special: 'numpad' },
    { file: 'lesson_symbols.svg', row: 0, title: 'Advanced Symbols', special: 'symbols' }, // Highlight number row for symbols roughly
    { file: 'lesson_master.svg', row: -1, title: 'Master All Keys', special: 'master' },
];

images.forEach(img => {
    const svg = createKeyboardSVG(img.row, img.title, img.special);
    fs.writeFileSync(path.join(outputDir, img.file), svg);
    console.log(`Generated ${img.file}`);
});
