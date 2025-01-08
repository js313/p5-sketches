/// <reference path="../node_modules/@types/p5/global.d.ts" />

class Body {
  // Only circles supported, for now
  constructor(centre, radius, mass, speed = 5) {
    // Add mass
    this.centre = centre;
    this.radius = radius;
    this.mass = mass;
    this.speed = speed;
    const rAngle = random(TWO_PI);
    this.velocity = createVector(cos(rAngle), sin(rAngle)).mult(this.speed);
  }

  draw() {
    stroke(200);
    fill(100);
    circle(this.centre.x, this.centre.y, this.radius * 2);
  }

  update() {
    this.centre.add(this.velocity); // framerate dependent

    if (this.centre.x + this.radius > width || this.centre.x - this.radius < 0)
      this.velocity.x = -this.velocity.x;
    if (this.centre.y + this.radius > height || this.centre.y - this.radius < 0)
      this.velocity.y = -this.velocity.y;

    this.draw();
  }
}
