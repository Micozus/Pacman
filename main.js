const boardWidth = 28;
const boardHeight = 31;
const pacman = document.getElementById("pacman");
const board = document.getElementById("board");
const scoreBoard = document.getElementById("score");
const pink = document.getElementById("ghostPink");
const blue = document.getElementById("ghostBlue");
const red = document.getElementById("ghostRed");
const green = document.getElementById("ghostGreen");
let score = 0;

const player = {
  id: pacman,
  x: 13,
  y: 17
};

const ghostPink = {
  id: pink,
  direction: 1,
  x: 1,
  y: 1
};
const ghostBlue = {
  id: blue,
  direction: 2,
  x: 2,
  y: 1
};
const ghostRed = {
  id: red,
  direction: 3,
  x: 3,
  y: 1
};
const ghostGreen = {
  id: green,
  direction: 4,
  x: 4,
  y: 1
};

const ghosts = [ghostPink, ghostBlue, ghostRed, ghostGreen];

const boardMap = [
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
];

const allPositions = boardMap.flatMap((row, y) =>
  row.split("").map((char, x) => ({ x, y, char }))
);

const drawWalls = (x, y) => {
  const wall = document.createElement("div");
  wall.classList.add("wall");
  wall.style.gridArea = `${y + 1}/${x + 1}/${y + 2}/${x + 2}`;
  board.appendChild(wall);
};

const drawDots = (x, y) => {
  const dot = document.createElement("div");
  dot.classList.add("dot");
  dot.id = `dot${x}:${y}`;
  dot.style.gridArea = `${y + 1}/${x + 1}/${y + 2}/${x + 2}`;
  board.appendChild(dot);
};

const walls = allPositions.filter(item => item.char === "#");
const dots = allPositions.filter(item => item.char === ".");

walls.forEach(wall => drawWalls(wall.x, wall.y));
dots.forEach(dot => drawDots(dot.x, dot.y));

const updatePacman = () => {
  player.id.style.gridArea = `${player.y + 1}/${player.x + 1}/${player.y +
    2}/${player.x + 2}`;
};

const updateGhost = ghostcolor => {
  ghostcolor.id.style.gridArea = `${ghostcolor.y + 1}/${ghostcolor.x +
    1}/${ghostcolor.y + 2}/${ghostcolor.x + 2}`;
};

ghosts.forEach(ghost => updateGhost(ghost));

updatePacman();

window.addEventListener("keyup", event => {
  const currentPosition = {
    x: player.x,
    y: player.y
  };
  if (event.code === "ArrowRight") {
    player.x = player.x + 1;
    console.log("R", player.x, player.y);
  }
  if (event.code === "ArrowLeft") {
    player.x = player.x - 1;
    console.log("L", player.x, player.y);
  }
  if (event.code === "ArrowUp") {
    player.y = player.y - 1;
    console.log("U", player.x, player.y);
  }
  if (event.code === "ArrowDown") {
    player.y = player.y + 1;
    console.log("D", player.x, player.y);
  }
  if (player.x < 0 && player.y === 14) {
    player.x = boardWidth - 1;
  }
  if (player.x > boardWidth - 1 && player.y === 14) {
    player.x = 0;
  }
  if (player.x < 0 || player.x > boardWidth - 1) {
    player.x = currentPosition.x;
  }
  if (player.y < 0 || player.y > boardHeight - 1) {
    player.y = currentPosition.y;
  }
  walls.forEach(wall => {
    if (player.x === wall.x && player.y === wall.y) {
      player.x = currentPosition.x;
      player.y = currentPosition.y;
    }
  });
  ghosts.forEach(ghost => {
    const currentGhostPosition = {
      x: ghost.x,
      y: ghost.y,
      direction: ghost.direction
    };

    switch (ghost.direction) {
      case 1: //up
        ghost.y--;
        console.log(`${ghost.y} u`);
        walls.forEach(wall => {
          if (ghost.x === wall.x && ghost.y === wall.y) {
            ghost.x = currentGhostPosition.x;
            ghost.y = currentGhostPosition.y;
            pacman.x > ghost.x ? (ghost.direction = 3) : (ghost.direction = 4);
          }
        });
        break;
      case 2: //down
        ghost.y++;
        console.log(`${ghost.y} d`);
        walls.forEach(wall => {
          if (ghost.x === wall.x && ghost.y === wall.y) {
            ghost.x = currentGhostPosition.x;
            ghost.y = currentGhostPosition.y;
            pacman.x > ghost.x ? (ghost.direction = 3) : (ghost.direction = 4);
          }
        });
        break;
      case 3: //left
        ghost.x--;
        console.log(`${ghost.x} l`);
        walls.forEach(wall => {
          if (ghost.x === wall.x && ghost.y === wall.y) {
            ghost.x = currentGhostPosition.x;
            ghost.y = currentGhostPosition.y;
            pacman.y < ghost.y ? (ghost.direction = 1) : (ghost.direction = 2);
          }
        });
        break;
      case 4: //right
        ghost.x++;
        console.log(`${ghost.x} R`);
        walls.forEach(wall => {
          if (ghost.x === wall.x && ghost.y === wall.y) {
            ghost.x = currentGhostPosition.x;
            ghost.y = currentGhostPosition.y;
            pacman.y < ghost.y ? (ghost.direction = 1) : (ghost.direction = 2);
          }
        });
        break;
    }
    if (player.x === ghost.x && player.y === ghost.y) {
      player.x = 13;
      player.y = 17;
    }

    updateGhost(ghost);
  });
  dots.forEach((dot, index) => {
    if (player.x === dot.x && player.y === dot.y) {
      dotElement = document.getElementById(`dot${dot.x}:${dot.y}`);
      dots.splice(index, 1);
      dotElement.parentNode.removeChild(dotElement);
      score += 100;
      scoreBoard.innerText = score;
    }
  });
  updatePacman();
});
