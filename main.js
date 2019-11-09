const scoreBoard = document.getElementById("score");
let score = 0;

// sprite tile 24x24
let sprites = new Image();
sprites.src = "spritemap.png";
sprites.onload = () => {
  window.requestAnimationFrame(step);
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
  constructor(x, y, spritex, spritey) {
    this.x = x;
    this.y = y;
    this.spritex = spritex;
    this.spritey = spritey;
    // chase, scatter, frightened
  }
  moveAvailable = true;
  phase = "chase";
}

const elements = {
  player: new PacmanElement(13, 17, 48, 72),
  ghostPink: new PacmanElement(1, 1, 0, 192),
  ghostRed: new PacmanElement(2, 1, 0, 144),
  ghostOrange: new PacmanElement(3, 1, 0, 216),
  ghostBlue: new PacmanElement(4, 1, 192, 192)
};

const toDraw = [
  elements.player,
  elements.ghostPink,
  elements.ghostBlue,
  elements.ghostOrange,
  elements.ghostRed
];

const step = () => {
  ctx.clearRect(0, 0, canva.width, canva.height);
  toDraw.forEach(draw =>
    ctx.drawImage(
      sprites,
      draw.spritex,
      draw.spritey,
      24,
      24,
      draw.x * map.tile,
      draw.y * map.tile,
      map.tile,
      map.tile
    )
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
};

window.addEventListener("keyup", event => {
  if (
    event.code === "ArrowRight" ||
    event.code === "ArrowLeft" ||
    event.code === "ArrowUp" ||
    event.code === "ArrowDown"
  ) {
    elements.player.direction = event.code;
  }
});

setInterval(() => {
  const currentPosition = {
    x: elements.player.x,
    y: elements.player.y
  };
  if (elements.player.direction === "ArrowRight") {
    elements.player.x = elements.player.x + 1;
    elements.player.spritex = 145;
  }
  if (elements.player.direction === "ArrowLeft") {
    elements.player.x = elements.player.x - 1;
    elements.player.spritex = 49;
  }
  if (elements.player.direction === "ArrowUp") {
    elements.player.y = elements.player.y - 1;
    elements.player.spritex = 73;
  }
  if (elements.player.direction === "ArrowDown") {
    elements.player.y = elements.player.y + 1;
    elements.player.spritex = 169;
  }
  if (elements.player.x < 0 && elements.player.y === 14) {
    elements.player.x = map.width - 1;
  }
  if (elements.player.x > map.width - 1 && elements.player.y === 14) {
    elements.player.x = 0;
  }
  walls.forEach(wall => {
    if (elements.player.x === wall.x && elements.player.y === wall.y) {
      elements.player.x = currentPosition.x;
      elements.player.y = currentPosition.y;
    }
  });
  if (
    elements.player.x !== currentPosition.x ||
    elements.player.y !== currentPosition.y
  ) {
    elements.player.moveAvailable = true;
    elements.player.lastGoodPath = elements.player.direction;
  } else {
    elements.player.moveAvailable = false;
    elements.player.direction = elements.player.lastGoodPath;
  }
  dots.forEach((dot, index) => {
    if (elements.player.x === dot.x && elements.player.y === dot.y) {
      dots.splice(index, 1);
      score += 100;
      scoreBoard.innerText = score;
    }
  });
}, 100);
