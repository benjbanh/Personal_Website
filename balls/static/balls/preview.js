let canvas = document.getElementById('balls_canvas');
const ctx = canvas.getContext("2d");

const width = (canvas.width = window.innerWidth);
const height = (canvas.height = window.innerHeight);

const numBalls = 3;
const initVelocity = 3;
const minSize = width/20;
const maxSize = width/10;
const mode = "rgba(245, 245, 245, 1)"
const friction = false;

const balls = [];
var count = 0;
var id = 0;  
 
// function to generate random number
function random(min, max) {
  const num = Math.floor(Math.random() * (max - min)) + min;
  return num;
}
// function to generate random RGB color value

function randomRGB() {
//   return `rgb(${random(100, 255)},${random(50, 255)},${random(50, 255)})`;
    return "rgb(255, 100, 0)";
}

class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.magnitude=-1;
        this.updateMagnitude();
    }

    updateMagnitude() {
        this.magnitude = Math.round(Math.sqrt(this.x * this.x + this.y * this.y));
    }

    setmag(newMag) {
        if (this.magnitude !== 0) {
            this.x = (this.x / this.magnitude) * newMag;
            this.y = (this.y / this.magnitude) * newMag;
            this.updateMagnitude();
        }
    }

    normalize() {
        if (this.magnitude !== 0) {
            this.x /= this.magnitude;
            this.y /= this.magnitude;
            this.updateMagnitude();
        }
    }

    copy() {
        return new Vector(this.x, this.y);
    }

    add(v) {
        this.x += v.x;
        this.y += v.y;
        this.updateMagnitude();
    }

    sub(v) {
        this.x -= v.x;
        this.y -= v.y;
        this.updateMagnitude();
    }

    mult(scalar) {
        this.x *= scalar;
        this.y *= scalar;
        this.updateMagnitude();
    }

    div(scalar) {
        if (scalar !== 0) {
            this.x /= scalar;
            this.y /= scalar;
            this.updateMagnitude();
        }
    }
}

function add(v1, v2) {
    return new Vector(v1.x + v2.x, v1.y + v2.y);
}

function sub(v1, v2) {
    return new Vector(v1.x - v2.x, v1.y - v2.y);
}

function mult(v, scalar) {
    return new Vector(v.x * scalar, v.y * scalar);
}

function div(v, scalar) {
    if (scalar !== 0) {
        return new Vector(v.x / scalar, v.y / scalar);
    } else {
        throw new Error("Cannot divide by zero");
    }
}

function dot(v1, v2) {
    return v1.x * v2.x + v1.y * v2.y;
}


class Ball {
    constructor(x, y, velX, velY, color, size) {
        this.x = x;
        this.y = y;
        this.velocity = new Vector(velX, velY)

        this.color = color;
        this.size = size;
        this.id = id;
    }

    draw() {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillStyle = "black";
    }

    update() {
        //wall bounce code
        if (this.x + this.size >= width) {
        this.velocity.x = -this.velocity.x;
        this.x = width - this.size;
        }

        if (this.x - this.size <= 0) {
        this.velocity.x = -this.velocity.x;
        this.x = this.size;
        }

        if (this.y + this.size >= height) {
        this.velocity.y = -this.velocity.y;
        this.y = height - this.size;
        }

        if (this.y - this.size <= 0) {
        this.velocity.y = -this.velocity.y;
        this.y = this.size;
        }

        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }

    collide() {
        for (let i = this.id + 1; i < balls.length; i++) {
            let collision = new Vector(balls[i].x - this.x, balls[i].y - this.y);
            let distance = collision.magnitude;
            let minDist = balls[i].size + this.size;

            if (distance < minDist) {
                // console.log(`Hit`);
                let overlap = minDist - distance;  // Corrected to get positive overlap value
                let copy = collision.copy();
                copy.setmag(overlap / 2);

                this.x -= copy.x;
                this.y -= copy.y;
                balls[i].x += copy.x;
                balls[i].y += copy.y;

                distance = minDist;
                collision.setmag(distance);

                let mSum = this.size + balls[i].size;
                let vDiff = sub(balls[i].velocity, this.velocity);
                
                let num = dot(vDiff, collision);
                let den = mSum * distance * distance;
                // Particle A (this)
                let deltaVA = collision.copy();
                deltaVA.mult((2 * balls[i].size * num) / den);
                this.velocity.add(deltaVA);

                // Particle B (other)
                let deltaVB = collision.copy();
                deltaVB.mult((-2 * this.size * num) / den);
                balls[i].velocity.add(deltaVB);
            }
        }

        // friction
        if(friction){
            this.velocity = mult(this.velocity, 0.997);
        }
    }
}

function newBall(){
    let size = random(minSize, maxSize);
    let xVel = random(-initVelocity, initVelocity)
    let yVel = random(-initVelocity, initVelocity)

    return new Ball(
      random(0 + size, width - size),
      random(0 + size, height - size),
      xVel,
      yVel,
      randomRGB(),
      size,
      id
    );
}

//initializes balls in the balls array
//and calls the main loop at the end
function init() {
  ctx.font = "10px Comic Sans MS";
  ctx.textAlign = "center";
  ctx.strokeStyle = "white";
  
  for( let i = 0; i < numBalls; i++) 
    balls.push(newBall());
  
  console.log("Preview Start")
  loop();
}

function loop() {
    ctx.fillStyle = mode

    ctx.fillRect(0, 0, width, height);

    for (const ball of balls) {
        ball.draw();
        ball.collide();
        ball.update();    
    }

    requestAnimationFrame(loop);
}

init();
