'use strict';

class Bullet {
    constructor(ctx, objGame, x, y, color, speed = 0, damageToPlayer = 0, damageToEnemy = 0) {
        this.del = false;
        this.ctx = ctx;
        this.objGame = objGame;
        this.color = color;
        this.width = canvas.height / 100;
        this.height = this.width * 3;
        this.speed = speed;
        this.x = x - this.width / 2;
        this.y = y - this.height / 2;
        this.damageToPlayer = damageToPlayer;
        this.damageToEnemy = damageToEnemy;
        //console.log('I\'m bullet', this.x, this.y, this.width, this.height);
    }

    draw() {
        //console.log('I\'m drawing bullet');
        if (!this.checkCrush()) {
            this.drawBullet();
            this.y -= this.speed;
        } else {
            //console.log('I\'m crushed bullet');
            this.del = true;
        }
    }

    drawBullet() {
        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    checkCrush() {
        if (this.y + this.height < 0 || this.y > canvas.height) {// if reach top
            return true;
        }
        for (const obj of this.objGame.drawableObjects[1]) {
            if (Math.pow(obj.x + obj.width / 2 - this.x, 2) + Math.pow(obj.y + obj.height / 2 - this.y, 2) <= Math.pow(obj.width / 2, 2)) {
                console.log(`Shooted a ${obj.type}`);
                if (obj.type === 'player' && this.damageToPlayer !== 0) {
                    if (!obj.immortal){
                        console.log(`Damage to ${obj.type}`);
                        obj.countOfLives -= this.damageToPlayer;
                        obj.immortal = true;
                        console.log('Player is immortal');
                    }
                    return true;
                }
                if (obj.type === 'enemy' && this.damageToEnemy !== 0) {
                    console.log(`Damage to ${obj.type}`);
                    obj.countOfLives -= this.damageToEnemy;
                    return true;
                }
                return false;
            }
        }
        return false;
    }
}


class Player {
    constructor(x, y, ctx, objGame) {
        this.type = 'player';
        this.del = false;
        this.objGame = objGame;
        this.ctx = ctx;
        this.countOfLives = 3;
        this.damage = 1;
        this.maxFiringFrequency = 300; // Shot every Milliseconds
        this.immortal = false;
        this.timeOfLastImmortal = Date.now();
        this.timeOfLastShot = Date.now();
        this.autoFire = false;
        this.img = new Image();
        this.img.src = 'images/playerSpaceship.png';
        this.width = window.innerHeight / 10;
        this.height = this.width;
        this.speed = this.width / 40;
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
        if (this.immortal){
            this.drawImmortal();
            if (Date.now() - 3000 - this.timeOfLastImmortal >= 0){
                this.timeOfLastImmortal = Date.now();
                //console.log('Player is not immortal anymore');
                this.immortal = false;
            }
        }
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
            this.objGame.drawableObjects[0].push(new Bullet(ctx, this.objGame, this.x + this.width / 2, this.y - 10, "#a00404", this.speed + 5, 0, this.damage));
        }
    }

    drawImmortal() {
        this.ctx.fillStyle = 'rgba(32,20,186,0.4)'
        this.ctx.arc(
            this.x+this.width/2,
            this.y+this.height/2,
            Math.sqrt(Math.pow(this.width/2,2) + Math.pow(this.height/2,2)),
            0,
            Math.PI*2
            );
        this.ctx.fill();
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
        this.type = 'obstacle';
        this.ctx = ctx;
        this.objGame = objGame;
        this.x = x;
        this.y = y;
    }

    draw() {

    }
}

class Enemy {
    constructor(x, y, ctx, objGame) {
        this.type = 'enemy';
        this.ctx = ctx;
        this.objGame = objGame;
        this.width = window.innerHeight / 10;
        this.height = this.width;
        this.speed = this.width / 50;
        this.x = x - this.width / 2;
        this.y = y - this.height / 2;
        this.del = false;
        this.timeOfLastShot = Date.now();
        this.autoFire = true;
        this.maxFiringFrequency = 500;
        this.damage = 1;
        this.countOfLives = 10;
    }

