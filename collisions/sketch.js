/// <reference path="../node_modules/@types/p5/global.d.ts" />

const bgColor = "#070831"; // (7, 8, 49)

let polygonCount = 10;
let polygons = [];
let controllablePolygon = null;

function windowResized() {
  background(bgColor); // to fix color changing on window resize
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  polygons.push(
    new Polygon(createVector(300, 300), 5, 100, 100, 3, true, true)
  );
  // polygons.push(
  //   new Polygon(createVector(500, 100), 3, 50, 10, 5, false, true)
  // );
  // polygons.push(
  //   new Polygon(createVector(500, 200), 3, 50, 3, 5, false, false)
  // );
  for (let i = 1; i < polygonCount; i++) {
    polygons.push(
      new Polygon(
        createVector(random(0, windowWidth), random(0, windowHeight)),
        Math.floor(random(3, 10)),
        random(50, 100),
        random(5, 100),
        random(5, 10),
        false,
        true
      )
    );
  }
  controllablePolygon = polygons[0];
}

function draw() {
  background(bgColor);
  for (let polygon of polygons) {
    polygon.update();
  }
  collisionCheck();
  controllablePolygon.move();
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
