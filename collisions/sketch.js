/// <reference path="../node_modules/@types/p5/global.d.ts" />

const bgColor = "#070831"; // (7, 8, 49)

let polygonCount = 5;
let manuallyAddedPolygons = 5;
let polygons = [];
let controllablePolygon = null;
let gravity = null;

function windowResized() {
  createCanvas(windowWidth / 2, windowHeight);
  background(bgColor); // to fix color changing on window resize
}

function setup() {
  createCanvas(windowWidth / 2, windowHeight);
  gravity = createVector(0, 0.98);
  polygons.push(
    new Polygon({
      centre: createVector(300, 300),
      numVertices: 5,
      distFromCentre: 50,
      mass: 100,
      maxSpeed: 3,
      elasticity: 0.5,
      controllable: true,
    })
  );
  for (let i = 0; i < polygonCount - manuallyAddedPolygons; i++) {
    polygons.push(
      new Polygon({
        centre: createVector(
          random(50, windowWidth - 50),
          random(100, windowHeight - 100)
        ),
        numVertices: Math.floor(random(3, 10)),
        distFromCentre: random(20, 30),
        mass: random(5, 100),
        maxSpeed: random(5, 10),
        elasticity: 0.5,
        controllable: true,
      })
    );
  }
  polygons.push(
    new Polygon({
      centre: createVector(200, height / 2 - 125),
      numVertices: 4,
      distFromCentre: 100,
      vertices: [
        createVector(50, height / 2 - 200),
        createVector(350, height / 2 - 100),
        createVector(350, height / 2 - 50),
        createVector(50, height / 2 - 150),
      ],
      mass: 10000,
      maxSpeed: 0,
      elasticity: 0.5,
      movable: false,
    })
  );
  polygons.push(
    new Polygon({
      centre: createVector(550, height / 2),
      numVertices: 4,
      distFromCentre: 100,
      vertices: [
        createVector(700, height / 2 - 50),
        createVector(400, height / 2 + 100),
        createVector(400, height / 2 + 50),
        createVector(700, height / 2 - 100),
      ],
      mass: 10000,
      maxSpeed: 0,
      elasticity: 0.5,
      movable: false,
    })
  );
  polygons.push(
    new Polygon({
      centre: createVector(5, (height / 2 - height + 101) / 2),
      numVertices: 4,
      distFromCentre: width / 2,
      vertices: [
        createVector(-10, height / 2),
        createVector(5, height / 2),
        createVector(5, height - 101),
        createVector(-10, height - 101),
      ],
      mass: 10000,
      maxSpeed: 0,
      elasticity: 0.5,
      movable: false,
    })
  );
  polygons.push(
    new Polygon({
      centre: createVector(width / 2, height),
      numVertices: 4,
      distFromCentre: width / 2,
      vertices: [
        createVector(-10, height - 100),
        createVector(width + 10, height - 100),
        createVector(width + 10, height + 10),
        createVector(-10, height + 10),
      ],
      mass: 10000,
      maxSpeed: 0,
      elasticity: 0.5,
      movable: false,
    })
  );
  polygons.push(
    new Polygon({
      centre: createVector(width + 5, (height / 2 - height + 101) / 2),
      numVertices: 4,
      distFromCentre: width / 2,
      vertices: [
        createVector(width - 5, height / 2),
        createVector(width + 10, height / 2),
        createVector(width + 10, height - 101),
        createVector(width - 5, height - 101),
      ],
      mass: 10000,
      maxSpeed: 0,
      elasticity: 0.5,
      movable: false,
    })
  );
  controllablePolygon = polygons[0];
}

// let frameCounter = 0;

function draw() {
  background(bgColor);

  if (mouseIsPressed) {
    strokeWeight(5);
    line(
      controllablePolygon.centre.x,
      controllablePolygon.centre.y,
      mouseX,
      mouseY
    );
    // polygons.push(
    //   new Polygon({
    //     centre: createVector(mouseX, mouseY),
    //     numVertices: Math.floor(random(4, 10)),
    //     distFromCentre: random(20, 30),
    //     mass: random(5, 100),
    //     maxSpeed: random(5, 10),
    //     elasticity: 0.5,
    //     controllable: true,
    //   })
    // );

    if (polygons[polygons.length - 1].numVertices < 4) console.log("aiusbfwer");

    polygonCount++;
  }

  for (let polygon of polygons) {
    collisionCheck();
    polygon.applyForce(gravity.copy().mult(polygon.mass));
    polygon.update();
  }
  if (controllablePolygon) controllablePolygon.move();

  displayFPS();
  // if (frameCounter < 300) {
  //   saveCanvas(`frame-${nf(frameCounter, 4)}`, "png");
  //   frameCounter++;
  // }
}

function displayFPS() {
  fill(255);
  textSize(16);
  textAlign(RIGHT, TOP);
  text("FPS: " + Math.round(frameRate()), width - 10, 10);
}

function collisionCheck() {
  for (let i = 0; i < polygonCount; i++) {
    for (let j = i + 1; j < polygonCount; j++) {
      let { mtv, collisionPoints } =
        satCollision(polygons[i], polygons[j]) ?? {};
      if (mtv) {
        collisionResolution(polygons[i], polygons[j], mtv, collisionPoints);
      }
    }
  }
}

function collisionResolution(polygon1, polygon2, mtv, collisionPoints) {
  // staticResolve(polygon1, polygon2, mtv);
  // linearResolve(polygon1, polygon2, mtv);
  dynamicResolve(polygon1, polygon2, mtv, collisionPoints);
}

// Touch controls
function touchEnded() {
  if (controllablePolygon) {
    controllablePolygon.applyImpulse(
      p5.Vector.sub(createVector(mouseX, mouseY), controllablePolygon.centre)
    );
  }
  // polygons.push(
  //   new Polygon({
  //     centre: createVector(mouseX, mouseY),
  //     numVertices: Math.floor(random(3, 10)),
  //     distFromCentre: random(20, 30),
  //     mass: random(5, 100),
  //     maxSpeed: random(5, 10),
  //     elasticity: 0.5,
  //     controllable: true,
  //   })
  // );
  // polygonCount++;
}
