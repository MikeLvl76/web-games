import p5 from "p5";

export class Bullet {
  p: p5;
  x: number = 0;
  y: number = 0;
  radius: number;
  dx: number;
  dy: number;

  constructor(
    p: p5,
    x: number,
    y: number,
    radius: number,
    destX: number,
    destY: number,
  ) {
    this.p = p;
    this.setPosition(x, y);
    this.radius = radius;
    const angle = Math.atan2(destY - y, destX - x);
    this.dx = Math.cos(angle);
    this.dy = Math.sin(angle);
  }

  setPosition(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  travel() {
    const speed = 0.25 * this.p.deltaTime;

    this.setPosition(this.x + this.dx * speed, this.y + this.dy * speed);
  }

  isOutOfBounds() {
    return (
      this.x + this.radius / 2 < 0 ||
      this.x - this.radius / 2 > this.p.width ||
      this.y + this.radius / 2 < 0 ||
      this.y - this.radius / 2 > this.p.height
    );
  }

  draw() {
    this.p.fill(200, 190, 40);
    this.p.ellipse(this.x, this.y, this.radius, this.radius);
  }
}
