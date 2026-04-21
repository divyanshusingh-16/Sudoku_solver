// --- State Variables ---
let moveHistory = [];
let animationInterval = null;
let currentStep = 0;
let backtrackCount = 0;
let workingGrid = [];

// Default puzzle (0 means empty)
const defaultGrid = [
    [5, 3, 0, 0, 7, 0, 0, 0, 0], [6, 0, 0, 1, 9, 5, 0, 0, 0], [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3], [4, 0, 0, 8, 0, 3, 0, 0, 1], [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0], [0, 0, 0, 4, 1, 9, 0, 0, 5], [0, 0, 0, 0, 8, 0, 0, 7, 9]
];

// --- Initialization ---
function init() {
    document.getElementById('btn-direct').addEventListener('click', directSolve);
    document.getElementById('btn-play').addEventListener('click', playAnimation);
    document.getElementById('btn-pause').addEventListener('click', pauseAnimation);
    document.getElementById('btn-step').addEventListener('click', () => applyNextMove());
    document.getElementById('btn-clear').addEventListener('click', () => buildBoard(true));
    document.getElementById('btn-reset').addEventListener('click', () => buildBoard(false));
    
    buildBoard(false); // Build default board on load
}

// --- DOM Functions ---

// Creates the 81 input boxes. If 'clear' is true, it makes a completely empty board.
function buildBoard(clear = false) {
    pauseAnimation();
    const container = document.getElementById('board-container');
    container.innerHTML = '';
    const board = document.createElement('div');
    board.className = 'sudoku-board';

    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            const cell = document.createElement('input');
            cell.type = 'text';
            cell.maxLength = 1;
            cell.className = 'sudoku-cell';
            cell.id = `cell-${row}-${col}`;
            
            if (row === 2 || row === 5) cell.classList.add('border-bottom');

            let val = clear ? 0 : defaultGrid[row][col];
            if (val !== 0) {
                cell.value = val;
                cell.classList.add('cell-fixed');
            }

            // Only allow typing numbers 1-9
            cell.oninput = (e) => {
                e.target.value = e.target.value.replace(/[^1-9]/g, '');
                e.target.classList.remove('cell-fixed', 'cell-placed', 'cell-removed'); 
            };
            board.appendChild(cell);
        }
    }
    container.appendChild(board);
    document.getElementById('backtrack-count').textContent = 0;
}

// Reads what the user currently has typed on the screen into our JS Array
function readBoardFromUI() {
    workingGrid = Array(9).fill(0).map(() => Array(9).fill(0));
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            let val = document.getElementById(`cell-${row}-${col}`).value;
            workingGrid[row][col] = val ? parseInt(val) : 0;
        }
    }
}

// --- Solving Logic ---

// 1. DIRECT SOLVE (No Animation)
function directSolve() {
    pauseAnimation();
    readBoardFromUI();
    if (solveSudoku(true)) { // Pass true to skip recording history
        // Instantly write the solved array back to the screen
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                let cell = document.getElementById(`cell-${row}-${col}`);
                if (!cell.value) {
                    cell.value = workingGrid[row][col];
                    cell.classList.add('cell-placed');
                }
            }
        }
    } else {
        alert("No valid solution exists for this board!");
    }
}

// 2. PLAY ANIMATION
function playAnimation() {
    document.getElementById('btn-play').disabled = true;
    document.getElementById('btn-pause').disabled = false;
    
    // Only calculate history if we are starting from the beginning
    if (currentStep === 0 || moveHistory.length === 0) {
        readBoardFromUI();
        moveHistory = [];
        backtrackCount = 0;
        document.getElementById('backtrack-count').textContent = 0;
        solveSudoku(false); // false means RECORD history
    }

    const delay = 1010 - document.getElementById('speed-slider').value; 
    animationInterval = setInterval(() => {
        applyNextMove();
        if (currentStep >= moveHistory.length) pauseAnimation();
    }, delay);
}

function pauseAnimation() {
    clearInterval(animationInterval);
    document.getElementById('btn-play').disabled = false;
    document.getElementById('btn-pause').disabled = true;
}

function applyNextMove() {
    if (currentStep >= moveHistory.length) return;
    
    const move = moveHistory[currentStep];
    const cell = document.getElementById(`cell-${move.row}-${move.col}`);
    
    document.querySelectorAll('.cell-current').forEach(el => el.classList.remove('cell-current'));
    
    if (move.type === 'try') {
        cell.classList.add('cell-current');
        cell.value = move.value;
    } else if (move.type === 'place') {
        cell.className = 'sudoku-cell cell-placed';
        if (move.row === 2 || move.row === 5) cell.classList.add('border-bottom');
        cell.value = move.value;
    } else if (move.type === 'remove') {
        cell.className = 'sudoku-cell cell-removed';
        if (move.row === 2 || move.row === 5) cell.classList.add('border-bottom');
        cell.value = '';
        backtrackCount++;
        document.getElementById('backtrack-count').textContent = backtrackCount;
    }
    currentStep++;
}

// --- The Brain: Backtracking Algorithm ---

function isSafe(row, col, num) {
    let startRow = row - (row % 3);
    let startCol = col - (col % 3);
    
    for (let i = 0; i < 9; i++) {
        // Check row, column, and 3x3 box simultaneously
        if (workingGrid[row][i] === num) return false;
        if (workingGrid[i][col] === num) return false;
        if (workingGrid[startRow + Math.floor(i / 3)][startCol + (i % 3)] === num) return false;
    }
    return true; 
}

// If instant = true, we solve silently. If instant = false, we log moves for the visualizer.
function solveSudoku(instant) {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (workingGrid[row][col] === 0) {
                
                for (let num = 1; num <= 9; num++) {
                    if (!instant) moveHistory.push({ type: 'try', row, col, value: num });
                    
                    if (isSafe(row, col, num)) {
                        workingGrid[row][col] = num;
                        if (!instant) moveHistory.push({ type: 'place', row, col, value: num });
                        
                        if (solveSudoku(instant)) return true;
                        
                        workingGrid[row][col] = 0;
                        if (!instant) moveHistory.push({ type: 'remove', row, col });
                    }
                }
                return false; // Trigger backtrack
            }
        }
    }
    return true; // Solved
}

// Start
init();