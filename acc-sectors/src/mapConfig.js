export const controllerList = [
    'A', 'B', 'C', 'D', 'E',
    'F', 'G', 'H', 'J', 'K',
    'L', 'M', 'N', 'V'
];

export const sectorsOwnership = {
    sector1: ['A', 'D', 'C'],                         // SECT A
    sector2: ['B', 'C', 'D'],                         // SECT B
    sector3: ['C', 'D'],                              // SECT C
    sector4: ['D', 'C'],                              // SECT D
    sector5: ['E', 'F', 'D', 'C'],                    // SECT E
    sector6: ['F', 'D', 'C'],                         // SECT F
    sector7: ['G', 'F', 'D', 'C'],                    // SECT G
    sector8: ['H', 'V', 'M', 'G', 'F', 'D'],          // SECT H
    sector9: ['J', 'H', 'V', 'M', 'G', 'F', 'D'],     // SECT J
    sector10: ['K', 'M', 'A', 'G', 'F','D', 'C'],     // SECT K
    sector11: ['L', 'N', 'M', 'A', 'G', 'F', 'D', 'C'], // SECT L
    sector12: ['M', 'A', 'G', 'F', 'D', 'C'],         // SECT M
    sector13: ['N', 'M', 'A', 'G', 'F', 'D', 'C'],    // SECT N
    sector14: ['V', 'M', 'G', 'F', 'D', 'C']          // SECT V
};

export const presets = [
    { name: 'D+F', controllers: ['D', 'F'] },
    { name: 'D+G', controllers: ['D', 'G'] },
    { name: 'D+M', controllers: ['D', 'M'] },
    { name: 'D+V', controllers: ['D', 'V'] },
    { name: 'D+F+V', controllers: ['D', 'F', 'V'] },
    { name: 'D+G+V', controllers: ['D', 'G', 'V'] },
    { name: 'D+M+V', controllers: ['D', 'M', 'V'] },
    { name: 'D+F+M', controllers: ['D', 'F', 'M'] },
    { name: 'D+F+M+V', controllers: ['D', 'F', 'M', 'V'] },
    { name: 'SANTA', controllers: ['D', 'A', 'V', 'J'] },
];

// Dark-themed colors for controllers
export const controllerColors = {
    'A': '#FF006E',  // Bright blue
    'B': '#3A86FF',  // Vibrant pink
    'C': '#FFBE0B',  // Golden yellow
    'D': '#00BBF9',  // Sky blue
    'E': '#FB5607',  // Orange
    'F': '#38B000',  // Green
    'G': '#8338EC',  // Purple
    'H': '#9B5DE5',  // Light purple
    'J': '#F15BB5',  // Pink
    'K': '#FEE440',  // Lemon yellow
    'L': '#00F5D4',  // Teal
    'M': '#E36414',  // Rust orange
    'N': '#0A9396',  // Deep teal
    'V': '#9B2226'   // Deep red
};