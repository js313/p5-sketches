/// <reference path="../node_modules/@types/p5/global.d.ts" />

const bgColor = "#070831"; // (7, 8, 49)
const primaryColor = "#fff4d6"; // (255, 244, 214)
const secondaryColor = "#908a76"; // (144, 138, 118)

let poly1 = null;
let poly2 = null;
let polySqDist = 0;

function windowResized() {
  background(bgColor); // to fix color changing on window resize
}

function setup() {
  createCanvas(800, 500);
  fill(100);
  poly1 = new Polygon(createVector(300, 300), 5, 100, 2, 100, 3);
  poly2 = new Polygon(createVector(100, 100), 3, 50, 3, 100, 5);
}

function draw() {
  background(220);
  // collisionCheck(poly1, poly2);
  poly1.update();
  poly2.update();
}

function collisionCheck(poly1, poly2) {
  if (
    createVector(poly1.centre.x, poly1.centre.y).sub(poly2.centre).magSq() <=
    Math.pow(poly1.radius + poly2.radius, 2)
  ) {
    collisionResolution(poly1, poly2);
  } else {
    poly1.color = 100;
    poly2.color = 100;
  }
}

function collisionResolution(poly1, poly2) {
  // let poly1Velocity = poly1.velocity.copy(); // Incorrect resolution
  // poly1.velocity = poly2.velocity.copy();
  // poly2.velocity = poly1Velocity;

  poly1.color = 200;
  poly2.color = 200;
}
