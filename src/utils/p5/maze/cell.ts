import p5 from "p5";

type CellType = "normal" | "entry" | "exit";
type CellWallsDisplay = {
  left: boolean;
  right: boolean;
  top: boolean;
  bottom: boolean;
};

export class Cell {
  p: p5;
  position: [number, number];
  dimensions: [number, number];
  type: CellType;
  isVisited: boolean;
  walls: CellWallsDisplay;

  constructor(
    _p: p5,
    _position: [number, number],
    _dimensions: [number, number],
    _type: CellType
  ) {
    this.p = _p;
    this.position = _position;
    this.dimensions = _dimensions;
    this.type = _type;
    this.isVisited = false;
    this.walls = {
      left: true,
      right: true,
      top: true,
      bottom: true,
    };
  }

  getOppositeWallName(name: keyof CellWallsDisplay): keyof CellWallsDisplay {
    if (name === "left") return "right";
    if (name === "right") return "left";
    if (name === "bottom") return "top";
    if (name === "top") return "bottom";
    return name;
  }

  draw() {
    const [x, y] = this.position;
    const [w, h] = this.dimensions;

    if (this.type !== "normal") {
      this.p.noStroke();
      if (this.type === "entry") {
        this.p.fill(2, 224, 36);
      } else {
        this.p.fill(235, 64, 12);
      }
      this.p.rect(x, y, w, h);
    }

    this.p.stroke(190);
    this.p.strokeWeight(2);

    if (this.walls.left) {
      this.p.line(x, y, x, y + h);
    }

    if (this.walls.right) {
      this.p.line(x + w, y, x + w, y + h);
    }

    if (this.walls.top) {
      this.p.line(x, y, x + w, y);
    }

    if (this.walls.bottom) {
      this.p.line(x, y + h, x + w, y + h);
    }
  }
}

export type { CellType, CellWallsDisplay };
