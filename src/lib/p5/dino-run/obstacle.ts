import p5 from "p5";

export class Obstacle {
  p: p5;
  x: number;
  y: number;
  w: number;
  h: number;
  groundHeight: number;
  scrollSpeed: number;

  constructor(p: p5, groundHeight: number) {
    this.p = p;
    this.x = p.width * 0.6;
    this.w = p.random(40, 80);
    this.h = p.random(120, 220);
    this.y = groundHeight - this.h;
    this.groundHeight = groundHeight;
    this.scrollSpeed = 4.0;
  }

  scroll() {
    this.x -= this.scrollSpeed;
    if (this.x + this.w <= 0) {
      this.x = this.p.width + this.w / 2;
      this.w = this.p.random(40, 80);
      this.h = this.p.random(120, 220);
      this.y = this.groundHeight - this.h;
    }
  }

  increaseScrollSpeed(n: number) {
    this.scrollSpeed += n;
  }

  draw() {
    this.p.fill(10, 200, 10);
    this.p.push();

    this.p.translate(this.x, this.y);

    const sx = this.w / 100;
    const sy = this.h / 100;

    this.p.scale(sx, sy);

    this.p.beginShape();

    // Main stem - bottom
    this.p.vertex(40, 100);
    this.p.vertex(40, 20);

    // Left arm
    this.p.vertex(25, 20);
    this.p.vertex(25, 45);
    this.p.vertex(15, 45);
    this.p.vertex(15, 35);
    this.p.vertex(5, 35);
    this.p.vertex(5, 50);
    this.p.vertex(15, 50);
    this.p.vertex(15, 60);
    this.p.vertex(25, 60);
    this.p.vertex(25, 100);

    // Bottom of main stem
    this.p.vertex(75, 100);

    // Right arm
    this.p.vertex(75, 55);
    this.p.vertex(85, 55);
    this.p.vertex(85, 45);
    this.p.vertex(95, 45);
    this.p.vertex(95, 30);
    this.p.vertex(85, 30);
    this.p.vertex(85, 40);
    this.p.vertex(75, 40);

    // Top of main stem
    this.p.vertex(75, 20);
    this.p.vertex(70, 10);
    this.p.vertex(60, 5);
    this.p.vertex(50, 10);
    this.p.vertex(40, 20);

    this.p.endShape(this.p.CLOSE);

    this.p.pop();
  }
}
