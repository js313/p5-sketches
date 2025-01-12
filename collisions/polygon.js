/// <reference path="../node_modules/@types/p5/global.d.ts" />

const primaryColor = "#fff4d6"; // (255, 244, 214)
const secondaryColor = "#908a76"; // (144, 138, 118)

class Polygon {
  constructor(
    centre,
    numVertices,
    distFromCentre,
    mass,
    maxSpeed,
    controllable,
    movable
  ) {
    this.mass = mass;
    this.color = movable ? secondaryColor : color(50);
    this.defaultColor = this.color;
    this.movable = movable;
    this.controllable = controllable;

    this.maxSpeed = maxSpeed;
    this.facingDir = createVector(0, 0);
    this.centre = centre;
    this.distFromCentre = distFromCentre;
    this.numVertices = numVertices;
    this.createShape(numVertices);
    this.displacement = createVector(0, 0);
  }

  createShape() {
    let randomAngles = [];
    let angleRange = (2 * PI) / this.numVertices;
    let minAngle = 0;
    let maxAngle = this.controllable ? 0 : angleRange;

    for (let i = 0; i < this.numVertices; i++) {
      randomAngles.push(random(minAngle, maxAngle));
      minAngle += angleRange;
      maxAngle += angleRange;
    }
    this.vertices = [];
    for (let i = 0; i < this.numVertices; i++) {
      let vert = createVector(
        this.centre.x + this.distFromCentre * cos(randomAngles[i]),
        this.centre.y + this.distFromCentre * sin(randomAngles[i])
      );

      this.vertices.push(vert);
    }

    this.facingDir = this.vertices[0].copy().sub(this.centre).normalize();

    this.calculateEdges();
  }

  calculateEdges() {
    this.edges = [];
    for (let i = 0; i < this.vertices.length; i++) {
      let next = (i + 1) % this.vertices.length;
      this.edges.push(this.vertices[next].copy().sub(this.vertices[i]));
    }
  }

  draw() {
    stroke(primaryColor);
    strokeWeight(3);
    fill(this.color);
    beginShape();
    for (let i = 0; i < this.numVertices; i++) {
      vertex(this.vertices[i].x, this.vertices[i].y);
    }
    endShape(CLOSE);
    this.controllable &&
      line(
        this.centre.x,
        this.centre.y,
        this.vertices[0].x,
        this.vertices[0].y
      );
  }

  move() {
    let speed = 0;
    let turnAngle = 0;

    // Keyboard input for WASD movement
    if (keyIsDown(87)) speed += this.maxSpeed; // W
    if (keyIsDown(83)) speed -= this.maxSpeed; // S
    if (keyIsDown(65)) turnAngle -= PI / 48; // A
    if (keyIsDown(68)) turnAngle += PI / 48; // D

    // Apply keyboard movement if a key is pressed
    if (speed !== 0 || turnAngle !== 0) {
      this.target = null; // Disable touch-based target
      let velocity = this.facingDir.copy().mult(speed);

      this.centre.add(velocity);
      for (let i = 0; i < this.vertices.length; i++) {
        let vertex = this.vertices[i];
        vertex.add(velocity);
        vertex.sub(this.centre).rotate(turnAngle).add(this.centre);
      }
      this.facingDir = this.vertices[0].copy().sub(this.centre).normalize();
      this.calculateEdges();
      return;
    }

    // Touch input for target-based movement
    if (this.target && p5.Vector.sub(this.target, this.centre).magSq() > 100) {
      let targetDirection = p5.Vector.sub(this.target, this.centre).normalize();

      // Gradually rotate facingDir to align with the targetDirection
      let angleToTarget = this.facingDir.angleBetween(targetDirection);
      let rotationStep = constrain(angleToTarget, -PI / 48, PI / 48); // Smooth rotation
      this.facingDir.rotate(rotationStep);

      // Move forward in the direction the polygon is facing
      speed = this.maxSpeed;

      // Calculate velocity in the facing direction
      let velocity = this.facingDir.copy().mult(speed);

      // Update the position of the polygon and its vertices
      this.centre.add(velocity);
      for (let i = 0; i < this.vertices.length; i++) {
        let vertex = this.vertices[i];
        vertex.add(velocity);
        vertex.sub(this.centre).rotate(rotationStep).add(this.centre);
      }

      this.calculateEdges();
    }
  }

  moveBy(displacement) {
    this.centre.add(displacement);
    for (let i = 0; i < this.vertices.length; i++) {
      this.vertices[i].add(displacement);
    }
    this.calculateEdges();
  }

  update() {
    this.draw();
  }

  colliding() {
    if (this.movable && !this.controllable) this.color = color(primaryColor);
  }
  notColliding() {
    this.color = this.defaultColor;
  }
}
