const unitLength = 20;
const boxColor = 150;
const strokeColor = 50;
let columns;
let rows;
let currentBoard;
let nextBoard;

// Control Speed of the Game of Life with a Framerate Slider
let framerateSlider;

// Start Stop
let isRunning = false;
let startButton;
let stopButton;
let resetButton;
let randomizeButton;

// Define colors for different cell states
let aliveColor; // Red for alive cells
let deadColor; // White for dead cells
let stableColor; // Dark gray for stable cells

// Pattern
let patternSelector;
let applyPatternButton;

// Setup
function setup() {
  const canvas = createCanvas(windowWidth, windowHeight - 100);
  canvas.parent(document.querySelector("#canvas"));

  // Initialize colors
  aliveColor = color(255, 0, 0); // Red for alive cells
  deadColor = color(255); // White for dead cells
  stableColor = color(100); // Dark gray for stable cells

  columns = floor(width / unitLength);
  rows = floor(height / unitLength);
  currentBoard = [];
  nextBoard = [];

  for (let i = 0; i < columns; i++) {
    currentBoard[i] = [];
    nextBoard[i] = [];
  }

  init();

  // Initialize the framerate slider element
  framerateSlider = select("#framerate-slider");
  framerateValue = select("#framerate-value");

  // Set an initial framerate
  frameRate(30);

  // Add an event listener to adjust the framerate when the slider changes
  framerateSlider.input(updateFramerate);

  // Initialize the buttons
  startButton = select("#start-button");
  stopButton = select("#stop-button");
  resetButton = select("#reset-button");

  // Add event listeners to start, stop, and reset the game
  startButton.mousePressed(startGame);
  stopButton.mousePressed(stopGame);
  resetButton.mousePressed(resetGame);

  // Initialize the randomize button
  randomizeButton = select("#randomize-button");

  // Add an event listener to trigger randomization
  randomizeButton.mousePressed(randomizeBoard);

  // Initialize the pattern selector and apply button
  patternSelector = select('#pattern-selector');
  applyPatternButton = select('#apply-pattern-button');

  // Add an event listener to apply the selected pattern
  applyPatternButton.mousePressed(applySelectedPattern);
}

function updateFramerate() {
  const newFramerate = parseFloat(framerateSlider.value());
  frameRate(newFramerate);
  framerateValue.html(`${newFramerate} FPS`);
}

function startGame() {
  isRunning = true;
  loop(); // Start the game loop
}

function stopGame() {
  isRunning = false;
  noLoop(); // Stop the game loop
}

function resetGame() {
  isRunning = false;
  noLoop(); // Stop the game loop
  init(); // Reset the game state
}

function randomizeBoard() {
  // Implement logic to randomly populate currentBoard with different colors
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      const randomValue = random();
      if (randomValue > 0.7) {
        currentBoard[i][j] = 1; // Alive (red)
      } else {
        currentBoard[i][j] = 0; // Dead (white)
      }
    }
  }
}

// Initialize/reset the board state
function init() {
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      currentBoard[i][j] = 0;
      nextBoard[i][j] = 0;
    }
  }
}

// Draw
function draw() {
  background(255);
  generate();

  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      if (currentBoard[i][j] == 1) {
        // Check if the cell is stable (not changing state)
        const isStable = currentBoard[i][j] === nextBoard[i][j];
        fill(isStable ? stableColor : aliveColor);
      } else {
        fill(deadColor);
      }
      stroke(strokeColor);
      rect(i * unitLength, j * unitLength, unitLength, unitLength);
    }
  }
}

// Generate
function generate() {
  for (let x = 0; x < columns; x++) {
    for (let y = 0; y < rows; y++) {
      let neighbors = 0;
      for (let i of [-1, 0, 1]) {
        for (let j of [-1, 0, 1]) {
          if (i == 0 && j == 0) {
            continue;
          }
          neighbors +=
            currentBoard[(x + i + columns) % columns][(y + j + rows) % rows];
        }
      }

      // Rules of Life
      if (currentBoard[x][y] == 1 && neighbors < 2) {
        nextBoard[x][y] = 0;
      } else if (currentBoard[x][y] == 1 && neighbors > 3) {
        nextBoard[x][y] = 0;
      } else if (currentBoard[x][y] == 0 && neighbors == 3) {
        nextBoard[x][y] = 1;
      } else {
        nextBoard[x][y] = currentBoard[x][y];
      }
    }
  }

  [currentBoard, nextBoard] = [nextBoard, currentBoard];
}

// When mouse is dragged
function mouseDragged() {
  //If the mouse coordinate is outside the board
  if (mouseX > unitLength * columns || mouseY > unitLength * rows) {
    return;
  }
  const x = Math.floor(mouseX / unitLength);
  const y = Math.floor(mouseY / unitLength);
  currentBoard[x][y] = 1;
  fill(aliveColor);
  stroke(strokeColor);
  rect(x * unitLength, y * unitLength, unitLength, unitLength);
}

// When mouse is pressed
function mousePressed() {
  if (!isRunning) {
    loop(); // Start the game loop
  }
}

// When mouse is released
function mouseReleased() {
  if (!isRunning) {
    noLoop(); // Stop the game loop
  }
}

function applySelectedPattern() {
  const selectedPattern = patternSelector.value();
  // Implement logic to place the selected pattern on the board
  switch (selectedPattern) {
    case 'random':
      randomizeBoard();
      break;
    case 'glider':
      applyGliderPattern();
      break;
    case 'lwss':
      applyLWSSPattern();
      break;
  }
}

function applyGliderPattern() {
  // Glider pattern
  // This pattern moves diagonally across the board
  currentBoard[2][1] = 1; // Red cell
  currentBoard[3][2] = 1;
  currentBoard[1][3] = 1;
  currentBoard[2][3] = 1;
  currentBoard[3][3] = 1;
}

function applyLWSSPattern() {
  // Lightweight Spaceship (LWSS) pattern
  // This pattern moves horizontally across the board
  currentBoard[2][1] = 1; // Red cell
  currentBoard[5][1] = 1;
  currentBoard[6][2] = 1;
  currentBoard[6][3] = 1;
  currentBoard[6][4] = 1;
  currentBoard[5][4] = 1;
  currentBoard[4][4] = 1;
  currentBoard[3][3] = 1;
}

document.querySelector("#reset-game").addEventListener("click", function () {
  init();
});
