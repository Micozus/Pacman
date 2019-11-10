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
  moveAvailable = false;
  phase = "chase";
}

const elements = {
  player: new PacmanElement(13, 17, 48, 72),
  ghostPink: new PacmanElement(1, 1, 0, 192),
  ghostRed: new PacmanElement(2, 1, 0, 144),
  ghostOrange: new PacmanElement(3, 1, 0, 216),
  ghostBlue: new PacmanElement(4, 1, 192, 192)
};

const ghosts = [
  elements.ghostPink,
  elements.ghostRed,
  elements.ghostOrange,
  elements.ghostBlue
];

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
  const moving = (typ, direction) => {
    const currentPosition = {
      x: typ.x,
      y: typ.y
    };
    if (direction === "ArrowUp") typ.y--;
    if (direction === "ArrowDown") typ.y++;
    if (direction === "ArrowLeft") typ.x--;
    if (direction === "ArrowRight") typ.x++;
    walls.forEach(wall => {
      if (typ.x === wall.x && typ.y === wall.y) {
        typ.x = currentPosition.x;
        typ.y = currentPosition.y;
      }
    });
    if (typ.x !== currentPosition.x || typ.y !== currentPosition.y) {
      typ.moveAvailable = true;
      typ.lastGoodPath = typ.direction;
    } else {
      typ.moveAvailable = false;
      typ.direction = typ.lastGoodPath;
    }
  };
  if (elements.player.direction === "ArrowRight") {
    moving(elements.player, "ArrowRight");
    elements.player.spritex = 145;
  }
  if (elements.player.direction === "ArrowLeft") {
    moving(elements.player, "ArrowLeft");
    elements.player.spritex = 49;
  }
  if (elements.player.direction === "ArrowUp") {
    moving(elements.player, "ArrowUp");
    elements.player.spritex = 73;
  }
  if (elements.player.direction === "ArrowDown") {
    moving(elements.player, "ArrowDown");
    elements.player.spritex = 169;
  }
  if (elements.player.x < 0 && elements.player.y === 14) {
    elements.player.x = map.width - 1;
  }
  if (elements.player.x > map.width - 1 && elements.player.y === 14) {
    elements.player.x = 0;
  }
  dots.forEach((dot, index) => {
    if (elements.player.x === dot.x && elements.player.y === dot.y) {
      dots.splice(index, 1);
      score += 100;
      scoreBoard.innerText = score;
    }
  });
  ghosts.forEach(ghost => {
    if (!ghost.moveAvailable) {
      switch (Math.floor(Math.random() * 4)) {
        case 0:
          ghost.direction = "ArrowLeft";
          break;
        case 1:
          ghost.direction = "ArrowRight";
          break;
        case 2:
          ghost.direction = "ArrowUp";
          break;
        case 3:
          ghost.direction = "ArrowDown";
          break;
      }
    }
    moving(ghost, ghost.direction);
    if (elements.player.x === ghost.x && elements.player.y === ghost.y) {
      elements.player.x = 13;
      elements.player.y = 17;
      elements.player.direction = null;
    }
  });
}, 100);
