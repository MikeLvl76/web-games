import p5 from "p5";
import { Food } from "./food";

type KeyDirection = "up" | "down" | "left" | "right";
const directions = ["up", "down", "left", "right"] as const;

type SnakePart = {
  x: number;
  y: number;
  r: number;
  px: number;
  py: number;
};

export class Snake {
  direction: KeyDirection;
  speed: number;
  body: SnakePart[];
  p: p5;

  constructor(_p: p5, startSize?: number) {
    this.p = _p;
    this.direction = directions[Math.floor(Math.random() * directions.length)];
    this.speed = 2 + Math.floor(Math.random() * 3);
    this.body = Array.from({ length: startSize ?? 3 }, (_, i) => ({
      x: this.p.width * 0.5,
      y: this.p.height * 0.5 + 20 * i,
      r: 20,
      px: this.p.width * 0.5,
      py: this.p.height * 0.5 + 20 * i,
    }));
  }

  setDirection(direction: KeyDirection) {
    if (
      (direction === "left" && this.direction !== "right") ||
      (direction === "right" && this.direction !== "left") ||
      (direction === "up" && this.direction !== "down") ||
      (direction === "down" && this.direction !== "up")
    ) {
      this.direction = direction;
    }
  }

  move() {
    this.body.forEach((part) => {
      part.px = part.x;
      part.py = part.y;
    });

    const head = this.body[0];
    if (this.direction === "left") {
      head.x -= this.speed;
    } else if (this.direction === "right") {
      head.x += this.speed;
    } else if (this.direction === "up") {
      head.y -= this.speed;
    } else if (this.direction === "down") {
      head.y += this.speed;
    }

    for (let i = 1; i < this.body.length; i++) {
      this.body[i].x = this.body[i - 1].px;
      this.body[i].y = this.body[i - 1].py;
    }
  }

  eat(food: Food, onsuccess?: (snake: Snake, food: Food) => void) {
    const head = this.body[0];
    if (this.p.dist(head.x, head.y, food.x, food.y) < food.r) {
      const tail = this.body[this.body.length - 1];
      this.body.push({
        ...tail,
        x: food.x,
        y: food.y,
        px: tail.x,
        py: tail.y,
      });
      this.speed += 0.2;
      food.randomizeLocation();
      food.randomizeColor();
      if (onsuccess) {
        onsuccess(this, food);
      }
    }
  }

  isCrossing() {
    const { x, y } = this.body[0];
    return x > this.p.width || x < 0 || y > this.p.height || y < 0;
  }

  draw() {
    this.p.noStroke();
    this.p.fill(0, 255, 0);
    this.body.slice(1, this.body.length).forEach(({ x, y, r }) => {
      this.p.ellipse(x, y, r, r);
    });

    this.p.fill(0, 127, 0);
    const head = this.body[0];
    this.p.ellipse(head.x, head.y, head.r * 1.1, head.r * 1.2);
  }
}
