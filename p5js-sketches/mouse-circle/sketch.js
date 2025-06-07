function setup() {
  createCanvas(600, 400);
  background(255);
}

function draw() {
  fill(0, 100);
  noStroke();
  ellipse(mouseX, mouseY, 30, 30);
}