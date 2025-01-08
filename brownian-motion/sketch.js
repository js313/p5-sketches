/// <reference path="../node_modules/@types/p5/global.d.ts" />

const bgColor = "#070831"; // (7, 8, 49)
const primaryColor = "#fff4d6"; // (255, 244, 214)
const secondaryColor = "#908a76"; // (144, 138, 118)

const maxStepSize = 10;
const maxTrailLength = 100;

let gridWidth = 100,
  gridHeight = 100;
let history = [];
let bias = null;
let biasStrength = 5;
let clickIndicatorRadius = 15;

function setup() {
  createCanvas(windowWidth, windowHeight);
  gridWidth = windowWidth;
  gridHeight = windowHeight;
  let v = createVector(windowWidth / 2, windowHeight / 2);
  bias = createVector(0, 0);
  history.push(v);
  stroke(primaryColor);
  noFill();
  background(bgColor);
}

function draw() {
  background(7, 8, 49, 25); // fade effect
  const hLastIdx = history.length - 1;

  if (mouseIsPressed) {
    bias.x = mouseX - history[history.length - 1].x;
    bias.y = mouseY - history[history.length - 1].y;
    bias.normalize();
    bias.mult(biasStrength);
    circle(mouseX, mouseY, clickIndicatorRadius);
  }

  let x = history[hLastIdx].x + random(-maxStepSize, maxStepSize) + bias.x;
  let y = history[hLastIdx].y + random(-maxStepSize, maxStepSize) + bias.y;

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

function mouseReleased() {
  bias.x = bias.y = 0;
}

function touchEnded() {
  bias.x = bias.y = 0;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  gridWidth = windowWidth;
  gridHeight = windowHeight;
}
