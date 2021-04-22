'use strict';

class Game {
    constructor(ctx) {
        this.alive = true;
        this.arrayOfStars = [];
        this.ctx = ctx;
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.prepareInGameBackground();
    }

    draw() {
        this.drawBackground();
        return this.alive;
    }

    drawBackground() {
        this.ctx.beginPath();
        this.ctx.fillStyle = "#0c0b38"
        this.ctx.fillRect(0, 0, this.width, this.height);
        for (let star of this.arrayOfStars) {
            this.ctx.beginPath();
            this.ctx.fillStyle = `rgba(156,155,155,${Math.sin(-Date.now() * 0.0000001 + (star.x + star.y) * 0.1)})`
            this.ctx.fillRect(star.x, star.y, 4, 4);
            this.ctx.closePath();
            star.x -= 0.05;
            star.y -= 0.05;
            if (star.x < 0) {
                star.x = this.width;
            }
            if (star.y < 0) {
                star.y = this.height;
            }
        }
    }


    prepareInGameBackground() {
        for (let i = 0; i < Math.floor(this.width * this.height / 2500); i++) {
            this.arrayOfStars.push({x: Math.random() * this.width, y: Math.random() * this.height})
        }
        console.log("Generated array of stars");
    }
}

window.onload = function () {
    document.getElementById('myCanvas').onmousemove = changeMousePos;
    setInterval(draw, 1);
}

let canvas = document.getElementById('myCanvas');
canvas.setAttribute('width', (window.innerWidth * 0.9).toString());
canvas.setAttribute('height', (window.innerHeight * 0.9).toString());
const ctx = canvas.getContext('2d');
let mouseX = 0;
let mouseY = 0;
let game = new Game(ctx);
let inGame = true;

function draw() {
    if (inGame) {
        inGame = game.draw();
    }
}

function changeMousePos(e) {
    mouseY = e.clientY;
    mouseX = e.clientX;
}







