const boardWidth = 27;
const boardHeight = 29;
const pacman = document.getElementById("pacman");

const player = {
  id: pacman,
  x: 0,
  y: 0
};

const updatePacman = () => {
  player.id.style.gridArea = `${player.y + 1}/${player.x + 1}/${player.y +
    2}/${player.x + 2}`;
};

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
  updatePacman();
});
