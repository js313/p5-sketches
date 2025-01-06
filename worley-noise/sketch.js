/// <reference path="../node_modules/@types/p5/global.d.ts" />

const bgColor = "#070831"; // (7, 8, 49)
const primaryColor = "#fff4d6"; // (255, 244, 214)
const secondaryColor = "#908a76"; // (144, 138, 118)

let rowDivide = 16;
let colDivide = 9;
let points = [];
let xCentre, yCentre, randXOffset, randYOffset;
let pDensity = 1;

function windowResized() {
  background(bgColor); // to fix color changing on window resize
}

function setup() {
  createCanvas(1280, 720);
  xCentre = width / rowDivide / 2;
  yCentre = height / colDivide / 2;
  strokeWeight(5);
  noFill();

  for (let i = 0; i < rowDivide; i++) {
    points[i] = [];
    for (let j = 0; j < colDivide; j++) {
      let x = i * (width / rowDivide);
      let y = j * (height / colDivide);
      randXOffset = random(width / rowDivide);
      randYOffset = random(height / colDivide);

      points[i][j] = createVector(x + randXOffset, y + randYOffset);
    }
  }
}

function draw() {
  // scale down width and height for better performance
  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      let gCoords = getGridCoords(i, j);
      let sqrdDistToNearestPoint = checkNeighbors(gCoords, createVector(i, j));
      stroke(
        map(sqrdDistToNearestPoint, 0, 5000, 255, 7),
        map(sqrdDistToNearestPoint, 0, 5000, 244, 8),
        map(sqrdDistToNearestPoint, 0, 5000, 214, 49)
      );

      point(i, j);
    }
  }

  // for (let i = 0; i < rowDivide; i++) {
  //   for (let j = 0; j < colDivide; j++) {
  //     points[i][j].x += sin(frameCount) + random(-1, 1); // seeing artefacts as som points leave their cell, use other noise algos to make the points move in bounds
  //     points[i][j].y += cos(frameCount) + random(-1, 1);
  //   }
  // }
}

function getGridCoords(x, y) {
  return createVector(x / (width / rowDivide), y / (height / colDivide));
}

function sqrdDist(pCoords, neighborPoint) {
  return (
    (pCoords.x - neighborPoint.x) * (pCoords.x - neighborPoint.x) +
    (pCoords.y - neighborPoint.y) * (pCoords.y - neighborPoint.y)
  );
}

function checkNeighbors(gCoords, pCoords) {
  let maxSqD = width * width;
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if (i + gCoords.x < 0 || i + gCoords.x >= rowDivide) continue;
      if (j + gCoords.y < 0 || j + gCoords.y >= colDivide) continue;
      let neighborPoint = points[floor(gCoords.x + i)][floor(gCoords.y + j)];
      maxSqD = min(maxSqD, sqrdDist(pCoords, neighborPoint));
    }
  }
  return maxSqD;
}
