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