    draw() {
        if (this.countOfLives <= 0) {
            this.death();
        }
        this.drawEnemy();
        if (this.autoFire) {
            this.fire();
        }
    }

    drawEnemy() {
        this.ctx.fillStyle = '#FFF';
        this.ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    fire() {
        if (Date.now() - this.timeOfLastShot - this.maxFiringFrequency >= 0) {
            this.timeOfLastShot = Date.now();
            this.objGame.drawableObjects[0].push(new Bullet(ctx, this.objGame, this.x + this.width / 2, this.y + this.height + 15, '#1fd030', -this.speed - 5, this.damage, 0));
        }
    }

    death() {
        console.log('Enemy is DEAD');
        this.del = true;
    }
}

class Button {
    constructor(ctx, objGame, x, y, width, height, text) {
        this.ctx = ctx;
        this.objGame = objGame;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.text = text;
        this.clicked = false;
    }

    draw() {
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.fillRect(this.x, this.y, this.width, this.height);
        this.ctx.fillStyle = '#000';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(this.text, this.x + this.width / 2, this.y + this.height / 2);
        this.checkClicked();
    }

    checkClicked() {
        if (lMouseX > this.x && lMouseX < this.x + this.width && lMouseY > this.y && lMouseY < this.y + this.height) {
            this.clicked = true;
        }
    }
}

class Game {
    constructor(ctx) {
        this.drawableObjects = {
            0: [],
            1: [],
        };
        this.ctx = ctx;
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.inMenu = true;
        this.prepareInGameBackground();
        this.prepareButtons();
    }

    prepare() {
        // Level 1 Player, Enemies, Obstacles, Bullets
        this.player = new Player(this.width / 2, (this.height / 10) * 9, this.ctx, this);
        this.drawableObjects[1].push(this.player);
        //
        this.drawableObjects[1].push(
            new Enemy(this.width / 2, this.height / 10, this.ctx, this),
        )

    }

    prepareButtons() {
        let n = 4;
        this.buttons = [
            new Button(ctx, this, (canvas.width - canvas.width / 15) / (n + 1), (canvas.height - canvas.height / 10) / 2, canvas.width / 10, canvas.height / 7, 'Клавиатура'),
            new Button(ctx, this, (canvas.width - canvas.width / 15) / (n + 1) * 2, (canvas.height - canvas.height / 10) / 2, canvas.width / 10, canvas.height / 7, 'Мышь'),
            new Button(ctx, this, (canvas.width - canvas.width / 15) / (n + 1) * 3, (canvas.height - canvas.height / 10) / 2, canvas.width / 10, canvas.height / 7, 'Мышь(авто)'),
            new Button(ctx, this, (canvas.width - canvas.width / 15) / (n + 1) * 4, (canvas.height - canvas.height / 10) / 2, canvas.width / 10, canvas.height / 7, 'Тач(авто)'),
        ];
    }

    draw() {
        // Draw level 0
        this.drawBackground();
        // Draw level 1
        if (this.inMenu) {
            this.menu();
        } else {
            for (const obj of this.drawableObjects[0]) {
                obj.draw();
            }
            this.drawableObjects[0] = this.drawableObjects[0].filter(item => !item.del);
            for (const obj of this.drawableObjects[1]) {
                obj.draw();
            }
            this.drawableObjects[1] = this.drawableObjects[1].filter(item => !item.del);
        }
    }

    menu() {
        for (const button of this.buttons) {
            button.draw();
        }
        if (this.buttons[0].clicked) {
            this.inMenu = false;
            console.log('Button clicked');
            this.prepare();
        }
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
    document.addEventListener("mousemove", changeMousePos);
    document.addEventListener('keydown', keyPressed);
    document.addEventListener('keyup', keyReleased);
    canvas.addEventListener('click', changeLMousePos);
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
let lMouseX = 0;
let lMouseY = 0;
let game = new Game(ctx);
let inGame = true;
let drawInterval = setInterval(draw, 1000 / 60);

function draw() {
    game.draw();
}

function changeLMousePos(e) {
    lMouseX = e.clientX;
    lMouseY = e.clientY;
    console.log(`Clicked here ${lMouseX} ${lMouseY}`);
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
