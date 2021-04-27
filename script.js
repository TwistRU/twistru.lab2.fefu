'use strict';

class Bullet {
    constructor(ctx, objGame) {
        this.del = false;
        this.ctx = ctx;
        this.objGame = objGame;
        this.img = new Image();
        this.img.src = 'images/laserShotRed.png';
        this.width = canvas.height / 100 ;
        this.height = canvas.height / 100 * this.img.naturalHeight / this.img.naturalWidth;
        this.speed = 5;
        this.x = canvas.width + this.width;
        this.y = canvas.height;
        this.damage = 1;
        console.log('I\'m bullet', this.x, this.y, this.width, this.height);
    }

    draw() {
        //console.log('I\'m drawing bullet');
        if (!this.checkCrush()) {
            this.ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
            this.y -= this.speed;
        } else {

            //console.log('I\'m crushed bullet');
            this.del = true;
        }
    }

    moveTo(x, y) {
        this.x = x - this.width / 2;
        this.y = y - this.height / 2;
    }

    checkCrush() {
        if (this.y+this.height < 0) {// if reach top
            return true;
        }
        //console.log('I\'m not crushed bullet');
        return false;
    }
}


class Player {
    constructor(x, y, ctx, objGame) {
        this.del = false;
        this.objGame = objGame;
        this.ctx = ctx;
        this.countOfLives = 3;
        this.damage = 0;
        this.maxFiringFrequency = 100; // Shot every Milliseconds
        this.timeOfLastShot = Date.now();
        this.autoFire = false;
        this.img = new Image();
        this.img.src = 'images/playerSpaceship.png';
        this.width = window.innerHeight / 10;
        this.height = this.width;
        this.speed = this.width / 60;
        this.x = x - this.width / 2;
        this.y = y - this.height / 2;
        console.log(`Player created at ${this.x} ${this.y}`);
        this.movemenetInterval = setInterval(this.movementByKeyboard, 1, this);
    }

    draw() {
        if (this.countOfLives <= 0) {
            this.death();
        }
        this.drawPlayer();
        if (this.autoFire) {
            this.fire();
        }
    }

    drawPlayer() {
        this.ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

    fire() {
        if (Date.now() - this.timeOfLastShot - this.maxFiringFrequency > 0) {
            this.timeOfLastShot = Date.now();
            let bull = new Bullet(ctx, this.objGame);
            bull.moveTo(this.x + this.width / 2, this.y - bull.height / 2);
            this.objGame.drawableObjects.push(bull);
        }
    }

    addToCoord(dx, dy) {
        this.x += dx;
        this.y += dy;
    }

    moveTo(x, y) {
        this.x = x - this.width / 2;
        this.y = y - this.height / 2;
    }

    movementByKeyboard(self) {
        if (keysStatus[KEY_CODES.SPACEBAR]) {
            self.fire();
        }
        if (keysStatus[KEY_CODES.DOWN_KEY] && self.y < canvas.height - self.height) {
            self.addToCoord(0, self.speed);
        }
        if (keysStatus[KEY_CODES.UP_KEY] && self.y > 0) {
            self.addToCoord(0, -self.speed);
        }
        if (keysStatus[KEY_CODES.LEFT_KEY] && self.x > 0) {
            self.addToCoord(-self.speed, 0);
        }
        if (keysStatus[KEY_CODES.RIGHT_KEY] && self.x < canvas.width - self.width) {
            self.addToCoord(self.speed, 0);
        }
    }

    death() {
        console.log('PLAYER IS DEAD');
        clearInterval(this.movemenetInterval);
        this.del = true;
    }
}

class Obstacle {
    constructor(x, y, ctx, objGame) {
        this.ctx = ctx;
        this.objGame = objGame;
        this.x = x;
        this.y = y;
    }
}

class Enemy {
    constructor(x, y, ctx, objGame) {
        this.ctx = ctx;
        this.objGame = objGame;
        this.x = x;
        this.y = y;
    }
}

class Game {
    constructor(ctx) {
        this.alive = true;
        this.drawableObjects = [];
        this.ctx = ctx;
        this.width = window.innerWidth;
        this.height = window.innerHeight;

        this.prepare();
    }

    prepare() {
        // Level 0 Background
        this.prepareInGameBackground();
        //
        // Level 1 Player, Enemies, Obstacles, Bullets
        this.player = new Player(this.width / 2, (this.height / 10) * 9, this.ctx, this);
        this.drawableObjects.push(this.player);
        //
    }

    draw() {
        // Draw level 0
        this.drawBackground();
        // Draw level 1
        console.log('DrawObjs: ',this.drawableObjects);
        for (const obj of this.drawableObjects) {
            obj.draw();
        }
        this.drawableObjects = this.drawableObjects.filter(item => !item.del);
        return true;
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
        this.arrayOfStars = [];
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
    SPACEBAR: 32,
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
    //console.log(e.keyCode);
}

function keyReleased(e) {
    // EventListener keyup
    keysStatus[e.keyCode] = false;
}
