import p5 from "p5";
import { Obstacle } from "./obstacle";

export class Dino {
  p: p5;
  x: number;
  defaultY: number;
  y: number;
  w: number;
  h: number;
  acc: number;
  isJumping: boolean;

  constructor(p: p5, groundHeight: number) {
    this.p = p;
    this.x = p.width * 0.2;
    this.w = 40;
    this.h = 40;
    this.defaultY = groundHeight - this.h;
    this.y = this.defaultY;
    this.acc = 8.0;
    this.isJumping = false;
  }

  startJump() {
    if (this.isJumping) return;
    this.isJumping = true;
  }

  handleJump() {
    if (!this.isJumping) return;

    this.y -= this.acc;
    this.acc -= 0.1;

    if (this.y >= this.defaultY) {
      this.isJumping = false;
      this.y = this.defaultY;
      this.acc = 8.0;
    }
  }

  hit(obstacle: Obstacle) {
    return (
      this.x + this.w >= obstacle.x &&
      this.x + this.w <= obstacle.x + obstacle.w &&
      this.y - this.h >= obstacle.y - obstacle.h / 2
    );
  }

  hasJumpedOver(obstacle: Obstacle) {
    if (this.hit(obstacle)) return false;

    return (
      this.x + this.w / 2 > obstacle.x + obstacle.w / 2 &&
      this.y - this.h < obstacle.y - obstacle.h / 2
    );
  }

  draw() {
    this.p.fill(200, 200, 0);
    this.p.push();

    this.p.translate(this.x, this.y);

    const sx = this.w / 100;
    const sy = this.h / 100;

    this.p.scale(sx, sy);

    this.p.beginShape();

    // Tail
    this.p.vertex(0, 60);
    this.p.vertex(15, 55);
    this.p.vertex(25, 45);

    // Back
    this.p.vertex(30, 35);
    this.p.vertex(45, 30);

    // Neck
    this.p.vertex(50, 20);
    this.p.vertex(55, 5);

    // Head
    this.p.vertex(60, 0);
    this.p.vertex(85, 0);
    this.p.vertex(95, 10);
    this.p.vertex(95, 25);

    // Snout
    this.p.vertex(100, 25);
    this.p.vertex(100, 40);
    this.p.vertex(85, 40);

    // Jaw / neck
    this.p.vertex(80, 50);
    this.p.vertex(70, 50);

    // Chest
    this.p.vertex(70, 70);

    // Front leg
    this.p.vertex(75, 70);
    this.p.vertex(75, 100);
    this.p.vertex(65, 100);
    this.p.vertex(65, 75);

    // Belly
    this.p.vertex(40, 75);

    // Back leg
    this.p.vertex(40, 100);
    this.p.vertex(30, 100);
    this.p.vertex(30, 70);

    // Tail underside
    this.p.vertex(20, 65);
    this.p.vertex(0, 70);

    this.p.endShape(this.p.CLOSE);

    // Eye
    this.p.fill(255);
    this.p.circle(82, 15, 5);

    this.p.fill(0);
    this.p.circle(82, 15, 2);

    this.p.pop();
  }
}
