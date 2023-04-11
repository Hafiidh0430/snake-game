const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
let tryBtn = document.querySelector(".btn-lose .try-again");
let exitBtn = document.querySelector(".btn-lose .exit-btn");
let rewindBtn = document.querySelector(".btn-lose .rewind-btn");
let modalBox = document.querySelector(".box-model");
let timeMinutes = document.querySelector(".timer .minutes");
let timeSeconds = document.querySelector(".timer .seconds");
let score = document.querySelector(".score span");
let highScore = document.querySelector(".high-score span");
let playLobby = document.querySelector(".overlay");
let btnStart = document.querySelector(".overlay .overlay-content .btn-start");
let boxInput = document.querySelector(".overlay .overlay-content");
let userInput = document.querySelector(".username");
let scoreTotal = 0;
let highTotal = 0 || localStorage.getItem("high");
let totalMinutes = 0;
let totalSeconds = 0;

playLobby.classList.add("active");
modalBox.classList.remove("active");

if (playLobby) {
  playLobby.classList.add("active");
  modalBox.classList.remove("active");
}

// tryBtn.addEventListener("click", () => {
//   playLobby.classList.add("active");
//   modalBox.classList.remove("active");
// });

exitBtn.addEventListener("click", () => {
  document.location.reload();
  modalBox.classList.remove("active");
});
rewindBtn.addEventListener("click", () => {
  // document.location.reload();
  rewindGame = setInterval(rewind, 100)
  modalBox.classList.remove("active");
});

function timer() {
  totalSeconds++;
  totalSeconds < 10
    ? (timeSeconds.textContent = `0${totalSeconds}`)
    : (timeSeconds.textContent = `${totalSeconds}`);
  if (totalSeconds > 59) {
    totalMinutes++;
    totalSeconds = 0;
  }
  totalMinutes < 10
    ? (timeMinutes.textContent = `0${totalMinutes}`)
    : (timeMinutes.textContent = `${totalMinutes}`);
}


userInput.addEventListener("keyup", (e) => {
  var value = e.currentTarget.value;
  if (value === "") {
    btnStart.disabled = true;
    btnStart.style.opacity = "0.3";
    btnStart.style.cursor = "none";
  } else {
    btnStart.disabled = false;
    btnStart.style.opacity = "1";
    btnStart.style.cursor = "pointer";
    btnStart.classList.add("kunci");
  }

});
btnStart.addEventListener("click", () => {
  let nickName = document.querySelector(".nick .name");
  let userInput = document.querySelector(".username").value;
  boxInput.style.top = "-30rem";
  playLobby.classList.remove("active");
  time = setInterval(timer, 1000);
  animation = setInterval(startGame, 100);

  if (userInput) {
    nickName.innerHTML = userInput;
  }
});

let grids = {
  x: canvas.width / 48,
  y: canvas.height / 30,
};

grid = 20;

let snake = {
  x: 0,
  y: 0,
  directionX: grid,
  directionY: 0,
  body: [],
  max: 6,
  rewind:{
    frame:[],
    index:0,
  }
};

let apple = {
  x: 320,
  y: 320,
};

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function spawn(x, y, w, h, color) {
  ctx.beginPath();
  // ctx.filter = `drop-shadow(0 0 25px black)`

  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

function startGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  snake.x += snake.directionX;
  snake.y += snake.directionY;

  if (snake.x < 0) snake.x = canvas.width - grid;
  if (snake.y < 0) snake.y = canvas.height - grid;
  if (snake.x >= canvas.width) snake.x = 0;
  if (snake.y >= canvas.height) snake.y = 0;
  
  spawn(apple.x, apple.y, grid - 1, grid - 1, "red");
  
  snake.body.unshift({ x: snake.x, y: snake.y });
  snake.body.splice(snake.max);

  snake.body.forEach((body, index) => {
    spawn(body.x, body.y, grid - 1, grid - 1, "#7211BE");
    if (index == 0) {
      // spawn kepala ular

      if (body.x == apple.x && body.y == apple.y) {
        scoreTotal++;
        snake.max++;
        apple.x = getRandomInt(0, 25) * grid;
        apple.y = getRandomInt(0, 25) * grid;
      }
      score.innerHTML = scoreTotal;
    } else {
      // pada bagian body ular
      spawn(body.x, body.y, grid - 1, grid - 1, '#ffffff25');

      if (body.x == snake.body[0].x && body.y == snake.body[0].y) {
        snake.body=[{x:0,y:0}]
        modalBox.classList.add("active");
        clearInterval(animation);
        clearInterval(time);
      }
      if (body.x == apple.x && body.y == apple.y) {
        apple.x = getRandomInt(0, 25) * grid;
        apple.y = getRandomInt(0, 25) * grid;
      }
    }
  });
  snake.rewind.frame.push({x:snake.x,y:snake.y})
}

score.innerHTML = scoreTotal;
function highestScore() {
  if (scoreTotal >= highTotal) {
    highTotal = scoreTotal;
    localStorage.setItem("high", highTotal);
  }
  highScore.textContent = highTotal;
}
highestScore();

function rewind(){
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  snake.x = snake.rewind.frame[snake.rewind.index].x;
  snake.y = snake.rewind.frame[snake.rewind.index].y;
  snake.body.unshift({ x: snake.x, y: snake.y });
  snake.body.splice(snake.max);
  
  snake.body.forEach((body, index) => {
    spawn(body.x, body.y, grid - 1, grid - 1, "#7211BE");
    if (index != 0) spawn(body.x, body.y, grid - 1, grid - 1, '#ffffff25')
  })
  console.log(snake.x)
  snake.rewind.index++
  if (snake.rewind.frame.length <= snake.rewind.index) {
    clearInterval(rewindGame);
    modalBox.classList.add("active");
    snake.rewind.index = 0
    snake.body=[{x:0,y:0}]
  }
}

document.addEventListener("keydown", function ({ key }) {
  if (key === 'a' && snake.directionX === 0) {
    snake.directionX = -grid;
    snake.directionY = 0;
  } else if (key === 'w' && snake.directionY === 0) {
    snake.directionY = -grid;
    snake.directionX = 0;
  } else if (key === 'd' && snake.directionX === 0) {
    snake.directionX = grid;
    snake.directionY = 0;
  } else if (key === 's' && snake.directionY === 0) {
    snake.directionY = grid;
    snake.directionX = 0;
  }
});

