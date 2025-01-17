/// <reference path="../node_modules/@types/p5/global.d.ts" />

const primaryColor = "#fff4d6"; // (255, 244, 214)
const secondaryColor = "#908a76"; // (144, 138, 118)

class Polygon {
  // INIT
  constructor({
    centre,
    numVertices,
    distFromCentre,
    vertices,
    mass,
    maxSpeed,
    elasticity,
    controllable = false,
    movable = true,
    // no need of movable variable, setting mass to infinte will have the same effect if collsion resolution algorithm accounts for it
  }) {
    this.color = movable ? secondaryColor : color(50);
    this.defaultColor = this.color;
    this.movable = movable;
    this.controllable = controllable;

    this.maxSpeed = maxSpeed;
    this.facingDir = createVector(0, 0);
    this.centre = centre;
    this.distFromCentre = distFromCentre;
    this.numVertices = numVertices;
    this.vertices = vertices;
    this.createShape();

    this.mass = mass;
    this.invMass = mass === Infinity ? 0 : 1 / mass;
    this.elasticity = elasticity;
    this.force = createVector(0, 0);
    this.velocity = createVector(0, 0);
  }

  createShape() {
    if (!this.vertices) {
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
    } else this.vertices = this.vertices;

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

  // DRAW
  draw() {
    stroke(primaryColor);
    strokeWeight(1);
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

  // PHYSICS
  update() {
    if (this.movable) {
      this.velocity.add(p5.Vector.mult(this.force, this.invMass));
      this.centre.add(this.velocity);
      for (let vertex of this.vertices) {
        vertex.add(this.velocity);
      }
      this.facingDir = this.vertices[0].copy().sub(this.centre).normalize();
      this.calculateEdges();

      this.force.set(0, 0);
    }

    this.draw();
  }

  applyForce(force) {
    if (!this.movable) return;

    this.force.add(force);
  }

  applyImpulse(impulse) {
    if (!this.movable) return;

    // impulse represents a quick, instantaneous change in momentum
    this.velocity.add(p5.Vector.mult(impulse, this.invMass));
  }

  // Keep for static resolution
  moveBy(displacement) {
    this.centre.add(displacement);
    for (let i = 0; i < this.vertices.length; i++) {
      this.vertices[i].add(displacement);
    }
    this.calculateEdges();
  }

  // Keep for testing without gravity
  move() {
    let force = 0;
    let turnAngle = 0;

    // Keyboard input for WASD movement
    if (keyIsDown(87)) force += 5; // W
    if (keyIsDown(83)) force -= 5; // S
    if (keyIsDown(65)) turnAngle -= PI / 48; // A
    if (keyIsDown(68)) turnAngle += PI / 48; // D

    // Apply keyboard movement if a key is pressed
    this.applyForce(this.facingDir.copy().mult(force));

    for (let i = 0; i < this.vertices.length; i++) {
      let vertex = this.vertices[i];
      vertex.sub(this.centre).rotate(turnAngle).add(this.centre);
    }
    this.facingDir = this.vertices[0].copy().sub(this.centre).normalize();
    this.calculateEdges();
    return;
  }
}
