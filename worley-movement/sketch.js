/// <reference path="../node_modules/@types/p5/global.d.ts" />

const bgColor = "#070831"; // (7, 8, 49)
const primaryColor = "#fff4d6"; // (255, 244, 214)
const secondaryColor = "#908a76"; // (144, 138, 118)

let seeds = [];
let depth = 50;
let z = 0;
let moveSpeed = 0.2;

function setup() {
  createCanvas(windowWidth, windowHeight);

  for (let i = 1; i <= depth; i += 2) {
    seeds.push(createVector(random(width / 6), random(height / 6), i));
  }
}

function draw() {
  for (let x = 0; x < width / 6; x++) {
    for (let y = 0; y < height / 6; y++) {
      let distances = [];

      for (let p of seeds) {
        distances.push(dist(p.x, p.y, p.z, x, y, z));
      }

      distances.sort((a, b) => a - b);

      let r = int(map(distances[1], 0, 30, 255, 0));
      let g = int(map(distances[1], 0, 50, 255, 0));
      let b = int(map(distances[0], 0, 100, 200, 0));

      let scaledX = x * 6;
      let scaledY = y * 6;

      noStroke();
      fill(r, g, b);
      rect(scaledX, scaledY, 6, 6); // Draw scaled pixels
    }
  }

  z += moveSpeed;

  if (z >= depth || z <= 0) {
    moveSpeed = -moveSpeed;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
