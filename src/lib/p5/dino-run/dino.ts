import p5 from "p5";

export class Dino {

    p: p5;
    x: number;
    defaultY: number;
    y: number;
    acc: number;
    isJumping: boolean;

    constructor(p: p5) {
        this.p = p;
        this.x = p.width * 0.2;
        this.defaultY = p.height * 0.8;
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

    draw() {
        this.p.fill(255);
        this.p.rect(this.x, this.y, 40, 40);
    }
}