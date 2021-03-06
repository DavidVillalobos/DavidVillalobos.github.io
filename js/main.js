
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var ballRadius = 10;
var x = canvas.width/2;
var y = canvas.height-30;
var dx = 2;
var dy = -2;

var paddleHeight = 15;
var paddleWidth = 100;
var paddleX = (canvas.width-paddleWidth)/2;

var rightPressed = false;
var leftPressed = false;

var brickRowCount = 10;
var brickColumnCount = 5;
var brickWidth = 75;
var brickHeight = 15;
var brickPadding = 15;
var brickOffsetTop = 60;
var brickOffsetLeft = 60;

var score = 0;
var lives = 3;

var colorBall = "#F6FA9E"
var colorPaddle = "#527C6A"
var colorsBrick = ["#1E57EF", "#87EF1E", "#1EEFEF", "#EF1F1E", "#F8F414", "#DE0CF3"];
var ColorFont = "#000000"

var Font = "550 20px Arial"

var bricks = [];
for(c=0; c<brickColumnCount; c++) {
    bricks[c] = [];
    for(r=0; r<brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);
document.addEventListener("touchmove", handleTouchStart, false);

function keyDownHandler(e) {
    if(e.keyCode == 39) {
        rightPressed = true;
    }
    else if(e.keyCode == 37) {
        leftPressed = true;
    }
}
function keyUpHandler(e) {
    if(e.keyCode == 39) {
        rightPressed = false;
    }
    else if(e.keyCode == 37) {
        leftPressed = false;
    }
}
function mouseMoveHandler(e) {
    var relativeX = e.clientX - paddleWidth;
    if(relativeX - paddleWidth/2 > 0 && relativeX + paddleWidth/2 < canvas.width) {
        paddleX = relativeX - paddleWidth/2;
    }
}

function getTouches(evt) {
    return evt.touches ||             // browser API
           evt.originalEvent.touches; // jQuery
}                                                     

function handleTouchStart(evt) {
    const firstTouch = getTouches(evt)[0];                                      
    var relativeX = firstTouch.clientX + paddleWidth;     
    if(relativeX - paddleWidth/2  > 0 && relativeX + paddleWidth/2 < canvas.width) {
        paddleX = relativeX - paddleWidth/2;
    }                                                                      
};  

function collisionDetection() {
    for(c=0; c<brickColumnCount; c++) {
        for(r=0; r<brickRowCount; r++) {
            var b = bricks[c][r];
            if(b.status == 1) {
                if( (x - ballRadius > b.x && x  - ballRadius < b.x + brickWidth && y - ballRadius > b.y && y - ballRadius < b.y+brickHeight)
                    || (x - ballRadius > b.x && x  - ballRadius < b.x + brickWidth && y - ballRadius > b.y && y - ballRadius < b.y+brickHeight)
                ) {
                    dy = -dy;
                    b.status = 0;
                    score++;
                    if(score == brickRowCount*brickColumnCount) {
                        alert("Ganaste, Felicidades");
                        document.location.reload();
                    }
                    dx = (score / 10 + 2) * dx/Math.abs(dx)
                    dy = (score / 10 + 2) * dy/Math.abs(dy)
                }
            }
        }
    }
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = colorBall;
    ctx.fill();
    ctx.closePath();
}
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight-5);
    ctx.fillStyle = colorPaddle;
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.arc(paddleX, canvas.height- paddleHeight/3, paddleHeight/2, 0, Math.PI*2);
    ctx.fillStyle = "#000000";
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.arc(paddleX+paddleWidth, canvas.height- paddleHeight/3, paddleHeight/2, 0, Math.PI*2);
    ctx.fillStyle = "#000000";
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.arc(paddleX, canvas.height- paddleHeight/3, paddleHeight/4, 0, Math.PI*2);
    ctx.fillStyle = colorPaddle;
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.arc(paddleX+paddleWidth, canvas.height- paddleHeight/3, paddleHeight/4, 0, Math.PI*2);
    ctx.fillStyle = colorPaddle;
    ctx.fill();
    ctx.closePath();
}
function drawBricks() {
    for(c=0; c<brickColumnCount; c++) {
        for(r=0; r<brickRowCount; r++) {
            if(bricks[c][r].status == 1) {
                var brickX = (r*(brickWidth+brickPadding))+brickOffsetLeft;
                var brickY = (c*(brickHeight+brickPadding))+brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = colorsBrick[(c+1) * (r+1) % 6];
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}
function drawScore() {
    ctx.font = Font;
    ctx.fillStyle = ColorFont;
    ctx.fillText("Puntaje: " + score, 25, 20);
}
function drawVelocity() {
    ctx.font = Font;
    ctx.fillStyle = ColorFont;
    ctx.fillText("Velocidad: " + Math.trunc((Math.abs(dx) + Math.abs(dy)) / 2) , canvas.width/3, 20);
}
function drawLives() {
    ctx.font = Font;
    ctx.fillStyle = ColorFont;
    ctx.fillText("Vidas: " + lives, canvas.width-110, 20);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    drawVelocity();
    drawLives();
    collisionDetection();
    
    if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }
    if(y + dy < ballRadius) {
        dy = -dy;
    }
    else if(y + dy + 2*ballRadius > canvas.height) {
        if(x + ballRadius > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
        }
        else {
            lives--;
            if(!lives) {
                alert("Fin del Juego");
                document.location.reload();
            }
            else {
                x = canvas.width/2;
                y = canvas.height-30;
                dx = Math.abs(dx);
                dy = -Math.abs(dy);
                paddleX = (canvas.width-paddleWidth)/2;
            }
        }
    }
    
    if(rightPressed && paddleX + paddleWidth < canvas.width ) {
        paddleX += 7; 
    }
    else if(leftPressed && paddleX > 0) {
        paddleX -= 7;
    }
    
    x += dx;
    y += dy;
    requestAnimationFrame(draw);
}

draw();