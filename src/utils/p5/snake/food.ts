import p5 from "p5";

export class Food {
  x: number;
  y: number;
  r: number;
  color: [number, number, number];
  p: p5;

  constructor(_p: p5, r: number) {
    this.p = _p;
    this.x = 0;
    this.y = 0;
    this.color = [0, 0, 0];
    this.r = r;
    this.randomizeLocation();
    this.randomizeColor();
  }

  randomizeLocation() {
    this.x = this.p.random(this.r, this.p.width - this.r);
    this.y = this.p.random(this.r, this.p.height - this.r);
  }

  randomizeColor() {
    this.color = [
      this.p.random(0, 255),
      this.p.random(0, 255),
      this.p.random(0, 255),
    ];
  }

  draw() {
    this.p.fill(this.color);
    this.p.stroke(255);
    this.p.strokeWeight(1);
    this.p.ellipse(this.x, this.y, this.r, this.r);
  }
}
