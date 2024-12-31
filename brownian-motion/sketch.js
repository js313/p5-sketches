/// <reference path="../node_modules/@types/p5/global.d.ts" />

const bgColor = "#070831"; // (7, 8, 49)
const primaryColor = "#fff4d6"; // (255, 244, 214)
const secondaryColor = "#908a76"; // (144, 138, 118)

const maxStepSize = 10;
const maxTrailLength = 100;

let gridWidth = 100,
  gridHeight = 100;
let history = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  gridWidth = windowWidth;
  gridHeight = windowHeight;
  let v = createVector(windowWidth / 2, windowHeight / 2);
  history.push(v);
  background(bgColor);
}

function draw() {
  background(7, 8, 49, 10); // fade effect
  const hLastIdx = history.length - 1;

  let x = history[hLastIdx].x + random(-maxStepSize, maxStepSize);
  let y = history[hLastIdx].y + random(-maxStepSize, maxStepSize);

  if (x < 0 || x > gridWidth) {
    x = (x + gridWidth) % gridWidth;
    history = [];
  }
  if (y < 0 || y > gridHeight) {
    y = (y + gridHeight) % gridHeight;
    history = [];
  }

  let v = createVector(x, y);
  history.push(v);
  if (history.length > maxTrailLength) history.shift();
  for (let i = 1; i < history.length; i++) {
    stroke(secondaryColor);
    strokeWeight(2);
    line(history[i - 1].x, history[i - 1].y, history[i].x, history[i].y);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  gridWidth = windowWidth;
  gridHeight = windowHeight;
}
