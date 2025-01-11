/// <reference path="../node_modules/@types/p5/global.d.ts" />

const bgColor = "#070831"; // (7, 8, 49)
const primaryColor = "#fff4d6"; // (255, 244, 214)
const secondaryColor = "#908a76"; // (144, 138, 118)

let polygonCount = 2;
let polygons = [];
let selectedPolygon = null;

function windowResized() {
  background(bgColor); // to fix color changing on window resize
}

function setup() {
  createCanvas(800, 500);
  fill(100);
  // for(let i=2;i<polygonCount;i++) {
  polygons.push(new Polygon(createVector(300, 300), 5, 100, 2, 3));
  polygons.push(new Polygon(createVector(100, 100), 7, 50, 3, 5));
  // }
}

function mousePressed() {
  for (let polygon of polygons) {
    if (polygon.isMouseInside()) {
      selectedPolygon = polygon;
      break;
    }
  }
}

function draw() {
  background(220);
  collisionCheck();
  if (selectedPolygon) selectedPolygon.move();
  for (let polygon of polygons) {
    polygon.update();
  }
}

function collisionCheck() {
  let inCollision = new Set();
  for (let i = 0; i < polygonCount; i++) {
    polygons[i].notColliding();
    for (let j = i + 1; j < polygonCount; j++) {
      if (satCollision(polygons[i], polygons[j])) {
        inCollision.add(i);
        inCollision.add(j);
      }
    }
  }
  inCollision.forEach((i) => polygons[i].colliding());
}

function collisionResolution(poly1, poly2) {}
