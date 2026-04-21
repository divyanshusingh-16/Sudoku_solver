# Sudoku Solver - Visualizer & Tool

## 📌 Project Overview
This is an **interactive Sudoku Solver** with a visualization feature. It shows how the backtracking algorithm solves Sudoku puzzles step-by-step. You can solve instantly, watch the animation, or solve step-by-step.

---

## 📁 File Structure

### **1. index.html** (The Structure)
This file creates the page layout and HTML elements.

#### Main Components:
- **Header Section**: Title and all control buttons
- **Control Buttons**:
  - `Direct Solve` - Solves instantly without animation
  - `Play Animation` - Shows how the algorithm works step-by-step
  - `Pause` - Pauses the animation
  - `Step` - Moves to the next step manually
  - `Clear` - Creates a completely empty board
  - `Reset` - Loads the default puzzle again
- **Speed Slider**: Controls animation speed (10-1000 ms)
- **Backtrack Counter**: Shows how many times the algorithm had to backtrack
- **Board Container**: 9×9 grid of input boxes for Sudoku cells

---

## 🎨 CSS Styling (style.css)
Controls the visual appearance and colors.

### Key Styles:
- **Background**: Dark gradient theme (navy blue to dark purple)
- **Buttons**: Different colors for different actions (blue for primary, red for danger)
- **Board**: 9×9 grid with thick borders separating 3×3 boxes (Sudoku regions)
- **Cell Colors**:
  - **White** = Empty cells you can type in
  - **Light Gray** = Fixed numbers (part of original puzzle)
  - **Yellow** = Currently being tried by the algorithm
  - **Green** = Correct number placed
  - **Red** = Removed number during backtracking

---

## ⚙️ JavaScript Functions (script.js)
The logic that makes everything work.

### **State Variables** (Memory)
```javascript
moveHistory = []     // Stores every move made by the solver
animationInterval    // Keeps track of current animation
currentStep          // Which move we're on in the animation
backtrackCount       // How many times we backtracked
workingGrid          // The puzzle being solved (2D array)
```

### **Main Functions**

#### 1. **init()** - Initialization
- Runs when the page loads
- Connects all buttons to their click events
- Creates the default board

#### 2. **buildBoard(clear)** - Create the Sudoku Grid
- Creates 81 input boxes (9 rows × 9 columns)
- If `clear = true`: Makes a blank board
- If `clear = false`: Loads the default puzzle
- Only allows numbers 1-9 to be typed
- Marks original puzzle numbers as "fixed" (can't be edited)

#### 3. **readBoardFromUI()** - Read User Input
- Takes whatever the user typed in the input boxes
- Stores it in the `workingGrid` array (2D array)
- Converts empty boxes to `0`

#### 4. **directSolve()** - Instant Solution
- Reads the current board from the input boxes
- Solves it immediately without animation
- Colors solved numbers green
- Shows "No valid solution" if puzzle is unsolvable

#### 5. **playAnimation()** - Step-by-Step Animation
- Solves the puzzle while recording every move
- Uses the speed slider to control animation speed
- Calls `applyNextMove()` repeatedly
- Stops automatically when puzzle is solved

#### 6. **pauseAnimation()** - Pause Animation
- Stops the animation
- User can continue with "Step" button or "Play" again

#### 7. **applyNextMove()** - Show One Move
- Takes the next move from `moveHistory`
- Updates the visual board with colors:
  - Yellow = trying a number
  - Green = placing a correct number
  - Red = removing a number (backtracking)
- Increments the backtrack counter for removals

---

### **The Solving Algorithm**

#### **isSafe(row, col, num)** - Check if Number is Valid
Checks if we can place a number at a position without breaking Sudoku rules:
- **Row check**: Number shouldn't exist in the same row
- **Column check**: Number shouldn't exist in the same column
- **3×3 Box check**: Number shouldn't exist in the same 3×3 region

Returns `true` if the number can be placed, `false` otherwise.

#### **solveSudoku(instant)** - Backtracking Algorithm (The Brain!)
This is the core solving logic:

1. **Loop through every cell** (row by row, column by column)
2. **Find empty cells** (cells with value 0)
3. **Try numbers 1-9**:
   - Record the attempt if animating
   - Check if the number is safe using `isSafe()`
   - If safe, place it and recursively try to solve the rest
   - If it leads to a solution, return `true` (solved!)
   - If not, remove the number and try the next one (backtrack)
4. **Return false** if no number works (forces backtracking)
5. **Return true** when all cells are filled correctly

**How Backtracking Works:**
- The algorithm tries a number
- If it doesn't lead to a solution, it removes it and tries another
- This continues until it finds a valid solution
- The animation shows this trial-and-error process

---

## 🎮 How to Use

### **1. Load a Puzzle**
- The default Sudoku puzzle is shown when you open the page
- Or click "Clear" to start with an empty board and enter your own puzzle

### **2. Solve Instantly**
- Click "Direct Solve" button
- The solution appears instantly with solved cells highlighted in green

### **3. Watch the Algorithm Work**
- Click "Play Animation" button
- Watch as the algorithm tries numbers (yellow), places correct ones (green), and backtracks (red)
- Use the speed slider to make it faster or slower

### **4. Manual Step-by-Step**
- Click "Step" button repeatedly to see one move at a time
- Good for understanding the algorithm

### **5. Reset or Clear**
- Click "Reset" to go back to the default puzzle
- Click "Clear" to erase everything and start fresh

---

## 📊 Example Output

When you run the algorithm, you'll see:
- **Yellow cells**: Numbers being tried
- **Green cells**: Correct numbers that are placed
- **Red cells**: Numbers that didn't work (being removed)
- **Backtrack Counter**: Shows how many times the algorithm had to undo a placement

---

## 🎓 Educational Value

This project teaches:
- **Backtracking Algorithm**: How to solve problems by trying and undoing
- **Recursion**: Functions calling themselves
- **Web Development**: HTML, CSS, JavaScript integration
- **Sudoku Rules**: How the puzzle logic works
- **Data Structures**: 2D arrays, objects

---

## 🔧 Technical Details

- **Grid Size**: 9×9 (classic Sudoku)
- **Algorithm**: Backtracking with constraint checking
- **Animation**: Uses JavaScript intervals (not canvas or frameworks)
- **Performance**: Can solve most puzzles in seconds
- **Complexity**: O(9^n) worst case, where n is the number of empty cells

---

## 📝 Notes

- You can type numbers 1-9 directly into any empty cell
- The original puzzle numbers are locked (gray background)
- Invalid inputs (letters, symbols) are automatically filtered out
- The backtrack counter helps understand algorithm efficiency
