import p5 from "p5";
import { Bullet } from "./bullet";

export class Tower {
  p: p5;
  x: number;
  y: number;
  radius: number;
  bullets: Bullet[];
  firerate: number;
  lastShot: number;

  constructor(p: p5, radius: number) {
    this.p = p;
    this.x = p.width / 2;
    this.y = p.height / 2;
    this.radius = radius;
    this.bullets = [];
    this.firerate = 150; // delay in ms between shots
    this.lastShot = 0;
  }

  fire() {
    const now = this.p.millis();

    if (now - this.lastShot < this.firerate) return;

    this.lastShot = now;

    this.bullets.push(
      new Bullet(this.p, this.x, this.y, 10, this.p.mouseX, this.p.mouseY),
    );
  }

  manage() {
    for (let index = 0; index < this.bullets.length; index++) {
      const bullet = this.bullets[index];

      bullet.travel();
      bullet.draw();

      if (bullet.isOutOfBounds()) {
        this.bullets.splice(index, 1);
      }
    }
  }

  draw() {
    this.p.fill(40, 40, 200);
    this.p.ellipse(this.x, this.y, this.radius, this.radius);
  }
}
