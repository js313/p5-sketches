function staticResolve(polygon1, polygon2, mtv) {
  let mtvHalf = mtv.copy().mult(0.5);
  let nMtvHalf = mtv.copy().mult(-0.5);
  let nMtv = mtv.copy().mult(-1);

  let p1Movable = polygon1.movable;
  let p2Movable = polygon2.movable;

  let p1Mass = polygon1.mass;
  let p2Mass = polygon2.mass;
  let totalMass = p1Mass + p2Mass;

  if (p1Movable && p2Movable) {
    polygon1.moveBy(nMtvHalf.mult(p2Mass / totalMass));
    polygon2.moveBy(mtvHalf.mult(p1Mass / totalMass));
  } else if (p1Movable) {
    polygon1.moveBy(nMtv);
  } else if (p2Movable) {
    polygon2.moveBy(mtv);
  }
}

function linearResolve(polygon1, polygon2, mtv) {
  let collisionAxis = mtv.copy().normalize();
  let vrel = polygon2.velocity.copy().sub(polygon1.velocity).dot(collisionAxis);

  // Ignore if the polygons are separating or stationary
  if (vrel >= 0) return;

  // Coefficient of restitution (elasticity)
  let cor = min(polygon1.elasticity, polygon2.elasticity);

  // Impulse magnitude
  let numerator = vrel * (1 + cor);
  let impulse = numerator / (polygon1.invMass + polygon2.invMass);

  // Impulse vectors
  let impulseVector = collisionAxis.copy().mult(impulse);

  // Apply impulses
  if (polygon1.movable) polygon1.applyImpulse(impulseVector);
  if (polygon2.movable) polygon2.applyImpulse(impulseVector.mult(-1));
}
