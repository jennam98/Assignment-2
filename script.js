const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

const netWidth = 4;
const netHeight = canvas.height;
const paddleWidth = 10;
const paddleHeight = 80;
const ballRadius = 8;
const aiSpeed = 5;

let playerScore = 0;
let aiScore = 0;
let winner = null;
let difficulty = 1;
let scoreMessage = '';
let scoreMessageTimer = 0;

let paddlePlayerY = (canvas.height - paddleHeight) / 2;
let paddleAiY = (canvas.height - paddleHeight) / 2;
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballSpeedX = 3; 
let ballSpeedY = 3; 

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (playerScore >= 15 || aiScore >= 15) {
    ctx.fillStyle = 'red';
  } else {
    ctx.fillStyle = '#222';
  }
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#fff';
  ctx.fillRect(canvas.width / 2 - netWidth / 2, 0, netWidth, netHeight);

  ctx.fillRect(0, paddlePlayerY, paddleWidth, paddleHeight);
  ctx.fillRect(canvas.width - paddleWidth, paddleAiY, paddleWidth, paddleHeight);

  ctx.beginPath();
  ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = '#fff';
  ctx.fill();

  ctx.font = '30px Arial';
  ctx.fillStyle = '#fff';
  ctx.fillText(`Player: ${playerScore}`, 50, 50);
  ctx.fillText(`AI: ${aiScore}`, canvas.width - 150, 50);

  if (scoreMessage) {
    ctx.fillText(scoreMessage, canvas.width / 2 - 100, 50);
  }

  if (winner !== null) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#fff';
    ctx.font = '50px Arial';
    ctx.fillText(winner === 'player' ? 'Player Wins!' : 'Game Over', canvas.width / 2 - 150, canvas.height / 2);
  }
}

function update() {
  if (winner !== null) return;

  let paddleAiCenter = paddleAiY + paddleHeight / 2;
  if (paddleAiCenter < ballY - aiSpeed) {
    paddleAiY += aiSpeed;
  } else if (paddleAiCenter > ballY + aiSpeed) {
    paddleAiY -= aiSpeed;
  }

  ballX += ballSpeedX;
  ballY += ballSpeedY;

  if ((ballX - ballRadius <= paddleWidth && ballY >= paddlePlayerY && ballY <= paddlePlayerY + paddleHeight) ||
      (ballX + ballRadius >= canvas.width - paddleWidth && ballY >= paddleAiY && ballY <= paddleAiY + paddleHeight)) {
    ballSpeedX = -ballSpeedX;
  }

  if (ballY - ballRadius <= 0 || ballY + ballRadius >= canvas.height) {
    ballSpeedY = -ballSpeedY;
  }

  if (ballX - ballRadius <= 0) {
    aiScore++;
    resetBall();
    scoreMessage = '1 point: AI';
    clearTimeout(scoreMessageTimer);
    scoreMessageTimer = setTimeout(() => {
      scoreMessage = '';
    }, 1500); 
  } else if (ballX + ballRadius >= canvas.width) {
    playerScore++;
    resetBall();
    scoreMessage = '1 point: Player';
    clearTimeout(scoreMessageTimer);
    scoreMessageTimer = setTimeout(() => {
      scoreMessage = '';
    }, 1500); 
  }

  if (playerScore >= 20 || aiScore >= 20) {
    winner = playerScore >= 20 ? 'player' : 'ai';
  }

  if (playerScore % 5 === 0 && playerScore > 0 && difficulty < 5) {
    difficulty++;
    ballSpeedX *= 1.2;
    ballSpeedY *= 1.2;
  }
}

function resetBall() {
  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
  ballSpeedX = 3 * (Math.random() > 0.5 ? 1 : -1);
  ballSpeedY = 3 * (Math.random() > 0.5 ? 1 : -1); 
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();

document.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowUp') {
    paddlePlayerY -= 20;
  } else if (event.key === 'ArrowDown') {
    paddlePlayerY += 20;
  }
});





