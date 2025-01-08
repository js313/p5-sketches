/// <reference path="../node_modules/@types/p5/global.d.ts" />

const bgColor = "#070831"; // (7, 8, 49)
const primaryColor = "#fff4d6"; // (255, 244, 214)
const secondaryColor = "#908a76"; // (144, 138, 118)

let body1 = null;
let body2 = null;
let bodySqDist = 0;

function windowResized() {
  background(bgColor); // to fix color changing on window resize
}

function setup() {
  createCanvas(800, 800);
  body1 = new Body(createVector(200, 200), 80, 2);
  body2 = new Body(createVector(80, 80), 60, 5);
}

function draw() {
  background(220);
  collisionCheck(body1, body2);
  body1.update();
  body2.update();
}

function collisionCheck(body1, body2) {
  if (
    createVector(body1.centre.x, body1.centre.y).sub(body2.centre).magSq() <=
    Math.pow(body1.radius + body2.radius, 2)
  ) {
    collisionResolution(body1, body2);
  }
}

function collisionResolution(body1, body2) {
  let body1Velocity = body1.velocity.copy(); // Incorrect resolution
  body1.velocity = body2.velocity.copy();
  body2.velocity = body1Velocity;
}
