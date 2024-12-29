class Cell {
  constructor(i, j, x, y, w, h) {
    this.i = i;
    this.j = j;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.visited = false;
    this.on = false;
    this.walls = [true, true, true, true];
  }
  show() {
    if (this.visited) {
      fill("#908a76");
      noStroke();
      rect(this.x, this.y, this.w, this.h);
    }
    if (this.on) {
      fill("#fff4d6");
      noStroke();
      rect(this.x, this.y, this.w, this.h);
    }
    stroke(255);
    this.walls[0] && line(this.x, this.y, this.x + this.w, this.y);
    this.walls[1] && line(this.x, this.y, this.x, this.y + this.h);
    this.walls[2] &&
      line(this.x, this.y + this.h, this.x + this.w, this.y + this.h);
    this.walls[3] &&
      line(this.x + this.w, this.y, this.x + this.w, this.y + this.h);
  }
  mark() {
    this.visited = true;
  }
  currentMark() {
    this.on = true;
  }
  currentUnMark() {
    this.on = false;
  }
  checkNeighbours() {
    let n = [];
    let i = this.i;
    let j = this.j;
    if (i > 0 && !grid[i - 1][j].visited) n.push(grid[i - 1][j]);
    if (i < grid.length - 1 && !grid[i + 1][j].visited) n.push(grid[i + 1][j]);
    if (j > 0 && !grid[i][j - 1].visited) n.push(grid[i][j - 1]);
    if (j < grid[i].length - 1 && !grid[i][j + 1].visited)
      n.push(grid[i][j + 1]);
    return n;
  }
  removeWall(next) {
    if (!next) return;
    let ni = next.i;
    let nj = next.j;
    if (ni < this.i) {
      this.walls[1] = false;
      next.walls[3] = false;
    } else if (ni > this.i) {
      this.walls[3] = false;
      next.walls[1] = false;
    } else if (nj < this.j) {
      this.walls[0] = false;
      next.walls[2] = false;
    } else if (nj > this.j) {
      this.walls[2] = false;
      next.walls[0] = false;
    }
  }
}
