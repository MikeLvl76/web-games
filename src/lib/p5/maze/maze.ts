import p5 from "p5";
import { Cell, CellType, CellWallsDisplay } from "./cell";

export class Maze {
  p: p5;
  cells: Cell[];

  constructor(_p: p5, size: number) {
    this.p = _p;
    this.cells = [];
    for (let i = 0; i < size; i++) {
      const rowSize = Math.sqrt(size);
      const row = Math.floor(i / rowSize);
      const col = i % rowSize;

      this.cells.push(
        new Cell(
          this.p,
          [(this.p.width / rowSize) * row, (this.p.height / rowSize) * col],
          [this.p.width / rowSize, this.p.height / rowSize],
          "normal"
        )
      );
    }

    this.generate();
    this.setEntryAndExit();
  }

  isEmpty() {
    return !this.cells.length;
  }

  randomCell(): [Cell, number] | null {
    if (this.isEmpty()) return null;
    const index = Math.floor(Math.random() * this.cells.length);

    return [this.cells[index], index];
  }

  setEntryAndExit() {
    const entry = this.randomCell();
    if (!entry) return;
    let exit = this.randomCell();

    while (exit && exit[1] === entry[1]) {
      exit = this.randomCell();
    }

    if (!exit) return;

    const [entryCell] = entry;
    const [exitCell] = exit;

    entryCell.type = "entry";
    exitCell.type = "exit";
  }

  getEntryOrExit(_type: Exclude<CellType, "normal">): [Cell, number] | null {
    for (let i = 0; i < this.cells.length; i++) {
      const cell = this.cells[i];
      if (cell.type === _type) {
        return [cell, i];
      }
    }

    return null;
  }

  cellNeighbors(index: number, includeVisited: boolean) {
    const rowSize = Math.sqrt(this.cells.length);
    const row = Math.floor(index / rowSize);
    const col = index % rowSize;

    if (row < 0 || row >= rowSize || col < 0 || col >= rowSize) return [];

    const neighbors: Record<
      keyof CellWallsDisplay,
      { cell: Cell | null; index: number }
    > = {
      left: { cell: null, index: -1 },
      right: { cell: null, index: -1 },
      top: { cell: null, index: -1 },
      bottom: { cell: null, index: -1 },
    };

    if (row - 1 >= 0) {
      const cellIndex = (row - 1) * rowSize + col;
      const cell = this.cells[cellIndex];
      neighbors.left = { cell, index: cellIndex };
    }

    if (row + 1 < rowSize) {
      const cellIndex = (row + 1) * rowSize + col;
      const cell = this.cells[cellIndex];
      neighbors.right = { cell, index: cellIndex };
    }

    if (col - 1 >= 0) {
      const cellIndex = row * rowSize + (col - 1);
      const cell = this.cells[cellIndex];
      neighbors.top = { cell, index: cellIndex };
    }

    if (col + 1 < rowSize) {
      const cellIndex = row * rowSize + (col + 1);
      const cell = this.cells[cellIndex];
      neighbors.bottom = { cell, index: cellIndex };
    }

    return Object.entries(neighbors).filter(
      ([, neighbor]) =>
        neighbor.cell && neighbor.cell.isVisited === includeVisited
    );
  }

  generate() {
    //     Randomized Depth-First Search
    //     1. Choose the initial cell, mark it as visited and push it to the stack
    //     2. While the stack is not empty
    // 	      1. Pop a cell from the stack and make it a current cell
    //      	2. If the current cell has any neighbours which have not been visited
    // 		      1. Push the current cell to the stack
    // 		      2. Choose one of the unvisited neighbours
    // 		      3. Remove the wall between the current cell and the chosen cell
    // 		      4. Mark the chosen cell as visited and push it to the stack

    const stack: { value: Cell; index: number }[] = [];
    const random = this.randomCell();
    if (!random) return;

    const [cell, index] = random;
    cell.isVisited = true;
    stack.push({ value: cell, index });

    while (stack.length > 0) {
      const current = stack.pop();
      if (!current) return;

      const neighbors = this.cellNeighbors(current.index, false);

      if (neighbors.length > 0) {
        stack.push(current);

        const [neighborWallName, neighbor] =
          neighbors[Math.floor(Math.random() * neighbors.length)];

        if (!neighbor.cell) return;

        const wall = neighbor.cell.getOppositeWallName(
          neighborWallName as keyof CellWallsDisplay
        );

        current.value.walls[neighborWallName as keyof CellWallsDisplay] = false;
        neighbor.cell.walls[wall as keyof CellWallsDisplay] = false;
        neighbor.cell.isVisited = true;

        stack.push({ value: neighbor.cell, index: neighbor.index });
      }
    }

    this.cells.forEach((c) => {
      c.isVisited = false;
    });
  }

  draw() {
    this.cells.forEach((cell) => cell.draw());
  }
}
