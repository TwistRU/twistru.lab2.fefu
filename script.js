'use strict';

class Player {
    constructor() {
        this.countOfLives = 3;
    }
}

class Obstacle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Enemy {

}

class Bullet {

}

class Game {
    constructor(ctx) {
        this.alive = true;
        this.arrayOfStars = [];
        this.arrayOfObstacles = [];
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
    document.addEventListener("mousemove", changeMousePos, true);
    document.addEventListener('keydown', keyPressed, true);
    document.addEventListener('keyup', keyReleased, true);
}

let canvas = document.getElementById('myCanvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext('2d');
const KEY_CODES = {
    LEFT_KEY: 37,
    UP_KEY: 38,
    RIGHT_KEY: 39,
    DOWN_KEY: 40,
}
let keysStatus = {};
let mouseX = 0;
let mouseY = 0;
let game = new Game(ctx);
let inGame = true;
let drawInterval = setInterval(draw, 1000 / 60);

function draw() {
    // drawInterval
    if (inGame) {
        inGame = game.draw();
    }
}

function changeMousePos(e) {
    // EventListener mousemove
    mouseY = e.clientY;
    mouseX = e.clientX;
}

function keyPressed(e) {
    // EventListener keydown
    keysStatus[e.keyCode] = true;
}

function keyReleased(e) {
    // EventListener keyup
    keysStatus[e.keyCode] = false;
}







