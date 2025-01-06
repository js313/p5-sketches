/// <reference path="../node_modules/@types/p5/global.d.ts" />

class Body {
  // Only circles supported, for now
  constructor(centre, radius) {
    this.centre = createVector(centre.x, centre.y);
    this.radius = radius;
  }
}
