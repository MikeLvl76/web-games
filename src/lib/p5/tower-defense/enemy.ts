import p5 from "p5";
import { Tower } from "./tower";
import { Bullet } from "./bullet";

export class Enemy {
  p: p5;
  x: number;
  y: number;
  radius: number;
  target: Tower;
  dx: number;
  dy: number;
  speed: number;

  constructor(p: p5, radius: number, target: Tower) {
    this.p = p;
    this.radius = radius;
    const { x, y } = this.getPositionOutside(p.width, p.height);
    this.x = x;
    this.y = y;
    this.target = target;
    const angle = Math.atan2(target.y - this.y, target.x - this.x);
    this.dx = Math.cos(angle);
    this.dy = Math.sin(angle);
    this.speed = 0.025;
  }

  getPositionOutside(width: number, height: number) {
    const side = this.p.floor(this.p.random(4));

    let x: number;
    let y: number;

    if (side === 0) {
      x = -this.radius;
      y = this.p.random(-this.radius, height + this.radius);
    } else if (side === 1) {
      x = width + this.radius;
      y = this.p.random(-this.radius, height + this.radius);
    } else if (side === 2) {
      x = this.p.random(-this.radius, width + this.radius);
      y = -this.radius;
    } else {
      x = this.p.random(-this.radius, width + this.radius);
      y = height + this.radius;
    }

    return { x, y };
  }

  setPosition(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  move() {
    const delta = this.speed * this.p.deltaTime;

    this.setPosition(this.x + this.dx * delta, this.y + this.dy * delta);
  }

  hitTarget() {
    return (
      this.p.dist(this.x, this.y, this.target.x, this.target.y) <
      this.target.radius * 0.6
    );
  }

  hitBy(bullets: Bullet[]) {
    for (const bullet of bullets) {
      if (this.p.dist(this.x, this.y, bullet.x, bullet.y) < this.radius * 0.6) {
        return true;
      }
    }
    return false;
  }

  draw() {
    this.p.fill(200, 40, 40);
    this.p.ellipse(this.x, this.y, this.radius, this.radius);
  }
}
