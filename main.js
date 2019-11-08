const scoreBoard = document.getElementById("score");
let score = 0;
let sprites = new Image();
sprites.src = "spritemap.png";
sprites.onload = function() {
  init();
};

const canva = document.getElementById("canvas");
const ctx = canva.getContext("2d");
const map = {
  tile: 20,
  width: 28,
  height: 31,
  board: [
    "############################",
    "#............##............#",
    "#.####.#####.##.#####.####.#",
    "#.####.#####.##.#####.####.#",
    "#.####.#####.##.#####.####.#",
    "#..........................#",
    "#.####.##.########.##.####.#",
    "#.####.##.########.##.####.#",
    "#......##....##............#",
    "######.#####.##.#####.######",
    "    ##.#####.##.#####.##    ",
    "    ##.##..........##.##    ",
    "    ##.##.########.##.##    ",
    "######.##.########.##.######",
    "..........########..........",
    "######.##.########.##.######",
    "    ##.##.########.##.##    ",
    "    ##.##.        .##.##    ",
    "    ##.##.########.##.##    ",
    "######.##.########.##.######",
    "#............##............#",
    "#.####.#####.##.#####.####.#",
    "#.####.#####.##.#####.####.#",
    "#...##................##...#",
    "###.##.##.########.##.##.###",
    "###.##.##.########.##.##.###",
    "#......##....##....##......#",
    "#.##########.##.##########.#",
    "#.##########.##.##########.#",
    "#..........................#",
    "############################"
  ]
};

canva.width = map.width * map.tile;
canva.height = map.height * map.tile;

allPositions = map.board.flatMap((row, y) =>
  row.split("").map((char, x) => ({ x, y, char }))
);
walls = allPositions.filter(item => item.char === "#");
dots = allPositions.filter(item => item.char === ".");

class PacmanElement {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    // chase, scatter, frightened
  }
  moveAvailable = true;
  phase = "chase";
}
const elements = {
  player: new PacmanElement(13, 17),
  ghostPink: new PacmanElement(1, 1),
  ghosts: [this.ghostPink]
};

function init() {
  window.requestAnimationFrame(step);
}

window.requestAnimationFrame(step);

function step() {
  ctx.clearRect(0, 0, canva.width, canva.height);
  ctx.drawImage(
    sprites,
    48,
    72,
    24,
    24,
    elements.player.x * map.tile,
    elements.player.y * map.tile,
    map.tile,
    map.tile
  );
  ctx.drawImage(
    sprites,
    0,
    72,
    24,
    24,
    elements.player.x * map.tile,
    elements.player.y * map.tile,
    map.tile,
    map.tile
  );
  dots.forEach(dot => {
    ctx.strokeStyle = "yellow";
    ctx.fillStyle = "yellow";
    ctx.fill();
    ctx.beginPath();
    ctx.arc(
      dot.x * map.tile + map.tile / 2,
      dot.y * map.tile + map.tile / 2,
      map.tile / 5,
      0,
      2 * Math.PI
    );
    ctx.stroke();
  });
  walls.forEach(wall => {
    ctx.fillStyle = "darkblue";
    ctx.fillRect(wall.x * map.tile, wall.y * map.tile, map.tile, map.tile);
  });
  window.requestAnimationFrame(step);
}

window.addEventListener("keyup", event => {
  const currentPosition = {
    x: elements.player.x,
    y: elements.player.y
  };
  if (event.code === "ArrowRight") {
    elements.player.x = elements.player.x + 1;
  }
  if (event.code === "ArrowLeft") {
    elements.player.x = elements.player.x - 1;
  }
  if (event.code === "ArrowUp") {
    elements.player.y = elements.player.y - 1;
  }
  if (event.code === "ArrowDown") {
    elements.player.y = elements.player.y + 1;
  }
  if (elements.player.x < 0 && elements.player.y === 14) {
    elements.player.x = map.width - 1;
  }
  if (elements.player.x > map.width - 1 && elements.player.y === 14) {
    elements.player.x = 0;
  }
  if (elements.player.x < 0 || elements.player.x > map.width - 1) {
    elements.player.x = currentPosition.x;
  }
  if (elements.player.y < 0 || elements.player.y > map.height - 1) {
    elements.player.y = currentPosition.y;
  }
  walls.forEach(wall => {
    if (elements.player.x === wall.x && elements.player.y === wall.y) {
      elements.player.x = currentPosition.x;
      elements.player.y = currentPosition.y;
    }
  });
  dots.forEach((dot, index) => {
    if (elements.player.x === dot.x && elements.player.y === dot.y) {
      dots.splice(index, 1);
      score += 100;
      scoreBoard.innerText = score;
    }
  });
});
