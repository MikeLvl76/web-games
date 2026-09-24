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

    return this.x + this.w / 2 > obstacle.x + obstacle.w / 2 && this.y - this.h < obstacle.y - obstacle.h / 2;
  }

  draw() {
    this.p.fill(255);
    this.p.rect(this.x, this.y, this.w, this.h);
  }
}
