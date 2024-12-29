/// <reference path="../node_modules/@types/p5/global.d.ts" />

const bgColor = "#070831";
const primaryColor = "#fff4d6";
const secondaryColor = "#908a76";

let grid = [];
let rows = 50;
let cols = 50;
let gridWidth = 600; // The width of the grid
let gridHeight = 600; // The height of the grid

let current;
let stack = [];

// Calculate the offsets to center the grid
let offsetX = 0;
let offsetY = 0;

function setup() {
  createCanvas(windowWidth, windowHeight); // Set canvas size to window size

  // Calculate the offsets to center the grid based on canvas size
  offsetX = (width - gridWidth) / 2;
  offsetY = (height - gridHeight) / 2;

  // Create the grid and cells
  for (let i = 0; i < rows; i++) {
    grid.push([]);
    for (let j = 0; j < cols; j++) {
      let cell = new Cell(
        i,
        j,
        i * (gridWidth / rows) + offsetX, // Shift cell's X position by offsetX
        j * (gridHeight / cols) + offsetY, // Shift cell's Y position by offsetY
        gridWidth / rows,
        gridHeight / cols
      );
      grid[i].push(cell);
    }
  }

  current = grid[0][0];
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      grid[i][j].show();
    }
  }
}

function draw() {
  background(bgColor); // Clear the canvas each frame

  // Mark and unmark the current cell
  current && current.currentMark();
  current && current.mark();

  // Show the grid cells
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      grid[i][j].show();
    }
  }

  if (!current) {
    noLoop();
    return;
  }

  // Unmark the current cell after processing
  current.currentUnMark();

  // Check neighbors of the current cell
  const neighbours = current.checkNeighbours();
  const randIndex = Math.floor(Math.random() * neighbours.length);
  let next;

  // If there are neighbors, push the current cell to the stack
  // and move to the next neighbor
  if (neighbours.length > 0) {
    stack.push(current);
    next = neighbours[randIndex];
  }
  // If no neighbors are available, pop a cell from the stack
  else if (stack.length > 0) {
    next = stack.pop();
  }

  // Remove the wall between the current and next cell
  if (next) {
    current.removeWall(next);
  } else {
    current.currentUnMark();
  }

  // Update the current cell
  current = next;
}
