import p5 from "p5";
import { Cell, CellWallsDisplay } from "./cell";
import { Maze } from "./maze";

export class Player {
  p: p5;
  position: [number, number];
  dimensions: [number, number];
  visitedCells: Cell[];
  info: { cell: Cell | null; index: number };
  movesCount: number;
  exitFound: boolean;
  showVisitedCells: boolean;
  maze: Maze;

  constructor(_p: p5, _maze: Maze) {
    this.p = _p;
    this.maze = _maze;
    this.visitedCells = [];
    this.movesCount = 0;
    this.exitFound = false;
    this.showVisitedCells = false;

    const [cell, index] = this.maze.getEntryOrExit("entry")!;
    this.info = { cell, index };
    this.dimensions = cell.dimensions.map((dim) => dim * 0.5) as [
      number,
      number
    ];
    this.position = cell.position.map(
      (pos) => pos + this.dimensions[0] * 0.5
    ) as [number, number];

    this.visitedCells.push(cell);
  }

  updatePosition(fromCell: Cell) {
    this.position = fromCell.position.map(
      (pos) => pos + this.dimensions[0] * 0.5
    ) as [number, number];
  }

  move() {
    const moveTo = (
      dx: number,
      dy: number,
      crossWall: keyof CellWallsDisplay
    ) => {
      const { cell, index } = this.info;
      if (!cell) return;

      const rowSize = Math.sqrt(this.maze.cells.length);
      const row = Math.floor(index / rowSize) + dx;
      const col = (index % rowSize) + dy;

      if (row < 0 || row >= rowSize || col < 0 || col >= rowSize) return;

      const nextIndex = row * rowSize + col;
      const next = this.maze.cells[nextIndex];
      const nextWall = cell.getOppositeWallName(crossWall);

      if (!cell.walls[crossWall] && !next.walls[nextWall]) {
        if (this.visitedCells.includes(next)) {
          this.visitedCells.pop();
        } else {
          this.visitedCells.push(next);
        }
        this.info = { cell: next, index: nextIndex };
        this.updatePosition(next);
        this.movesCount++;

        const exit = this.maze.getEntryOrExit("exit");
        if (!exit) return;

        const [, exitIndex] = exit;
        if (this.info.index === exitIndex) {
          this.exitFound = true;
        }
      }
    };

    if (this.p.keyIsPressed) {
      if (this.p.key === "ArrowLeft" || this.p.key === "q") {
        moveTo(-1, 0, "left");
      } else if (this.p.key === "ArrowRight" || this.p.key === "d") {
        moveTo(1, 0, "right");
      } else if (this.p.key === "ArrowUp" || this.p.key === "z") {
        moveTo(0, -1, "top");
      } else if (this.p.key === "ArrowDown" || this.p.key === "s") {
        moveTo(0, 1, "bottom");
      }
    }
  }

  draw() {
    const [x, y] = this.position;
    const [w, h] = this.dimensions;

    this.p.noStroke();
    this.p.fill(249, 194, 14);
    this.p.ellipse(x + w * 0.5, y + h * 0.25, w * 0.7, h);

    if (this.showVisitedCells) {
      for (let i = 1; i < this.visitedCells.length; i++) {
        this.p.noFill();
        this.p.stroke(255, 255, 0);
        const [px, py] = this.visitedCells[i - 1].position;
        const [pw, ph] = this.visitedCells[i - 1].dimensions;
        const [x, y] = this.visitedCells[i].position;
        const [w, h] = this.visitedCells[i].dimensions;
        this.p.line(px + pw / 2, py + ph / 2, x + w / 2, y + h / 2);
      }
    }
  }
}
