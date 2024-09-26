// https://editor.p5js.org/codingtrain/sketches/z8n19RFz9

const para = document.querySelector("p");
let count = 0;

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const width = (canvas.width = window.innerWidth);
const height = (canvas.height = window.innerWidth * 3);

const balls = [];
const initVelocity = 10;
var id = 0;

/** 
 * debug:
 *  console logs total KE and renders 
 *  magnitudes of velocities on balls
 * mode: 
 *  ctx.fillStyle = "rgba(0, 0, 0, 0)";  //splatoon
 *  ctx.fillStyle = "rgba(0, 0, 0, 0.25)";  //blurred
 *  ctx.fillStyle = "rgba(0, 0, 0, 1)";    //normal
 *
*/
const debug = false;
const mode = "rgba(0, 0, 0, 1)"
    

// function to generate random number

function random(min, max) {
  const num = Math.floor(Math.random() * (max - min)) + min;
  return num;
}
// function to generate random RGB color value

function randomRGB() {
  return `rgb(${random(100, 255)},${random(50, 255)},${random(50, 255)})`;
}

function getKE(ball){
    return Math.abs(1/2 * ball.size * ball.velocity.magnitude * ball.velocity.magnitude)
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
            let copy = this.copy();
            copy.x /= copy.magnitude;
            copy.y /= copy.magnitude;
            copy.updateMagnitude();
            return copy;
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
        if (debug){
            ctx.font = this.size.toString() + "px Comic Sans MS";
            ctx.fillText(this.velocity.magnitude, this.x, this.y);
        }
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
                if( debug ){
                    let n = collision.normalize();
                    let point = new Vector( this.x + this.size * n.x, this.y + this.size * n.y) 
                    ctx.fillStyle = "rgb(255,0,0)";
                    ctx.beginPath();
                    ctx.arc(point.x, point.y, 10, 0, 2 * Math.PI);
                    ctx.fill();
                }
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
    }
}

//initializes balls in the balls array
//and calls the main loop at the end
function init() {
  ctx.font = "40px Comic Sans MS";
  ctx.textAlign = "center";
  ctx.strokeStyle = "white";
  //Add mouse events
  canvas.addEventListener("mousedown", (event) => {
    let adjust = canvas.getBoundingClientRect();
    let pos = {
      x: event.clientX - adjust.left,
      y: event.clientY - adjust.top,
    };
    let size = random(25,100)
    const newBall = new Ball(
      pos.x,
      pos.y,
      random(-initVelocity, initVelocity),
      random(-initVelocity, initVelocity),
      randomRGB(),
      size,
      id
    );
    id++;
    count++;
    balls.push(newBall);
    // console.log(`${pos.x},${pos.y}`);
  });
  document.addEventListener("keydown", (event) => {
    switch (event.key) {
      case "w":
        let size = random(25,100)
        const newBall = new Ball(
          random(0 + size, width - size),
          random(0 + size, height - size),
          random(-initVelocity, initVelocity),
          random(-initVelocity, initVelocity),
          randomRGB(),
          size,
          id
        );
        id++;
        count++;
        balls.push(newBall);
        break;
      case "s":
        if (balls.length > 0) {
          balls.pop();
          id--;
          count--;
        }
        break;
      case " ":
        for (let ball of balls) {
            ball.velocity.x = ball.velocity.x * 0.1;
            ball.velocity.y = ball.velocity.y * 0.1;
            ball.velocity.updateMagnitude();
        }
        break;
    }
  });
    ctx.fillRect(0, 0, width, height);
  loop();
}

function loop() {
    let totalKE = 0;
    ctx.fillStyle = mode;

    ctx.fillRect(0, 0, width, height);

    for (const ball of balls) {
        ball.draw();
        ball.collide();
        ball.update();
        totalKE += getKE(ball)        
    }
    ctx.font = "40px Comic Sans MS";
    if (balls.length === 0) 
        ctx.strokeText("Try Clicking", 110, 50);
    else{
        ctx.fillStyle = balls[balls.length-1].color;
        ctx.fillText("click: +ball", canvas.width / 2, canvas.height / 2.5);
        ctx.fillText("W: +ball", canvas.width / 2, canvas.height / 2.25);
        ctx.fillText("S: -ball", canvas.width / 2, canvas.height / 2);
        ctx.fillText('" ": slow', canvas.width / 2, canvas.height / 1.8);
    }

    ctx.fillStyle = "rgb(255, 255, 255)";
    ctx.fillText("Bouncing Balls", width - 140, 40);
    ctx.fillText("Ball count: " + count, width - 140, 90);

    //total Kinetic Energy
    if (debug)
        console.log(totalKE);

    requestAnimationFrame(loop);
}

init();