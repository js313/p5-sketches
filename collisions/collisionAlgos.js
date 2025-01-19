/// <reference path="../node_modules/@types/p5/global.d.ts" />

function satCollision(polygon1, polygon2) {
  const normals = [
    // ...polygon1.edges.map((edge) => p5.Vector.rotate(edge, PI / 2)),
    // ...polygon2.edges.map((edge) => p5.Vector.rotate(edge, PI / 2)),
    ...polygon1.edges.map((edge) => createVector(-edge.y, edge.x).normalize()),
    ...polygon2.edges.map((edge) => createVector(-edge.y, edge.x).normalize()),
  ];

  let overlap = Infinity;
  let mtv = null;

  for (let i = 0; i < normals.length; i++) {
    normal = normals[i];
    let min1 = Infinity,
      max1 = -Infinity;
    polygon1.vertices.forEach((vertex) => {
      min1 = min(min1, p5.Vector.dot(normal, vertex));
      max1 = max(max1, p5.Vector.dot(normal, vertex));
    });
    let min2 = Infinity,
      max2 = -Infinity;
    polygon2.vertices.forEach((vertex) => {
      min2 = min(min2, p5.Vector.dot(normal, vertex));
      max2 = max(max2, p5.Vector.dot(normal, vertex));
    });

    if (min2 > max1 || max2 < min1) return null;

    if (min(max1, max2) - max(min1, min2) < overlap) {
      overlap = min(max1, max2) - max(min1, min2);
      mtv = normal;
    }

    overlap = min(overlap, min(max1, max2) - max(min1, min2));
  }
  // To make sure the direction of the collision axis is from polygon1 to polygon2
  let direction = polygon2.centre.copy().sub(polygon1.centre).normalize();
  if (p5.Vector.dot(direction, mtv) < 0) mtv.mult(-1);
  return {
    mtv: mtv.mult(overlap),
    collisionPoints: getCollisionPoints(polygon1, polygon2),
  };
}

function getCollisionPoints(polygon1, polygon2) {
  let collisionPointIndices = [];

  // Check points of polygon1 against polygon2
  polygon1.vertices.forEach((vertex, index) => {
    if (isPointInsidePolygon(vertex, polygon2.vertices)) {
      collisionPointIndices.push({ polygon: 1, pointIndex: index });
    }
  });

  // Check points of polygon2 against polygon1
  polygon2.vertices.forEach((vertex, index) => {
    if (isPointInsidePolygon(vertex, polygon1.vertices)) {
      collisionPointIndices.push({ polygon: 2, pointIndex: index });
    }
  });

  return collisionPointIndices;
}

// Ray cast method
function isPointInsidePolygon(point, vertices) {
  let vertLen = vertices.length;
  let y = point.y,
    minDx = point.x;
  let numIntersections = 0;

  for (let i = 0; i < vertLen; i++) {
    let x1 = vertices[i].x,
      y1 = vertices[i].y;
    let x2 = vertices[(i + 1) % vertLen].x,
      y2 = vertices[(i + 1) % vertLen].y;

    // Check for horizontal ray crossing
    if (y1 > y2) {
      // Swap if y1 is greater than y2
      [x1, y1, x2, y2] = [x2, y2, x1, y1];
    }

    // Only check for intersection if the point is in the y-range of the edge
    if (y > y1 && y <= y2) {
      let intersectionX = x1 + ((y - y1) * (x2 - x1)) / (y2 - y1);
      if (intersectionX >= minDx) {
        numIntersections++;
      }
    }
  }

  return numIntersections % 2 !== 0; // Odd intersections mean inside
}
