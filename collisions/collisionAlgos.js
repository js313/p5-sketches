/// <reference path="../node_modules/@types/p5/global.d.ts" />

function satCollision(polygon1, polygon2) {
  const normals = [
    // ...polygon1.edges.map((edge) => p5.Vector.rotate(edge, PI / 2)),
    // ...polygon2.edges.map((edge) => p5.Vector.rotate(edge, PI / 2)),
    ...polygon1.edges.map((edge) => createVector(-edge.y, edge.x).normalize()),
    ...polygon2.edges.map((edge) => createVector(-edge.y, edge.x).normalize()),
  ];

  let overlap = Infinity;
  let collisionAxis = null;

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
      collisionAxis = normal;
    }

    overlap = min(overlap, min(max1, max2) - max(min1, min2));
  }

  // To make sure the direction of the collision axis is from polygon1 to polygon2
  let direction = polygon2.centre.copy().sub(polygon1.centre).normalize();
  if (p5.Vector.dot(direction, collisionAxis) < 0) collisionAxis.mult(-1);
  return collisionAxis.mult(overlap);
}
