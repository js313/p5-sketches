/// <reference path="../node_modules/@types/p5/global.d.ts" />

class Polygon {
  constructor(centre, numVertices, distFromCentre, mass, maxSpeed) {
    this.mass = mass;
    this.rotation = 0;
    this.color = color(7, 8, 49);
    this.defaultColor = color(7, 8, 49);

    this.maxSpeed = maxSpeed;
    this.centre = centre;
    this.distFromCentre = distFromCentre;
    this.numVertices = numVertices;
    this.createShape(numVertices);
  }

  createShape() {
    let randomAngles = [];

    for (let i = 0; i < this.numVertices; i++) {
      randomAngles.push(random(TWO_PI));
    }
    randomAngles.sort();
    this.vertices = [];
    for (let i = 0; i < this.numVertices; i++) {
      let vert = createVector(
        this.centre.x + this.distFromCentre * cos(randomAngles[i]),
        this.centre.y + this.distFromCentre * sin(randomAngles[i])
      );

      this.vertices.push(vert);
    }

    this.calculateEdges();
  }

  calculateEdges() {
    this.edges = [];
    for (let i = 1; i < this.numVertices; i++) {
      let edge = this.vertices[i].copy().sub(this.vertices[i - 1]);
      this.edges.push(edge);
    }
    let closingEdge = this.vertices[0]
      .copy()
      .sub(this.vertices[this.numVertices - 1]);
    this.edges.push(closingEdge);
  }

  draw() {
    stroke(this.color);
    fill(this.color);
    beginShape();
    for (let i = 0; i < this.numVertices; i++) {
      vertex(this.vertices[i].x, this.vertices[i].y);
    }
    endShape();
  }

  move() {
    let dx = 0;
    let dy = 0;
    if (keyIsDown(87)) dy -= 2; // W
    if (keyIsDown(83)) dy += 2; // S
    if (keyIsDown(65)) dx -= 2; // A
    if (keyIsDown(68)) dx += 2; // D

    let vel = createVector(dx, dy).normalize().mult(this.maxSpeed);
    this.centre.add(vel);
    for (let vert of this.vertices) {
      vert.add(vel);
    }
  }

  update() {
    this.draw();
  }

  colliding() {
    this.color = color(255, 0, 0);
  }
  notColliding() {
    this.color = color(7, 8, 49);
  }

  isMouseInside() {
    let d = dist(mouseX, mouseY, this.centre.x, this.centre.y);
    let isSelected = false;
    if (d <= this.distFromCentre) {
      isSelected = true;
      this.color = color(200, 8, 49);
    } else this.color = color(7, 8, 49);
    return isSelected;
  }
}
