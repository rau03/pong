let canvas = document.querySelector("canvas");
let ctx = canvas.getContext("2d");
let width = (canvas.width = 600);
let height = (canvas.height = 400);

const MAX_COMPUTER_SPEED = 2;

const BALL_SIZE = 5;
let ballPosition;

let xSpeed;
let ySpeed;

function initBall() {
  ballPosition = { x: width / 2, y: height / 2 };
  xSpeed = (Math.random() > 0.5 ? 1 : -1) * (2 + Math.random() * 3);
  ySpeed = (Math.random() > 0.5 ? 1 : -1) * (2 + Math.random() * 3);
}

const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 40;
const PADDLE_OFFSET = 10;

let leftPaddleTop = 10;
let rightPaddleTop = 30;

let leftScore = 0;
let rightScore = 0;
let gameOver = false;

document.addEventListener("mousemove", (e) => {
  rightPaddleTop = e.y - canvas.offsetTop;
});

function draw() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = "white";
  ctx.fillRect(ballPosition.x, ballPosition.y, BALL_SIZE, BALL_SIZE);
  ctx.fillRect(PADDLE_OFFSET, leftPaddleTop, PADDLE_WIDTH, PADDLE_HEIGHT);
  ctx.fillRect(
    width - PADDLE_WIDTH - PADDLE_OFFSET,
    rightPaddleTop,
    PADDLE_WIDTH,
    PADDLE_HEIGHT
  );

  // Update the HTML score display
  document.getElementById("left-score").textContent = leftScore;
  document.getElementById("right-score").textContent = rightScore;
}

function followBall() {
  let ball = {
    top: ballPosition.y,
    bottom: ballPosition.y + BALL_SIZE,
  };
  let leftPaddle = {
    top: leftPaddleTop,
    bottom: leftPaddleTop + PADDLE_HEIGHT,
  };

  if (ball.top < leftPaddle.top) {
    leftPaddleTop -= MAX_COMPUTER_SPEED;
  } else if (ball.bottom > leftPaddle.bottom) {
    leftPaddleTop += MAX_COMPUTER_SPEED;
  }
}

function update() {
  ballPosition.x += xSpeed;
  ballPosition.y += ySpeed;
  followBall();
}

function checkPaddleCollision(ball, paddle) {
  return (
    ball.left < paddle.right &&
    ball.right > paddle.left &&
    ball.top < paddle.bottom &&
    ball.bottom > paddle.top
  );
}

function adjustAngle(distanceFromTop, distanceFromBottom) {
  if (distanceFromTop < 0) {
    ySpeed -= 0.5;
  } else if (distanceFromBottom < 0) {
    ySpeed += 0.5;
  }
}

function checkCollision() {
  let ball = {
    left: ballPosition.x,
    right: ballPosition.x + BALL_SIZE,
    top: ballPosition.y,
    bottom: ballPosition.y + BALL_SIZE,
  };

  let leftPaddle = {
    left: PADDLE_OFFSET,
    right: PADDLE_OFFSET + PADDLE_WIDTH,
    top: leftPaddleTop,
    bottom: leftPaddleTop + PADDLE_HEIGHT,
  };

  let rightPaddle = {
    left: width - PADDLE_WIDTH - PADDLE_OFFSET,
    right: width - PADDLE_OFFSET,
    top: rightPaddleTop,
    bottom: rightPaddleTop + PADDLE_HEIGHT,
  };

  if (checkPaddleCollision(ball, leftPaddle)) {
    let distanceFromTop = ball.top - leftPaddle.top;
    let distanceFromBottom = leftPaddle.bottom - ball.bottom;
    adjustAngle(distanceFromTop, distanceFromBottom);
    xSpeed = Math.abs(xSpeed);
  }

  if (checkPaddleCollision(ball, rightPaddle)) {
    let distanceFromTop = ball.top - rightPaddle.top;
    let distanceFromBottom = rightPaddle.bottom - ball.bottom;
    adjustAngle(distanceFromTop, distanceFromBottom);
    xSpeed = -Math.abs(xSpeed);
  }

  if (ball.left <= 0) {
    rightScore++;
    initBall();
  }
  if (ball.right > width) {
    leftScore++;
    initBall();
  }

  if (leftScore > 9 || rightScore > 9) {
    gameOver = true;
  }

  if (ball.left < 0 || ball.right >= width) {
    xSpeed = -xSpeed;
  }

  if (ball.top <= 0 || ball.bottom >= height) {
    ySpeed = -ySpeed;
  }
}

function drawGameOver() {
  ctx.fillStyle = "white";
  ctx.font = "30px monospace";
  ctx.textAlign = "center";
  ctx.fillText("GAME OVER", width / 2, height / 2);
}

function gameLoop() {
  draw();
  update();
  checkCollision();
  if (gameOver) {
    drawGameOver();
  } else {
    setTimeout(gameLoop, 30);
  }
}

initBall();
gameLoop();
