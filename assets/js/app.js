const canvas = document.querySelector("canvas");
const canvasSize = 608;
canvas.width = canvasSize;
canvas.height = canvasSize;
const ctx = canvas.getContext("2d");

const unit = 32;
const cWidth = 17;
const cHeight = 15;

const SNAKE = [];
SNAKE[0] = {
  x: 9 * unit,
  y: 10 * unit
};

const food = {
  x: randomInt(cWidth, 1) * unit,
  y: randomInt(cHeight, 3) * unit
};

let score = 0;
let direction;
let snakeX,
  snakeY;

// ===== ===== ===== ===== =====
// Images
// ===== ===== ===== ===== =====

const ground = new Image();
ground.src = "./assets/img/ground.png";

const foodImg = new Image();
foodImg.src = "./assets/img/food.png";

// ===== ===== ===== ===== =====
// Helper function
// ===== ===== ===== ===== =====

function randomInt(max, inc) {
  return Math.floor(Math.random() * max + inc);
}

// ===== ===== ===== ===== =====
// Snake movement
// ===== ===== ===== ===== =====

function steerSnake(e) {
  switch (e.key) {
    case "ArrowLeft":
      if (direction === "RIGHT")
        return
      direction = "LEFT";
      break;
    case "ArrowRight":
      if (direction === "LEFT")
        return;
      direction = "RIGHT";
      break;
    case "ArrowUp":
      if (direction === "DOWN")
        return;
      direction = "UP";
      break;
    case "ArrowDown":
      if (direction === "UP")
        return;
      direction = "DOWN";
      break;
  }
}

function setSnakeCoordinates() {
  snakeX = SNAKE[0].x;
  snakeY = SNAKE[0].y;

  switch (direction) {
    case "LEFT":
      if (snakeX < unit + 1)
        snakeX = canvasSize - unit * 2;
      else snakeX -= unit;
      break;
    case "RIGHT":
      if (snakeX >= canvasSize - unit * 2)
        snakeX = unit;
      else snakeX += unit;
      break;
    case "UP":
      if (snakeY <= unit * 3)
        snakeY = canvasSize - unit * 2;
      else snakeY -= unit;
      break;
    case "DOWN":
      if (snakeY > canvasSize - unit * 3)
        snakeY = unit * 3;
      else snakeY += unit;
      break;
  }
}

// ===== ===== ===== ===== =====
// Other game functions
// ===== ===== ===== ===== =====

function spawnFood() {
  while (SNAKE.some(s => s.x === food.x || s.y === food.y)) {
    food.x = randomInt(cWidth, 1) * unit;
    food.y = randomInt(cHeight, 3) * unit;
  }
}

function isCollision(newHead) {
  if (SNAKE.length < 4)
    return false;
  const collision = SNAKE.find(s => s.x === newHead.x && s.y === newHead.y);
  if (collision) {
    alert("GAME OVER");
    const playAgainPrompt = confirm("Play again?");
    if (playAgainPrompt)
      location.reload();
    return true;
  }
  return false;
}

function updateScore() {
  ctx.fillStyle = "white";
  ctx.font = "45px Changa one";
  ctx.fillText(score, 2 * unit, 1.6 * unit);
}

// ===== ===== ===== ===== =====
// Draw to canvas
// ===== ===== ===== ===== =====

let lastRender = 0;

function draw(timestamp) {

  const requestID = requestAnimationFrame(draw);
  if (timestamp - lastRender < 100)
    return;
  lastRender = timestamp;

  ctx.drawImage(ground, 0, 0);

  for (let i = 0; i < SNAKE.length; i++) {
    ctx.fillStyle = (i === 0)
      ? "rgb(102, 0, 255)"
      : `rgba(153, 75, 255, ${1 - i * .02})`;
    ctx.fillRect(SNAKE[i].x, SNAKE[i].y, unit, unit);

    ctx.strokeStyle = "red";
    ctx.strokeRect(SNAKE[i].x, SNAKE[i].y, unit, unit);
  }

  ctx.drawImage(foodImg, food.x, food.y);

  setSnakeCoordinates();

  // If snake eats food, respawn food; else remove tail
  if (snakeX === food.x && snakeY === food.y) {
    score++;
    spawnFood();
  }
  else
    SNAKE.pop();

  const newHead = {
    x: snakeX,
    y: snakeY
  };

  if (isCollision(newHead))
    cancelAnimationFrame(requestID);

  // Place new head
  SNAKE.unshift(newHead);

  updateScore();

}

// ===== ===== ===== ===== =====
// UI
// ===== ===== ===== ===== =====

requestAnimationFrame(draw);
document.addEventListener("keydown", steerSnake);