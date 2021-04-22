'use strict';

class Player {
    constructor(x, y) {
        this.countOfLives = 3;
        this.img = new Image();
        this.img.src = 'images/playerSpaceship.png';
        this.width = window.innerWidth/18;
        this.height = this.width;
        this.speed = this.width/60;
        this.x = x-this.width/2;
        this.y = y-this.height/2;
        console.log(`Player created at ${this.x} ${this.y}`);
        this.movemenetInterval = setInterval(this.movement, 1, this);
    }
    moveTo(dx,dy){
        this.x += dx;
        this.y += dy;
    }

    movement(self){
        if (self.countOfLives < 1){
            clearInterval(self.movemenetInterval);
        }
        if (keysStatus[KEY_CODES.DOWN_KEY] && self.y < window.innerHeight-self.height){
            self.moveTo(0, self.speed);
        }
        if (keysStatus[KEY_CODES.UP_KEY] && self.y > 0){
            self.moveTo(0, -self.speed);
        }
        if (keysStatus[KEY_CODES.LEFT_KEY] && self.x > 0){
            self.moveTo(-self.speed, 0);
        }
        if (keysStatus[KEY_CODES.RIGHT_KEY] && self.x < window.innerWidth-self.width){
            self.moveTo(self.speed, 0);
        }
    }
}

class Obstacle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Enemy {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Bullet {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Game {
    constructor(ctx) {
        this.alive = true;
        this.arrayOfStars = [];
        this.arrayOfObstacles = [];
        this.ctx = ctx;
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.player = new Player(this.width/2, this.height/2);
        this.prepareInGameBackground();
    }

    draw() {
        this.drawBackground();
        this.drawPlayer();
        return this.alive;
    }

    drawPlayer(){
        this.ctx.drawImage(this.player.img, this.player.x, this.player.y, this.player.width, this.player.height);
    }

    drawBackground() {
        this.ctx.beginPath();
        this.ctx.fillStyle = "#0c0b38"
        this.ctx.fillRect(0, 0, this.width, this.height);
        for (let star of this.arrayOfStars) {
            this.ctx.beginPath();
            this.ctx.fillStyle = `rgba(156,155,155,${Math.sin(-Date.now() * 0.0000001 + (star.x + star.y) * 0.07)})`;
            this.ctx.fillRect(star.x, star.y, 5, 5);
            this.ctx.closePath();
            star.x -= 0.1;
            star.y -= 0.1;
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







