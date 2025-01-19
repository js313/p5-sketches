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
  // To prevent polygons slowly sinking into each other as the linear resolution
  // does not depend on how much the polygons are overlapping
  staticResolve(polygon1, polygon2, mtv);

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

function dynamicResolve(polygon1, polygon2, mtv, collisionPoints) {
  staticResolve(polygon1, polygon2, mtv);

  collisionPoints = collisionPoints.map((pointInfo) =>
    pointInfo.polygon === 1
      ? polygon1.vertices[pointInfo.pointIndex]
      : polygon2.vertices[pointInfo.pointIndex]
  );

  let impulsesToApply = [];

  let collisionAxis = mtv.copy().normalize();
  let cor = min(polygon1.elasticity, polygon2.elasticity);

  for (let cPoint of collisionPoints) {
    let r1 = cPoint.copy().sub(polygon1.centre);
    let r2 = cPoint.copy().sub(polygon2.centre);

    let r1p = createVector(-r1.y, r1.x);
    let r2p = createVector(-r2.y, r2.x);

    let angularVel1 = p5.Vector.mult(r1p, polygon1.angularVelocity);
    let angularVel2 = p5.Vector.mult(r2p, polygon2.angularVelocity);

    let vrel = p5.Vector.add(polygon2.velocity, angularVel2)
      .sub(p5.Vector.add(polygon1.velocity, angularVel1))
      .dot(collisionAxis);

    if (vrel >= 0) continue;

    let numerator = vrel * (1 + cor);

    let r1pDotN = p5.Vector.dot(r1p, collisionAxis);
    let r2pDotN = p5.Vector.dot(r2p, collisionAxis);

    let denominator =
      polygon1.invMass +
      polygon2.invMass +
      r1pDotN * r1pDotN * polygon1.invMomentOfInertia +
      r2pDotN * r2pDotN * polygon2.invMomentOfInertia;

    let j = numerator / denominator;

    j /= collisionPoints.length;

    let impulseVector = collisionAxis.copy().mult(j);

    impulsesToApply.push({ cPoint, impulse: impulseVector });
  }

  impulsesToApply.forEach((impulse) => {
    if (polygon1.movable) {
      polygon1.applyRotationImpulse(impulse.impulse, impulse.cPoint);
      polygon1.applyImpulse(impulse.impulse);
    }
    if (polygon2.movable) {
      impulse.impulse.mult(-1);
      polygon2.applyRotationImpulse(impulse.impulse, impulse.cPoint);
      polygon2.applyImpulse(impulse.impulse);
    }
  });
}
