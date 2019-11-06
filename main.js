const boardWidth = 28;
const boardHeight = 31;
const pacman = document.getElementById("pacman");
const board = document.getElementById("board");

const player = {
  id: pacman,
  x: 13,
  y: 17
};

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
  dots.forEach((dot, index) => {
    if (player.x === dot.x && player.y === dot.y) {
      dotElement = document.getElementById(`dot${dot.x}:${dot.y}`);
      dots.splice(index, 1);
      dotElement.parentNode.removeChild(dotElement);
    }
  });
  updatePacman();
});
