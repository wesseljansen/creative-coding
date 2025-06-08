let cols = 8;
let rows = 8;
let spacing;
let points = [];
let easing = 0.1;
let maxOffset = 10;
let influenceRadius = 150;
let cells = [];

function setup() {
  createCanvas(600, 600);
  spacing = width / cols;
  strokeWeight(1.5);
  noFill();

  // Initialize grid points
  for (let y = 0; y < rows; y++) {
    points[y] = [];
    for (let x = 0; x < cols; x++) {
      let baseX = x * spacing + spacing / 2;
      let baseY = y * spacing + spacing / 2;
      points[y][x] = {
        baseX: baseX,
        baseY: baseY,
        x: baseX,
        y: baseY
      };
    }
  }

  // Initialize cell states (false = white, true = black)
  for (let y = 0; y < rows - 1; y++) {
    cells[y] = [];
    for (let x = 0; x < cols - 1; x++) {
      cells[y][x] = false;
    }
  }
}

function draw() {
  background(0);

  // Update point positions based on mouse
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      let pt = points[y][x];
      let distance = dist(mouseX, mouseY, pt.baseX, pt.baseY);

      let offsetX = 0;
      let offsetY = 0;

      if (distance < influenceRadius) {
        offsetX = map(abs(mouseX - pt.baseX), 0, influenceRadius, maxOffset, 0);
        offsetY = map(abs(mouseY - pt.baseY), 0, influenceRadius, maxOffset, 0);

        offsetX *= mouseY < pt.baseY ? -1 : 1;
        offsetY *= mouseX < pt.baseX ? -1 : 1;
      }

      pt.x += ((pt.baseX + offsetX) - pt.x) * easing;
      pt.y += ((pt.baseY + offsetY) - pt.y) * easing;
    }
  }

  // Draw cell backgrounds with straight edges
  noStroke();
  for (let y = 0; y < rows - 1; y++) {
    for (let x = 0; x < cols - 1; x++) {
      let p1 = points[y][x];
      let p2 = points[y][x + 1];
      let p3 = points[y + 1][x + 1];
      let p4 = points[y + 1][x];

      fill(cells[y][x] ? 0 : 255);

      beginShape();
      vertex(p1.x, p1.y);
      vertex(p2.x, p2.y);
      vertex(p3.x, p3.y);
      vertex(p4.x, p4.y);
      endShape(CLOSE);
    }
  }

  // Draw horizontal lines
  stroke(0);
  noFill();
  for (let y = 0; y < rows; y++) {
    beginShape();
    curveVertex(points[y][0].x, points[y][0].y);
    for (let x = 0; x < cols; x++) {
      curveVertex(points[y][x].x, points[y][x].y);
    }
    curveVertex(points[y][cols - 1].x, points[y][cols - 1].y);
    endShape();
  }

  // Draw vertical lines
  for (let x = 0; x < cols; x++) {
    beginShape();
    curveVertex(points[0][x].x, points[0][x].y);
    for (let y = 0; y < rows; y++) {
      curveVertex(points[y][x].x, points[y][x].y);
    }
    curveVertex(points[rows - 1][x].x, points[rows - 1][x].y);
    endShape();
  }
}

function mousePressed() {
  for (let y = 0; y < rows - 1; y++) {
    for (let x = 0; x < cols - 1; x++) {
      let p1 = points[y][x];
      let p2 = points[y][x + 1];
      let p3 = points[y + 1][x + 1];
      let p4 = points[y + 1][x];

      let minX = min(p1.x, p2.x, p3.x, p4.x);
      let maxX = max(p1.x, p2.x, p3.x, p4.x);
      let minY = min(p1.y, p2.y, p3.y, p4.y);
      let maxY = max(p1.y, p2.y, p3.y, p4.y);

      if (mouseX > minX && mouseX < maxX && mouseY > minY && mouseY < maxY) {
        cells[y][x] = !cells[y][x];
        return;
      }
    }
  }
}