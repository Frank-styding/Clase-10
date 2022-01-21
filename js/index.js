let canvas = document.getElementById("canvas");
let display = document.getElementById("display");
let score = document.getElementById("score");
//control buttons
let btn_up = document.getElementById("btn-up");
let btn_down = document.getElementById("btn-down");
let btn_left = document.getElementById("btn-left");
let btn_right = document.getElementById("btn-right");

//init canvas context
let { width, height } = display.getBoundingClientRect();
canvas.width = width - 2;
canvas.height = height - 2;
let screen_width = width - 2;
let screen_height = height - 2;
let ctx = canvas.getContext("2d");

//draw functions
function clear() {
  ctx.clearRect(0, 0, screen_width, screen_height);
}

function renderLevel(level) {
  clear();
  for (let i = 0; i < level.data.length; i++) {
    let x = i % level.width;
    let y = Math.floor(i / level.width);
    let celd_value = level.data[i];

    let color;
    Object.keys(TILES).forEach((tileName) => {
      if (celd_value == TILES[tileName].value) {
        const colorData = TILES[tileName].color;
        color = `rgb(${colorData.r},${colorData.g},${colorData.b})`;
      }
    });

    if (color) {
      ctx.save();
      ctx.fillStyle = color;
      ctx.fillRect(
        x * level.celd_size + 0.5,
        y * level.celd_size + 0.5,
        level.celd_size,
        level.celd_size
      );
      ctx.restore();
    }
  }
}

//level
function createLevel(celd_size) {
  let width = Math.round(screen_width / celd_size);
  let height = Math.round(screen_height / celd_size);
  let data = new Array(width * height).fill(0);

  let randomNumbers = [];
  let maxNumbers = 5;
  for (let i = 0; i < maxNumbers; i++) {
    let randomNumber = Math.round(Math.random() * width * height);
    while (randomNumbers.filter((item) => item == randomNumber).length > 0) {
      randomNumber = Math.round(Math.random() * width * height);
    }
    randomNumbers.push(randomNumber);
  }

  data[randomNumbers[0]] = 1;

  for (let i = 1; i < maxNumbers; i++) {
    data[randomNumbers[i]] = 2;
  }

  return { data, width, height, celd_size };
}

function findPlayerPos(level) {
  for (let i = 0; i < level.data.length; i++) {
    if (level.data[i] == TILES.player.value) {
      const x = i % level.width;
      const y = Math.floor(i / level.width);
      return { x, y };
    }
  }
}
function getCountOfCoints(level) {
  return level.data.filter((item) => item == TILES.coin.value).length;
}

const TILES = {
  space: {
    value: 0,
    color: { r: 255, g: 255, b: 255 },
  },
  player: {
    value: 1,
    color: { r: 255, g: 0, b: 255 },
  },
  coin: {
    value: 2,
    color: { r: 0, g: 255, b: 255 },
  },
};

//game
let level = createLevel(40);
let scoreValue = 0;

function save() {
  localStorage.setItem("level", JSON.stringify(level));
  localStorage.setItem("score", scoreValue.toString());
}

function getSavedData() {
  if (localStorage.getItem("level") != null) {
    level = JSON.parse(localStorage.getItem("level"));
  }
  if (localStorage.getItem("score") != null) {
    scoreValue = +localStorage.getItem("score");
    score.innerHTML = "Score :" + scoreValue;
  }
}

getSavedData();

btn_down.onmousedown = () => {
  advancePlayer(0, 1);
};
btn_up.onmousedown = () => {
  advancePlayer(0, -1);
};
btn_left.onmousedown = () => {
  advancePlayer(-1, 0);
};
btn_right.onmousedown = () => {
  advancePlayer(1, 0);
};

function advancePlayer(x, y) {
  let pos = findPlayerPos(level);
  if (
    pos.x + x > level.width - 1 ||
    pos.x + x < 0 ||
    pos.y + y < 0 ||
    pos.y + y > level.height - 1
  )
    return;
  let next_pos = { x: pos.x + x, y: pos.y + y };

  if (
    level.data[next_pos.x + next_pos.y * level.width] == TILES.coin.value &&
    getCountOfCoints(level) == 1
  ) {
    level = createLevel(40);
  } else {
    if (level.data[next_pos.x + next_pos.y * level.width] == TILES.coin.value) {
      scoreValue += 10;
    }
    level.data[pos.x + pos.y * level.width] = 0;
    level.data[next_pos.x + next_pos.y * level.width] = 1;
  }
  score.innerHTML = "Score :" + scoreValue;
  save();
}

function loop() {
  renderLevel(level);
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
