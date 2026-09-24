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
    this.p.fill(255);
    this.p.rect(this.x, this.y, this.w, this.h);
  }
}
