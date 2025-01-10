/// <reference path="../node_modules/@types/p5/global.d.ts" />

class Polygon {
  constructor(centre, numVertices, distFromCentre, mass, color, speed = 5) {
    this.mass = mass;
    this.speed = speed;
    this.rotation = 0;
    this.color = color;

    const rAngle = random(TWO_PI);
    this.velocity = createVector(cos(rAngle), sin(rAngle)).mult(this.speed);
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
    stroke(this.color + 100);
    fill(this.color);
    beginShape();
    for (let i = 0; i < this.numVertices; i++) {
      vertex(this.vertices[i].x, this.vertices[i].y);
    }
    endShape();
  }

  update() {
    let wallXCollided = false,
      wallYCollided = false;
    // framerate dependent
    this.centre.add(this.velocity);
    for (let i = 0; i < this.numVertices; i++) {
      let vertex = this.vertices[i];
      vertex.add(this.velocity);
      if (vertex.x > width || vertex.x < 0) wallXCollided = true;
      if (vertex.y > height || vertex.y < 0) wallYCollided = true;
    }
    this.calculateEdges();
    this.draw();

    if (wallXCollided) this.velocity.x = -this.velocity.x;
    if (wallYCollided) this.velocity.y = -this.velocity.y;
  }
}
