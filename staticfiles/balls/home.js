const para = document.querySelector("p");
let count = 0;

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const width = (canvas.width = window.innerWidth);
const height = (canvas.height = window.innerHeight * 3);
console.log(document.body.scrollHeight);

const balls = [];
const initVelocity = 5;
var id = 0;

// const boundaryRadius = width * 0.15;  // Radius of the circular boundary
// const boundaryCenter = {x: width * 0.75, y: height * 0.4 };

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
const debug = false
const mode = "rgba(245, 245, 245, 1)"
    

// function to generate random number

function random(min, max) {
  const num = Math.floor(Math.random() * (max - min)) + min;
  return num;
}

function randomRGB() {
//   return `rgb(${random(100, 255)},${random(50, 255)},${random(50, 255)})`;
    return `rgb(0, 0, 0)`;
}

function getKE(ball){
    return Math.abs(1/2 * ball.size * ball.velocity.magnitude * ball.velocity.magnitude)
}

class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.magnitude=0;
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

    copy() {
        return new Vector(this.x, this.y);
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
        ctx.strokeStyle = this.color;
        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        ctx.stroke();
        if (debug){
            ctx.font = this.size.toString() + "px Comic Sans MS";
            ctx.fillText(this.velocity.magnitude, this.x, this.y);
        }
    }

    update() {
        // let col = new Vector(boundaryCenter.x - this.x, boundaryCenter.y - this.y);
        // let distance = col.magnitude;
        // let minDist = boundaryRadius + this.size;

        // //boundary collision code
        // if (distance < minDist) {
        //     let n = col.normalize();
        //     if( debug ){
        //         let point = new Vector( this.x + this.size * n.x, this.y + this.size * n.y) 
        //         ctx.strokeStyle = "rgb(255,0,0)";
        //         ctx.beginPath();
        //         ctx.arc(point.x, point.y, 10, 0, 2 * Math.PI);
        //         ctx.stroke();
        //     }

        //     let overlap = minDist - distance;  // Corrected to get positive overlap value
        //     let copy = col.copy();
        //     copy.setmag(overlap);

        //     this.x -= copy.x;
        //     this.y -= copy.y;

        //     distance = minDist;
        //     col.setmag(distance);

        //     let vn = dot(this.velocity, n);
        //     this.velocity = sub(this.velocity, mult(n, 2 * vn));
        // }

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
        for (let i = this.id; i < balls.length; i++) {
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

            // friction
            this.velocity = mult(this.velocity, 0.997);
        }
    }
}

// function drawBoundary() {
//     ctx.beginPath();
//     ctx.arc(boundaryCenter.x, boundaryCenter.y, boundaryRadius, 0, 2 * Math.PI);
//     ctx.strokeStyle = "rgba(0, 0, 0, 0.5)"; // Color and transparency
//     ctx.stroke();
// }

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
  

    //add one ball at start
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
    
    loop();
}

function loop() {
    let totalKE = 0;
    ctx.fillStyle = mode;

    ctx.fillRect(0, 0, width, height);
    // drawBoundary();

    for (const ball of balls) {
        ball.draw();
        ball.collide();
        ball.update();
        totalKE += getKE(ball)        
    }

    //total Kinetic Energy
    if (debug)
        console.log(totalKE);

    requestAnimationFrame(loop);
}

init();
