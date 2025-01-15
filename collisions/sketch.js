/// <reference path="../node_modules/@types/p5/global.d.ts" />

const bgColor = "#070831"; // (7, 8, 49)

let polygonCount = 10;
let polygons = [];
let controllablePolygon = null;
let gravity = null;
let gravityStep = null;
const subSteps = 10;

function windowResized() {
  createCanvas(windowWidth, windowHeight);
  background(bgColor); // to fix color changing on window resize
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  gravity = createVector(0, 10);
  gravityStep = gravity.copy().mult(1 / subSteps);
  polygons.push(
    new Polygon(createVector(300, 300), 5, 100, 100, 3, true, true)
  );
  for (let i = 1; i < polygonCount - 1; i++) {
    polygons.push(
      new Polygon(
        createVector(
          random(50, windowWidth - 50),
          random(100, windowHeight - 100)
        ),
        Math.floor(random(3, 10)),
        random(50, 100),
        random(5, 100),
        random(5, 10),
        false,
        true
      )
    );
  }
  polygons.push(
    new Polygon(
      createVector(width / 2, height),
      4,
      width / 2,
      10000,
      0,
      false,
      false,
      [
        createVector(-10, height - 100),
        createVector(width + 10, height - 100),
        createVector(width + 10, height + 10),
        createVector(-10, height + 10),
      ]
    )
  );
  controllablePolygon = polygons[0];
}

function touchStarted() {
  // Set the target for the controllable polygon when the screen is touched
  if (controllablePolygon) {
    controllablePolygon.target = createVector(mouseX, mouseY);
  }
}

function touchMoved() {
  // Set the target for the controllable polygon when the screen is touched
  if (controllablePolygon) {
    controllablePolygon.target = createVector(mouseX, mouseY);
  }
}

function touchEnded() {
  // Set the target for the controllable polygon when the screen is touched
  if (controllablePolygon) {
    controllablePolygon.target = controllablePolygon.center;
  }
}

function draw() {
  background(bgColor);

  for (let i = 0; i < subSteps; i++) {
    // Apply gravity in small steps and check collision, for precision
    collisionCheck();
    for (let polygon of polygons) {
      if (polygon.movable) polygon.moveBy(gravityStep);
    }
  }

  for (let polygon of polygons) {
    polygon.update();
  }
  if (controllablePolygon) controllablePolygon.move();

  displayFPS();
}

function displayFPS() {
  fill(255);
  textSize(16);
  textAlign(RIGHT, TOP);
  text("FPS: " + Math.round(frameRate()), width - 10, 10);
}

function collisionCheck() {
  let inCollision = new Set();

  for (let i = 0; i < polygonCount; i++) {
    polygons[i].notColliding();
    for (let j = i + 1; j < polygonCount; j++) {
      let mtv = satCollision(polygons[i], polygons[j]);
      if (mtv) {
        inCollision.add(i);
        inCollision.add(j);
        collisionResolution(polygons[i], polygons[j], mtv);
      }
    }
  }
  inCollision.forEach((i) => polygons[i].colliding());
}

function collisionResolution(polygon1, polygon2, mtv) {
  staticResolve(polygon1, polygon2, mtv);
}
