import p5 from "p5";
import { Enemy } from "./enemy";
import { Tower } from "./tower";
import { Bullet } from "./bullet";

export class EnemyGenerator {
  p: p5;
  count: number | "unlimited";
  displayCount: number;
  target: Tower;
  enemies: Enemy[];

  constructor(
    p: p5,
    count: number | "unlimited",
    displayCount: number,
    target: Tower,
  ) {
    this.p = p;
    this.count = count;
    this.displayCount = displayCount;
    this.target = target;
    this.enemies = Array(displayCount).fill(new Enemy(p, 20, target));
  }

  generate() {
    if (this.enemies.length < this.displayCount) {
      const range = this.displayCount - this.enemies.length;
      if (this.count !== "unlimited") {
        this.count -= range;
        if (this.count <= 0) {
          // cannot generate more enemies
          return;
        }
      }
      for (let i = 0; i < range; i++) {
        this.enemies.push(new Enemy(this.p, 20, this.target));
      }
    }
  }

  manage(bullets: Bullet[]) {
    for (let index = 0; index < this.enemies.length; index++) {
      const enemy = this.enemies[index];

      enemy.move();
      enemy.draw();

      if (enemy.hitTarget() || enemy.hitBy(bullets)) {
        this.enemies.splice(index, 1);
      }
    }
  }
}
